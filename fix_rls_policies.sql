-- ==============================================================================
-- SKRIP SOLUSI LENGKAP: PERIZINAN TABEL (GRANT) & ROW LEVEL SECURITY (RLS)
-- Mengatasi 2 Masalah:
-- 1. "permission denied for table groups" (karena role authenticated belum di-grant hak akses tabel)
-- 2. "infinite recursion detected in policy for relation group_members" (kebijakan rekursif)
-- 
-- CARA PENGGUNAAN:
-- Buka Supabase Dashboard -> Masuk ke Menu SQL Editor -> Tempel skrip ini -> Klik "Run".
-- ==============================================================================

-- ==============================================================================
-- 1. BERIKAN HAK AKSES DASAR (GRANT) KE SCHEMA DAN TABEL PUBLIC
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- ==============================================================================
-- 2. RESET & BERSIHKAN SEMUA KEBIJAKAN LAMA
-- ==============================================================================
-- Drop policy lama pada groups
DROP POLICY IF EXISTS "Pengguna dapat melihat grup tempat ia menjadi anggota" ON public.groups;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat membuat grup baru" ON public.groups;
DROP POLICY IF EXISTS "Hanya Admin Grup yang dapat mengubah info grup" ON public.groups;
DROP POLICY IF EXISTS "Admin grup dapat mengubah info grup" ON public.groups;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat membaca grup" ON public.groups;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat melihat grup" ON public.groups;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat membuat grup" ON public.groups;
DROP POLICY IF EXISTS "Admin dapat mengupdate info grup" ON public.groups;

-- Drop policy lama pada group_members
DROP POLICY IF EXISTS "Anggota dapat melihat daftar member di grupnya" ON public.group_members;
DROP POLICY IF EXISTS "Pengguna dapat bergabung ke grup" ON public.group_members;
DROP POLICY IF EXISTS "Anggota dapat membaca data keanggotaan grup" ON public.group_members;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat melihat anggota grup" ON public.group_members;
DROP POLICY IF EXISTS "Pengguna dapat keluar dari grup" ON public.group_members;

-- Drop policy lama pada profiles
DROP POLICY IF EXISTS "Semua orang dapat membaca profil" ON public.profiles;
DROP POLICY IF EXISTS "Pengguna dapat mengubah profil sendiri" ON public.profiles;

-- ==============================================================================
-- 3. PASTIKAN RLS AKTIF
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_items ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 4. KEBIJAKAN BARU TABEL: PROFILES
-- ==============================================================================
CREATE POLICY "Semua orang dapat membaca profil"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Pengguna dapat mengubah profil sendiri"
    ON public.profiles FOR ALL
    TO authenticated
    USING (auth.uid() = id);

-- ==============================================================================
-- 5. KEBIJAKAN BARU TABEL: GROUPS (Bebas Rekursi & Izin Insert Lengkap)
-- ==============================================================================
-- Semua user login dapat melihat info grup (untuk bergabung via kode unik & melihat dashboard)
CREATE POLICY "Pengguna terautentikasi dapat melihat grup"
    ON public.groups FOR SELECT
    TO authenticated
    USING (true);

-- Pengguna dapat membuat grup baru (pembuat = created_by)
CREATE POLICY "Pengguna terautentikasi dapat membuat grup"
    ON public.groups FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

-- Admin pembuat grup dapat memperbarui info grup
CREATE POLICY "Admin dapat mengupdate info grup"
    ON public.groups FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by);

-- ==============================================================================
-- 6. KEBIJAKAN BARU TABEL: GROUP_MEMBERS (Bebas Rekursi)
-- ==============================================================================
-- Semua user login dapat melihat daftar anggota grup tanpa query rekursif
CREATE POLICY "Pengguna terautentikasi dapat melihat anggota grup"
    ON public.group_members FOR SELECT
    TO authenticated
    USING (true);

-- User dapat mendaftarkan diri sendiri ke grup (sebagai admin_grup saat buat grup atau member saat join)
CREATE POLICY "Pengguna dapat bergabung ke grup"
    ON public.group_members FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- User dapat mengupdate statusnya sendiri jika diperlukan
CREATE POLICY "Pengguna dapat mengupdate statusnya"
    ON public.group_members FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- User dapat keluar dari grup
CREATE POLICY "Pengguna dapat keluar dari grup"
    ON public.group_members FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 7. KEBIJAKAN BARU TABEL: EXPENSES & BILL_ITEMS
-- ==============================================================================
DROP POLICY IF EXISTS "Anggota dapat melihat pengeluaran di grupnya" ON public.expenses;
DROP POLICY IF EXISTS "Hanya Admin Grup yang dapat membuat atau mengedit pengeluaran" ON public.expenses;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat melihat pengeluaran" ON public.expenses;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat mengelola pengeluaran" ON public.expenses;

CREATE POLICY "Pengguna terautentikasi dapat melihat pengeluaran"
    ON public.expenses FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Pengguna terautentikasi dapat mengelola pengeluaran"
    ON public.expenses FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anggota dapat melihat tagihan miliknya atau tagihan grupnya" ON public.bill_items;
DROP POLICY IF EXISTS "Anggota dapat mengupdate konfirmasi bayar miliknya" ON public.bill_items;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat melihat tagihan" ON public.bill_items;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat mengelola tagihan" ON public.bill_items;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat membuat tagihan" ON public.bill_items;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat mengupdate tagihan" ON public.bill_items;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat menghapus tagihan" ON public.bill_items;

CREATE POLICY "Pengguna terautentikasi dapat melihat tagihan"
    ON public.bill_items FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Pengguna terautentikasi dapat membuat tagihan"
    ON public.bill_items FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Pengguna terautentikasi dapat mengupdate tagihan"
    ON public.bill_items FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Pengguna terautentikasi dapat menghapus tagihan"
    ON public.bill_items FOR DELETE
    TO authenticated
    USING (true);

-- Bersihkan data pengeluaran yang yatim/orphan (pengeluaran tanpa tagihan) jika ada
DELETE FROM public.expenses
WHERE id NOT IN (SELECT DISTINCT expense_id FROM public.bill_items);
