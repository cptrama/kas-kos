import { getCurrentUserProfile, signOutAction } from "@/app/actions/auth";
import Link from "next/link";
import { IconWallet, IconUser, IconLogout, IconPlus, IconDoorEnter } from "@tabler/icons-react";

export default async function DashboardPage() {
  const profile = await getCurrentUserProfile();

  return (
    <div className="page bg-light min-vh-100">
      {/* Top Navbar */}
      <header className="navbar navbar-expand-md navbar-light bg-white border-bottom">
        <div className="container-xl">
          <Link href="/dashboard" className="navbar-brand d-flex align-items-center gap-2">
            <span className="badge bg-green text-white p-2 rounded-circle">
              <IconWallet size={20} stroke={2} />
            </span>
            <span className="fs-2 fw-bold text-dark">
              Kas<span className="text-teal">Kos</span>
            </span>
          </Link>

          <div className="navbar-nav flex-row order-md-last align-items-center gap-3">
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

      {/* Main Dashboard Content */}
      <main className="container-xl py-5">
        <div className="page-header mb-4">
          <div className="row align-items-center">
            <div className="col">
              <div className="page-pretitle text-muted">Selamat Datang</div>
              <h2 className="page-title text-dark fw-bold">Halo, {profile?.full_name || "Anak Kos"}! 👋</h2>
              <p className="text-secondary mt-1">
                Akun Anda berhasil terautentikasi melalui Supabase Auth.
              </p>
            </div>
          </div>
        </div>

        {/* Workspace Card */}
        <div className="row row-cards">
          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-4 text-center">
                <div className="avatar avatar-xl bg-green-lt rounded-circle mx-auto mb-3">
                  <IconPlus size={32} />
                </div>
                <h3 className="card-title fw-bold">Buat Grup Kamar Kos Baru</h3>
                <p className="text-secondary">
                  Apakah Anda koordinator / bendahara kontrakan? Buat kamar kos baru dan undang roommate Anda dengan kode unik 6-digit.
                </p>
                <button className="btn btn-teal mt-2" disabled>
                  + Buat Grup Kos (Segera Hadir di Task-04)
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-4 text-center">
                <div className="avatar avatar-xl bg-blue-lt rounded-circle mx-auto mb-3">
                  <IconDoorEnter size={32} />
                </div>
                <h3 className="card-title fw-bold">Gabung ke Grup Kos</h3>
                <p className="text-secondary">
                  Sudah punya kode 6-digit dari teman kos? Masukkan kode untuk langsung bergabung dan melihat tagihan patungan Anda.
                </p>
                <button className="btn btn-outline-secondary mt-2" disabled>
                  Gabung dengan Kode (Segera Hadir di Task-04)
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
