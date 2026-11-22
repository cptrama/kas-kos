"use client";

import { useState, useRef, useEffect } from "react";
import { ExpenseWithItems, uploadExpenseReceiptAction } from "@/app/actions/expense";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { showToast } from "@/components/ui/ToastNotification";
import {
  IconReceipt2,
  IconUpload,
  IconCheck,
  IconCopy,
  IconPhoto,
  IconAlertCircle,
  IconExternalLink,
  IconShieldCheck,
  IconBolt,
  IconX,
} from "@tabler/icons-react";

interface ExpenseReceiptModalProps {
  expense: ExpenseWithItems | null;
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onSuccess?: (updatedData: {
    proofImageUrl: string | null;
    receiptNotes: string | null;
    message?: string;
  }) => void;
}

export default function ExpenseReceiptModal({
  expense,
  isOpen,
  isAdmin,
  onClose,
  onSuccess,
}: ExpenseReceiptModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pastikan form unggah selalu di-reset saat modal dibuka atau ditutup
  useEffect(() => {
    if (!isOpen) {
      setShowUploadForm(false);
      setPreviewUrl(null);
    }
  }, [isOpen, expense?.id]);

  if (!isOpen || !expense) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("danger", "Ukuran gambar terlalu besar. Maksimal 5 MB.");
        setPreviewUrl(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  }

  function handleCopyToken(token: string) {
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    showToast("success", "Nomor token berhasil disalin ke clipboard!");
    setTimeout(() => setCopiedToken(false), 2500);
  }

  async function handleUploadReceipt(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!expense) return;

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("expense_id", expense.id);

    try {
      const res = await uploadExpenseReceiptAction(formData);
      setIsLoading(false);

      if (res && !res.success) {
        const errMsg = res.error || "Gagal mengunggah bukti struk.";
        showToast("danger", errMsg);
        return;
      }

      setShowUploadForm(false);
      setPreviewUrl(null);

      const successMsg = res?.message || "Bukti struk pembelian berhasil disimpan dan dipublikasikan!";
      showToast("success", successMsg);

      if (onSuccess) {
        onSuccess({
          proofImageUrl: res?.proofImageUrl || previewUrl,
          receiptNotes: (formData.get("receipt_notes")?.toString().trim()) || null,
          message: successMsg,
        });
      }

      // Langsung close ke halaman utama, tidak stay pada menu upload
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      const errMsg = err?.message || "Terjadi kendala jaringan saat mengunggah.";
      showToast("danger", errMsg);
    }
  }

  return (
    <div
      className="modal modal-blur fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", zIndex: 1060 }}
    >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content shadow-lg border-0">
            {/* Header Modal */}
            <div className="modal-header border-bottom">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-teal text-white p-2 rounded-circle">
                  <IconShieldCheck size={20} />
                </span>
                <div>
                  <h5 className="modal-title fw-bold m-0">Transparansi Struk Pembelian Kas</h5>
                  <span className="text-secondary small">
                    Bukti realisasi pengeluaran: <strong>{expense.title}</strong>
                  </span>
                </div>
              </div>
              <button type="button" className="btn-close" onClick={onClose} disabled={isLoading}></button>
            </div>

            <div className="modal-body p-4">
              {/* Kartu Ringkasan Pengeluaran */}
            <div className="card bg-light border-0 p-3 mb-4">
              <div className="row align-items-center g-3">
                <div className="col-sm-6">
                  <div className="text-secondary small">Pengeluaran Bersama:</div>
                  <div className="fs-3 fw-bold text-dark">{expense.title}</div>
                  <div className="small text-muted">Jatuh Tempo: {formatDateIndo(expense.dueDate)}</div>
                </div>
                <div className="col-sm-6 text-sm-end">
                  <div className="text-secondary small">Total Dana Terealisasi:</div>
                  <div className="fs-2 fw-extrabold text-teal">{formatRupiah(expense.totalAmount)}</div>
                  <span className="badge bg-green-lt text-green d-inline-flex align-items-center gap-1 mt-1">
                    <IconCheck size={14} /> Dana Kas Terkumpul dari Roommate
                  </span>
                </div>
              </div>
            </div>

            {/* Kotak Catatan Khusus / Nomor Token Listrik (Jika Ada) */}
            {expense.receiptNotes && (
              <div className="card bg-teal-lt border-teal mb-4 p-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div>
                    <div className="fw-bold text-teal d-flex align-items-center gap-1">
                      <IconBolt size={18} />
                      <span>Nomor Token / Catatan Struk Koordinator:</span>
                    </div>
                    <div className="fs-2 fw-bold text-dark mt-1 letter-spacing-1 font-monospace">
                      {expense.receiptNotes}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-teal d-flex align-items-center gap-1"
                    onClick={() => handleCopyToken(expense.receiptNotes || "")}
                  >
                    {copiedToken ? <IconCheck size={15} /> : <IconCopy size={15} />}
                    <span>{copiedToken ? "Tersalin!" : "Salin Kode"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Gambar Bukti Struk Pembelian Riil */}
            {expense.proofImageUrl ? (
              <div className="text-center mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-semibold text-dark d-flex align-items-center gap-1">
                    <IconPhoto size={16} />
                    <span>Foto Struk Pembelian / Nota Resmi:</span>
                  </div>
                  <a
                    href={expense.proofImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-teal d-flex align-items-center gap-1"
                  >
                    <IconExternalLink size={14} />
                    <span>Buka Ukuran Asli</span>
                  </a>
                </div>

                <div className="bg-dark rounded p-2 d-flex justify-content-center align-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={expense.proofImageUrl}
                    alt="Bukti Struk Pembelian Kas"
                    className="img-fluid rounded"
                    style={{ maxHeight: "400px", objectFit: "contain" }}
                  />
                </div>
                <div className="text-muted small mt-2">
                  ✓ Bukti pembelian ini dapat dilihat secara transparan oleh seluruh roommate kamar kos.
                </div>
              </div>
            ) : (
              !showUploadForm && (
                <div className="p-4 bg-light rounded border border-dashed text-center mb-3">
                  <IconReceipt2 size={40} className="text-muted mb-2 opacity-50" />
                  <h4 className="fw-bold text-dark mb-1">Belum Ada Struk Pembelian</h4>
                  <p className="text-secondary small mx-auto mb-0 text-center" style={{ maxWidth: "460px" }}>
                    Koordinator kos belum mengunggah foto struk/kuitansi pembelian untuk pengeluaran ini.
                  </p>
                  {isAdmin && (
                    <button
                      type="button"
                      className="btn btn-teal btn-sm mt-3 d-inline-flex align-items-center gap-1"
                      onClick={() => setShowUploadForm(true)}
                    >
                      <IconUpload size={16} />
                      <span>Unggah Struk Pembelian Sekarang</span>
                    </button>
                  )}
                </div>
              )
            )}

            {/* Form Unggah Struk Baru (Khusus Koordinator / Admin Kos) */}
            {showUploadForm && (
              <form onSubmit={handleUploadReceipt} className="card p-3 border-teal mt-3">
                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                  <h5 className="fw-bold m-0 text-teal d-flex align-items-center gap-1">
                    <IconUpload size={18} />
                    <span>Form Unggah Struk Pembelian Koordinator</span>
                  </h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost-secondary"
                    onClick={() => {
                      setShowUploadForm(false);
                      setPreviewUrl(null);
                    }}
                  >
                    <IconX size={16} />
                  </button>
                </div>

                <div className="mb-3">
                  <label className="form-label required">
                    Pilih Berkas Foto Struk / Kuitansi Pembelian (Maks. 5 MB)
                  </label>
                  <input
                    type="file"
                    name="receipt_file"
                    ref={fileInputRef}
                    accept="image/*"
                    required
                    className="form-control"
                    onChange={handleFileChange}
                  />
                </div>

                {previewUrl && (
                  <div className="mb-3 text-center bg-dark p-2 rounded">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Pratinjau Struk"
                      className="img-fluid rounded"
                      style={{ maxHeight: "250px", objectFit: "contain" }}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">
                    Nomor Token Listrik 20-Digit / Catatan Struk (Opsional)
                  </label>
                  <input
                    type="text"
                    name="receipt_notes"
                    defaultValue={expense.receiptNotes || ""}
                    className="form-control font-monospace"
                    placeholder="Contoh: 2841-8932-1049-5821-4920"
                  />
                  <div className="form-text small text-muted">
                    Roommate kos dapat langsung menyalin kode token ini untuk dimasukkan ke meteran listrik.
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setShowUploadForm(false);
                      setPreviewUrl(null);
                    }}
                    disabled={isLoading}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-teal btn-sm px-3" disabled={isLoading}>
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    ) : (
                      <IconCheck size={16} className="me-1" />
                    )}
                    {isLoading ? "Mengunggah..." : "Simpan & Publikasikan Struk"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Modal */}
          <div className="modal-footer border-top bg-light d-flex justify-content-between">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={isLoading}>
              Tutup
            </button>

            {isAdmin && !showUploadForm && (
              <button
                type="button"
                className="btn btn-outline-teal btn-sm d-flex align-items-center gap-1"
                onClick={() => setShowUploadForm(true)}
              >
                <IconUpload size={16} />
                <span>{expense.proofImageUrl ? "Ganti Foto Struk" : "Unggah Struk Pembelian"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
