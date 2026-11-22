"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface GroupResponse {
  success: boolean;
  error?: string;
  message?: string;
  groupId?: string;
}

/**
 * Helper untuk membuat kode invite 6 karakter acak yang mudah dibaca
 */
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Server Action: Membuat Grup Kamar Kos Baru (Koordinator / Admin)
 */
export async function createGroupAction(formData: FormData): Promise<GroupResponse> {
  const groupName = formData.get("group_name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || "";
  const paymentBank = formData.get("payment_bank")?.toString().trim() || "";
  const paymentAccountNumber = formData.get("payment_account_number")?.toString().trim() || "";
  const paymentHolderName = formData.get("payment_holder_name")?.toString().trim() || "";

  if (!groupName) {
    return { success: false, error: "Nama grup kos wajib diisi." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
  }

  // Generate kode unik 6 karakter
  let inviteCode = generateCode();
  let attempts = 0;
  let isUnique = false;

  while (!isUnique && attempts < 5) {
    const { data: existing } = await supabase
      .from("groups")
      .select("id")
      .eq("invite_code", inviteCode)
      .maybeSingle();

    if (!existing) {
      isUnique = true;
    } else {
      inviteCode = generateCode();
      attempts++;
    }
  }

  // 1. Simpan grup ke database
  const { data: newGroup, error: groupError } = await supabase
    .from("groups")
    .insert({
      group_name: groupName,
      description,
      invite_code: inviteCode,
      created_by: user.id,
      payment_bank: paymentBank,
      payment_account_number: paymentAccountNumber,
      payment_holder_name: paymentHolderName,
    })
    .select("id")
    .single();

  if (groupError || !newGroup) {
    if (groupError?.message?.toLowerCase().includes("permission denied")) {
      return {
        success: false,
        error: "Izin tabel belum diberikan di Supabase (permission denied for table groups). Silakan jalankan skrip fix_rls_policies.sql di Supabase SQL Editor.",
      };
    }
    return { success: false, error: groupError?.message || "Gagal membuat grup kos." };
  }

  // 2. Otomatis daftarkan pembuat grup sebagai admin_grup
  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: newGroup.id,
    user_id: user.id,
    role: "admin_grup",
  });

  if (memberError) {
    return { success: false, error: "Grup berhasil dibuat, namun gagal mendaftarkan admin." };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true, groupId: newGroup.id, message: "Grup kos berhasil dibuat!" };
}

/**
 * Server Action: Bergabung ke Grup Kos via Kode Undangan 6-Digit
 */
export async function joinGroupByCodeAction(formData: FormData): Promise<GroupResponse> {
  const rawCode = formData.get("invite_code")?.toString().trim();

  if (!rawCode) {
    return { success: false, error: "Kode undangan wajib diisi." };
  }

  const inviteCode = rawCode.toUpperCase();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Silakan masuk akun terlebih dahulu." };
  }

  // 1. Cari grup berdasarkan invite_code
  const { data: group, error: findError } = await supabase
    .from("groups")
    .select("id, group_name")
    .eq("invite_code", inviteCode)
    .maybeSingle();

  if (findError || !group) {
    return { success: false, error: "Kode grup tidak ditemukan. Pastikan 6 karakter sudah tepat." };
  }

  // 2. Periksa apakah pengguna sudah pernah bergabung di grup ini
  const { data: existingMember } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", group.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingMember) {
    return { success: false, error: "Anda sudah terdaftar sebagai anggota di grup ini." };
  }

  // 3. Masukkan ke tabel group_members sebagai member
  const { error: joinError } = await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: user.id,
    role: "member",
  });

  if (joinError) {
    return { success: false, error: joinError.message || "Gagal bergabung ke grup." };
  }

  revalidatePath("/dashboard", "layout");
  return {
    success: true,
    groupId: group.id,
    message: `Berhasil bergabung ke ${group.group_name}!`,
  };
}

/**
 * Server Action: Mengatur Informasi Rekening Pembayaran Grup (Khusus Koordinator)
 */
export async function updateGroupPaymentInfoAction(formData: FormData): Promise<GroupResponse> {
  const groupId = formData.get("group_id")?.toString();
  const paymentBank = formData.get("payment_bank")?.toString().trim() || "";
  const paymentAccountNumber = formData.get("payment_account_number")?.toString().trim() || "";
  const paymentHolderName = formData.get("payment_holder_name")?.toString().trim() || "";

  if (!groupId) {
    return { success: false, error: "ID grup tidak valid." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Sesi berakhir. Silakan login kembali." };
  }

  // Validasi hak akses: hanya admin_grup yang dapat mengubah
  const { data: member } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .single();

  if (!member || member.role !== "admin_grup") {
    return { success: false, error: "Hanya koordinator/admin grup yang dapat mengubah rekening kas." };
  }

  const { error: updateError } = await supabase
    .from("groups")
    .update({
      payment_bank: paymentBank,
      payment_account_number: paymentAccountNumber,
      payment_holder_name: paymentHolderName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", groupId);

  if (updateError) {
    return { success: false, error: updateError.message || "Gagal memperbarui rekening." };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true, message: "Informasi rekening berhasil diperbarui!" };
}

/**
 * Query: Mengambil semua grup yang diikuti oleh pengguna saat ini
 */
export async function getUserGroups() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: members, error } = await supabase
    .from("group_members")
    .select(`
      role,
      groups:group_id (
        id,
        group_name,
        description,
        invite_code,
        payment_bank,
        payment_account_number,
        payment_holder_name,
        created_at
      )
    `)
    .eq("user_id", user.id);

  if (error || !members) return [];

  return members.map((m: any) => ({
    role: m.role as "admin_grup" | "member",
    group: m.groups,
  }));
}

/**
 * Query: Mengambil daftar anggota dalam satu grup
 */
export async function getGroupMembers(groupId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("group_members")
    .select(`
      id,
      role,
      joined_at,
      profiles:user_id (
        id,
        full_name,
        phone_number,
        avatar_url
      )
    `)
    .eq("group_id", groupId);

  if (error || !data) return [];

  return data.map((item: any) => ({
    id: item.id,
    role: item.role,
    joinedAt: item.joined_at,
    profile: item.profiles,
  }));
}
