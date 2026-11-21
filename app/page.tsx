import Link from "next/link";
import {
  IconBolt,
  IconWifi,
  IconDroplet,
  IconFlame,
  IconReceipt2,
  IconShieldCheck,
  IconUsers,
  IconArrowRight,
  IconCheck,
  IconWallet,
  IconDeviceMobile,
} from "@tabler/icons-react";

export default function HomePage() {
  return (
    <div className="page">
      {/* Top Navigation */}
      <header className="navbar navbar-expand-md navbar-light d-print-none bg-white border-bottom">
        <div className="container-xl">
          <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
            <span className="badge bg-green text-white p-2 rounded-circle">
              <IconWallet size={20} stroke={2} />
            </span>
            <span className="fs-2 fw-bold text-dark">
              Kas<span className="text-teal">Kos</span>
            </span>
          </Link>
          <div className="navbar-nav flex-row order-md-last gap-2">
            <Link href="/login" className="btn btn-outline-secondary">
              Masuk
            </Link>
            <Link href="/register" className="btn btn-teal">
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-6 bg-white border-bottom">
        <div className="container-xl text-center py-5">
          <span className="badge bg-green-lt mb-3 px-3 py-2 fs-4">
            🚀 Solusi Keuangan Kamar Kos & Kontrakan
          </span>
          <h1 className="display-4 fw-extrabold text-dark mb-3">
            Urusan Kas Beres, <br />
            <span className="text-teal">Hubungan Roommate Tetap Adem.</span>
          </h1>
          <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: "680px" }}>
            Selamat tinggal drama nagih uang kas di grup WhatsApp! Catat iuran listrik, WiFi, air galon, dan kebutuhan pokok bersama dengan pembagian rata otomatis serta bukti bayar transparan.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link href="/register" className="btn btn-teal btn-lg px-4 d-flex align-items-center gap-2">
              Mulai Pakai Gratis <IconArrowRight size={20} />
            </Link>
            <Link href="/login" className="btn btn-outline-secondary btn-lg px-4">
              Masuk ke Dashboard
            </Link>
          </div>
          <p className="small text-muted mt-3">
            ✓ 100% Gratis untuk anak kos &nbsp;•&nbsp; ✓ Tanpa biaya admin transaksi &nbsp;•&nbsp; ✓ Cukup share kode 6-digit
          </p>
        </div>
      </section>

      {/* Problem vs Solution Comparison */}
      <section className="py-6 bg-light">
        <div className="container-xl">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Masih Pakai Cara Lama?</h2>
            <p className="text-muted">Bandingkan kerepotan mencatat manual dengan kemudahan KasKos.</p>
          </div>

          <div className="row row-cards justify-content-center">
            {/* Cara Lama */}
            <div className="col-md-5">
              <div className="card border-danger shadow-sm h-100">
                <div className="card-status-top bg-danger"></div>
                <div className="card-body">
                  <h3 className="card-title text-danger mb-3">❌ Cara Lama (Buku / WhatsApp)</h3>
                  <ul className="list-unstyled space-y-2">
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <span className="text-danger fw-bold">✕</span>
                      <span>Catatan di whiteboard atau buku rawan basah, hilang, atau lupa dicatat.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <span className="text-danger fw-bold">✕</span>
                      <span>Bendahara sungkan dan canggung saat harus menagih berulang kali di grup WA.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <span className="text-danger fw-bold">✕</span>
                      <span>Hitung pembagian manual rawan selisih uang dan menimbulkan salah paham.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <span className="text-danger fw-bold">✕</span>
                      <span>Bukti transfer tenggelam oleh obrolan harian di grup chat.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Solusi KasKos */}
            <div className="col-md-5">
              <div className="card border-teal shadow-sm h-100">
                <div className="card-status-top bg-teal"></div>
                <div className="card-body">
                  <h3 className="card-title text-teal mb-3">✅ Solusi KasKos SaaS</h3>
                  <ul className="list-unstyled space-y-2">
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <IconCheck size={18} className="text-teal mt-1 flex-shrink-0" />
                      <span>Semua riwayat kas tersimpan aman di cloud dan bisa dipantau seluruh anggota 24/7.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <IconCheck size={18} className="text-teal mt-1 flex-shrink-0" />
                      <span>Alert tagihan otomatis transparan, tidak perlu merasa tidak enakan lagi.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <IconCheck size={18} className="text-teal mt-1 flex-shrink-0" />
                      <span>Fitur <strong>Auto-Split</strong> membagi tagihan per kepala secara akurat seketika.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <IconCheck size={18} className="text-teal mt-1 flex-shrink-0" />
                      <span>Struk transfer tersimpan rapi per tagihan dengan verifikasi status lunas 1-klik.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-6 bg-white border-top border-bottom">
        <div className="container-xl">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Fitur Unggulan Buat Anak Kos</h2>
            <p className="text-muted">Semua yang Anda butuhkan untuk mengelola uang kontrakan tanpa ribet.</p>
          </div>

          <div className="row row-cards">
            <div className="col-md-4">
              <div className="card card-stacked">
                <div className="card-body text-center p-4">
                  <div className="avatar avatar-lg bg-green-lt mb-3 mx-auto rounded-circle">
                    <IconUsers size={28} />
                  </div>
                  <h3 className="card-title">Grup Kamar Multi-Tenant</h3>
                  <p className="text-secondary">
                    Buat kamar kos baru dan undang teman sekamar hanya dengan membagikan <strong>Kode Undangan 6-digit</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card card-stacked">
                <div className="card-body text-center p-4">
                  <div className="avatar avatar-lg bg-yellow-lt mb-3 mx-auto rounded-circle">
                    <IconReceipt2 size={28} />
                  </div>
                  <h3 className="card-title">Auto-Split Bill Engine</h3>
                  <p className="text-secondary">
                    Input total biaya token listrik atau WiFi, sistem akan langsung membagi rata ke seluruh penghuni secara otomatis.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card card-stacked">
                <div className="card-body text-center p-4">
                  <div className="avatar avatar-lg bg-blue-lt mb-3 mx-auto rounded-circle">
                    <IconShieldCheck size={28} />
                  </div>
                  <h3 className="card-title">Upload Bukti Transfer</h3>
                  <p className="text-secondary">
                    Anggota cukup upload screenshot struk m-banking/DANA, koordinator kos tinggal klik verifikasi status Lunas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Icons Showcase */}
      <section className="py-5 bg-light">
        <div className="container-xl text-center">
          <h3 className="text-secondary mb-4">Cocok untuk Segala Jenis Pengeluaran Bersama</h3>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <span className="badge bg-white text-dark shadow-sm py-2 px-3 d-flex align-items-center gap-2 fs-3">
              <IconBolt className="text-warning" size={20} /> Token Listrik PLN
            </span>
            <span className="badge bg-white text-dark shadow-sm py-2 px-3 d-flex align-items-center gap-2 fs-3">
              <IconWifi className="text-azure" size={20} /> WiFi / Internet
            </span>
            <span className="badge bg-white text-dark shadow-sm py-2 px-3 d-flex align-items-center gap-2 fs-3">
              <IconDroplet className="text-blue" size={20} /> Air Galon
            </span>
            <span className="badge bg-white text-dark shadow-sm py-2 px-3 d-flex align-items-center gap-2 fs-3">
              <IconFlame className="text-danger" size={20} /> Gas LPG
            </span>
            <span className="badge bg-white text-dark shadow-sm py-2 px-3 d-flex align-items-center gap-2 fs-3">
              <IconDeviceMobile className="text-teal" size={20} /> Iuran Sampah & Kebersihan
            </span>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="footer bg-white border-top py-5">
        <div className="container-xl text-center">
          <h2 className="fw-bold mb-2">Siap Bikin Keuangan Kos Kamu Rapi & Transparan?</h2>
          <p className="text-muted mb-4">Mulai dalam 1 menit, tidak perlu download aplikasi, langsung via web browser.</p>
          <Link href="/register" className="btn btn-teal btn-lg px-5">
            Daftar KasKos Sekarang — Gratis!
          </Link>
          <div className="text-muted small mt-4">
            &copy; {new Date().getFullYear()} KasKos SaaS. Dikembangkan oleh Tim Mahasiswa.
          </div>
        </div>
      </footer>
    </div>
  );
}
