"use client";

import { useState } from "react";
import { approvePaymentAction, rejectPaymentAction } from "@/app/actions/expense";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { showToast } from "@/components/ui/ToastNotification";
import {
  IconCheck,
  IconX,
  IconShieldCheck,
  IconClock,
  IconAlertCircle,
  IconExternalLink,
  IconUser,
  IconPhoto,
} from "@tabler/icons-react";

export interface PaymentProofModalItem {
  id: string; // bill_item_id
  userName: string;
  userPhone?: string | null;
  expenseTitle: string;
  splitAmount: number;
  status: "pending" | "waiting_approval" | "paid";
  proofImageUrl?: string | null;
  paidAt?: string | null;
  notes?: string | null;
}

interface PaymentProofModalProps {
  item: PaymentProofModalItem | null;
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PaymentProofModal({
  item,
  isOpen,
  isAdmin,
  onClose,
  onSuccess,
}: PaymentProofModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!isOpen || !item) return null;

  async function handleApprove() {
    if (!item) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("bill_item_id", item.id);

    const res = await approvePaymentAction(formData);
    setIsLoading(false);

    if (!res?.success) {
      showToast("danger", res?.error || "Gagal memverifikasi pembayaran.");
    } else {
      showToast("success", res.message || "Pembayaran berhasil diverifikasi!");
      if (onSuccess) onSuccess();
      onClose();
    }
  }

  async function handleReject() {
    if (!item) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("bill_item_id", item.id);
    formData.append("reason", rejectReason || "Bukti transfer tidak valid atau belum masuk.");

    const res = await rejectPaymentAction(formData);
    setIsLoading(false);

    if (!res?.success) {
      showToast("danger", res?.error || "Gagal menolak verifikasi.");
    } else {
      showToast("success", res.message || "Status dikembalikan ke Belum Bayar.");
      if (onSuccess) onSuccess();
      setShowRejectInput(false);
      onClose();
    }
  }

  return (
    <div
      className="modal modal-blur fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg border-0">
          {/* Modal Header */}
          <div className="modal-header border-bottom">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-teal-lt p-2 rounded-circle">
                <IconShieldCheck size={20} />
              </span>
              <div>
                <h5 className="modal-title fw-bold m-0">Verifikasi Bukti Transfer Pembayaran</h5>
                <span className="text-secondary small">
                  Tagihan: <strong>{item.expenseTitle}</strong>
                </span>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose} disabled={isLoading}></button>
          </div>

          <div className="modal-body p-4">
            {/* Info Roommate & Nominal Tagihan */}
            <div className="card bg-light border-0 p-3 mb-4">
              <div className="row align-items-center g-3">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <span className="avatar avatar-md bg-white text-teal rounded-circle shadow-sm">
                      <IconUser size={20} />
                    </span>
                    <div>
                      <div className="fw-bold text-dark fs-3">{item.userName}</div>
                      <div className="text-secondary small">{item.userPhone || "Roommate Kos"}</div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 text-sm-end">
                  <div className="text-secondary small">Nominal Porsi Tagihan:</div>
                  <div className="fs-2 fw-extrabold text-teal">{formatRupiah(item.splitAmount)}</div>
                  <div className="mt-1">
                    {item.status === "paid" && (
                      <span className="badge bg-green-lt text-green d-inline-flex align-items-center gap-1">
                        <IconCheck size={14} /> Lunas ({formatDateIndo(item.paidAt)})
                      </span>
                    )}
                    {item.status === "waiting_approval" && (
                      <span className="badge bg-yellow-lt text-warning d-inline-flex align-items-center gap-1">
                        <IconClock size={14} /> Menunggu Approval Koordinator
                      </span>
                    )}
                    {item.status === "pending" && (
                      <span className="badge bg-red-lt text-danger d-inline-flex align-items-center gap-1">
                        <IconAlertCircle size={14} /> Belum Bayar
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Gambar Bukti Transfer */}
            <div className="text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="fw-semibold text-dark d-flex align-items-center gap-1">
                  <IconPhoto size={16} />
                  <span>Struk / Bukti Transfer:</span>
                </div>
                {item.proofImageUrl && (
                  <a
                    href={item.proofImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-teal d-flex align-items-center gap-1"
                  >
                    <IconExternalLink size={14} />
                    <span>Buka Ukuran Penuh</span>
                  </a>
                )}
              </div>

              {item.proofImageUrl ? (
                <div className="bg-dark rounded p-2 d-flex justify-content-center align-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.proofImageUrl}
                    alt="Bukti Transfer Pembayaran"
                    className="img-fluid rounded"
                    style={{ maxHeight: "380px", objectFit: "contain" }}
                  />
                </div>
              ) : (
                <div className="p-5 bg-light rounded border border-dashed text-secondary text-center">
                  <IconPhoto size={40} className="text-muted mb-2 opacity-50" />
                  <p className="m-0 fw-medium">Roommate ini belum mengunggah gambar bukti transfer.</p>
                  <p className="small text-muted mt-1 m-0">
                    Jika anggota telah membayar secara tunai / cash langsung, Koordinator tetap dapat memverifikasi pelunasan di bawah.
                  </p>
                </div>
              )}
            </div>

            {/* Input Alasan Tolak jika diperlukan */}
            {showRejectInput && (
              <div className="mt-3 p-3 bg-red-lt rounded border border-danger">
                <label className="form-label text-danger fw-semibold">Alasan Penolakan Bukti:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Nominal transfer kurang, foto buram, struk tidak terbaca..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className="d-flex justify-content-end gap-2 mt-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setShowRejectInput(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={handleReject}
                    disabled={isLoading}
                  >
                    Konfirmasi Tolak Bukti
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer dengan Aksi Verifikasi Koordinator */}
          <div className="modal-footer border-top bg-light d-flex justify-content-between flex-wrap gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={isLoading}>
              Tutup
            </button>

            {isAdmin && item.status !== "paid" && (
              <div className="d-flex gap-2">
                {!showRejectInput && item.proofImageUrl && (
                  <button
                    type="button"
                    className="btn btn-outline-danger d-flex align-items-center gap-1"
                    onClick={() => setShowRejectInput(true)}
                    disabled={isLoading}
                  >
                    <IconX size={16} />
                    <span>Tolak Bukti</span>
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-teal px-4 d-flex align-items-center gap-2 shadow-sm"
                  onClick={handleApprove}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <IconCheck size={18} />
                  )}
                  <span className="fw-bold">
                    {item.status === "waiting_approval" ? "Verifikasi & Tandai Lunas" : "Tandai Lunas Tunai"}
                  </span>
                </button>
              </div>
            )}

            {item.status === "paid" && (
              <span className="text-success small fw-semibold d-flex align-items-center gap-1">
                <IconCheck size={16} /> Pembayaran sudah terverifikasi lunas
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
