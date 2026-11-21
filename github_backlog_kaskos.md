# PANDUAN GITHUB & DAFTAR BACKLOG TASK

## Proyek SaaS: **KasKos** (Fokus Penilaian GitHub & Kontribusi Tim: Bobot 20%)

> **Prinsip Utama:** Backlog ini dirancang **khusus untuk aktivitas teknis di repositori GitHub**. Seluruh anggota (3 mahasiswa) memiliki porsi beban teknis yang setara dan nyata (masing-masing 5 task inti) sehingga riwayat commit, pull request (PR), dan grafik kontributor di GitHub membuktikan kolaborasi aktif dari ketiga mahasiswa kepada dosen.
> *Tugas non-teknis (branding, konten media sosial, kuesioner tester, dan laporan akhir) dialokasikan sebagai tanggung jawab bersama yang dikerjakan secara kolaboratif (lihat Bagian 5).*

---

## 1. Setup Awal Repositori & Kolaborasi (Target Nilai: 8%)

* **Langkah 1 (Ketua Tim):** Buat repositori publik baru di GitHub dengan nama `kaskos-saas` (atau sejenisnya).
* **Langkah 2 (Semua Anggota):**
  * Masuk ke menu **Settings** $\rightarrow$ **Collaborators** $\rightarrow$ **Add people**.
  * Undang kedua rekan tim. Keduanya **wajib menerima undangan** via email / notifikasi GitHub agar tercatat resmi sebagai *Collaborator*.
* **Langkah 3 (GitHub Projects):**
  * Masuk ke tab **Projects** pada repositori $\rightarrow$ klik **New Project** $\rightarrow$ pilih template **Board**.
  * Buat 5 kolom status:
    1. 📋 `Backlog` (Daftar semua task dari dokumen ini)
    2. 📌 `Todo` (Task yang siap dikerjakan pada sprint/minggu berjalan)
    3. ⏳ `In Progress` (Sedang dikerjakan pada branch masing-masing)
    4. 🔍 `In Review / PR` (Sedang dalam proses review Pull Request oleh rekan tim)
    5. ✅ `Done` (Fitur sudah di-merge ke branch utama dan lolos uji)

---

## 2. Aturan Standar Commit Message (Wajib untuk Nilai Keteraturan: 4%)

Dosen menilai konsistensi dan profesionalisme commit history. Gunakan format konvensional berikut:

* `feat: <nama fitur baru>` (Contoh: `feat: implement login with supabase auth`)
* `fix: <perbaikan bug>` (Contoh: `fix: resolve mobile layout overflow on tables`)
* `docs: <update dokumentasi>` (Contoh: `docs: update setup guide in README.md`)
* `style: <perbaikan UI/styling>` (Contoh: `style: integrate tabler stat card badges`)
* `chore: <konfigurasi/build/dependency>` (Contoh: `chore: setup initial dependencies and gitignore`)
* `ci/test: <pengujian & automasi>` (Contoh: `ci: add github actions build verification workflow`)

---

## 3. Daftar 15 GitHub Issues Siap Pakai (Tinggal Copy-Paste ke GitHub)

Pembagian tugas teknis dibuat seimbang (5 task per mahasiswa) dengan batasan domain yang jelas agar tidak terjadi konflik merge (*merge conflict*).

---

### 👤 Mahasiswa 1: Backend Core, Database Schema & Authentication Lead

*Domain: Arsitektur Data PostgreSQL, Supabase Auth, Middleware Keamanan, dan Server Actions Grup*

1. **[TASK-01] chore: Setup repository baseline, gitignore, and environment configuration**

   * **Branch:** `chore/repo-init`
   * **Assignee:** Mahasiswa 1
   * **Label:** `setup`, `documentation`
   * **Deskripsi:** Inisialisasi repositori, konfigurasi file `.gitignore` untuk Next.js/Node, file template `.env.example` (kredensial Supabase URL & Anon Key), lisensi open-source, dan panduan instalasi lokal di `README.md`.
