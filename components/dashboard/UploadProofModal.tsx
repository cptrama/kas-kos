"use client";

import { useState, useRef } from "react";
import { uploadPaymentProofAction } from "@/app/actions/expense";
import { formatRupiah } from "@/lib/utils";
import { showToast } from "@/components/ui/ToastNotification";
import {
  IconUpload,
  IconX,
  IconPhoto,
  IconAlertCircle,
  IconCheck,
  IconReceipt2,
  IconNotes,
} from "@tabler/icons-react";

export interface UploadProofModalItem {
  id: string; // bill_item_id
  expenseTitle: string;
  splitAmount: number;
}

interface UploadProofModalProps {
  item: UploadProofModalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UploadProofModal({
  item,
  isOpen,
  onClose,
  onSuccess,
}: UploadProofModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !item) return null;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("danger", "Ukuran gambar terlalu besar. Maksimal 5 MB.");
        setPreviewUrl(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!item) return;

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      showToast("danger", "Silakan pilih foto atau screenshot bukti transfer terlebih dahulu.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append("bill_item_id", item.id);

    try {
      const res = await uploadPaymentProofAction(formData);

      if (!res?.success) {
        showToast("danger", res?.error || "Gagal mengunggah bukti pembayaran.");
      } else {
        showToast("success", res.message || "Bukti transfer berhasil dikirim!");
        onSuccess?.();
        onClose();
      }
    } catch {
      showToast("danger", "Terjadi kendala jaringan saat mengunggah. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="modal modal-blur fade show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg border-0 rounded-3 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-teal text-white py-3">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-white text-teal p-1 rounded-circle">
                <IconUpload size={18} />
              </span>
              <h5 className="modal-title fw-bold m-0 text-white">Konfirmasi Pembayaran Kas</h5>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              disabled={isLoading}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {/* Info Tagihan yang Sedang Dibayar */}
              <div className="bg-light p-3 rounded-3 border mb-3">
                <div className="text-secondary small fw-medium">Tagihan yang Dibayar:</div>
                <div className="fs-3 fw-bold text-dark d-flex align-items-center gap-2">
                  <IconReceipt2 size={20} className="text-teal" />
                  <span>{item.expenseTitle}</span>
                </div>
                <div className="mt-2 text-secondary small fw-medium">Nominal Patungan Anda:</div>
                <div className="fs-2 fw-extrabold text-teal">
                  {formatRupiah(item.splitAmount)}
                </div>
              </div>

              {/* Upload Foto Input */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">
                  Foto Bukti Transfer (Screenshot m-Banking / Struk) <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  name="proof_file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  required
                  onChange={handleFileChange}
                  className="form-control"
                  disabled={isLoading}
                />
                <div className="form-text text-muted small" style={{ fontSize: "11px" }}>
                  Mendukung JPG, PNG, atau WEBP. Ukuran maksimal 5 MB.
                </div>
              </div>

              {/* Pratinjau Gambar / Preview */}
              {previewUrl && (
                <div className="mb-3 text-center bg-dark-lt p-2 rounded border">
                  <div className="text-muted small mb-1 fw-medium">Pratinjau Struk:</div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Pratinjau Bukti Transfer"
                    className="img-fluid rounded border shadow-sm"
                    style={{ maxHeight: "200px", objectFit: "contain" }}
                  />
                </div>
              )}

              {/* Catatan Opsional */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark d-flex align-items-center gap-1">
                  <IconNotes size={16} className="text-secondary" />
                  <span>Catatan Tambahan (Opsional)</span>
                </label>
                <input
                  type="text"
                  name="notes"
                  className="form-control"
                  placeholder="Contoh: Transfer via BCA an Budi, jam 19.30"
                  disabled={isLoading}
                />
              </div>

              <div className="small text-muted bg-azure-lt p-2 rounded">
                💡 Setelah bukti transfer terkirim, status tagihan Anda otomatis berubah menjadi <strong>Menunggu Verifikasi</strong> hingga koordinator kos menyetujuinya.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer bg-light py-2 px-4 d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-teal d-flex align-items-center gap-2 fw-bold shadow-sm"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Mengunggah Bukti...</span>
                  </>
                ) : (
                  <>
                    <IconUpload size={18} />
                    <span>Kirim Bukti Pembayaran</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
