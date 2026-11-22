-- ==============================================================================
-- SKRIP DATABASE POSTGRESQL / SUPABASE: KASKOS SaaS
-- Deskripsi: Skema database lengkap untuk manajemen kas & tagihan patungan anak kos.
-- Kompatibel dengan: Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABEL: PROFILES (Terhubung otomatis dengan auth.users Supabase)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger untuk membuat profil otomatis setiap kali user baru register di Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone_number, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Anak Kos Baru'),
        new.raw_user_meta_data->>'phone_number',
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 3. TABEL: GROUPS (Kamar Kos / Rumah Kontrakan)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_name TEXT NOT NULL,
    description TEXT,
    invite_code VARCHAR(10) UNIQUE NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    payment_bank TEXT,                  -- Contoh: BCA, BRI, Mandiri, DANA, GoPay
    payment_account_number TEXT,        -- Contoh: 1234567890
    payment_holder_name TEXT,          -- Contoh: Budi Santoso (Bendahara Kos)
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Helper function untuk membuat kode invite 6 karakter acak
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. TABEL: GROUP_MEMBERS (Relasi Keanggotaan & Peran dalam Grup)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin_grup', 'member')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(group_id, user_id)
);

-- ==============================================================================
-- 5. TABEL: EXPENSES (Pengeluaran / Tagihan Bersama)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    title TEXT NOT NULL,                -- Contoh: "Token Listrik PLN Bulan Ini"
    description TEXT,
    category TEXT NOT NULL DEFAULT 'lainnya' 
        CHECK (category IN ('listrik', 'wifi', 'air_galon', 'gas_lpg', 'kebersihan', 'konsumsi', 'lainnya')),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount > 0),
    due_date DATE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 6. TABEL: BILL_ITEMS (Porsi Tagihan per Anggota Kos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bill_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    split_amount NUMERIC(12, 2) NOT NULL CHECK (split_amount >= 0),
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'waiting_approval', 'paid')),
    proof_image_url TEXT,               -- Tautan file bukti transfer di Supabase Storage
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(expense_id, user_id)
);

-- ==============================================================================
-- 7. INDEKS PERFORMA (Query Optimization)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_expenses_group ON public.expenses(group_id);
CREATE INDEX IF NOT EXISTS idx_bill_items_user ON public.bill_items(user_id);
CREATE INDEX IF NOT EXISTS idx_bill_items_expense ON public.bill_items(expense_id);
CREATE INDEX IF NOT EXISTS idx_groups_invite_code ON public.groups(invite_code);

-- ==============================================================================
-- 7.5 HAK AKSES DASAR (GRANT PRIVILEGES)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- Keamanan data agar anggota hanya melihat grup & tagihan miliknya sendiri
-- ==============================================================================

-- Aktifkan RLS di semua tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_items ENABLE ROW LEVEL SECURITY;

-- 8.1 PROFILES POLICIES
CREATE POLICY "Pengguna dapat membaca semua profil"
    ON public.profiles FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Pengguna hanya dapat mengedit profilnya sendiri"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 8.2 GROUPS POLICIES
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

-- 8.3 GROUP MEMBERS POLICIES
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

-- 8.4 EXPENSES POLICIES
CREATE POLICY "Anggota grup dapat melihat pengeluaran kos"
    ON public.expenses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members gm
            WHERE gm.group_id = expenses.group_id AND gm.user_id = auth.uid()
        )
    );

CREATE POLICY "Hanya Admin Grup yang dapat membuat atau mengedit pengeluaran"
    ON public.expenses FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members gm
            WHERE gm.group_id = expenses.group_id AND gm.user_id = auth.uid() AND gm.role = 'admin_grup'
        )
    );

-- 8.5 BILL ITEMS POLICIES
CREATE POLICY "Anggota dapat melihat tagihan miliknya atau tagihan grupnya"
    ON public.bill_items FOR SELECT
    USING (
        bill_items.user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.expenses e
            JOIN public.group_members gm ON gm.group_id = e.group_id
            WHERE e.id = bill_items.expense_id AND gm.user_id = auth.uid()
        )
    );

CREATE POLICY "Anggota dapat mengupdate konfirmasi bayar miliknya"
    ON public.bill_items FOR UPDATE
    USING (
        bill_items.user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.expenses e
            JOIN public.group_members gm ON gm.group_id = e.group_id
            WHERE e.id = bill_items.expense_id AND gm.user_id = auth.uid() AND gm.role = 'admin_grup'
        )
    );

-- ==============================================================================
-- 9. SETUP STORAGE BUCKET UNTUK BUKTI TRANSFER (Supabase Storage)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('transfer-proofs', 'transfer-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan Storage agar pengguna terautentikasi bisa mengunggah bukti bayar
CREATE POLICY "Upload bukti bayar diizinkan untuk pengguna login"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'transfer-proofs' AND auth.role() = 'authenticated');

CREATE POLICY "Semua orang dapat melihat gambar bukti bayar"
ON storage.objects FOR SELECT
USING (bucket_id = 'transfer-proofs');

-- ==============================================================================
-- 10. DUMMY SEED DATA (Opsional - untuk demo & pengujian awal)
-- ==============================================================================
-- Anda bisa menjalankan query ini setelah membuat user akun di Supabase Auth untuk langsung
-- memiliki data siap uji saat demo ke dosen.
