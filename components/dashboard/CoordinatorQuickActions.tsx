"use client";

import { useState } from "react";
import {
  IconCopy,
  IconCheck,
  IconReceipt2,
  IconSparkles,
} from "@tabler/icons-react";

interface CoordinatorQuickActionsProps {
  inviteCode: string;
  groupName: string;
  isAdmin: boolean;
  onOpenCreateExpense?: () => void;
}

export default function CoordinatorQuickActions({
  inviteCode,
  groupName,
  isAdmin,
  onOpenCreateExpense,
}: CoordinatorQuickActionsProps) {
  const [copied, setCopied] = useState(false);
  const [showPlaceholderModal, setShowPlaceholderModal] = useState(false);

  function handleCopyInviteCode() {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCreateExpense() {
    if (onOpenCreateExpense) {
      onOpenCreateExpense();
    } else {
      setShowPlaceholderModal(true);
    }
  }

  return (
    <>
      <div className="card shadow-sm border-0 mb-4 bg-white">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-teal-lt p-1 rounded">Quick Actions</span>
                <span className="text-secondary small">Aksi Cepat Koordinator</span>
              </div>
              <h3 className="card-title fw-bold m-0 mt-1">
                Kelola Tagihan & Penghuni: <span className="text-teal">{groupName}</span>
              </h3>
            </div>

            <div className="d-flex flex-wrap gap-2 align-items-center">
              {/* Tombol Cepat: Salin Kode Invite */}
              <button
                type="button"
                className="btn btn-outline-teal d-flex align-items-center gap-2"
                onClick={handleCopyInviteCode}
                title="Salin kode invite 6-digit untuk roommate"
              >
                {copied ? <IconCheck size={18} className="text-success" /> : <IconCopy size={18} />}
                <span>{copied ? "Kode Tersalin!" : "Salin Kode Invite"}</span>
              </button>

              {/* Tombol Cepat: Buat Tagihan Baru */}
              {isAdmin && (
                <button
                  type="button"
                  className="btn btn-teal d-flex align-items-center gap-2 shadow-sm"
                  onClick={handleCreateExpense}
                  id="btn-quick-create-expense"
                >
                  <IconReceipt2 size={18} />
                  <span className="fw-semibold">Buat Tagihan Baru</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Siap Pakai untuk Buat Tagihan Baru (TASK-08 & TASK-09 Integration) */}
      {showPlaceholderModal && (
        <div className="modal modal-blur fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-green text-white p-2 rounded-circle">
                    <IconReceipt2 size={18} />
                  </span>
                  <h5 className="modal-title fw-bold m-0">Buat Tagihan Kas Baru</h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPlaceholderModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4 text-center">
                <div className="avatar avatar-xl bg-teal-lt rounded-circle mx-auto mb-3">
                  <IconSparkles size={32} />
                </div>
                <h4 className="fw-bold mb-2">Fitur Auto-Split Engine (TASK-08)</h4>
                <p className="text-secondary small mb-3">
                  Tombol aksi cepat ini telah terhubung ke antarmuka Koordinator Kos. Form lengkap dengan pembagian otomatis (*split bill*) dan modal pop-up akan disempurnakan pada **TASK-08** dan **TASK-09**.
                </p>
                <div className="bg-light p-3 rounded text-start border small">
                  <div className="fw-semibold text-dark mb-1">Target Form Tagihan:</div>
                  <ul className="mb-0 ps-3 text-secondary">
                    <li>Judul Pengeluaran (Token PLN, WiFi, Galon, Gas, dll.)</li>
                    <li>Nominal Total Tagihan (Rp)</li>
                    <li>Tanggal Jatuh Tempo</li>
                    <li>Auto-split rata ke seluruh anggota kamar aktif</li>
                  </ul>
                </div>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-teal w-100"
                  onClick={() => setShowPlaceholderModal(false)}
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
