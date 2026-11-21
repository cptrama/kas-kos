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
  IconCreditCard,
  IconClock,
  IconSparkles,
  IconStar,
  IconCopy,
  IconHelpCircle,
  IconShield,
  IconUserCheck,
} from "@tabler/icons-react";

export default function HomePage() {
  return (
    <div className="page bg-white">
      {/* Top Navigation */}
      <header className="navbar navbar-expand-md navbar-light sticky-top bg-white border-bottom shadow-xs">
        <div className="container-xl">
          <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
            <span className="badge bg-teal text-white p-2 rounded-circle shadow-sm">
              <IconWallet size={20} stroke={2.5} />
            </span>
            <span className="fs-2 fw-bold text-dark">
              Kas<span className="text-teal">Kos</span>
            </span>
          </Link>

          <div className="d-none d-md-flex align-items-center gap-4 mx-auto">
            <a href="#fitur" className="text-secondary text-decoration-none fw-medium hover-teal">
              Fitur Utama
            </a>
            <a href="#cara-kerja" className="text-secondary text-decoration-none fw-medium hover-teal">
              Cara Kerja
            </a>
            <a href="#komparasi" className="text-secondary text-decoration-none fw-medium hover-teal">
              Perbandingan
            </a>
            <a href="#faq" className="text-secondary text-decoration-none fw-medium hover-teal">
              FAQ
            </a>
          </div>

          <div className="navbar-nav flex-row order-md-last align-items-center gap-2">
            <Link href="/login" className="btn btn-outline-secondary px-3">
              Masuk
            </Link>
            <Link href="/register" className="btn btn-teal px-3 shadow-sm d-flex align-items-center gap-1">
              <span>Daftar Gratis</span>
              <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-6 bg-light border-bottom position-relative overflow-hidden">
        <div className="container-xl text-center py-4">
          <div className="d-inline-flex align-items-center gap-2 badge bg-teal-lt mb-3 px-3 py-2 fs-4 rounded-pill">
            <IconSparkles size={16} className="text-teal" />
            <span>Solusi SaaS No. 1 Pengeluaran Bersama Kamar Kos</span>
          </div>

          <h1 className="display-4 fw-extrabold text-dark mb-3 tracking-tight">
            Urusan Kas Beres, <br />
            <span className="text-teal">Hubungan Roommate Tetap Adem.</span>
          </h1>

          <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: "720px", lineHeight: "1.7" }}>
            Selamat tinggal drama nagih uang kas di grup WhatsApp! Catat iuran listrik, WiFi, air galon, dan kebutuhan pokok bersama dengan pembagian rata otomatis serta verifikasi bukti bayar transparan 24/7.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
            <Link href="/register" className="btn btn-teal btn-lg px-4 shadow d-flex align-items-center gap-2">
              <span>Mulai Pakai Gratis</span>
              <IconArrowRight size={20} />
            </Link>
            <Link href="/login" className="btn btn-outline-dark btn-lg px-4">
              Masuk ke Dashboard
            </Link>
          </div>

          <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap text-muted small fw-medium">
            <span className="d-flex align-items-center gap-1">
              <IconCheck size={16} className="text-teal fw-bold" /> 100% Gratis Tanpa Biaya Admin
            </span>
            <span className="d-flex align-items-center gap-1">
              <IconCheck size={16} className="text-teal fw-bold" /> Cukup Kode Invite 6-Digit
            </span>
            <span className="d-flex align-items-center gap-1">
              <IconCheck size={16} className="text-teal fw-bold" /> Mobile-Friendly Tanpa Download App
            </span>
          </div>

          {/* Interactive UI Mockup Showcase */}
          <div className="mt-5 mx-auto text-start" style={{ maxWidth: "860px" }}>
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
              <div className="card-header bg-dark text-white py-2 px-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-danger p-1 rounded-circle"></span>
                  <span className="badge bg-warning p-1 rounded-circle"></span>
                  <span className="badge bg-success p-1 rounded-circle"></span>
                  <span className="ms-2 small text-light opacity-75">app.kaskos.id/dashboard</span>
                </div>
                <span className="badge bg-teal text-white small">
                  Live Preview
                </span>
              </div>

              <div className="card-body bg-light p-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <div>
                    <h3 className="fw-bold mb-0 text-dark">🏠 Kamar Mawar 03</h3>
                    <p className="text-muted small mb-0">Kode Invite: <strong className="text-teal">KM392X</strong> • 4 Penghuni</p>
                  </div>
                  <span className="badge bg-green-lt px-3 py-2 rounded-pill fs-4">
                    Kas Terkumpul: Rp 300.000
                  </span>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <div className="card border-0 shadow-sm p-3 h-100">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-warning-lt p-1 rounded">
                          <IconBolt size={18} />
                        </span>
                        <strong className="text-dark">Token Listrik PLN 100k</strong>
                      </div>
                      <div className="fs-3 fw-bold text-dark mb-1">Total: Rp 100.000</div>
                      <div className="text-secondary small">
                        Auto-Split 4 Orang: <span className="text-teal fw-bold">Rp 25.000 / orang</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="card border-0 shadow-sm p-3 h-100">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-teal-lt p-1 rounded">
                          <IconCreditCard size={18} />
                        </span>
                        <strong className="text-dark">Rekening Tujuan Kas</strong>
                      </div>
                      <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded">
                        <div>
                          <div className="small text-muted">BCA • Bendahara Kos</div>
                          <div className="fw-bold text-teal">123-456-7890</div>
                        </div>
                        <button type="button" className="btn btn-sm btn-outline-teal d-flex align-items-center gap-1" disabled>
                          <IconCopy size={14} /> Salin
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar and status table preview */}
                <div className="bg-white p-3 rounded shadow-sm border">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small fw-bold text-secondary">Status Pembayaran Anggota:</span>
                    <span className="badge bg-teal text-white small">3 dari 4 Sudah Bayar</span>
                  </div>
                  <div className="progress progress-sm mb-3">
                    <div className="progress-bar bg-teal" style={{ width: "75%" }}></div>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge bg-green-lt py-2 px-3 d-inline-flex align-items-center gap-1">
                      <IconCheck size={14} /> Budi (Lunas)
                    </span>
                    <span className="badge bg-green-lt py-2 px-3 d-inline-flex align-items-center gap-1">
                      <IconCheck size={14} /> Siti (Lunas)
                    </span>
                    <span className="badge bg-yellow-lt py-2 px-3 d-inline-flex align-items-center gap-1">
                      <IconClock size={14} /> Dimas (Menunggu Verifikasi)
                    </span>
                    <span className="badge bg-danger-lt py-2 px-3 d-inline-flex align-items-center gap-1">
                      <IconClock size={14} /> Rama (Belum Bayar)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cara Kerja (How it works) */}
      <section id="cara-kerja" className="py-6 bg-white border-bottom">
        <div className="container-xl">
          <div className="text-center mb-5">
            <span className="badge bg-teal-lt mb-2 px-3 py-1 fs-5">Simpel & Praktis</span>
            <h2 className="display-6 fw-bold text-dark">Hanya Butuh 3 Langkah Cepat</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "560px" }}>
              Tidak perlu instal aplikasi tambahan. Cukup buka lewat browser ponsel atau laptop, kelola kas langsung beres.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="avatar avatar-xl bg-teal text-white rounded-circle mx-auto mb-3 fw-bold fs-2 shadow-sm">
                  1
                </div>
                <h3 className="fw-bold mb-2">Buat Kamar Kos</h3>
                <p className="text-secondary small mb-0">
                  Daftarkan nama kamar kos Anda, tentukan rekening kas penerima, dan bagikan <strong>kode invite 6-digit</strong> ke teman sekamar.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="avatar avatar-xl bg-teal text-white rounded-circle mx-auto mb-3 fw-bold fs-2 shadow-sm">
                  2
                </div>
                <h3 className="fw-bold mb-2">Input Tagihan Bersama</h3>
                <p className="text-secondary small mb-0">
                  Beli token listrik, bayar WiFi, atau galon? Cukup masukkan total nominalnya. Sistem otomatis membagi rata ke seluruh penghuni aktif.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="avatar avatar-xl bg-teal text-white rounded-circle mx-auto mb-3 fw-bold fs-2 shadow-sm">
                  3
                </div>
                <h3 className="fw-bold mb-2">Upload & Verifikasi Struk</h3>
                <p className="text-secondary small mb-0">
                  Anggota mentransfer ke rekening tujuan dan mengunggah screenshot bukti. Koordinator tinggal 1-klik konfirmasi lunas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Comparison */}
      <section id="komparasi" className="py-6 bg-light border-bottom">
        <div className="container-xl">
          <div className="text-center mb-5">
            <span className="badge bg-danger-lt mb-2 px-3 py-1 fs-5">Solusi Nyata</span>
            <h2 className="display-6 fw-bold text-dark">Masih Mau Ribet Pakai Cara Lama?</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
              Bandingkan rasa canggung dan repotnya mencatat manual di grup WhatsApp dengan keteraturan KasKos.
            </p>
          </div>

          <div className="row row-cards justify-content-center g-4">
            {/* Cara Lama */}
            <div className="col-lg-5 col-md-6">
              <div className="card border-danger shadow-sm h-100">
                <div className="card-status-top bg-danger"></div>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge bg-danger text-white p-2 rounded-circle">✕</span>
                    <h3 className="card-title text-danger m-0 fw-bold fs-3">Cara Lama (Grup WA & Buku)</h3>
                  </div>
                  <ul className="list-unstyled space-y-3 mt-3">
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <span className="text-danger fw-bold mt-1">✕</span>
                      <span className="text-secondary"><strong>Canggung Menagih:</strong> Bendahara sering merasa tidak enak hati saat harus berkali-kali *tag* nama teman di grup chat.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <span className="text-danger fw-bold mt-1">✕</span>
                      <span className="text-secondary"><strong>Bukti Transfer Hilang:</strong> Struk m-banking tenggelam ribuan pesan obrolan harian dan stiker grup.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <span className="text-danger fw-bold mt-1">✕</span>
                      <span className="text-secondary"><strong>Hitungan Selisih:</strong> Menghitung pembagian desimal manual rawan keliru dan memicu curiga antar penghuni.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <span className="text-danger fw-bold mt-1">✕</span>
                      <span className="text-secondary"><strong>Buku Kas Hilang:</strong> Catatan di papan tulis atau kertas mudah terhapus, basah, atau tertinggal.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Solusi KasKos */}
            <div className="col-lg-5 col-md-6">
              <div className="card border-teal shadow-sm h-100">
                <div className="card-status-top bg-teal"></div>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge bg-teal text-white p-2 rounded-circle">✓</span>
                    <h3 className="card-title text-teal m-0 fw-bold fs-3">Solusi KasKos SaaS</h3>
                  </div>
                  <ul className="list-unstyled space-y-3 mt-3">
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <IconCheck size={20} className="text-teal mt-1 flex-shrink-0 fw-bold" />
                      <span className="text-dark"><strong>Alert Tagihan Netral:</strong> Notifikasi sistem yang mengingatkan secara objektif, tanpa ada pihak yang merasa sungkan.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <IconCheck size={20} className="text-teal mt-1 flex-shrink-0 fw-bold" />
                      <span className="text-dark"><strong>Cloud Proof Storage:</strong> Foto struk tersimpan rapi langsung di kartu tagihan dan terverifikasi aman.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <IconCheck size={20} className="text-teal mt-1 flex-shrink-0 fw-bold" />
                      <span className="text-dark"><strong>Auto-Split Presisi:</strong> Sekali klik, nominal tagihan langsung terbagi rata ke seluruh anggota tanpa selisih sen pun.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <IconCheck size={20} className="text-teal mt-1 flex-shrink-0 fw-bold" />
                      <span className="text-dark"><strong>Transparansi 24/7:</strong> Seluruh penghuni kamar bisa memantau sisa saldo kas dan status lunas kapan saja.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="fitur" className="py-6 bg-white border-bottom">
        <div className="container-xl">
          <div className="text-center mb-5">
            <span className="badge bg-teal-lt mb-2 px-3 py-1 fs-5">Fitur Lengkap</span>
            <h2 className="display-6 fw-bold text-dark">Didesain Khusus Kebutuhan Anak Kos</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
              Kombinasi kemudahan penggunaan antarmuka Tabler.io dengan kehandalan cloud backend modern.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-3">
                <div className="card-body">
                  <div className="avatar avatar-md bg-green-lt rounded-circle mb-3">
                    <IconUsers size={24} />
                  </div>
                  <h3 className="fw-bold fs-3 mb-2">Grup Kamar Multi-Tenant</h3>
                  <p className="text-secondary small mb-0">
                    Satu akun bisa mengelola atau bergabung ke grup kos mana pun hanya dengan memasukkan kode unik 6 karakter.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-3">
                <div className="card-body">
                  <div className="avatar avatar-md bg-yellow-lt rounded-circle mb-3">
                    <IconReceipt2 size={24} />
                  </div>
                  <h3 className="fw-bold fs-3 mb-2">Auto-Split Engine</h3>
                  <p className="text-secondary small mb-0">
                    Membagi pengeluaran bersama secara adil dan otomatis. Status tagihan tergenerate otomatis ke akun tiap anggota.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-3">
                <div className="card-body">
                  <div className="avatar avatar-md bg-teal-lt rounded-circle mb-3">
                    <IconShieldCheck size={24} />
                  </div>
                  <h3 className="fw-bold fs-3 mb-2">Upload Bukti & Verifikasi</h3>
                  <p className="text-secondary small mb-0">
                    Unggah screenshot transfer langsung dari galeri HP ke cloud storage. Koordinator memvalidasi dengan 1 klik.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-3">
                <div className="card-body">
                  <div className="avatar avatar-md bg-blue-lt rounded-circle mb-3">
                    <IconCreditCard size={24} />
                  </div>
                  <h3 className="fw-bold fs-3 mb-2">1-Klik Salin No. Rekening</h3>
                  <p className="text-secondary small mb-0">
                    Tidak perlu lagi bolak-balik tanya &quot;Minta no rek dong!&quot;. Nomor rekening bendahara siap disalin instan ke clipboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-3">
                <div className="card-body">
                  <div className="avatar avatar-md bg-purple-lt rounded-circle mb-3">
                    <IconClock size={24} />
                  </div>
                  <h3 className="fw-bold fs-3 mb-2">Catatan Riwayat Real-Time</h3>
                  <p className="text-secondary small mb-0">
                    Riwayat seluruh iuran per bulan terekam abadi. Tidak ada lagi perdebatan siapa yang sudah atau belum membayar.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-3">
                <div className="card-body">
                  <div className="avatar avatar-md bg-azure-lt rounded-circle mb-3">
                    <IconDeviceMobile size={24} />
                  </div>
                  <h3 className="fw-bold fs-3 mb-2">Responsif di Semua Layar</h3>
                  <p className="text-secondary small mb-0">
                    Didesain optimal untuk layar smartphone maupun laptop. Ringan, hemat kuota internet, dan loading super kencang.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Icons Showcase */}
      <section className="py-5 bg-light border-bottom">
        <div className="container-xl text-center">
          <h3 className="text-secondary mb-4 fw-medium">Mendukung Segala Macam Pengeluaran Kamar Kos</h3>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <span className="badge bg-white text-dark shadow-sm py-2 px-3 d-flex align-items-center gap-2 fs-3 rounded-pill">
              <IconBolt className="text-warning" size={22} /> Token Listrik PLN
            </span>
            <span className="badge bg-white text-dark shadow-sm py-2 px-3 d-flex align-items-center gap-2 fs-3 rounded-pill">
              <IconWifi className="text-azure" size={22} /> Iuran WiFi Indihome/Biznet
            </span>
            <span className="badge bg-white text-dark shadow-sm py-2 px-3 d-flex align-items-center gap-2 fs-3 rounded-pill">
              <IconDroplet className="text-blue" size={22} /> Isi Ulang Air Galon
            </span>
            <span className="badge bg-white text-dark shadow-sm py-2 px-3 d-flex align-items-center gap-2 fs-3 rounded-pill">
              <IconFlame className="text-danger" size={22} /> Gas Masak LPG 3kg
            </span>
            <span className="badge bg-white text-dark shadow-sm py-2 px-3 d-flex align-items-center gap-2 fs-3 rounded-pill">
              <IconDeviceMobile className="text-teal" size={22} /> Iuran Sampah & Kebersihan
            </span>
          </div>
        </div>
      </section>

      {/* Social Proof / Tester Testimonials */}
      <section className="py-6 bg-white border-bottom">
        <div className="container-xl">
          <div className="text-center mb-5">
            <span className="badge bg-teal-lt mb-2 px-3 py-1 fs-5">Uji Coba Pengguna</span>
            <h2 className="display-6 fw-bold text-dark">Kata Teman Kos yang Sudah Mencoba</h2>
            <p className="text-muted">Feedback nyata dari 10+ mahasiswa penguji yang menguji KasKos.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="d-flex text-warning mb-2">
                  <IconStar size={18} fill="currentColor" />
                  <IconStar size={18} fill="currentColor" />
                  <IconStar size={18} fill="currentColor" />
                  <IconStar size={18} fill="currentColor" />
                  <IconStar size={18} fill="currentColor" />
                </div>
                <p className="text-secondary small fst-italic mb-3">
                  &quot;Sebagai bendahara kos 6 orang, dulu pusing banget kalau token listrik bunyi malam-malam. Sekarang tinggal input nominal, bagi rata, dan teman-teman langsung kirim bukti transfer ke web.&quot;
                </p>
                <div className="d-flex align-items-center gap-2 mt-auto">
                  <span className="avatar avatar-sm bg-teal-lt rounded-circle">
                    <IconUserCheck size={18} />
                  </span>
                  <div>
                    <div className="fw-bold small text-dark">Rian Pratama</div>
                    <div className="text-muted small" style={{ fontSize: "11px" }}>Koordinator Kos Pogung, Sleman</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="d-flex text-warning mb-2">
                  <IconStar size={18} fill="currentColor" />
                  <IconStar size={18} fill="currentColor" />
                  <IconStar size={18} fill="currentColor" />
                  <IconStar size={18} fill="currentColor" />
                  <IconStar size={18} fill="currentColor" />
                </div>
                <p className="text-secondary small fst-italic mb-3">
                  &quot;Fitur 1-klik salin no rekening beneran penyelamat. Biasanya harus scroll chat WA panjang cuma buat cari nomor rekening bendahara. Di KasKos tinggal klik langsung kebuka m-banking.&quot;
                </p>
                <div className="d-flex align-items-center gap-2 mt-auto">
                  <span className="avatar avatar-sm bg-blue-lt rounded-circle">
                    <IconUserCheck size={18} />
                  </span>
                  <div>
                    <div className="fw-bold small text-dark">Dinda Maharani</div>
                    <div className="text-muted small" style={{ fontSize: "11px" }}>Anak Kos Putri, Sukolilo</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="d-flex text-warning mb-2">
                  <IconStar size={18} fill="currentColor" />
                  <IconStar size={18} fill="currentColor" />
                  <IconStar size={18} fill="currentColor" />
                  <IconStar size={18} fill="currentColor" />
                  <IconStar size={18} fill="currentColor" />
                </div>
                <p className="text-secondary small fst-italic mb-3">
                  &quot;Yang paling saya suka adalah transparansinya. Semua uang keluar tercatat jelas tanggal dan nominalnya. Hubungan sama roommate jadi jauh lebih adem dan bebas curiga.&quot;
                </p>
                <div className="d-flex align-items-center gap-2 mt-auto">
                  <span className="avatar avatar-sm bg-green-lt rounded-circle">
                    <IconUserCheck size={18} />
                  </span>
                  <div>
                    <div className="fw-bold small text-dark">Fajar Nugraha</div>
                    <div className="text-muted small" style={{ fontSize: "11px" }}>Penghuni Kontrakan, Jatinangor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-6 bg-light border-bottom">
        <div className="container-xl" style={{ maxWidth: "800px" }}>
          <div className="text-center mb-5">
            <span className="badge bg-teal-lt mb-2 px-3 py-1 fs-5">Tanya Jawab</span>
            <h2 className="display-6 fw-bold text-dark">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-muted">Ketahui lebih lanjut mengenai cara kerja dan keamanan KasKos.</p>
          </div>

          <div className="row g-3">
            <div className="col-12">
              <div className="card border-0 shadow-sm p-4">
                <h4 className="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                  <IconHelpCircle size={20} className="text-teal" />
                  Apakah KasKos benar-benar gratis?
                </h4>
                <p className="text-secondary small mb-0">
                  Ya, 100% gratis! KasKos dikembangkan sebagai proyek SaaS mahasiswa untuk membantu kehidupan anak kos. Tidak ada biaya langganan, tanpa potongan, dan bebas iklan mengganggu.
                </p>
              </div>
            </div>

            <div className="col-12">
              <div className="card border-0 shadow-sm p-4">
                <h4 className="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                  <IconHelpCircle size={20} className="text-teal" />
                  Apakah uang kas disimpan di dalam sistem KasKos?
                </h4>
                <p className="text-secondary small mb-0">
                  <strong>Tidak.</strong> KasKos murni merupakan platform pencatatan, kalkulasi otomatis, dan verifikasi bukti. Uang ditransfer langsung dari rekening bank atau e-wallet anggota ke rekening bendahara kos Anda, sehingga 100% aman dan tidak ada dana yang ditahan.
                </p>
              </div>
            </div>

            <div className="col-12">
              <div className="card border-0 shadow-sm p-4">
                <h4 className="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                  <IconHelpCircle size={20} className="text-teal" />
                  Bagaimana jika salah satu anggota telat bayar?
                </h4>
                <p className="text-secondary small mb-0">
                  Dashboard anggota akan menampilkan alert banner berwarna merah/kuning dengan rincian tagihan belum lunas, sehingga anggota bersangkutan langsung menyadari kewajibannya tanpa perlu ditagih berulang kali secara personal.
                </p>
              </div>
            </div>

            <div className="col-12">
              <div className="card border-0 shadow-sm p-4">
                <h4 className="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                  <IconHelpCircle size={20} className="text-teal" />
                  Berapa banyak anggota yang bisa bergabung dalam satu grup?
                </h4>
                <p className="text-secondary small mb-0">
                  Tidak ada batasan jumlah anggota. Mau kamar kos berdua, berempat, atau kontrakan besar dengan 10+ penghuni, sistem auto-split KasKos akan membagi tagihan secara merata seketika.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-6 bg-teal text-white text-center">
        <div className="container-xl py-4" style={{ maxWidth: "700px" }}>
          <div className="avatar avatar-lg bg-white text-teal rounded-circle mx-auto mb-3 shadow">
            <IconSparkles size={32} />
          </div>
          <h2 className="display-6 fw-extrabold mb-3">Siap Bikin Keuangan Kamar Kos Rapi & Bebas Drama?</h2>
          <p className="lead text-white-50 mb-4">
            Daftar sekarang dalam hitungan detik. Cukup masukkan email dan undang teman kos Anda!
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link href="/register" className="btn btn-white text-teal fw-bold btn-lg px-4 shadow">
              Daftar KasKos Sekarang — Gratis!
            </Link>
          </div>
          <div className="small text-white-50 mt-3">
            Tidak memerlukan kartu kredit • Setup hanya 1 menit
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-dark text-white py-5">
        <div className="container-xl">
          <div className="row g-4 align-items-center justify-content-between">
            <div className="col-md-5">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-teal text-white p-2 rounded-circle">
                  <IconWallet size={18} stroke={2.5} />
                </span>
                <span className="fs-2 fw-bold text-white">
                  Kas<span className="text-teal">Kos</span>
                </span>
              </div>
              <p className="text-muted small mb-0" style={{ maxWidth: "380px" }}>
                Platform SaaS pengelolaan iuran dan pengeluaran bersama kamar kos & kontrakan mahasiswa di Indonesia.
              </p>
            </div>

            <div className="col-md-7 text-md-end text-muted small">
              <div className="mb-2">
                <span className="badge bg-dark-lt text-light border border-secondary px-3 py-1">
                  Proyek SaaS Mahasiswa • Penilaian GitHub & Kolaborasi Tim
                </span>
              </div>
              <div>
                &copy; {new Date().getFullYear()} KasKos. Dibangun dengan Next.js App Router, Tabler.io, dan Supabase.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
