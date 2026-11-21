-- ==============================================================================
-- KASKOS MOCK SEED DATA (10 Mahasiswa Tester & Tagihan Simulasi)
-- Proyek SaaS: KasKos
-- Bagian dari TASK-15: Pengujian Otomatisasi & Mock Data Tester
-- ==============================================================================

-- 1. SEED DATA PROFIL 10 MAHASISWA TESTER
-- (Catatan: Profil terhubung dengan auth.users jika diuji via Supabase Dashboard / SQL Editor)
INSERT INTO public.profiles (id, full_name, phone_number, avatar_url)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Muhammad Rama (Koordinator)', '081234567801', NULL),
    ('22222222-2222-2222-2222-222222222222', 'Suraya Akbar (Bendahara)', '081234567802', NULL),
    ('33333333-3333-3333-3333-333333333333', 'Fikri Nabillah (Anak Kos)', '081234567803', NULL),
    ('44444444-4444-4444-4444-444444444444', 'Budi Santoso (Tester 4)', '081234567804', NULL),
    ('55555555-5555-5555-5555-555555555555', 'Siti Rahmawati (Tester 5)', '081234567805', NULL),
    ('66666666-6666-6666-6666-666666666666', 'Dimas Pratama (Tester 6)', '081234567806', NULL),
    ('77777777-7777-7777-7777-777777777777', 'Dinda Maharani (Tester 7)', '081234567807', NULL),
    ('88888888-8888-8888-8888-888888888888', 'Rian Hidayat (Tester 8)', '081234567808', NULL),
    ('99999999-9999-9999-9999-999999999999', 'Fajar Nugraha (Tester 9)', '081234567809', NULL),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Nabila Putri (Tester 10)', '081234567810', NULL)
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name, phone_number = EXCLUDED.phone_number;

-- 2. SEED DATA GRUP KAMAR KOS BERSAMA
INSERT INTO public.groups (id, group_name, description, invite_code, created_by, payment_bank, payment_account_number, payment_holder_name)
VALUES
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Kontrakan Pogung Asri No. 4',
        'Kamar bersama 6 mahasiswa Teknik & Komputer di Pogung Lor.',
        'POG004',
        '11111111-1111-1111-1111-111111111111',
        'Bank Central Asia (BCA)',
        '8830192847',
        'Muhammad Rama (Bendahara Kas)'
    ),
    (
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'Kos Melati Putri Kamar 02',
        'Kamar kos 4 mahasiswi di Sukolilo.',
        'MLT002',
        '77777777-7777-7777-7777-777777777777',
        'DANA E-Wallet',
        '081234567807',
        'Dinda Maharani'
    )
ON CONFLICT (id) DO NOTHING;

-- 3. SEED ANGGOTA KAMAR KOS (GROUP_MEMBERS)
-- Grup 1: Kontrakan Pogung Asri (6 Mahasiswa)
INSERT INTO public.group_members (group_id, user_id, role)
VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'admin_grup'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'admin_grup'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'member'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'member'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'member'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '66666666-6666-6666-6666-666666666666', 'member')
ON CONFLICT (group_id, user_id) DO NOTHING;

-- Grup 2: Kos Melati Putri (4 Mahasiswi)
INSERT INTO public.group_members (group_id, user_id, role)
VALUES
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '77777777-7777-7777-7777-777777777777', 'admin_grup'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '88888888-8888-8888-8888-888888888888', 'member'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '99999999-9999-9999-9999-999999999999', 'member'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'member')
ON CONFLICT (group_id, user_id) DO NOTHING;

-- 4. SEED CONTOH PENGELUARAN BERSAMA (EXPENSES)
INSERT INTO public.expenses (id, group_id, title, description, category, total_amount, due_date, created_by)
VALUES
    (
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Token Listrik PLN 150k (Bulan Berjalan)',
        'Pembelian token listrik darurat via PLN Mobile.',
        'listrik',
        150000.00,
        CURRENT_DATE + INTERVAL '3 days',
        '11111111-1111-1111-1111-111111111111'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Iuran WiFi Indihome 50 Mbps',
        'Tagihan internet bulanan kontrakan.',
        'wifi',
        300000.00,
        CURRENT_DATE + INTERVAL '7 days',
        '11111111-1111-1111-1111-111111111111'
    ),
    (
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Isi Ulang 4 Galon Air Mineral Aqua',
        'Air galon untuk dispenser ruang tengah.',
        'air_galon',
        80000.00,
        CURRENT_DATE + INTERVAL '1 days',
        '22222222-2222-2222-2222-222222222222'
    )
ON CONFLICT (id) DO NOTHING;

-- 5. SEED DATA PORSI TAGIHAN (BILL_ITEMS)
-- Porsi Tagihan 1: Token Listrik 150k dibagi 6 orang = @Rp 25.000
INSERT INTO public.bill_items (expense_id, user_id, split_amount, status, proof_image_url, paid_at, notes)
VALUES
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 25000.00, 'paid', 'https://mock.supabase.co/storage/v1/object/public/transfer-proofs/demo1.jpg', NOW(), 'Lunas otomatis (pembuat tagihan)'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 25000.00, 'paid', 'https://mock.supabase.co/storage/v1/object/public/transfer-proofs/demo2.jpg', NOW(), 'Transfer via BCA'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 25000.00, 'waiting_approval', 'https://mock.supabase.co/storage/v1/object/public/transfer-proofs/demo3.jpg', NULL, 'Struk BCA sdh diupload jam 14.00'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 25000.00, 'pending', NULL, NULL, NULL),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555', 25000.00, 'pending', NULL, NULL, NULL),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '66666666-6666-6666-6666-666666666666', 25000.00, 'pending', NULL, NULL, NULL)
ON CONFLICT (expense_id, user_id) DO NOTHING;

-- Porsi Tagihan 2: WiFi 300k dibagi 6 orang = @Rp 50.000
INSERT INTO public.bill_items (expense_id, user_id, split_amount, status, proof_image_url, paid_at, notes)
VALUES
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 50000.00, 'paid', 'https://mock.supabase.co/storage/v1/object/public/transfer-proofs/demo1.jpg', NOW(), 'Lunas otomatis'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 50000.00, 'waiting_approval', 'https://mock.supabase.co/storage/v1/object/public/transfer-proofs/demo2.jpg', NULL, 'Mohon diacc ya mas rama'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 50000.00, 'pending', NULL, NULL, NULL),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 50000.00, 'pending', NULL, NULL, NULL),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 50000.00, 'pending', NULL, NULL, NULL),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '66666666-6666-6666-6666-666666666666', 50000.00, 'pending', NULL, NULL, NULL)
ON CONFLICT (expense_id, user_id) DO NOTHING;
