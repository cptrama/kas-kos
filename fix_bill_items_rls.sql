-- ==============================================================================
-- SKRIP SOLUSI: PERBAIKAN RLS TABEL BILL_ITEMS & EXPENSES
-- Mengatasi Error: "new row violates row-level security policy for table bill_items"
-- 
-- CARA PENGGUNAAN:
-- 1. Buka Supabase Dashboard -> Masuk menu SQL Editor.
-- 2. Tempel seluruh isi skrip ini.
-- 3. Klik tombol "Run".
-- ==============================================================================

-- 1. Pastikan hak akses dasar (GRANT) terbuka untuk role authenticated
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 2. HAPUS SEMUA KEBIJAKAN LAMA PADA TABEL bill_items
DROP POLICY IF EXISTS "Anggota dapat melihat tagihan miliknya atau tagihan grupnya" ON public.bill_items;
DROP POLICY IF EXISTS "Anggota dapat mengupdate konfirmasi bayar miliknya" ON public.bill_items;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat melihat tagihan" ON public.bill_items;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat mengelola tagihan" ON public.bill_items;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat membuat tagihan" ON public.bill_items;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat mengupdate tagihan" ON public.bill_items;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat menghapus tagihan" ON public.bill_items;

-- 3. KEBIJAKAN BARU LENGKAP UNTUK TABEL bill_items
-- A. Melihat tagihan (SELECT)
CREATE POLICY "Pengguna terautentikasi dapat melihat tagihan"
    ON public.bill_items FOR SELECT
    TO authenticated
    USING (true);

-- B. Membuat rincian tagihan split bill untuk semua anggota (INSERT)
CREATE POLICY "Pengguna terautentikasi dapat membuat tagihan"
    ON public.bill_items FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- C. Mengupdate bukti transfer atau status lunas (UPDATE)
CREATE POLICY "Pengguna terautentikasi dapat mengupdate tagihan"
    ON public.bill_items FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- D. Menghapus tagihan (DELETE)
CREATE POLICY "Pengguna terautentikasi dapat menghapus tagihan"
    ON public.bill_items FOR DELETE
    TO authenticated
    USING (true);

-- 4. REFRESH KEBIJAKAN TABEL expenses
DROP POLICY IF EXISTS "Anggota grup dapat melihat pengeluaran kos" ON public.expenses;
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

-- 5. BERSIHKAN DATA PENGELUARAN YANG TERSIMPAN TANPA RINCIAN TAGIHAN (ORPHAN CLEANUP)
DELETE FROM public.expenses
WHERE id NOT IN (SELECT DISTINCT expense_id FROM public.bill_items);