2. **[TASK-02] feat: Execute Supabase database schema, triggers, and RLS policies**

   * **Branch:** `feat/db-schema-rls`
   * **Assignee:** Mahasiswa 1
   * **Label:** `backend`, `database`
   * **Deskripsi:** Eksekusi skrip `schema_kaskos.sql` di Supabase. Pastikan tabel `profiles`, `groups`, `group_members`, `expenses`, dan `bill_items` terbentuk. Pasang trigger otomatis pembuatan profil user (`handle_new_user`), fungsi generate invite code 6-digit, serta konfigurasi Row Level Security (RLS) policies.
3. **[TASK-03] feat: Implement Supabase Auth logic and Route Protection Middleware**

   * **Branch:** `feat/auth-system`
   * **Assignee:** Mahasiswa 1
   * **Label:** `backend`, `auth`
   * **Deskripsi:** Bangun logika backend autentikasi Supabase (Register, Login, Logout) menggunakan Server Actions. Implementasikan Next.js Middleware (`middleware.ts`) untuk memproteksi rute internal (`/dashboard/*`) dari akses tanpa login (*Auth Guard*).
4. **[TASK-04] feat: Create Server Actions for Group Management (Create & Join Group)**

   * **Branch:** `feat/group-actions`
   * **Assignee:** Mahasiswa 1
   * **Label:** `backend`, `feature`
   * **Deskripsi:** Buat Server Action untuk:
     - Membuat grup kamar kos baru dan otomatis menetapkan pembuat sebagai `admin_grup`.
     - Generate kode unik 6 karakter acak.
     - Validasi dan pemrosesan bergabung ke grup (*join group*) via kode invite ke tabel `group_members`.
5. **[TASK-05] feat: Implement Group Settings & Payment Account Server Actions**

   * **Branch:** `feat/group-settings-action`
   * **Assignee:** Mahasiswa 1
   * **Label:** `backend`, `feature`
   * **Deskripsi:** Bangun Server Action untuk memperbarui informasi rekening pembayaran grup (pilihan Bank BCA/BRI/Mandiri atau E-Wallet DANA/GoPay, nomor rekening/HP, nama penerima), serta query daftar anggota aktif dalam grup kos.

---

### 👤 Mahasiswa 2: Coordinator Dashboard & Expense Splitting Engine

*Domain: Layout Tabler.io, Tampilan Koordinator, Algoritma Bagi Tagihan, dan Verifikasi Pembayaran*

6. **[TASK-06] feat: Initialize Next.js 14/15 App Router & Tabler.io UI Foundation**

   * **Branch:** `feat/tabler-ui-setup`
   * **Assignee:** Mahasiswa 2
   * **Label:** `frontend`, `setup`
   * **Deskripsi:** Inisialisasi struktur Next.js App Router, integrasikan library Tabler (`@tabler/core` & `@tabler/icons-react`), setup font Inter, konfigurasi layout dasar dashboard, serta pastikan styling CSS Tabler ter-compile dengan sempurna.
7. **[TASK-07] feat: Build Coordinator Dashboard UI (Stat Cards & Quick Actions)**

   * **Branch:** `feat/coordinator-dashboard-ui`
   * **Assignee:** Mahasiswa 2
   * **Label:** `frontend`, `ui`
   * **Deskripsi:** Bangun antarmuka Dashboard Koordinator Kos dengan komponen Tabler:
     - 3 Stat Cards visual: Total Kas Terkumpul (Rp), Sisa Tunggakan (Rp), dan Jumlah Anggota Aktif.
     - Tombol cepat (*Quick Action*): "Buat Tagihan Baru" dan "Salin Kode Invite".
8. **[TASK-08] feat: Build Expense CRUD Server Actions & Auto-Split Calculation Engine**

   * **Branch:** `feat/expense-split-engine`
   * **Assignee:** Mahasiswa 2
   * **Label:** `backend`, `feature`
   * **Deskripsi:** Buat Server Action pengeluaran kas:
     - Logika penambahan pengeluaran bersama (`expenses`).
     - Algoritma pembagian rata otomatis (*split bill*) nominal total ke seluruh anggota grup aktif ke dalam baris tabel `bill_items`.
     - Aksi edit keterangan/nominal tagihan dan pembatalan/hapus tagihan.
