-- ==============================================================================
-- SKRIP PERBAIKAN ROW LEVEL SECURITY (RLS) POLICIES KASKOS
-- Solusi untuk error: "infinite recursion detected in policy for relation group_members"
-- Jalankan skrip ini sekali di Supabase SQL Editor Anda.
-- ==============================================================================

-- 1. HAPUS SEMUA POLICY LAMA PADA GROUPS & GROUP_MEMBERS
DROP POLICY IF EXISTS "Pengguna dapat melihat grup tempat ia menjadi anggota" ON public.groups;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat membuat grup baru" ON public.groups;
DROP POLICY IF EXISTS "Hanya Admin Grup yang dapat mengubah info grup" ON public.groups;
DROP POLICY IF EXISTS "Admin grup dapat mengubah info grup" ON public.groups;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat membaca grup" ON public.groups;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat melihat grup" ON public.groups;
DROP POLICY IF EXISTS "Admin dapat mengupdate info grup" ON public.groups;

DROP POLICY IF EXISTS "Anggota dapat melihat daftar member di grupnya" ON public.group_members;
DROP POLICY IF EXISTS "Pengguna dapat bergabung ke grup" ON public.group_members;
DROP POLICY IF EXISTS "Anggota dapat membaca data keanggotaan grup" ON public.group_members;
DROP POLICY IF EXISTS "Pengguna terautentikasi dapat melihat anggota grup" ON public.group_members;
DROP POLICY IF EXISTS "Pengguna dapat keluar dari grup" ON public.group_members;

-- 2. KEBIJAKAN BARU UNTUK TABEL GROUPS (Bebas Rekursi)
CREATE POLICY "Pengguna terautentikasi dapat melihat grup"
    ON public.groups FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Pengguna terautentikasi dapat membuat grup"
    ON public.groups FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admin dapat mengupdate info grup"
    ON public.groups FOR UPDATE
    TO authenticated
    USING (created_by = auth.uid());

-- 3. KEBIJAKAN BARU UNTUK TABEL GROUP_MEMBERS (Bebas Rekursi)
CREATE POLICY "Pengguna terautentikasi dapat melihat anggota grup"
    ON public.group_members FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Pengguna dapat bergabung ke grup"
    ON public.group_members FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Pengguna dapat keluar dari grup"
    ON public.group_members FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
