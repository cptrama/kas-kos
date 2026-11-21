"use client";

import { useState } from "react";
import Link from "next/link";
import { signInAction } from "@/app/actions/auth";
import { IconWallet, IconLock, IconMail, IconArrowRight } from "@tabler/icons-react";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await signInAction(formData);
      if (result && !result.success && result.error) {
        setErrorMessage(result.error);
      }
    } catch (err: unknown) {
      // Jika redirect Next.js dipicu, biarkan berjalan
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        return;
      }
      setErrorMessage("Terjadi kesalahan saat mencoba masuk. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page page-center bg-light min-vh-100 d-flex align-items-center justify-content-center py-4">
      <div className="container container-tight py-4" style={{ maxWidth: "440px" }}>
        <div className="text-center mb-4">
          <Link href="/" className="navbar-brand d-inline-flex align-items-center gap-2">
            <span className="badge bg-green text-white p-2 rounded-circle">
              <IconWallet size={24} stroke={2} />
            </span>
            <span className="fs-1 fw-bold text-dark">
              Kas<span className="text-teal">Kos</span>
            </span>
          </Link>
          <p className="text-muted mt-2">Masuk ke akun kamar kos Anda</p>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-4 fw-bold">Selamat Datang Kembali</h2>

            {errorMessage && (
              <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                <div className="small">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="on">
              <div className="mb-3">
                <label className="form-label required">Alamat Email</label>
                <div className="input-group input-group-flat">
                  <span className="input-group-text">
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

              <div className="mb-4">
                <label className="form-label required">Kata Sandi</label>
                <div className="input-group input-group-flat">
                  <span className="input-group-text">
                    <IconLock size={18} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    name="password"
                    required
                    className="form-control"
                    placeholder="Minimal 6 karakter"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="form-footer">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-teal w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  {isLoading ? (
                    <span>Memproses...</span>
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
        </div>

        <div className="text-center text-muted mt-3">
          Belum punya akun kamar kos?{" "}
          <Link href="/register" className="text-teal fw-semibold">
            Daftar Gratis di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
