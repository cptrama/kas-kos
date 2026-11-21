import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KasKos - Kelola Kas & Tagihan Patungan Anak Kos Tanpa Drama",
  description: "Aplikasi web micro-SaaS untuk mempermudah penghuni kos mengelola pengeluaran bersama, split bill otomatis, dan upload bukti transfer.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-light">{children}</body>
    </html>
  );
}
