"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ExpenseCategory =
  | "listrik"
  | "wifi"
  | "air_galon"
  | "gas_lpg"
  | "kebersihan"
  | "konsumsi"
  | "lainnya";

export interface ExpenseResponse {
  success: boolean;
  error?: string;
  message?: string;
  expenseId?: string;
}

export interface BillItemData {
  id: string;
  expenseId: string;
  userId: string;
  splitAmount: number;
  status: "pending" | "waiting_approval" | "paid";
  proofImageUrl?: string | null;
  paidAt?: string | null;
  notes?: string | null;
  userProfile?: {
    fullName: string;
    phoneNumber?: string | null;
  };
}

export interface ExpenseWithItems {
  id: string;
  groupId: string;
  title: string;
  description?: string | null;
  category: ExpenseCategory;
  totalAmount: number;
  dueDate?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  billItems: BillItemData[];
}

export interface GroupFinancialStats {
  totalCollected: number;
  totalPending: number;
  totalExpenses: number;
  expensesCount: number;
  activeMembersCount: number;
}

/**
 * Helper internal: Validasi apakah pengguna adalah admin/koordinator grup kos
 */
async function verifyGroupAdmin(supabase: any, groupId: string, userId: string): Promise<boolean> {
  const { data: member } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .single();

  return member?.role === "admin_grup";
}

/**
 * Server Action: [TASK-08] Membuat Pengeluaran Bersama & Pembagian Rata Otomatis (Auto-Split Engine)
 */