9. **[TASK-09] feat: Build Expense Management UI (Data Table & Add Expense Modal)**

   * **Branch:** `feat/expense-table-modal`
   * **Assignee:** Mahasiswa 2
   * **Label:** `frontend`, `feature`
   * **Deskripsi:** Buat komponen UI interaktif:
     - Modal pop-up form tambah tagihan (judul, kategori ikon listrik/wifi/galon/gas, nominal total, tanggal jatuh tempo).
     - Data Table daftar tagihan dengan penanda Tabler Badges warna-warni (`bg-green-lt` Lunas, `bg-yellow-lt` Menunggu Verifikasi, `bg-red-lt` Belum Bayar) serta filter status.
10. **[TASK-10] feat: Implement Payment Approval & Status Verification Action**

    * **Branch:** `feat/payment-verification`
    * **Assignee:** Mahasiswa 2
    * **Label:** `frontend`, `backend`
    * **Deskripsi:** Bangun antarmuka dan Server Action bagi Koordinator Kos untuk memverifikasi pembayaran:
      - Modal pratinjau bukti transfer yang diunggah anggota.
      - Aksi tombol verifikasi: mengubah status tagihan dari `waiting_approval` $\rightarrow$ `paid` (Lunas) dan mencatat timestamp `paid_at`.

---

### 👤 Mahasiswa 3: Member Experience, Payment Flow & QA/DevOps

*Domain: Landing Page Publik, Auth Pages UI, Tampilan Anggota Kos, Upload Bukti, dan CI/CD*

11. **[TASK-11] feat: Design high-converting Public Landing Page with Tabler components**

    * **Branch:** `feat/landing-page`
    * **Assignee:** Mahasiswa 3
    * **Label:** `frontend`, `ui`
    * **Deskripsi:** Bangun halaman utama publik yang mobile-friendly:
      - Hero Section dengan value proposition KasKos (*"Urusan Kas Beres, Hubungan Roommate Tetap Adem"*).
      - Ilustrasi perbandingan masalah manual vs kemudahan KasKos.
      - Fitur unggulan (Split otomatis, notifikasi tagihan, transparansi kas).
      - Call-to-Action (CTA) tombol daftar langsung ke form registrasi.
12. **[TASK-12] feat: Build modern Auth Pages UI (Login & Register Forms)**

    * **Branch:** `feat/auth-pages-ui`
    * **Assignee:** Mahasiswa 3
    * **Label:** `frontend`, `ui`
    * **Deskripsi:** Desain halaman `/login` dan `/register` menggunakan gaya komponen form Tabler.io:
      - Input nama lengkap, nomor WhatsApp, email, dan kata sandi.
      - Tampilan penanganan error pesan validasi yang ramah pengguna.
      - Tautan navigasi bolak-balik antara Login dan Register.
13. **[TASK-13] feat: Build Member Dashboard UI (Personal Bill Alert & Bank Account Info)**

    * **Branch:** `feat/member-dashboard-ui`
    * **Assignee:** Mahasiswa 3
    * **Label:** `frontend`, `feature`
    * **Deskripsi:** Bangun antarmuka khusus sisi Anggota Kos (Member):
      - Alert Box nominal yang harus dibayar (*"Kamu memiliki tagihan belum lunas sebesar Rp 35.000 untuk Token Listrik"*).
      - Info detail rekening tujuan pembayaran (Bank / E-Wallet) milik bendahara kos.
      - Tombol interaktif 1-klik *"Salin No. Rekening"* ke clipboard (fitur perbaikan berdasarkan feedback tester).
