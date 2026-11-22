"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface AuthResponse {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Server Action: Pendaftaran Pengguna Baru (Register)
 */
export async function signUpAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString().trim();
  const phoneNumber = formData.get("phone_number")?.toString().trim() || "";

  if (!email || !password || !fullName) {
    return { success: false, error: "Nama lengkap, email, dan kata sandi wajib diisi." };
  }

  if (password.length < 6) {
    return { success: false, error: "Kata sandi minimal harus 6 karakter." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone_number: phoneNumber,
      },
      emailRedirectTo: `${siteUrl}/auth/callback?next=/login`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("rate limit")) {
      return {
        success: false,
        error:
          "Batas pengiriman email verifikasi dari server Supabase telah tercapai untuk jam ini (maksimal 3-4 email per jam pada akun gratis). Untuk pengujian leluasa, Anda dapat menonaktifkan opsi 'Confirm email' di Supabase Dashboard -> Authentication -> Providers -> Email.",
      };
    }
    return { success: false, error: error.message };
  }

  // Jika Supabase mengonfirmasi sesi langsung (tanpa verifikasi email manual)
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return {
    success: true,
    message: "Pendaftaran berhasil! Silakan periksa email Anda jika konfirmasi email diaktifkan, atau langsung masuk.",
  };
}

/**
 * Server Action: Masuk Akun (Login)
 */
export async function signInAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, error: "Email dan kata sandi wajib diisi." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message === "Invalid login credentials"
        ? "Email atau kata sandi tidak cocok."
        : error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Server Action: Keluar Akun (Logout)
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Mengambil data profil pengguna yang sedang login
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile || {
    id: user.id,
    full_name: user.user_metadata?.full_name || "Anak Kos",
    phone_number: user.user_metadata?.phone_number || "",
    role: "user",
  };
}
