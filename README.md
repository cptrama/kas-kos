# KasKos - Kelola Kas & Tagihan Patungan Anak Kos

> *"Urusan Kas Beres, Hubungan Roommate Tetap Adem."*

KasKos adalah platform web Micro-SaaS untuk mempermudah penghuni kos dan kontrakan dalam mengelola pengeluaran bersama (iuran listrik, WiFi, air galon, beras, kebersihan), membagi tagihan secara otomatis (*auto-split bill*), dan mengunggah bukti transfer tanpa drama penagihan manual.

---

## Fitur Utama

- **Multi-Tenant Room/Group:** Buat grup kontrakan dan undang roommate hanya dengan kode unik 6 karakter.
- **Auto-Split Bill Engine:** Input total tagihan, sistem otomatis membagi nominal secara proporsional ke semua penghuni aktif.
- **Direct Peer-to-Peer Transfer:** Anggota mentransfer langsung ke rekening bank / e-wallet koordinator dengan fitur 1-klik salin nomor rekening.
- **Proof of Payment Upload:** Unggah struk transfer digital yang langsung tersimpan di cloud storage.
- **Interactive Dashboard:** Ringkasan visual kas terkumpul, sisa tunggakan, dan status verifikasi berbasis Tabler.io UI.

---

## Tumpukan Teknologi (Tech Stack)

- **Frontend:** Next.js (App Router), React, TypeScript
- **UI Kit & Icons:** Tabler.io (`@tabler/core`) & Tabler Icons (`@tabler/icons-react`)
- **Backend & Logic:** Next.js Server Actions & Route Middleware
- **Database & Auth:** PostgreSQL (Supabase) dengan Row Level Security (RLS)
- **File Storage:** Supabase Storage (`transfer-proofs` bucket)
- **Deployment:** Vercel

---

## Panduan Instalasi Lokal

### 1. Prasyarat
- Node.js versi 18+ atau 20+
- Akun Supabase (Gratis)

### 2. Kloning Repositori
```bash
git clone https://github.com/cptrama/kas-kos.git
cd kas-kos
```

### 3. Konfigurasi Environment
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Isi nilai `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari dashboard Supabase Anda.

### 4. Setup Database
Jalankan perintah SQL dari file `schema_kaskos.sql` di panel **SQL Editor** Supabase Anda untuk membentuk seluruh tabel, trigger otomatis, dan policy keamanan RLS.

### 5. Jalankan Server Pengembangan
```bash
npm install
npm run dev
```
Buka peramban di `http://localhost:3000`.

---

## Tim Pengembang & Kolaborasi

Proyek ini dikembangkan oleh kelompok 3 mahasiswa dengan pembagian kontributor repositori:
- **Mahasiswa 1 (Lead):** Backend Core, Database Schema, Authentication & Middleware
- **Mahasiswa 2:** Coordinator Dashboard, Expense CRUD & Auto-Split Engine
- **Mahasiswa 3:** Member Dashboard UI, Payment Flow, Storage & CI/CD Pipeline
