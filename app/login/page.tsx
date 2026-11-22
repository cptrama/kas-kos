"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { signInAction } from "@/app/actions/auth";
import { showToast, showLoading } from "@/components/ui/ToastNotification";
import {
  IconLock,
  IconMail,
  IconArrowRight,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
  IconShieldLock,
} from "@tabler/icons-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Ambil email & kata sandi yang tersimpan saat pendaftaran
      const savedAuthStr = localStorage.getItem("kaskos_saved_auth");
      if (savedAuthStr) {
        const saved = JSON.parse(savedAuthStr);
        if (saved?.email) setEmail(saved.email);
        if (saved?.password) setPassword(saved.password);
      }

      const params = new URLSearchParams(window.location.search);
      if (params.get("confirmed") === "true") {
        showToast(
          "success",
          "Email Anda berhasil dikonfirmasi! Alamat email dan kata sandi Anda telah terisi otomatis. Silakan langsung klik Masuk ke Dashboard."
        );
      }
    } catch {
      // ignore
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    showLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await signInAction(formData);
      if (result && !result.success && result.error) {
        showLoading(false);
        setIsLoading(false);
        showToast("danger", result.error);
      } else {
        // Hapus kredensial tersimpan setelah berhasil masuk
        try {
          localStorage.removeItem("kaskos_saved_auth");
        } catch {}
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        try {
          localStorage.removeItem("kaskos_saved_auth");
        } catch {}
        showToast("success", "Login berhasil! Membuka Dashboard...");
        // Tetap biarkan isLoading & showLoading aktif hingga browser selesai pindah halaman
        return;
      }
      showLoading(false);
      setIsLoading(false);
      showToast("danger", "Terjadi kendala saat mencoba masuk. Silakan periksa kembali email & kata sandi Anda.");
    }
  }

  return (
    <div className="page page-center bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="container container-tight py-4" style={{ maxWidth: "440px" }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div className="mb-2">
            <BrandLogo href="/" size={52} />
          </div>
          <p className="text-muted small mt-2">
            Kelola kas dan tagihan bersama tanpa rasa sungkan
          </p>
        </div>

        {/* Login Card */}
        <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
          <div className="card-status-top bg-teal"></div>
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-1 fw-bold fs-2 text-dark">
              Selamat Datang Kembali! 👋
            </h2>
            <p className="text-muted text-center small mb-4">
              Masuk untuk memantau kas kamar kos Anda
            </p>

            <form onSubmit={handleSubmit} autoComplete="on">
              {/* Email Input */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">
                  Alamat Email <span className="text-danger">*</span>
                </label>
                <div className="input-group input-group-flat">
                  <span className="input-group-text ps-3">
                    <IconMail size={18} className="text-muted" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="nama@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold text-dark m-0">
                    Kata Sandi <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="input-group input-group-flat">
                  <span className="input-group-text ps-3">
                    <IconLock size={18} className="text-muted" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Masukkan kata sandi akun"
                    autoComplete="current-password"
                  />
                  <span className="input-group-text pe-3">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="btn btn-link link-secondary p-0 text-muted"
                      title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-footer mt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-teal w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Memverifikasi & Membuka Dashboard...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Dashboard</span>
                      <IconArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="card-footer bg-light border-top py-3 text-center small text-muted">
            Belum punya akun kamar kos?{" "}
            <Link href="/register" className="text-teal fw-bold text-decoration-none">
              Daftar Gratis di sini
            </Link>
          </div>
        </div>

        {/* Security badge & back link */}
        <div className="d-flex flex-column align-items-center gap-2 mt-4 text-center">
          <div className="text-muted small d-flex align-items-center gap-1">
            <IconShieldLock size={16} className="text-teal" />
            <span>Autentikasi terenkripsi aman oleh Supabase Auth</span>
          </div>
          <Link href="/" className="text-secondary small d-inline-flex align-items-center gap-1 text-decoration-none mt-1 hover-teal">
            <IconArrowLeft size={16} />
            <span>Kembali ke Halaman Utama</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
