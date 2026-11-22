"use client";

import { useState, useEffect } from "react";
import { IconCheck, IconAlertCircle, IconInfoCircle } from "@tabler/icons-react";

export interface ToastData {
  type: "success" | "danger" | "info" | "warning";
  message: string;
}

/**
 * Memicu pop-up notifikasi melayang (Floating Toast) dari mana saja di aplikasi
 */
export function showToast(type: "success" | "danger" | "info" | "warning", message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("kaskos-toast", { detail: { type, message } }));
  }
}

/**
 * Memicu indikator progress bar di bagian paling atas layar saat memuat / navigasi
 */
export function showLoading(active: boolean = true) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("kaskos-loading", { detail: active }));
  }
}

/**
 * Komponen Global Toast & Top Loading Bar yang aktif di seluruh aplikasi
 */
export default function GlobalToast() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    function handleToast(e: Event) {
      const customEvent = e as CustomEvent<ToastData>;
      if (customEvent.detail) {
        setToast(customEvent.detail);
        clearTimeout(timer);
        timer = setTimeout(() => {
          setToast(null);
        }, 4500);
      }
    }

    function handleLoading(e: Event) {
      const customEvent = e as CustomEvent<boolean>;
      setIsLoading(Boolean(customEvent.detail));
    }

    window.addEventListener("kaskos-toast", handleToast);
    window.addEventListener("kaskos-loading", handleLoading);
    return () => {
      window.removeEventListener("kaskos-toast", handleToast);
      window.removeEventListener("kaskos-loading", handleLoading);
      clearTimeout(timer);
    };
  }, []);

  const bg =
    toast?.type === "success"
      ? "#0ca678"
      : toast?.type === "danger"
      ? "#d63939"
      : toast?.type === "warning"
      ? "#f59f00"
      : "#206bc4";

  return (
    <>
      {/* Top Indeterminate Loading Bar */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "3px",
            zIndex: 999999,
            backgroundColor: "rgba(12, 166, 120, 0.15)",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              height: "100%",
              backgroundColor: "#0ca678",
              boxShadow: "0 0 10px #0ca678, 0 0 4px #0ca678",
              animation: "kaskosTopLoading 1.2s infinite ease-in-out",
            }}
          />
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 99999,
            maxWidth: "420px",
            width: "calc(100% - 48px)",
            backgroundColor: bg,
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
                ) : toast.type === "danger" ? (
                  <IconAlertCircle size={20} color="#fff" />
                ) : (
                  <IconInfoCircle size={20} color="#fff" />
                )}
              </div>
            </div>
            <div className="flex-grow-1 text-white pe-2">
              <div className="fw-bold small lh-1 mb-1">
                {toast.type === "success"
                  ? "Berhasil!"
                  : toast.type === "danger"
                  ? "Perhatian!"
                  : "Pemberitahuan"}
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
          {/* Bar durasi mundur 4.5 detik */}
          <div
            style={{
              height: "4px",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              animation: "toastProgress 4.5s linear forwards",
            }}
          />
        </div>
      )}

      {/* Global Toast & Loading Keyframes */}
      <style jsx global>{`
        @keyframes toastSlideIn {
          from {
            transform: translateY(-20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes toastProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        @keyframes kaskosTopLoading {
          0% {
            left: -35%;
            width: 35%;
          }
          50% {
            left: 20%;
            width: 60%;
          }
          100% {
            left: 100%;
            width: 35%;
          }
        }
      `}</style>
    </>
  );
}
