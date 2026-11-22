"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Komponen pendeteksi callback konfirmasi email Supabase pada Landing Page.
 * Jika pengguna mengklik link verifikasi email lama yang mengarah ke root "/",
 * komponen ini otomatis mengalihkan pengguna ke halaman /login dengan kredensial tersimpan.
 */
export default function AuthRedirectDetector() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    const search = window.location.search;

    if (
      hash.includes("type=signup") ||
      hash.includes("type=email_change") ||
      hash.includes("access_token") ||
      search.includes("code=")
    ) {
      router.replace("/login?confirmed=true");
    }
  }, [router]);

  return null;
}
