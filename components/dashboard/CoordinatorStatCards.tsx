import { GroupFinancialStats } from "@/app/actions/expense";
import { formatRupiah } from "@/lib/utils";
import { IconWallet, IconClock, IconUsers, IconCheck, IconAlertCircle } from "@tabler/icons-react";

interface CoordinatorStatCardsProps {
  stats: GroupFinancialStats;
}

export default function CoordinatorStatCards({ stats }: CoordinatorStatCardsProps) {
  return (
    <div className="row row-cards mb-4">
      {/* Stat Card 1: Total Kas Terkumpul */}
      <div className="col-sm-6 col-lg-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-status-top bg-green"></div>
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar avatar-md bg-green text-white rounded-circle">
                  <IconWallet size={24} />
                </span>
              </div>
              <div className="col">
                <div className="text-secondary small fw-medium">Total Kas Terkumpul</div>
                <div className="fs-2 fw-bold text-dark mt-1">
                  {formatRupiah(stats.totalCollected)}
                </div>
              </div>
            </div>
            <div className="mt-3 d-flex align-items-center gap-1 text-teal small">
              <IconCheck size={16} />
              <span>Dana iuran yang telah terverifikasi lunas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Card 2: Sisa Tunggakan */}
      <div className="col-sm-6 col-lg-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-status-top bg-yellow"></div>
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar avatar-md bg-yellow text-white rounded-circle">
                  <IconClock size={24} />
                </span>
              </div>
              <div className="col">
                <div className="text-secondary small fw-medium">Sisa Tunggakan</div>
                <div className="fs-2 fw-bold text-dark mt-1">
                  {formatRupiah(stats.totalPending)}
                </div>
              </div>
            </div>
            <div className="mt-3 d-flex align-items-center gap-1 text-warning small">
              <IconAlertCircle size={16} />
              <span>Belum lunas / menunggu verifikasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Card 3: Jumlah Anggota Aktif */}
      <div className="col-sm-6 col-lg-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-status-top bg-blue"></div>
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar avatar-md bg-blue text-white rounded-circle">
                  <IconUsers size={24} />
                </span>
              </div>
              <div className="col">
                <div className="text-secondary small fw-medium">Jumlah Anggota Aktif</div>
                <div className="fs-2 fw-bold text-dark mt-1">
                  {stats.activeMembersCount} <span className="fs-4 fw-normal text-secondary">Orang</span>
                </div>
              </div>
            </div>
            <div className="mt-3 text-secondary small">
              Penghuni terdaftar di kamar kos ini
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
