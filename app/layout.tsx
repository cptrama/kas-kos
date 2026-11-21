import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KasKos - Kelola Kas & Tagihan Patungan Anak Kos Tanpa Drama",
  description:
    "Aplikasi web micro-SaaS untuk mempermudah penghuni kos mengelola pengeluaran bersama, split bill otomatis, dan upload bukti transfer.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-light`}>{children}</body>
    </html>
  );
}
