"use client";

import { useState } from "react";
import { createExpenseWithSplitAction } from "@/app/actions/expense";
import { formatRupiah } from "@/lib/utils";
import {
  IconReceipt2,
  IconBolt,
  IconWifi,
  IconDroplet,
  IconFlame,
  IconTrash,
  IconToolsKitchen2,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";

interface CreateExpenseModalProps {
  groupId: string;
  memberCount: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateExpenseModal({
  groupId,
  memberCount,
  isOpen,
  onClose,
  onSuccess,
}: CreateExpenseModalProps) {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const estimatedSplit = memberCount > 0 ? Math.floor(totalAmount / memberCount) : 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await createExpenseWithSplitAction(formData);

    setIsLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || "Gagal membuat tagihan.");
    } else {
      setSuccessMsg(res.message || "Tagihan berhasil dibuat!");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1200);
    }
  }

  return (
    <div
      className="modal modal-blur fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header border-bottom">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-green text-white p-2 rounded-circle">
                <IconReceipt2 size={20} />
              </span>
              <div>
                <h5 className="modal-title fw-bold m-0">Buat Tagihan Kas Bersama</h5>
                <span className="text-secondary small">
                  Otomatis dibagi rata ke {memberCount} anggota aktif kos
                </span>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose} disabled={isLoading}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <input type="hidden" name="group_id" value={groupId} />

            <div className="modal-body p-4">
              {errorMsg && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" role="alert">
                  <IconAlertCircle size={20} />
                  <div>{errorMsg}</div>
                </div>
              )}

              {successMsg && (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-3" role="alert">
                  <IconCheck size={20} />
                  <div>{successMsg}</div>
                </div>
              )}

              <div className="row g-3">
                {/* Judul Pengeluaran */}
                <div className="col-12">
                  <label className="form-label required">Judul Tagihan / Pengeluaran</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="form-control"
                    placeholder="Contoh: Token Listrik PLN 100rb, Iuran WiFi IndiHome, dsb."
                  />
                </div>

                {/* Kategori Pengeluaran */}
                <div className="col-md-6">
                  <label className="form-label required">Kategori</label>
                  <select name="category" className="form-select" defaultValue="listrik" required>
                    <option value="listrik">⚡ Listrik / Token PLN</option>
                    <option value="wifi">📶 WiFi & Internet</option>
                    <option value="air_galon">💧 Air Minum Galon</option>
                    <option value="gas_lpg">🔥 Gas LPG / Dapur</option>
                    <option value="kebersihan">🧹 Iuran Kebersihan & Sampah</option>
                    <option value="konsumsi">🍳 Beras & Kebutuhan Bersama</option>
                    <option value="lainnya">📦 Pengeluaran Lainnya</option>
                  </select>
                </div>

                {/* Tanggal Jatuh Tempo */}
                <div className="col-md-6">
                  <label className="form-label">Tanggal Jatuh Tempo (Opsional)</label>
                  <input type="date" name="due_date" className="form-control" />
                </div>

                {/* Nominal Total Tagihan */}
                <div className="col-12">
                  <label className="form-label required">Total Nominal Tagihan (Rp)</label>
                  <div className="input-group">
                    <span className="input-group-text fw-bold">Rp</span>
                    <input
                      type="number"
                      name="total_amount"
                      required
                      min="1000"
                      step="500"
                      className="form-control form-control-lg fw-bold text-dark"
                      placeholder="Contoh: 150000"
                      onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Live Split Calculation Card */}
                {totalAmount > 0 && memberCount > 0 && (
                  <div className="col-12">
                    <div className="card bg-teal-lt border-teal border-dashed p-3">
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                          <div className="text-teal fw-bold">Kalkulasi Auto-Split:</div>
                          <div className="small text-secondary">
                            Dibagi rata untuk <strong>{memberCount} penghuni</strong> aktif
                          </div>
                        </div>
                        <div className="text-end">
                          <span className="text-muted small">Porsi per orang:</span>
                          <div className="fs-2 fw-extrabold text-teal">
                            {formatRupiah(estimatedSplit)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Keterangan Tambahan */}
                <div className="col-12">
                  <label className="form-label">Keterangan / Catatan Tambahan (Opsional)</label>
                  <textarea
                    name="description"
                    rows={2}
                    className="form-control"
                    placeholder="Contoh: Dibeli tanggal 20, struk pembelian disimpan di kulkas."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Batal
              </button>
              <button type="submit" className="btn btn-teal px-4" disabled={isLoading}>
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                ) : (
                  <IconCheck size={18} className="me-1" />
                )}
                {isLoading ? "Menyimpan..." : "Buat Tagihan & Bagi Rata"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
