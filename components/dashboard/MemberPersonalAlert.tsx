import { formatRupiah, formatDateIndo } from "@/lib/utils";
import {
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconReceipt2,
  IconSparkles,
  IconInfoCircle,
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
  // Hitung agregat tagihan pribadi
  const pendingBills = bills.filter((b) => b.status === "pending");
  const waitingBills = bills.filter((b) => b.status === "waiting_approval");
  const paidBills = bills.filter((b) => b.status === "paid");

  const totalPendingAmount = pendingBills.reduce((acc, b) => acc + b.splitAmount, 0);
  const totalWaitingAmount = waitingBills.reduce((acc, b) => acc + b.splitAmount, 0);

  // 1. Kondisi: Ada tagihan yang belum dibayar (PENDING) -> Alert Box Merah/Kuning Mencolok
  if (pendingBills.length > 0) {
    const billTitles = pendingBills.map((b) => b.expenseTitle).join(", ");

    return (
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
              untuk <strong>{billTitles}</strong>.
            </p>

            <div className="d-flex flex-wrap gap-2 align-items-center mt-3 pt-2 border-top border-danger-subtle">
              <span className="small text-secondary fw-medium">Rincian Patungan Kamu:</span>
              {pendingBills.map((b) => (
                <span key={b.billItemId} className="badge bg-white text-dark border border-danger-subtle py-1 px-2 small">
                  {b.expenseTitle}: <strong>{formatRupiah(b.splitAmount)}</strong>
                  {b.dueDate && ` (Jatuh tempo: ${formatDateIndo(b.dueDate)})`}
                </span>
              ))}
            </div>

            <div className="small text-muted mt-2">
              👉 Silakan lakukan pembayaran ke rekening tujuan kas di bawah ini, lalu unggah bukti transfer.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Kondisi: Semua tagihan sudah dibayar tapi masih ada yang MENUNGGU VERIFIKASI (WAITING APPROVAL)
  if (waitingBills.length > 0) {
    return (
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

            <p className="mb-2 text-dark fs-4">
              Bukti transfer kamu sebesar <strong>{formatRupiah(totalWaitingAmount)}</strong> untuk{" "}
              <em>{waitingBills.map((b) => b.expenseTitle).join(", ")}</em> sudah berhasil dikirim dan sedang menunggu pengecekan oleh koordinator kos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. Kondisi: Seluruh tagihan sudah LUNAS (PAID)
  if (paidBills.length > 0) {
    return (
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
              Terima kasih, <strong>{userName}</strong>! Kamu sudah menyelesaikan seluruh {paidBills.length} kewajiban iuran bersama bulan ini. Keuangan kamar kos tetap tertib dan transparan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4. Kondisi: Belum ada tagihan sama sekali di kamar kos
  return (
    <div className="alert alert-info bg-azure-lt border-info shadow-sm mb-4 p-3 rounded-3" role="alert">
      <div className="d-flex align-items-center gap-2 text-dark">
        <IconInfoCircle size={20} className="text-azure flex-shrink-0" />
        <span className="small">
          Saat ini belum ada tagihan pengeluaran aktif yang dibagikan untuk akun Anda.
        </span>
      </div>
    </div>
  );
}
