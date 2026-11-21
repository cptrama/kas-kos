import { getCurrentUserProfile, signOutAction } from "@/app/actions/auth";
import { getUserGroups, getGroupMembers } from "@/app/actions/group";
import Link from "next/link";
import GroupModals from "@/components/dashboard/GroupModals";
import {
  IconWallet,
  IconUser,
  IconLogout,
  IconBuildingCommunity,
  IconUsers,
  IconCreditCard,
  IconShield,
} from "@tabler/icons-react";

export default async function DashboardPage() {
  const profile = await getCurrentUserProfile();
  const userGroups = await getUserGroups();

  // Ambil grup pertama sebagai grup aktif
  const activeGroupData = userGroups.length > 0 ? userGroups[0] : null;
  const activeGroup = activeGroupData?.group || null;
  const isAdmin = activeGroupData?.role === "admin_grup";

  // Ambil daftar anggota jika sudah punya grup
  const members = activeGroup ? await getGroupMembers(activeGroup.id) : [];

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
                <div className="small text-muted">{isAdmin ? "Koordinator Kos" : "Anggota Kos"}</div>
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

      {/* Main Container */}
      <main className="container-xl py-5">
        {/* Page Header */}
        <div className="page-header mb-4">
          <div className="row align-items-center">
            <div className="col">
              <div className="page-pretitle text-muted">Workspace Kas Kos</div>
              <h2 className="page-title text-dark fw-bold">
                {activeGroup ? activeGroup.group_name : `Halo, ${profile?.full_name || "Anak Kos"}! 👋`}
              </h2>
              <p className="text-secondary mt-1">
                {activeGroup
                  ? activeGroup.description || "Kelola pengeluaran bersama kamar kos tanpa drama."
                  : "Anda belum tergabung dalam grup kos mana pun. Buat grup baru atau minta kode undangan dari teman kos Anda."}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Controls (Create, Join, Settings) */}
        <GroupModals activeGroup={activeGroup} isAdmin={isAdmin} />

        {/* Jika belum ada grup: Empty State */}
        {!activeGroup && (
          <div className="card shadow-sm border-0 text-center py-6">
            <div className="card-body">
              <div className="avatar avatar-xl bg-teal-lt rounded-circle mx-auto mb-3">
                <IconBuildingCommunity size={36} />
              </div>
              <h3 className="fw-bold">Belum Ada Kamar Kos Aktif</h3>
              <p className="text-muted mx-auto" style={{ maxWidth: "480px" }}>
                Mulai kelola kas dengan membuat kamar kos baru (jika Anda bendahara) atau masukkan 6-digit kode invite dari teman Anda.
              </p>
            </div>
          </div>
        )}

        {/* Jika sudah ada grup: Tampilkan Info Pembayaran & Anggota */}
        {activeGroup && (
          <div className="row row-cards">
            {/* Rekening Tujuan Pembayaran */}
            <div className="col-md-5">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-status-top bg-teal"></div>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge bg-teal-lt p-2 rounded-circle">
                      <IconCreditCard size={20} />
                    </span>
                    <h3 className="card-title m-0 fw-bold">Rekening Kas Tujuan</h3>
                  </div>

                  {activeGroup.payment_bank ? (
                    <div className="bg-light p-3 rounded border">
                      <div className="text-muted small">Metode Pembayaran:</div>
                      <div className="fs-3 fw-bold text-dark">{activeGroup.payment_bank}</div>

                      <div className="text-muted small mt-2">Nomor Rekening / No. HP:</div>
                      <div className="fs-2 fw-extrabold text-teal">{activeGroup.payment_account_number}</div>

                      <div className="text-muted small mt-2">Atas Nama:</div>
                      <div className="fw-semibold text-dark">{activeGroup.payment_holder_name}</div>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-light rounded border border-dashed">
                      <p className="text-muted small mb-2">Belum ada informasi rekening kas.</p>
                      {isAdmin && (
                        <p className="small text-teal fw-semibold mb-0">
                          Klik tombol &quot;Atur Rekening Kas&quot; di atas untuk mengisi.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Daftar Anggota Kos */}
            <div className="col-md-7">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-green-lt p-2 rounded-circle">
                        <IconUsers size={20} />
                      </span>
                      <h3 className="card-title m-0 fw-bold">Penghuni Kos ({members.length})</h3>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-vcenter table-hover">
                      <thead>
                        <tr>
                          <th>Nama Penghuni</th>
                          <th>Kontak</th>
                          <th>Peran</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m: any) => (
                          <tr key={m.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <span className="avatar avatar-sm bg-light rounded-circle">
                                  <IconUser size={16} />
                                </span>
                                <div className="fw-semibold text-dark">
                                  {m.profile?.full_name || "Anggota"}
                                </div>
                              </div>
                            </td>
                            <td className="text-muted small">
                              {m.profile?.phone_number || "-"}
                            </td>
                            <td>
                              {m.role === "admin_grup" ? (
                                <span className="badge bg-teal-lt d-inline-flex align-items-center gap-1">
                                  <IconShield size={12} /> Koordinator
                                </span>
                              ) : (
                                <span className="badge bg-secondary-lt">Anggota</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
