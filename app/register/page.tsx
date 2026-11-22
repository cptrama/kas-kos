"use client";

import { useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { signUpAction } from "@/app/actions/auth";
import { showToast } from "@/components/ui/ToastNotification";
import {
  IconLock,
  IconMail,
  IconUser,
  IconPhone,
  IconArrowRight,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
  IconShieldLock,
} from "@tabler/icons-react";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    // Simpan email & sandi di storage lokal agar otomatis terisi saat konfirmasi email
    if (typeof window !== "undefined" && email && password) {
      try {
        localStorage.setItem("kaskos_saved_auth", JSON.stringify({ email, password }));
      } catch {
        // ignore storage error
      }
    }

    try {
      const result = await signUpAction(formData);
      if (result && !result.success && result.error) {
        showToast("danger", result.error);
      } else if (result && result.success && result.message) {
        showToast("success", result.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        return;
      }
      showToast("danger", "Terjadi kendala saat mendaftar. Silakan coba kembali beberapa saat lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page page-center bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="container container-tight py-4" style={{ maxWidth: "480px" }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div className="mb-2">
            <BrandLogo href="/" size={52} />
          </div>
          <p className="text-muted small mt-2">
            Mulai kelola uang patungan kos tanpa selisih dan tanpa drama
          </p>
        </div>

        {/* Register Card */}
        <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
          <div className="card-status-top bg-teal"></div>
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-1 fw-bold fs-2 text-dark">
              Buat Akun Baru 🚀
            </h2>
            <p className="text-muted text-center small mb-4">
              Gratis 100% untuk seluruh anak kos & mahasiswa
            </p>

            <form onSubmit={handleSubmit} autoComplete="on">
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">
                  Nama Lengkap <span className="text-danger">*</span>
                </label>
                <div className="input-group input-group-flat">
                  <span className="input-group-text ps-3">
                    <IconUser size={18} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    name="full_name"
                    required
                    className="form-control"
                    placeholder="Contoh: Budi Santoso"
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold text-dark m-0">
                    Nomor WhatsApp / HP
                  </label>
                  <span className="text-muted small" style={{ fontSize: "11px" }}>Opsional</span>
                </div>
                <div className="input-group input-group-flat">
                  <span className="input-group-text ps-3">
                    <IconPhone size={18} className="text-muted" />
                  </span>
                  <input
                    type="tel"
                    name="phone_number"
                    className="form-control"
                    placeholder="Contoh: 081234567890"
                    autoComplete="tel"
                  />
                </div>
                <div className="form-text text-muted" style={{ fontSize: "11px" }}>
                  Berguna agar teman sekamar dapat menghubungi Anda terkait iuran.
                </div>
              </div>

              {/* Email Address */}
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
                    className="form-control"
                    placeholder="nama@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-dark">
                  Kata Sandi <span className="text-danger">*</span>
                </label>
                <div className="input-group input-group-flat">
                  <span className="input-group-text ps-3">
                    <IconLock size={18} className="text-muted" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={6}
                    className="form-control"
                    placeholder="Minimal 6 karakter"
                    autoComplete="new-password"
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
                      <span>Mendaftarkan Akun Anda...</span>
                    </>
                  ) : (
                    <>
                      <span>Daftar Sekarang — 100% Gratis</span>
                      <IconArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="card-footer bg-light border-top py-3 text-center small text-muted">
            Sudah punya akun sebelumnya?{" "}
            <Link href="/login" className="text-teal fw-bold text-decoration-none">
              Masuk di sini
            </Link>
          </div>
        </div>

        {/* Security badge & back link */}
        <div className="d-flex flex-column align-items-center gap-2 mt-4 text-center">
          <div className="text-muted small d-flex align-items-center gap-1">
            <IconShieldLock size={16} className="text-teal" />
            <span>Data Anda terlindungi & tidak dibagikan ke pihak ketiga</span>
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
