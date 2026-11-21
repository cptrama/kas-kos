"use client";

import { useState } from "react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import UploadProofModal, { UploadProofModalItem } from "@/components/dashboard/UploadProofModal";
import {
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconSparkles,
  IconInfoCircle,
  IconUpload,
} from "@tabler/icons-react";

export interface PersonalBillSummary {
  billItemId: string;
  expenseId: string;
  expenseTitle: string;
  category: string;
  splitAmount: number;
  status: "pending" | "waiting_approval" | "paid";
  dueDate?: string | null;
}

interface MemberPersonalAlertProps {
  userName: string;
  bills: PersonalBillSummary[];
}

export default function MemberPersonalAlert({
  userName,
  bills,
}: MemberPersonalAlertProps) {
  const [selectedUploadItem, setSelectedUploadItem] = useState<UploadProofModalItem | null>(null);

  // Hitung agregat tagihan pribadi
  const pendingBills = bills.filter((b) => b.status === "pending");
  const waitingBills = bills.filter((b) => b.status === "waiting_approval");
  const paidBills = bills.filter((b) => b.status === "paid");

  const totalPendingAmount = pendingBills.reduce((acc, b) => acc + b.splitAmount, 0);
  const totalWaitingAmount = waitingBills.reduce((acc, b) => acc + b.splitAmount, 0);

  return (
    <>
      {/* Modal Upload Bukti Transfer */}
      <UploadProofModal
        item={selectedUploadItem}
        isOpen={Boolean(selectedUploadItem)}
        onClose={() => setSelectedUploadItem(null)}
      />

      {/* 1. Kondisi: Ada tagihan yang belum dibayar (PENDING) -> Alert Box Merah/Kuning Mencolok */}
      {pendingBills.length > 0 && (
        <div className="alert alert-danger bg-danger-lt border-danger shadow-sm mb-4 p-4 rounded-3" role="alert">
          <div className="d-flex align-items-start gap-3">
            <div className="avatar avatar-md bg-danger text-white rounded-circle flex-shrink-0">
              <IconAlertTriangle size={24} />
            </div>
            <div className="w-100">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                <h3 className="alert-title fw-bold text-danger m-0 fs-3">
                  Tagihan Kas Belum Lunas
                </h3>
                <span className="badge bg-danger text-white px-3 py-1 fs-5 fw-bold">
                  {pendingBills.length} Tagihan Tertunggak
                </span>
              </div>

              <p className="mb-2 text-dark fs-3">
                Halo <strong>{userName}</strong>, kamu memiliki tagihan belum lunas sebesar{" "}
                <span className="fw-extrabold text-danger underline text-decoration-underline">
                  {formatRupiah(totalPendingAmount)}
                </span>{" "}
                untuk <strong>{pendingBills.map((b) => b.expenseTitle).join(", ")}</strong>.
              </p>

              {/* Rincian Tagihan & Tombol Upload Bukti 1-Klik */}
              <div className="mt-3 pt-2 border-top border-danger-subtle">
                <div className="small text-secondary fw-semibold mb-2">Rincian Patungan Kamu:</div>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  {pendingBills.map((b) => (
                    <div
                      key={b.billItemId}
                      className="bg-white p-2 px-3 rounded border border-danger-subtle shadow-xs d-flex align-items-center justify-content-between gap-3 flex-wrap"
                    >
                      <div>
                        <span className="fw-bold text-dark">{b.expenseTitle}</span>:{" "}
                        <span className="text-danger fw-extrabold">{formatRupiah(b.splitAmount)}</span>
                        {b.dueDate && (
                          <span className="text-muted small ms-1" style={{ fontSize: "11px" }}>
                            • Jatuh tempo: {formatDateIndo(b.dueDate)}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-teal d-flex align-items-center gap-1 shadow-xs"
                        onClick={() =>
                          setSelectedUploadItem({
                            id: b.billItemId,
                            expenseTitle: b.expenseTitle,
                            splitAmount: b.splitAmount,
                          })
                        }
                      >
                        <IconUpload size={14} />
                        <span>Upload Bukti Bayar</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="small text-muted mt-3">
                👉 Silakan lakukan transfer ke rekening tujuan kas di bawah, lalu klik tombol <strong>Upload Bukti Bayar</strong> di atas.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Kondisi: Menunggu verifikasi koordinator */}
      {waitingBills.length > 0 && (
        <div className="alert alert-warning bg-warning-lt border-warning shadow-sm mb-4 p-4 rounded-3" role="alert">
          <div className="d-flex align-items-start gap-3">
            <div className="avatar avatar-md bg-warning text-white rounded-circle flex-shrink-0">
              <IconClock size={24} />
            </div>
            <div className="w-100">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                <h3 className="alert-title fw-bold text-warning-emphasis m-0 fs-3">
                  Bukti Pembayaran Menunggu Verifikasi
                </h3>
                <span className="badge bg-warning text-dark px-3 py-1 fs-5 fw-bold">
                  {waitingBills.length} Menunggu Approval
                </span>
              </div>

              <p className="mb-0 text-dark fs-4">
                Bukti transfer kamu sebesar <strong>{formatRupiah(totalWaitingAmount)}</strong> untuk{" "}
                <em>{waitingBills.map((b) => b.expenseTitle).join(", ")}</em> sudah terkirim ke sistem dan sedang menunggu konfirmasi koordinator kos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Kondisi: Semua lunas */}
      {pendingBills.length === 0 && waitingBills.length === 0 && paidBills.length > 0 && (
        <div className="alert alert-success bg-green-lt border-success shadow-sm mb-4 p-4 rounded-3" role="alert">
          <div className="d-flex align-items-center gap-3">
            <div className="avatar avatar-md bg-success text-white rounded-circle flex-shrink-0">
              <IconCheck size={24} />
            </div>
            <div>
              <h3 className="alert-title fw-bold text-success m-0 fs-3 d-flex align-items-center gap-2">
                <span>Semua Tagihan Kamu Sudah Lunas!</span>
                <IconSparkles size={18} />
              </h3>
              <p className="mb-0 text-dark small mt-1">
                Terima kasih, <strong>{userName}</strong>! Kamu sudah menyelesaikan seluruh {paidBills.length} kewajiban kas bersama bulan ini. Keuangan kamar kos tetap tertib dan transparan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Kondisi: Belum ada tagihan sama sekali */}
      {bills.length === 0 && (
        <div className="alert alert-info bg-azure-lt border-info shadow-sm mb-4 p-3 rounded-3" role="alert">
          <div className="d-flex align-items-center gap-2 text-dark">
            <IconInfoCircle size={20} className="text-azure flex-shrink-0" />
            <span className="small">
              Saat ini belum ada pengeluaran bersama yang dibagikan untuk kamar kos Anda.
            </span>
          </div>
        </div>
      )}
    </>
  );
}
