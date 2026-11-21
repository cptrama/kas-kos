# Panduan Kontribusi & Arsitektur Proyek KasKos

Selamat datang di repositori proyek **KasKos (SaaS Pengelolaan Kas & Tagihan Patungan Kamar Kos)**. Dokumen ini merupakan panduan teknis bagi pengembang dan anggota tim dalam berkolaborasi, menjalankan pengujian, serta menjaga kualitas basis kode.

---

## 1. Arsitektur Proyek & Struktur Direktori

Aplikasi KasKos dibangun menggunakan tumpukan teknologi modern:
* **Framework:** Next.js 14 (App Router)
* **Bahasa:** TypeScript & React 18
* **Desain UI:** Tabler.io UI Kit (`@tabler/core` & `@tabler/icons-react`)
* **Backend & Database:** PostgreSQL via Supabase (Auth, Database Triggers, Row Level Security, dan Storage Buckets)

```text
kas-kos/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI Workflow (Linting & Build Test)
├── app/
│   ├── actions/               # Server Actions (Auth, Group Management, Expense Engine)
│   │   ├── auth.ts            # Supabase Auth Server Actions
│   │   ├── group.ts           # Manajemen Kamar Kos & Rekening Kas
│   │   └── expense.ts         # CRUD Tagihan, Split Engine & Approval Bukti
│   ├── dashboard/             # Rute Terproteksi Workspace KasKos
│   │   ├── layout.tsx         # Tabler Navbar, Profile Avatar & Footer Layout
│   │   └── page.tsx           # Dashboard Koordinator & Anggota Terintegrasi
│   ├── login/                 # UI Halaman Masuk Akun
│   ├── register/              # UI Halaman Registrasi Akun Baru
│   ├── globals.css            # Styling Global & Import Tabler CSS
│   ├── layout.tsx             # Root HTML Layout & Font Inter
│   └── page.tsx               # Public Landing Page SaaS Berkonversi Tinggi
├── components/
│   └── dashboard/             # Komponen Dashboard Modular
│       ├── CoordinatorQuickActions.tsx  # Tombol Aksi Cepat Koordinator
│       ├── CoordinatorStatCards.tsx     # 3 Kartu Statistik Keuangan Kas
│       ├── CreateExpenseModal.tsx       # Pop-up Form Tagihan Baru
│       ├── ExpenseSection.tsx           # Wrapper Bagian Pengeluaran
│       ├── ExpenseTable.tsx             # Tabel Tagihan, Badges & Accordion
│       ├── GroupModals.tsx              # Modal Buat Kamar & Gabung Kode 6-Digit
│       ├── MemberPersonalAlert.tsx      # Alert Box Tagihan Pribadi Anggota
│       ├── PaymentAccountCard.tsx       # Kartu Rekening Kas & 1-Klik Salin
│       ├── PaymentProofModal.tsx        # Modal Approval Bukti Transfer Koordinator
│       └── UploadProofModal.tsx         # Modal Upload Struk Transfer ke Storage
├── docs/
│   └── CONTRIBUTING.md        # Dokumen Panduan Kontribusi Ini
├── lib/
│   ├── supabase/              # Inisialisasi Klien Supabase (Client, Server, Middleware)
│   └── utils.ts               # Formatter Mata Uang (Rupiah) & Tanggal Indonesia
├── schema_kaskos.sql          # Skema Database PostgreSQL, RLS Policies & Triggers
├── mock_seed_kaskos.sql       # 10 Akun Tester & Data Simulasi Tagihan
└── github_backlog_kaskos.md   # Backlog Rinci & Pembagian Tanggung Jawab Tim
```

---

## 2. Standar Alur Kerja Git & Branching

Untuk menjamin riwayat kolaborasi yang bersih dan memenuhi kriteria penilaian dosen:

1. **Dilarang keras melakukan commit langsung ke branch `main`!**
2. Buat branch fitur baru yang berakar dari branch `main` terbaru:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b <tipe>/<nama-fitur>
   ```
3. Gunakan konvensi penamaan commit standar (*Conventional Commits*):
   * `feat: <penambahan fitur baru>`
   * `fix: <perbaikan bug atau konflik merge>`
   * `style: <penyesuaian UI atau styling Tabler>`
   * `chore: <konfigurasi dependensi atau repositori>`
   * `ci: <pembaruan workflow otomatisasi>`
   * `docs: <pembaruan dokumentasi>`
4. Push branch Anda dan buka **Pull Request (PR)** menuju `main`:
   ```bash
   git push -u origin <tipe>/<nama-fitur>
   ```
5. Setiap PR akan otomatis diuji oleh GitHub Actions (`.github/workflows/ci.yml`) sebelum di-merge.
6. Minimal satu anggota tim lain wajib melakukan review dan *Approve* sebelum PR di-merge.

---

## 3. Menjalankan Proyek Secara Lokal

### Prasyarat
* Node.js versi 18 atau 20 LTS
* Akun Supabase (untuk URL dan Anon Key)

### Langkah Instalasi
```bash
# 1. Gandakan repositori
git clone https://github.com/cptrama/kas-kos.git
cd kas-kos

# 2. Pasang dependensi
npm install

# 3. Buat file environment lokal
cp .env.example .env.local

# 4. Buka .env.local dan isi kredensial Supabase Anda
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 5. Jalankan server pengembangan
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## 4. Pengujian & Verifikasi Kualitas Kode

Sebelum membuka Pull Request, jalankan pemeriksaan berikut:

```bash
# 1. Jalankan Linter ESLint
npm run lint

# 2. Jalankan Build Production
npm run build
```

Pastikan kedua perintah menghasilkan status **0 Error** agar lolos uji pada pipeline CI/CD GitHub Actions.

---

## 5. Menggunakan Mock Seed Data (Untuk Presentasi & Tester)

Jika Anda ingin mengisi database dengan 10 profil mahasiswa tester dan contoh pengeluaran siap uji:
1. Buka dashboard proyek Supabase Anda $\rightarrow$ masuk ke menu **SQL Editor**.
2. Salin seluruh isi file [mock_seed_kaskos.sql](file:///c:/laragon/www/kas-kos/mock_seed_kaskos.sql).
3. Klik **Run** untuk mengeksekusi seed data.

---

## 6. Pembagian Modul Tim Mahasiswa

| Anggota Tim | Domain Tanggung Jawab | File Utama |
| :--- | :--- | :--- |
| **Mahasiswa 1** | Backend Core, Database Schema, Supabase Auth & Group Management | `schema_kaskos.sql`, `app/actions/auth.ts`, `app/actions/group.ts`, `components/dashboard/GroupModals.tsx` |
| **Mahasiswa 2** | Tabler Foundation, Coordinator Dashboard, Auto-Split Engine & Verification | `app/actions/expense.ts`, `components/dashboard/CoordinatorStatCards.tsx`, `components/dashboard/ExpenseTable.tsx`, `components/dashboard/PaymentProofModal.tsx` |
| **Mahasiswa 3** | Member Experience, Public Landing Page, Auth Pages, Proof Upload & CI/CD | `app/page.tsx`, `app/login/page.tsx`, `app/register/page.tsx`, `components/dashboard/MemberPersonalAlert.tsx`, `components/dashboard/UploadProofModal.tsx`, `.github/workflows/ci.yml`, `mock_seed_kaskos.sql` |
