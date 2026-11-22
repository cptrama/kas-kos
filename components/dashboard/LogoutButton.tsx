"use client";

import { useState } from "react";
import { signOutAction } from "@/app/actions/auth";
import { showToast, showLoading } from "@/components/ui/ToastNotification";
import { IconLogout } from "@tabler/icons-react";

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    showLoading(true);
    showToast("info", "Sedang keluar dari akun...");

    try {
      await signOutAction();
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        return;
      }
      setIsLoggingOut(false);
      showLoading(false);
      showToast("danger", "Gagal keluar akun. Silakan coba kembali.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 shadow-xs"
      title="Keluar dari akun Anda"
    >
      {isLoggingOut ? (
        <>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          <span className="d-none d-md-inline">Keluar...</span>
        </>
      ) : (
        <>
          <IconLogout size={16} />
          <span className="d-none d-md-inline">Keluar</span>
        </>
      )}
    </button>
  );
}
