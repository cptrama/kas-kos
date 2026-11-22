import { getCurrentUserProfile, signOutAction } from "@/app/actions/auth";
import Link from "next/link";
import { IconUser, IconLogout } from "@tabler/icons-react";
import ThemeToggle from "@/components/ThemeToggle";
import BrandLogo from "@/components/BrandLogo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUserProfile();

  return (
    <div className="page bg-light min-vh-100">
      {/* Top Navbar */}
      <header className="navbar navbar-expand-md navbar-light bg-white border-bottom sticky-top">
        <div className="container-xl">
          <BrandLogo href="/dashboard" size={42} />

          <div className="navbar-nav flex-row order-md-last align-items-center gap-3">
            <ThemeToggle />

            <div className="d-flex align-items-center gap-2">
              <span className="avatar avatar-sm bg-green-lt rounded-circle">
                <IconUser size={18} />
              </span>
              <div className="d-none d-md-block text-start">
                <div className="fw-semibold text-dark">{profile?.full_name || "Anak Kos"}</div>
                <div className="small text-muted">{profile?.phone_number || "Anggota"}</div>
              </div>
            </div>

            <form action={signOutAction}>
              <button type="submit" className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1">
                <IconLogout size={16} />
                <span className="d-none d-md-inline">Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content Area */}
      <main className="container-xl py-4">{children}</main>

      {/* Footer */}
      <footer className="footer footer-transparent d-print-none py-3 mt-auto border-top">
        <div className="container-xl text-center text-secondary small">
          © {new Date().getFullYear()} KasKos — Kelola Kas & Tagihan Patungan Anak Kos.
        </div>
      </footer>
    </div>
  );
}