export async function createExpenseWithSplitAction(formData: FormData): Promise<ExpenseResponse> {
  const groupId = formData.get("group_id")?.toString().trim();
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || "";
  const categoryRaw = formData.get("category")?.toString().trim() || "lainnya";
  const totalAmountRaw = formData.get("total_amount")?.toString().trim();
  const dueDateRaw = formData.get("due_date")?.toString().trim() || null;

  if (!groupId || !title || !totalAmountRaw) {
    return { success: false, error: "Grup kos, judul tagihan, dan nominal total wajib diisi." };
  }

  const totalAmount = parseFloat(totalAmountRaw);
  if (isNaN(totalAmount) || totalAmount <= 0) {
    return { success: false, error: "Nominal total pengeluaran harus lebih besar dari 0." };
  }

  const validCategories: ExpenseCategory[] = [
    "listrik",
    "wifi",
    "air_galon",
    "gas_lpg",
    "kebersihan",
    "konsumsi",
    "lainnya",
  ];
  const category: ExpenseCategory = validCategories.includes(categoryRaw as ExpenseCategory)
    ? (categoryRaw as ExpenseCategory)
    : "lainnya";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
  }

  const isAdmin = await verifyGroupAdmin(supabase, groupId, user.id);
  if (!isAdmin) {
    return { success: false, error: "Hanya koordinator kos (admin grup) yang berwenang membuat tagihan." };
  }

  // 1. Ambil daftar seluruh anggota aktif dalam grup untuk split bill
  const { data: members, error: memberErr } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId);

  if (memberErr || !members || members.length === 0) {
    return { success: false, error: "Tidak ada anggota aktif di grup kos untuk dibagi tagihan." };
  }

  // 2. Simpan record pengeluaran ke tabel `expenses`
  const { data: newExpense, error: expError } = await supabase
    .from("expenses")
    .insert({
      group_id: groupId,
      title,
      description: description || null,
      category,
      total_amount: totalAmount,
      due_date: dueDateRaw,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (expError || !newExpense) {
    return { success: false, error: expError?.message || "Gagal menyimpan pengeluaran kas." };
  }

  // 3. Algoritma Pembagian Rata Otomatis (Auto-Split Engine)
  const memberCount = members.length;
  const baseSplit = Math.floor(totalAmount / memberCount);
  const remainder = totalAmount - baseSplit * memberCount;

  const billItemsPayload = members.map((m, index) => ({
    expense_id: newExpense.id,
    user_id: m.user_id,
    // Sisa pembagian (jika ada pembulatan) dialokasikan ke anggota pertama agar total split_amount presisi 100%
    split_amount: index === 0 ? baseSplit + remainder : baseSplit,
    status: "pending",
  }));

  const { error: billError } = await supabase.from("bill_items").insert(billItemsPayload);

  if (billError) {
    // Bersihkan record pengeluaran yang terlanjur tersimpan agar tidak ada data yatim/orphan
    await supabase.from("expenses").delete().eq("id", newExpense.id);
    return {
      success: false,
      error: `Gagal membagi tagihan ke anggota kos: ${billError.message}. Silakan jalankan skrip fix_bill_items_rls.sql di Supabase SQL Editor.`,
    };
  }

  revalidatePath("/dashboard", "layout");
  return {
    success: true,
    message: `Tagihan "${title}" sebesar Rp ${totalAmount.toLocaleString("id-ID")} berhasil dibuat dan dibagi rata ke ${memberCount} penghuni.`,
    expenseId: newExpense.id,
  };
}

/**
 * Server Action: [TASK-08] Memperbarui Pengeluaran Kas & Sinkronisasi Ulang Nominal Porsi (Update)
 */
export async function updateExpenseAction(formData: FormData): Promise<ExpenseResponse> {
  const expenseId = formData.get("expense_id")?.toString().trim();
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || "";
  const categoryRaw = formData.get("category")?.toString().trim() || "lainnya";
  const totalAmountRaw = formData.get("total_amount")?.toString().trim();
  const dueDateRaw = formData.get("due_date")?.toString().trim() || null;

  if (!expenseId || !title || !totalAmountRaw) {
    return { success: false, error: "ID pengeluaran, judul, dan nominal total wajib diisi." };
  }

  const totalAmount = parseFloat(totalAmountRaw);
  if (isNaN(totalAmount) || totalAmount <= 0) {
    return { success: false, error: "Nominal total pengeluaran harus lebih besar dari 0." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
  }

  // Ambil data pengeluaran lama
  const { data: existingExp, error: fetchErr } = await supabase
    .from("expenses")
    .select("id, group_id, total_amount")
    .eq("id", expenseId)
    .single();

  if (fetchErr || !existingExp) {
    return { success: false, error: "Data pengeluaran tidak ditemukan." };
  }

  const isAdmin = await verifyGroupAdmin(supabase, existingExp.group_id, user.id);
  if (!isAdmin) {
    return { success: false, error: "Hanya koordinator kos yang dapat memperbarui tagihan ini." };
  }

  // Update pengeluaran
  const { error: updateError } = await supabase
    .from("expenses")
    .update({
      title,
      description: description || null,
      category: categoryRaw,
      total_amount: totalAmount,
      due_date: dueDateRaw,
      updated_at: new Date().toISOString(),
    })
    .eq("id", expenseId);

  if (updateError) {
    return { success: false, error: updateError.message || "Gagal memperbarui pengeluaran." };
  }

  // Jika nominal total berubah, sinkronisasi ulang porsi `split_amount` di `bill_items`
  if (existingExp.total_amount !== totalAmount) {
    const { data: currentItems } = await supabase
      .from("bill_items")
      .select("id")
      .eq("expense_id", expenseId);

    if (currentItems && currentItems.length > 0) {
      const count = currentItems.length;
      const baseSplit = Math.floor(totalAmount / count);
      const remainder = totalAmount - baseSplit * count;

      for (let i = 0; i < count; i++) {
        const item = currentItems[i];
        const newSplit = i === 0 ? baseSplit + remainder : baseSplit;
        await supabase
          .from("bill_items")
          .update({
            split_amount: newSplit,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);
      }
    }
  }

  revalidatePath("/dashboard", "layout");
  return { success: true, message: `Tagihan "${title}" berhasil diperbarui!` };
}

/**
 * Server Action: [TASK-08] Membatalkan / Menghapus Tagihan Pengeluaran Bersama (Delete)
 */
export async function deleteExpenseAction(formData: FormData): Promise<ExpenseResponse> {
  const expenseId = formData.get("expense_id")?.toString().trim();

  if (!expenseId) {
    return { success: false, error: "ID tagihan yang ingin dihapus tidak valid." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
  }

  const { data: existingExp } = await supabase
    .from("expenses")
    .select("group_id, title")
    .eq("id", expenseId)
    .single();

  if (!existingExp) {
    return { success: false, error: "Tagihan tidak ditemukan." };
  }

  const isAdmin = await verifyGroupAdmin(supabase, existingExp.group_id, user.id);
  if (!isAdmin) {
    return { success: false, error: "Hanya koordinator kos yang dapat menghapus tagihan." };
  }

  // Hapus tagihan dari tabel expenses (otomatis menghapus bill_items via ON DELETE CASCADE)
  const { error: delError } = await supabase.from("expenses").delete().eq("id", expenseId);

  if (delError) {
    return { success: false, error: delError.message || "Gagal menghapus tagihan." };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true, message: `Tagihan "${existingExp.title}" berhasil dihapus.` };
}

/**
 * Server Action: [TASK-10] Verifikasi Pembayaran & Approval Bukti Transfer oleh Koordinator Kos
 */
export async function approvePaymentAction(formData: FormData): Promise<ExpenseResponse> {
  const billItemId = formData.get("bill_item_id")?.toString().trim();

  if (!billItemId) {
    return { success: false, error: "ID porsi tagihan tidak valid." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
  }

  // Ambil data bill_item beserta expenses untuk mengecek wewenang admin grup
  const { data: billItem, error: fetchErr } = await supabase
    .from("bill_items")
    .select(`
      id,
      split_amount,
      status,
      expenses:expense_id (
        id,
        group_id,
        title
      )
    `)
    .eq("id", billItemId)
    .single();

  if (fetchErr || !billItem || !billItem.expenses) {
    return { success: false, error: "Data tagihan anggota tidak ditemukan." };
  }

  const groupId = (billItem.expenses as any).group_id;
  const isAdmin = await verifyGroupAdmin(supabase, groupId, user.id);
  if (!isAdmin) {
    return { success: false, error: "Hanya koordinator kos yang berwenang memverifikasi pembayaran." };
  }

  // Ubah status tagihan dari waiting_approval -> paid dan catat timestamp paid_at
  const { error: updateErr } = await supabase
    .from("bill_items")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", billItemId);

  if (updateErr) {
    return { success: false, error: updateErr.message || "Gagal memverifikasi pembayaran." };
  }

  revalidatePath("/dashboard", "layout");
  return {
    success: true,
    message: `Pembayaran sebesar Rp ${Number(billItem.split_amount).toLocaleString("id-ID")} berhasil diverifikasi dan ditandai LUNAS.`,
  };
}

/**
 * Server Action: [TASK-10] Menolak / Membatalkan Verifikasi Pembayaran (Kembali ke Pending)
 */
export async function rejectPaymentAction(formData: FormData): Promise<ExpenseResponse> {
  const billItemId = formData.get("bill_item_id")?.toString().trim();
  const reason = formData.get("reason")?.toString().trim() || "Bukti transfer tidak valid.";

  if (!billItemId) {
    return { success: false, error: "ID porsi tagihan tidak valid." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
  }

  const { data: billItem, error: fetchErr } = await supabase
    .from("bill_items")
    .select(`
      id,
      expenses:expense_id (
        group_id
      )
    `)
    .eq("id", billItemId)
    .single();

  if (fetchErr || !billItem || !billItem.expenses) {
    return { success: false, error: "Data tagihan tidak ditemukan." };
  }

  const groupId = (billItem.expenses as any).group_id;
  const isAdmin = await verifyGroupAdmin(supabase, groupId, user.id);
  if (!isAdmin) {
    return { success: false, error: "Hanya koordinator kos yang berwenang menolak verifikasi." };
  }

  const { error: updateErr } = await supabase
    .from("bill_items")
    .update({
      status: "pending",
      notes: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", billItemId);

  if (updateErr) {
    return { success: false, error: updateErr.message || "Gagal memperbarui status tagihan." };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true, message: "Status pembayaran berhasil dikembalikan ke Belum Bayar." };
}

/**
 * Query: [TASK-08] Mengambil seluruh daftar pengeluaran kos beserta rincian pembagian anggota
 */
export async function getGroupExpenses(groupId: string): Promise<ExpenseWithItems[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("expenses")
    .select(`
      id,
      group_id,
      title,
      description,
      category,
      total_amount,
      due_date,
      created_by,
      created_at,
      updated_at,
      bill_items (
        id,
        expense_id,
        user_id,
        split_amount,
        status,
        proof_image_url,
        paid_at,
        notes,
        profiles:user_id (
          full_name,
          phone_number
        )
      )
    `)
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((exp: any) => ({
    id: exp.id,
    groupId: exp.group_id,
    title: exp.title,
    description: exp.description,
    category: exp.category as ExpenseCategory,
    totalAmount: Number(exp.total_amount) || 0,
    dueDate: exp.due_date,
    createdBy: exp.created_by,
    createdAt: exp.created_at,
    updatedAt: exp.updated_at,
    billItems: Array.isArray(exp.bill_items)
      ? exp.bill_items.map((item: any) => ({
          id: item.id,
          expenseId: item.expense_id,
          userId: item.user_id,
          splitAmount: Number(item.split_amount) || 0,
          status: item.status,
          proofImageUrl: item.proof_image_url,
          paidAt: item.paid_at,
          notes: item.notes,
          userProfile: item.profiles
            ? {
                fullName: item.profiles.full_name,
                phoneNumber: item.profiles.phone_number,
              }
            : undefined,
        }))
      : [],
  }));
}

/**
 * Server Action: Mengambil ringkasan statistik kas untuk Dashboard Koordinator
 */
export async function getGroupFinancialStats(groupId: string): Promise<GroupFinancialStats> {
  const supabase = await createClient();

  // 1. Ambil jumlah anggota aktif dalam grup
  const { count: memberCount } = await supabase
    .from("group_members")
    .select("id", { count: "exact", head: true })
    .eq("group_id", groupId);

  const activeMembersCount = memberCount || 0;

  // 2. Ambil seluruh data pengeluaran dan porsi tagihan bill_items
  const { data: expenses, error: expErr } = await supabase
    .from("expenses")
    .select(`
      id,
      total_amount,
      bill_items (
        id,
        split_amount,
        status
      )
    `)
    .eq("group_id", groupId);

  if (expErr || !expenses) {
    return {
      totalCollected: 0,
      totalPending: 0,
      totalExpenses: 0,
      expensesCount: 0,
      activeMembersCount,
    };
  }

  let totalCollected = 0;
  let totalPending = 0;
  let totalExpenses = 0;

  for (const exp of expenses) {
    totalExpenses += Number(exp.total_amount) || 0;
    if (exp.bill_items && Array.isArray(exp.bill_items)) {
      for (const item of exp.bill_items) {
        const amount = Number(item.split_amount) || 0;
        if (item.status === "paid") {
          totalCollected += amount;
        } else {
          totalPending += amount;
        }
      }
    }
  }

  return {
    totalCollected,
    totalPending,
    totalExpenses,
    expensesCount: expenses.length,
    activeMembersCount,
  };
}

/**
 * Server Action: [TASK-14] Mengunggah Bukti Pembayaran ke Supabase Storage & Update Status ke waiting_approval
 */
export async function uploadPaymentProofAction(formData: FormData): Promise<ExpenseResponse> {
  const billItemId = formData.get("bill_item_id")?.toString().trim();
  const notes = formData.get("notes")?.toString().trim() || "";
  const file = formData.get("proof_file") as File | null;

  if (!billItemId) {
    return { success: false, error: "ID porsi tagihan tidak valid." };
  }

  if (!file || file.size === 0) {
    return { success: false, error: "Silakan pilih berkas foto / screenshot struk transfer." };
  }

  // Validasi ukuran berkas (Maksimal 5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "Ukuran berkas bukti transfer tidak boleh melebihi 5 MB." };
  }

  // Validasi format berkas gambar
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "Format berkas harus berupa gambar (JPG, JPEG, PNG, atau WEBP)." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
  }

  // Cek apakah bill_item ini milik user yang sedang login
  const { data: billItem, error: fetchErr } = await supabase
    .from("bill_items")
    .select("id, user_id, split_amount")
    .eq("id", billItemId)
    .single();

  if (fetchErr || !billItem) {
    return { success: false, error: "Data tagihan tidak ditemukan." };
  }

  if (billItem.user_id !== user.id) {
    return { success: false, error: "Anda hanya dapat mengunggah bukti bayar untuk tagihan milik Anda sendiri." };
  }

  // Buat nama berkas unik
  const fileExt = file.name.split(".").pop() || "jpg";
  const sanitizedName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `proofs/${user.id}/${sanitizedName}`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload ke bucket transfer-proofs di Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("transfer-proofs")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: `Gagal mengunggah foto ke storage: ${uploadError.message}` };
    }

    // Dapatkan URL Publik bukti transfer
    const {
      data: { publicUrl },
    } = supabase.storage.from("transfer-proofs").getPublicUrl(filePath);

    // Update status baris bill_items menjadi waiting_approval
    const { error: updateError } = await supabase
      .from("bill_items")
      .update({
        status: "waiting_approval",
        proof_image_url: publicUrl,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", billItemId);

    if (updateError) {
      return { success: false, error: `Gagal memperbarui status tagihan: ${updateError.message}` };
    }

    revalidatePath("/dashboard", "layout");
    return {
      success: true,
      message: `Bukti transfer sebesar Rp ${Number(billItem.split_amount).toLocaleString("id-ID")} berhasil diunggah! Menunggu konfirmasi bendahara.`,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Terjadi kesalahan internal saat memproses berkas bukti transfer." };
  }
}

