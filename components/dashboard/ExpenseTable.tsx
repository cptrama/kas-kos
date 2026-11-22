"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExpenseWithItems, deleteExpenseAction } from "@/app/actions/expense";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { showToast } from "@/components/ui/ToastNotification";
import PaymentProofModal, { PaymentProofModalItem } from "@/components/dashboard/PaymentProofModal";
import UploadProofModal, { UploadProofModalItem } from "@/components/dashboard/UploadProofModal";
import ExpenseReceiptModal from "@/components/dashboard/ExpenseReceiptModal";
import {
  IconBolt,
  IconWifi,
  IconDroplet,
  IconFlame,
  IconTrash,
  IconToolsKitchen2,
  IconReceipt2,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconChevronDown,
  IconChevronUp,
  IconPlus,
  IconReceiptOff,
  IconTrashX,
  IconUser,
  IconShieldCheck,
  IconPhoto,
  IconUpload,
} from "@tabler/icons-react";

interface ExpenseTableProps {
  expenses: ExpenseWithItems[];
  isAdmin: boolean;
  currentUserId?: string | null;
  onOpenCreateModal: () => void;
}

export default function ExpenseTable({
  expenses: initialExpenses,
  isAdmin,
  currentUserId,
  onOpenCreateModal,
}: ExpenseTableProps) {
  const router = useRouter();
  const [expensesList, setExpensesList] = useState<ExpenseWithItems[]>(initialExpenses);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "waiting" | "paid">("all");
  const [expandedExpenseId, setExpandedExpenseId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedProofItem, setSelectedProofItem] = useState<PaymentProofModalItem | null>(null);
  const [selectedUploadItem, setSelectedUploadItem] = useState<UploadProofModalItem | null>(null);
  const [selectedReceiptExpense, setSelectedReceiptExpense] = useState<ExpenseWithItems | null>(null);

  useEffect(() => {
    setExpensesList(initialExpenses);
  }, [initialExpenses]);

  // Helper Ikon Kategori
  function getCategoryInfo(category: string) {
    switch (category) {
      case "listrik":
        return { label: "Listrik / PLN", icon: IconBolt, bg: "bg-yellow-lt text-warning" };
      case "wifi":
        return { label: "WiFi & Internet", icon: IconWifi, bg: "bg-blue-lt text-blue" };
      case "air_galon":
        return { label: "Air Galon", icon: IconDroplet, bg: "bg-cyan-lt text-cyan" };
      case "gas_lpg":
        return { label: "Gas LPG", icon: IconFlame, bg: "bg-orange-lt text-orange" };
      case "kebersihan":
        return { label: "Kebersihan", icon: IconTrash, bg: "bg-green-lt text-green" };
      case "konsumsi":
        return { label: "Konsumsi / Dapur", icon: IconToolsKitchen2, bg: "bg-purple-lt text-purple" };
      default:
        return { label: "Lainnya", icon: IconReceipt2, bg: "bg-secondary-lt text-secondary" };
    }
  }

  // Hitung status keseluruhan pengeluaran
  function getExpenseOverallStatus(exp: ExpenseWithItems) {
    if (!exp.billItems || exp.billItems.length === 0) {
      return { status: "pending", label: "Belum Bayar", badgeClass: "bg-red-lt text-danger" };
    }
    const allPaid = exp.billItems.every((item) => item.status === "paid");
    if (allPaid) {
      return { status: "paid", label: "Lunas", badgeClass: "bg-green-lt text-green" };
    }
    const hasWaiting = exp.billItems.some((item) => item.status === "waiting_approval");
    if (hasWaiting) {
      return { status: "waiting", label: "Menunggu Verifikasi", badgeClass: "bg-yellow-lt text-warning" };
    }
    return { status: "pending", label: "Belum Bayar", badgeClass: "bg-red-lt text-danger" };
  }

  // Filter daftar pengeluaran berdasarkan tab
  const filteredExpenses = expensesList.filter((exp) => {
    if (filterStatus === "all") return true;
    const overall = getExpenseOverallStatus(exp);
    return overall.status === filterStatus;
  });

  // Hitung jumlah untuk counter filter
  const pendingCount = expensesList.filter((e) => getExpenseOverallStatus(e).status === "pending").length;
  const waitingCount = expensesList.filter((e) => getExpenseOverallStatus(e).status === "waiting").length;
  const paidCount = expensesList.filter((e) => getExpenseOverallStatus(e).status === "paid").length;

  // Handler Hapus Tagihan
  async function handleDeleteExpense(expenseId: string, title: string) {
    if (!confirm(`Apakah Anda yakin ingin menghapus tagihan "${title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    setDeletingId(expenseId);
    const formData = new FormData();
    formData.append("expense_id", expenseId);
    await deleteExpenseAction(formData);
    setDeletingId(null);
  }

  function toggleExpand(id: string) {
    setExpandedExpenseId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="card shadow-sm border-0 mb-4 bg-white">
      {/* Header Tabel & Filter Status */}
      <div className="card-header border-bottom p-3 p-md-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 w-100">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-green-lt p-2 rounded-circle">
                <IconReceipt2 size={20} />
              </span>
              <h3 className="card-title m-0 fw-bold">Daftar Tagihan & Pengeluaran Kas</h3>
            </div>
            <p className="text-secondary small m-0 mt-1">
              Pantau status pelunasan seluruh iuran bersama kamar kos.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {isAdmin && (
              <button
                type="button"
                className="btn btn-teal btn-sm d-flex align-items-center gap-1 shadow-sm"
                onClick={onOpenCreateModal}
              >
                <IconPlus size={16} />
                <span>Tambah Tagihan</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nav Tabs Filter Status */}
      <div className="px-3 px-md-4 pt-3 bg-light border-bottom">
        <ul className="nav nav-tabs card-header-tabs m-0 border-0">
          <li className="nav-item">
            <button
              className={`nav-link ${filterStatus === "all" ? "active fw-bold text-teal" : "text-secondary"}`}
              onClick={() => setFilterStatus("all")}
            >
              Semua ({expensesList.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filterStatus === "pending" ? "active fw-bold text-danger" : "text-secondary"}`}
              onClick={() => setFilterStatus("pending")}
            >
              Belum Bayar ({pendingCount})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filterStatus === "waiting" ? "active fw-bold text-warning" : "text-secondary"}`}
              onClick={() => setFilterStatus("waiting")}
            >
              Menunggu Verifikasi ({waitingCount})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filterStatus === "paid" ? "active fw-bold text-success" : "text-secondary"}`}
              onClick={() => setFilterStatus("paid")}
            >
              Lunas ({paidCount})
            </button>
          </li>
        </ul>
      </div>

      {/* Data Table */}
      {filteredExpenses.length === 0 ? (
        <div className="card-body text-center py-6">
          <div className="avatar avatar-xl bg-light rounded-circle mx-auto mb-3 text-secondary">
            <IconReceiptOff size={36} />
          </div>
          <h4 className="fw-bold text-dark">Tidak Ada Tagihan Ditemukan</h4>
          <p className="text-secondary small mx-auto" style={{ maxWidth: "420px" }}>
            {filterStatus === "all"
              ? "Kamar kos ini belum memiliki catatan pengeluaran bersama. Klik tombol '+ Tambah Tagihan' untuk mulai mencatat."
              : `Tidak ada tagihan dengan filter status "${filterStatus}".`}
          </p>
          {isAdmin && filterStatus === "all" && (
            <button type="button" className="btn btn-teal mt-2" onClick={onOpenCreateModal}>
              <IconPlus size={18} className="me-1" /> Buat Tagihan Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-vcenter table-hover m-0">
            <thead>
              <tr className="bg-light">
                <th>Pengeluaran & Kategori</th>
                <th>Jatuh Tempo</th>
                <th>Total Nominal</th>
                <th>Porsi / Orang</th>
                <th>Status</th>
                <th>Progress Pelunasan</th>
                <th className="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => {
                const cat = getCategoryInfo(exp.category);
                const overall = getExpenseOverallStatus(exp);
                const CatIcon = cat.icon;
                const isExpanded = expandedExpenseId === exp.id;
                const paidItems = exp.billItems.filter((i) => i.status === "paid").length;
                const totalItems = exp.billItems.length;
                const progressPct = totalItems > 0 ? Math.round((paidItems / totalItems) * 100) : 0;
                const perPersonAmount = exp.billItems.length > 0 ? exp.billItems[0].splitAmount : 0;

                return (
                  <tr key={exp.id} className="align-middle">
                    {/* Judul & Kategori */}
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`avatar avatar-sm rounded-circle ${cat.bg}`}>
                          <CatIcon size={18} />
                        </span>
                        <div>
                          <div className="fw-bold text-dark">{exp.title}</div>
                          <div className="small text-muted d-flex align-items-center gap-2">
                            <span>{cat.label}</span>
                            {exp.description && (
                              <>
                                <span>•</span>
                                <span className="text-truncate" style={{ maxWidth: "200px" }}>
                                  {exp.description}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Jatuh Tempo */}
                    <td className="small text-secondary">{formatDateIndo(exp.dueDate)}</td>

                    {/* Total Nominal */}
                    <td className="fw-bold text-dark">{formatRupiah(exp.totalAmount)}</td>

                    {/* Porsi per Orang */}
                    <td className="text-teal fw-semibold small">{formatRupiah(perPersonAmount)}</td>

                    {/* Status Badge Warna-Warni Tabler */}
                    <td>
                      <span className={`badge ${overall.badgeClass} d-inline-flex align-items-center gap-1`}>
                        {overall.status === "paid" && <IconCheck size={14} />}
                        {overall.status === "waiting" && <IconClock size={14} />}
                        {overall.status === "pending" && <IconAlertCircle size={14} />}
                        <span>{overall.label}</span>
                      </span>
                    </td>

                    {/* Progress Pelunasan */}
                    <td style={{ minWidth: "160px" }}>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress progress-xs flex-grow-1">
                          <div
                            className={`progress-bar ${progressPct === 100 ? "bg-green" : "bg-teal"}`}
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                        <span className="small text-secondary fw-medium">
                          {paidItems}/{totalItems}
                        </span>
                      </div>
                    </td>

                    {/* Tombol Aksi */}
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        {/* Tombol Lihat/Unggah Struk Pembelian Riil Koordinator */}
                        {exp.proofImageUrl ? (
                          <button
                            type="button"
                            className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
                            onClick={() => {
                              const current = expensesList.find((e) => e.id === exp.id) || exp;
                              setSelectedReceiptExpense(current);
                            }}
                            title="Lihat struk pembelian / nomor token resmi"
                          >
                            <IconReceipt2 size={15} />
                            <span className="d-none d-lg-inline">Struk</span>
                          </button>
                        ) : isAdmin ? (
                          <button
                            type="button"
                            className="btn btn-outline-teal btn-sm d-flex align-items-center gap-1"
                            onClick={() => {
                              const current = expensesList.find((e) => e.id === exp.id) || exp;
                              setSelectedReceiptExpense(current);
                            }}
                            title="Unggah struk pembelian kas"
                          >
                            <IconUpload size={14} />
                            <span className="d-none d-lg-inline">Unggah Struk</span>
                          </button>
                        ) : null}

                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                          onClick={() => toggleExpand(exp.id)}
                          title="Lihat rincian pembayaran per anggota"
                        >
                          <span>Rincian</span>
                          {isExpanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                        </button>

                        {isAdmin && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteExpense(exp.id, exp.title)}
                            disabled={deletingId === exp.id}
                            title="Hapus tagihan ini"
                          >
                            {deletingId === exp.id ? (
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            ) : (
                              <IconTrashX size={15} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Accordion Detail Breakdown per Anggota jika expanded */}
      {expandedExpenseId && (
        <div className="card-footer bg-light p-3 p-md-4 border-top">
          {(() => {
            const exp = expensesList.find((e) => e.id === expandedExpenseId);
            if (!exp) return null;

            return (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold m-0 text-dark">
                    Rincian Pelunasan Roommate: <span className="text-teal">{exp.title}</span>
                  </h4>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setExpandedExpenseId(null)}
                  >
                    Tutup Rincian
                  </button>
                </div>

                {/* Banner Bukti Realisasi Pembelian Kas Koordinator (Anti-Penggelapan Dana) */}
                <div
                  className={`card ${
                    exp.proofImageUrl ? "bg-green-lt border-green" : "bg-white border border-dashed"
                  } p-3 mb-3 shadow-none`}
                >
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                      <div
                        className={`fw-bold ${
                          exp.proofImageUrl ? "text-success" : "text-dark"
                        } d-flex align-items-center gap-1`}
                      >
                        <IconShieldCheck size={18} />
                        <span>
                          {exp.proofImageUrl
                            ? "Struk Pembelian Kas Terlampir & Terverifikasi"
                            : "Struk Bukti Pembelian Belum Dilampirkan"}
                        </span>
                      </div>
                      {exp.receiptNotes ? (
                        <div className="small text-dark mt-1">
                          <strong>Catatan / No. Token:</strong>{" "}
                          <span className="font-monospace fw-bold bg-white px-2 py-0.5 rounded border">
                            {exp.receiptNotes}
                          </span>
                        </div>
                      ) : (
                        <div className="small text-secondary mt-1">
                          {exp.proofImageUrl
                            ? "Koordinator telah melampirkan foto struk pembelian resmi yang dapat diperiksa oleh semua roommate."
                            : isAdmin
                            ? "Dana sudah terkumpul? Harap lampirkan foto struk pembelian token/kuitansi agar transparan bagi semua penghuni."
                            : "Menunggu koordinator melampirkan foto struk pembelian token / kuitansi resmi."}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        exp.proofImageUrl ? "btn-success" : "btn-outline-teal"
                      } d-flex align-items-center gap-1 shadow-sm`}
                      onClick={() => {
                        const current = expensesList.find((e) => e.id === exp.id) || exp;
                        setSelectedReceiptExpense(current);
                      }}
                    >
                      {exp.proofImageUrl ? <IconReceipt2 size={16} /> : <IconUpload size={16} />}
                      <span>
                        {exp.proofImageUrl
                          ? "Lihat Struk Pembelian"
                          : isAdmin
                          ? "Unggah Struk Pembelian"
                          : "Periksa Status Struk"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="row g-2">
                  {exp.billItems.map((item) => {
                    let badgeClass = "bg-red-lt text-danger";
                    let statusText = "Belum Bayar";
                    let StatusIcon = IconAlertCircle;

                    if (item.status === "paid") {
                      badgeClass = "bg-green-lt text-green";
                      statusText = "Lunas";
                      StatusIcon = IconCheck;
                    } else if (item.status === "waiting_approval") {
                      badgeClass = "bg-yellow-lt text-warning";
                      statusText = "Menunggu Approval";
                      StatusIcon = IconClock;
                    }

                    return (
                      <div key={item.id} className="col-md-6 col-lg-4">
                        <div className="card bg-white shadow-sm border p-3 h-100">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center gap-2">
                              <span className="avatar avatar-xs bg-light rounded-circle">
                                <IconUser size={14} />
                              </span>
                              <div className="fw-semibold text-dark">
                                {item.userProfile?.fullName || "Roommate"}
                              </div>
                            </div>
                            <span className={`badge ${badgeClass} d-inline-flex align-items-center gap-1 small`}>
                              <StatusIcon size={12} />
                              <span>{statusText}</span>
                            </span>
                          </div>

                          <div className="d-flex justify-content-between text-secondary small">
                            <span>Nominal Porsi:</span>
                            <span className="fw-bold text-dark">{formatRupiah(item.splitAmount)}</span>
                          </div>

                          {item.paidAt && (
                            <div className="d-flex justify-content-between text-secondary small mt-1">
                              <span>Tanggal Bayar:</span>
                              <span>{formatDateIndo(item.paidAt)}</span>
                            </div>
                          )}

                          {/* Aksi Verifikasi Bukti Transfer & Status Pelunasan */}
                          <div className="mt-2 pt-2 border-top">
                            {item.status === "waiting_approval" ? (
                              <button
                                type="button"
                                className="btn btn-warning btn-sm w-100 d-flex align-items-center justify-content-center gap-1 fw-bold shadow-sm"
                                onClick={() =>
                                  setSelectedProofItem({
                                    id: item.id,
                                    userName: item.userProfile?.fullName || "Roommate",
                                    userPhone: item.userProfile?.phoneNumber,
                                    expenseTitle: exp.title,
                                    splitAmount: item.splitAmount,
                                    status: item.status,
                                    proofImageUrl: item.proofImageUrl,
                                    paidAt: item.paidAt,
                                    notes: item.notes,
                                  })
                                }
                              >
                                <IconShieldCheck size={16} />
                                <span>Periksa Bukti & Verifikasi</span>
                              </button>
                            ) : item.proofImageUrl ? (
                              <button
                                type="button"
                                className="btn btn-outline-teal btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                                onClick={() =>
                                  setSelectedProofItem({
                                    id: item.id,
                                    userName: item.userProfile?.fullName || "Roommate",
                                    userPhone: item.userProfile?.phoneNumber,
                                    expenseTitle: exp.title,
                                    splitAmount: item.splitAmount,
                                    status: item.status,
                                    proofImageUrl: item.proofImageUrl,
                                    paidAt: item.paidAt,
                                    notes: item.notes,
                                  })
                                }
                              >
                                <IconPhoto size={15} />
                                <span>Lihat Bukti Transfer</span>
                              </button>
                            ) : item.status === "pending" && currentUserId && item.userId === currentUserId ? (
                              <button
                                type="button"
                                className="btn btn-teal btn-sm w-100 d-flex align-items-center justify-content-center gap-1 shadow-xs fw-semibold"
                                onClick={() =>
                                  setSelectedUploadItem({
                                    id: item.id,
                                    expenseTitle: exp.title,
                                    splitAmount: item.splitAmount,
                                  })
                                }
                              >
                                <IconUpload size={15} />
                                <span>Upload Bukti Bayar</span>
                              </button>
                            ) : isAdmin && item.status === "pending" ? (
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                                onClick={() =>
                                  setSelectedProofItem({
                                    id: item.id,
                                    userName: item.userProfile?.fullName || "Roommate",
                                    userPhone: item.userProfile?.phoneNumber,
                                    expenseTitle: exp.title,
                                    splitAmount: item.splitAmount,
                                    status: item.status,
                                    proofImageUrl: item.proofImageUrl,
                                    paidAt: item.paidAt,
                                    notes: item.notes,
                                  })
                                }
                              >
                                <IconCheck size={15} />
                                <span>Verifikasi Pelunasan</span>
                              </button>
                            ) : (
                              <div className="text-muted small text-center py-1">Belum ada bukti</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Modal Pratinjau Bukti Transfer & Approval Koordinator (TASK-10) */}
      <PaymentProofModal
        isOpen={!!selectedProofItem}
        item={selectedProofItem}
        isAdmin={isAdmin}
        onClose={() => setSelectedProofItem(null)}
      />

      {/* Modal Konfirmasi Pembayaran & Upload Bukti Transfer Roommate (TASK-14) */}
      <UploadProofModal
        isOpen={!!selectedUploadItem}
        item={selectedUploadItem}
        onClose={() => setSelectedUploadItem(null)}
      />

      {/* Modal Transparansi Bukti Pembelian / Struk Pengeluaran Kas (Anti-Penggelapan Dana) */}
      <ExpenseReceiptModal
        isOpen={!!selectedReceiptExpense}
        expense={selectedReceiptExpense}
        isAdmin={isAdmin}
        onClose={() => setSelectedReceiptExpense(null)}
        onSuccess={(updatedData) => {
          if (selectedReceiptExpense) {
            setExpensesList((prev) =>
              prev.map((e) =>
                e.id === selectedReceiptExpense.id
                  ? {
                      ...e,
                      proofImageUrl: updatedData.proofImageUrl || e.proofImageUrl,
                      receiptNotes:
                        updatedData.receiptNotes !== undefined
                          ? updatedData.receiptNotes
                          : e.receiptNotes,
                    }
                  : e
              )
            );
          }
          setSelectedReceiptExpense(null);
          showToast(
            "success",
            updatedData.message || "Bukti struk pembelian berhasil disimpan dan dipublikasikan!"
          );
          router.refresh();
        }}
      />
    </div>
  );
}
