"use client";

import { useState, useRef, useEffect } from "react";
import { createGroupAction, joinGroupByCodeAction, updateGroupPaymentInfoAction } from "@/app/actions/group";
import { IconPlus, IconDoorEnter, IconSettings, IconCopy, IconCheck, IconBuildingCommunity, IconAlertCircle } from "@tabler/icons-react";

interface GroupModalsProps {
  activeGroup?: {
    id: string;
    group_name: string;
    invite_code: string;
    payment_bank?: string;
    payment_account_number?: string;
    payment_holder_name?: string;
  } | null;
  isAdmin?: boolean;
}

export default function GroupModals({ activeGroup, isAdmin }: GroupModalsProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Floating Toast Notification state (Pop-up mengambang 3-6 detik)
  const [toast, setToast] = useState<{ type: "success" | "danger" | "info"; message: string } | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  function triggerToast(type: "success" | "danger" | "info", msg: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ type, message: msg });
    // Muncul selama 4.5 detik (sesuai permintaan 3 - 6 detik)
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  function copyInviteCode() {
    if (!activeGroup?.invite_code) return;
    navigator.clipboard.writeText(activeGroup.invite_code);
    setIsCopied(true);
    triggerToast("success", "Kode invite berhasil disalin ke clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  }

  async function handleCreateGroup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createGroupAction(formData);
    setIsLoading(false);
    if (!res.success) {
      triggerToast("danger", res.error || "Gagal membuat grup.");
    } else {
      setShowCreate(false);
      triggerToast("success", "Grup kos baru berhasil dibuat!");
    }
  }

  async function handleJoinGroup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await joinGroupByCodeAction(formData);
    setIsLoading(false);
    if (!res.success) {
      triggerToast("danger", res.error || "Gagal bergabung ke grup.");
    } else {
      setShowJoin(false);
      triggerToast("success", res.message || "Berhasil bergabung ke grup!");
    }
  }

  async function handleUpdateSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateGroupPaymentInfoAction(formData);
    setIsLoading(false);
    if (!res.success) {
      triggerToast("danger", res.error || "Gagal memperbarui rekening.");
    } else {
      setShowSettings(false);
      triggerToast("success", "Rekening kas berhasil diperbarui!");
    }
  }

  return (
    <>
      {/* Floating Pop-up Notification (Toast Mengambang di Depan Layar 3-6 Detik) */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 99999,
            maxWidth: "420px",
            width: "calc(100% - 48px)",
            backgroundColor: toast.type === "success" ? "#0ca678" : toast.type === "danger" ? "#d63939" : "#206bc4",
            color: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.35), 0 4px 10px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
            animation: "toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          role="alert"
        >
          <div className="d-flex align-items-center p-3">
            <div className="me-3 flex-shrink-0">
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {toast.type === "success" ? (
                  <IconCheck size={20} color="#fff" />
                ) : (
                  <IconAlertCircle size={20} color="#fff" />
                )}
              </div>
            </div>
            <div className="flex-grow-1 text-white pe-2">
              <div className="fw-bold small lh-1 mb-1">
                {toast.type === "success" ? "Berhasil!" : "Pemberitahuan"}
              </div>
              <div className="small lh-sm" style={{ opacity: 0.95 }}>
                {toast.message}
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white flex-shrink-0"
              onClick={() => setToast(null)}
              aria-label="Tutup"
            ></button>
          </div>
          {/* Progress bar hitung mundur 4.5 detik */}
          <div
            style={{
              height: "4px",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              animation: "toastProgress 4.5s linear forwards",
            }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        <button className="btn btn-teal d-flex align-items-center gap-2" onClick={() => setShowCreate(true)}>
          <IconPlus size={18} />
          <span>Buat Grup Kos Baru</span>
        </button>
        <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => setShowJoin(true)}>
          <IconDoorEnter size={18} />
          <span>Gabung dengan Kode</span>
        </button>
        {activeGroup && isAdmin && (
          <button className="btn btn-outline-teal d-flex align-items-center gap-2" onClick={() => setShowSettings(true)}>
            <IconSettings size={18} />
            <span>Atur Rekening Kas</span>
          </button>
        )}
      </div>

      {/* Banner Info Grup Aktif & Kode Undangan */}
      {activeGroup && (
        <div className="card shadow-sm border-0 mb-4 bg-white">
          <div className="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-teal-lt p-2 rounded-circle">
                  <IconBuildingCommunity size={20} />
                </span>
                <h3 className="card-title m-0 fw-bold">{activeGroup.group_name}</h3>
              </div>
              <p className="text-muted small mt-1 mb-0">
                Bagikan kode 6-digit di bawah ini kepada teman kontrakan untuk bergabung.
              </p>
            </div>
            <div className="d-flex align-items-center gap-2 bg-light p-2 rounded border">
              <span className="text-muted small">Kode Invite:</span>
              <span className="fs-3 fw-bold text-teal letter-spacing-1">{activeGroup.invite_code}</span>
              <button
                className="btn btn-sm btn-outline-teal d-flex align-items-center gap-1"
                onClick={copyInviteCode}
                title="Salin Kode"
              >
                {isCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                <span>{isCopied ? "Tersalin!" : "Salin"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Buat Grup Kos */}
      {showCreate && (
        <div className="modal modal-blur fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Buat Grup Kamar Kos Baru</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreate(false)} disabled={isLoading}></button>
              </div>
              <form onSubmit={handleCreateGroup}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label required">Nama Grup Kos / Kontrakan</label>
                    <input
                      type="text"
                      name="group_name"
                      required
                      className="form-control"
                      placeholder="Contoh: Kontrakan Mawar No. 4"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Deskripsi / Alamat Singkat</label>
                    <input
                      type="text"
                      name="description"
                      className="form-control"
                      placeholder="Contoh: Jl. Sukabumi No. 12"
                    />
                  </div>
                  <hr className="my-3" />
                  <h6 className="text-muted mb-2">Informasi Rekening Pembayaran (Opsional)</h6>
                  <div className="mb-2">
                    <label className="form-label">Nama Bank / E-Wallet</label>
                    <input
                      type="text"
                      name="payment_bank"
                      className="form-control"
                      placeholder="Contoh: BCA / DANA / GoPay"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Nomor Rekening / No. HP</label>
                    <input
                      type="text"
                      name="payment_account_number"
                      className="form-control"
                      placeholder="Contoh: 1234567890"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Atas Nama Pemilik Rekening</label>
                    <input
                      type="text"
                      name="payment_holder_name"
                      className="form-control"
                      placeholder="Contoh: Budi (Bendahara)"
                    />
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)} disabled={isLoading}>
                    Batal
                  </button>
                  <button type="submit" disabled={isLoading} className="btn btn-teal">
                    {isLoading ? "Menyimpan..." : "Buat Grup Sekarang"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Gabung Grup via Kode */}
      {showJoin && (
        <div className="modal modal-blur fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Gabung ke Grup Kos</h5>
                <button type="button" className="btn-close" onClick={() => setShowJoin(false)} disabled={isLoading}></button>
              </div>
              <form onSubmit={handleJoinGroup}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label required">Masukkan Kode Undangan 6-Karakter</label>
                    <input
                      type="text"
                      name="invite_code"
                      required
                      maxLength={6}
                      className="form-control text-center fs-2 fw-bold text-uppercase letter-spacing-1"
                      placeholder="ABC123"
                    />
                    <small className="form-hint text-center d-block mt-2">
                      Minta 6 digit kode unik kepada bendahara / teman kos Anda.
                    </small>
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowJoin(false)} disabled={isLoading}>
                    Batal
                  </button>
                  <button type="submit" disabled={isLoading} className="btn btn-teal">
                    {isLoading ? "Memproses..." : "Gabung ke Grup"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Atur Rekening Kas */}
      {showSettings && activeGroup && (
        <div className="modal modal-blur fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Pengaturan Rekening Tujuan Transfer</h5>
                <button type="button" className="btn-close" onClick={() => setShowSettings(false)} disabled={isLoading}></button>
              </div>
              <form onSubmit={handleUpdateSettings}>
                <input type="hidden" name="group_id" value={activeGroup.id} />
                <div className="modal-body p-4">
                  <p className="text-muted small mb-3">
                    Informasi ini akan muncul di dashboard anggota saat mereka akan mentransfer uang kas bersama.
                  </p>
                  <div className="mb-3">
                    <label className="form-label required">Nama Bank / E-Wallet</label>
                    <input
                      type="text"
                      name="payment_bank"
                      required
                      defaultValue={activeGroup.payment_bank || ""}
                      className="form-control"
                      placeholder="BCA / Mandiri / BRI / DANA / GoPay"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label required">Nomor Rekening / No. HP E-Wallet</label>
                    <input
                      type="text"
                      name="payment_account_number"
                      required
                      defaultValue={activeGroup.payment_account_number || ""}
                      className="form-control"
                      placeholder="Contoh: 5220304911 atau 08123456789"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label required">Nama Pemilik Rekening</label>
                    <input
                      type="text"
                      name="payment_holder_name"
                      required
                      defaultValue={activeGroup.payment_holder_name || ""}
                      className="form-control"
                      placeholder="Contoh: Budi Santoso (Bendahara)"
                    />
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowSettings(false)} disabled={isLoading}>
                    Batal
                  </button>
                  <button type="submit" disabled={isLoading} className="btn btn-teal">
                    {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
