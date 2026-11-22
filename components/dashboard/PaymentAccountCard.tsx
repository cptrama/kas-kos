"use client";

import { useState } from "react";
import { IconCopy, IconCheck, IconCreditCard, IconBuildingBank, IconWallet } from "@tabler/icons-react";
import { showToast } from "@/components/ui/ToastNotification";

interface PaymentAccountCardProps {
  paymentBank?: string | null;
  paymentAccountNumber?: string | null;
  paymentHolderName?: string | null;
  isAdmin?: boolean;
}

export default function PaymentAccountCard({
  paymentBank,
  paymentAccountNumber,
  paymentHolderName,
  isAdmin = false,
}: PaymentAccountCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!paymentAccountNumber) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(paymentAccountNumber);
      } else {
        // Fallback jika Clipboard API tidak didukung di environment tertentu
        const textArea = document.createElement("textarea");
        textArea.value = paymentAccountNumber;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      showToast("success", `Nomor rekening/HP ${paymentAccountNumber} berhasil disalin ke clipboard!`);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      showToast("danger", "Gagal menyalin otomatis. Silakan salin manual.");
    }
  }

  // Pilih warna badge berdasarkan bank/e-wallet
  const getBankBadgeClass = (bankName: string) => {
    const lower = bankName.toLowerCase();
    if (lower.includes("bca")) return "bg-primary-lt text-primary";
    if (lower.includes("mandiri")) return "bg-yellow-lt text-yellow";
    if (lower.includes("bri")) return "bg-blue-lt text-blue";
    if (lower.includes("dana")) return "bg-azure-lt text-azure";
    if (lower.includes("gopay")) return "bg-green-lt text-green";
    return "bg-teal-lt text-teal";
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-status-top bg-teal"></div>
      <div className="card-body p-4 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-teal-lt p-2 rounded-circle">
                <IconCreditCard size={20} />
              </span>
              <h3 className="card-title m-0 fw-bold">Rekening Kas Tujuan</h3>
            </div>
            {paymentBank && (
              <span className={`badge px-2 py-1 fs-5 fw-bold ${getBankBadgeClass(paymentBank)}`}>
                {paymentBank}
              </span>
            )}
          </div>

          {paymentBank && paymentAccountNumber ? (
            <div className="bg-light p-3 rounded-3 border position-relative">
              <div className="row align-items-center">
                <div className="col">
                  <div className="text-muted small fw-medium">Pilihan Bank / E-Wallet:</div>
                  <div className="fs-3 fw-bold text-dark d-flex align-items-center gap-2">
                    <IconBuildingBank size={18} className="text-secondary" />
                    <span>{paymentBank}</span>
                  </div>

                  <div className="text-muted small fw-medium mt-3">Nomor Rekening / No. HP:</div>
                  <div className="fs-1 fw-extrabold text-teal letter-spacing-1 font-monospace select-all">
                    {paymentAccountNumber}
                  </div>

                  <div className="text-muted small fw-medium mt-2">Atas Nama Penerima:</div>
                  <div className="fw-bold text-dark fs-4">{paymentHolderName || "Bendahara Kos"}</div>
                </div>
              </div>

              {/* 1-Klik Salin Nomor Rekening Button */}
              <div className="mt-3 pt-2 border-top d-flex align-items-center justify-content-between flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`btn btn-sm ${
                    copied ? "btn-success" : "btn-teal"
                  } d-flex align-items-center gap-1 shadow-xs`}
                  title="Klik untuk menyalin nomor rekening ke clipboard"
                >
                  {copied ? (
                    <>
                      <IconCheck size={16} />
                      <span>Nomor Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <IconCopy size={16} />
                      <span>Salin No. Rekening</span>
                    </>
                  )}
                </button>

                <span className="text-muted small" style={{ fontSize: "11px" }}>
                  💡 Fitur 1-klik siap tempel di m-banking
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-5 bg-light rounded-3 border border-dashed">
              <div className="avatar avatar-md bg-secondary-lt rounded-circle mx-auto mb-2">
                <IconWallet size={24} />
              </div>
              <p className="text-muted small mb-2 fw-medium">
                Belum ada informasi rekening tujuan kas yang diatur.
              </p>
              {isAdmin ? (
                <p className="small text-teal fw-semibold mb-0">
                  Gunakan tombol &quot;Atur Rekening Kas&quot; di atas untuk memasukkan nomor rekening/e-wallet.
                </p>
              ) : (
                <p className="small text-secondary mb-0">
                  Harap hubungi koordinator/bendahara kos untuk mengisi data pembayaran.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