14. **[TASK-14] feat: Implement Payment Confirmation Modal & Proof Upload to Supabase Storage**

    * **Branch:** `feat/proof-upload-storage`
    * **Assignee:** Mahasiswa 3
    * **Label:** `frontend`, `backend`
    * **Deskripsi:** Bangun alur konfirmasi bayar dari sisi anggota:
      - Modal pop-up *"Konfirmasi Pembayaran"*.
      - Input upload screenshot/foto bukti transfer ke Supabase Storage bucket `transfer-proofs`.
      - Update status pada baris `bill_items` menjadi `waiting_approval` dan simpan URL bukti transfer.
15. **[TASK-15] ci/test: Setup GitHub Actions CI workflow, Mock Seed Data, and Repo Documentation**

    * **Branch:** `ci/testing-and-docs`
    * **Assignee:** Mahasiswa 3
    * **Label:** `devops`, `testing`, `documentation`
    * **Deskripsi:**
      - Setup file `.github/workflows/ci.yml` untuk otomatis menjalankan pemeriksaan linter (`npm run lint`) dan build test (`npm run build`) pada setiap Pull Request.
      - Buat skrip data uji coba (*mock seed data*) untuk 10 user tester dan contoh tagihan di repositori.
      - Dokumentasikan arsitektur modul dan panduan kontribusi developer di folder `docs/CONTRIBUTING.md`.

---

## 4. Alur Kerja Git & Kolaborasi Nyata (Branching & Pull Request)

Untuk membuktikan kolaborasi nyata di GitHub (Target Nilai: 8%):

1. **Jangan commit langsung ke `main`!** Setiap mahasiswa wajib membuat branch fitur baru dari `main` sesuai nama branch di atas:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/<nama-fitur>
   ```
2. Kerjakan kode, lalu commit dengan format konvensional:
   ```bash
   git add .
   git commit -m "feat: implement payment confirmation modal and proof upload"
   git push origin feat/<nama-fitur>
   ```
3. Buka **Pull Request (PR)** di GitHub menuju branch `main`.
4. **Wajib Code Review:** Anggota tim lain wajib membuka PR tersebut, memberikan minimal 1 komentar atau *Approve*, sebelum PR di-merge ke branch `main`.

---

## 5. Daftar Tugas Non-GitHub (Dikerjakan Bersama Seluruh Anggota)

> [!NOTE]
> Tugas-tugas di bawah ini **TIDAK dimasukkan ke dalam GitHub Backlog individual** agar grafik kontribusi kode GitHub tetap murni teknis dan seimbang. Seluruh kegiatan ini dikerjakan secara bersama-sama oleh ketiga anggota tim secara kolaboratif:

|     No     | Modul / Bidang                        | Aktivitas Kolaboratif                                                                                             | Hasil / Bukti yang Diharapkan                                        |
| :---------: | :------------------------------------ | :---------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| **1** | **Branding & Identitas**        | Desain logo KasKos, penentuan palet warna brand (*Emerald Green & Slate*), tipografi, dan bio resmi.            | Aset logo PNG/SVG, panduan warna grafis.                             |
| **2** | **Setup Media Sosial**          | Pembuatan akun resmi `@kaskos_app` (Instagram & TikTok) dan pengaturan link bio ke URL Vercel.                  | Akun aktif dengan profil lengkap dan tautan website.                 |
| **3** | **Produksi 10 Konten Medsos**   | Merancang ide skrip, pengambilan video, desain carousel grafis, dan mempublikasikan 10 konten edukasi/promosi.    | 10 postingan terbit di Instagram/TikTok (Educate, Engage, Promote).  |
| **4** | **Pengujian Pengguna (Tester)** | Menyusun kuesioner Google Form, mendampingi 10 anak kos saat uji coba web, serta merekap data kepuasan & kendala. | Spreadsheet rekapitulasi data 10 tester dan daftar usulan perbaikan. |
| **5** | **Dokumen Laporan & Slide**     | Menyusun dokumen laporan akhir proyek, membuat slide presentasi Canva/PDF, dan gladi bersih presentasi 15 menit.  | File Laporan Akhir (PDF), Slide Presentasi, dan kesiapan Live Demo.  |
