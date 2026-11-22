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
 * Komponen Global Toast yang mengambang di pojok kanan atas layar (durasi 4.5s)
 */
export default function GlobalToast() {
  const [toast, setToast] = useState<ToastData | null>(null);

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

    window.addEventListener("kaskos-toast", handleToast);
    return () => {
      window.removeEventListener("kaskos-toast", handleToast);
      clearTimeout(timer);
    };
  }, []);

  if (!toast) return null;

  const bg =
    toast.type === "success"
      ? "#0ca678"
      : toast.type === "danger"
      ? "#d63939"
      : toast.type === "warning"
      ? "#f59f00"
      : "#206bc4";

  return (
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
  );
}
