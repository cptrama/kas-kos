-- ==============================================================================
-- KASKOS SaaS - MIGRATION: BUKTI REALISASI PEMBELIAN DARI KOORDINATOR
-- Deskripsi: Menambahkan kolom bukti struk pembelian (contoh: struk token PLN,
--            kuitansi WiFi, nota galon) dan catatan nomor token 20-digit.
--            Semua anggota kos yang tergabung dalam grup berhak melihatnya
--            secara transparan untuk mencegah penggelapan dana kas bersama.
-- ==============================================================================

ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS proof_image_url TEXT,
ADD COLUMN IF NOT EXISTS receipt_notes TEXT;

-- Komentar dokumentasi kolom
COMMENT ON COLUMN public.expenses.proof_image_url IS 'URL foto/screenshot struk bukti pembelian riil dari koordinator di Supabase Storage';
COMMENT ON COLUMN public.expenses.receipt_notes IS 'Catatan khusus realisasi pengeluaran, seperti 20-digit nomor token listrik PLN atau ID pelanggan';
