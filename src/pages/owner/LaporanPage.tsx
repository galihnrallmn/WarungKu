import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonBackButton,
  IonButtons,
  RefresherEventDetail,
} from "@ionic/react";
import {
  documentTextOutline,
  chevronBackOutline,
  downloadOutline,
  calendarOutline,
  cashOutline,
  receiptOutline,
  trendingUpOutline,
  chevronDownOutline,
  checkmarkCircleOutline,
  warningOutline,
  closeCircleOutline,
  closeOutline,
} from "ionicons/icons";
import { LaporanHarian, LaporanBulanan } from "../../types";
import {
  getLaporanHarian,
  getLaporanBulanan,
  exportCSV,
} from "../../services/transaksi.service";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import "./LaporanPage.css";

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

type ViewMode = "harian" | "bulanan";
type ToastColor = "success" | "warning" | "danger";

/* =========================================
   CUSTOM TOAST — inline
   ========================================= */
interface CustomToastProps {
  show: boolean;
  message: string;
  color?: ToastColor;
  duration?: number;
  onDidDismiss: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({
  show,
  message,
  color = "success",
  duration = 2500,
  onDidDismiss,
}) => {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setAnimating(true);
      const hideTimer = setTimeout(() => setAnimating(false), duration);
      const removeTimer = setTimeout(() => {
        setVisible(false);
        onDidDismiss();
      }, duration + 350);
      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [show]);

  if (!visible) return null;

  const iconMap = {
    success: checkmarkCircleOutline,
    warning: warningOutline,
    danger: closeCircleOutline,
  };
  const labelMap = {
    success: "Berhasil",
    warning: "Perhatian",
    danger: "Gagal",
  };

  const dismiss = () => {
    setAnimating(false);
    setTimeout(() => {
      setVisible(false);
      onDidDismiss();
    }, 350);
  };

  return (
    <div className={`ctoast-wrapper ${animating ? "show" : "hide"}`}>
      <div className={`ctoast ctoast--${color}`}>
        <div className={`ctoast-icon-wrap ctoast-icon-wrap--${color}`}>
          <IonIcon icon={iconMap[color]} />
        </div>
        <div className="ctoast-body">
          <span className="ctoast-label">{labelMap[color]}</span>
          <span className="ctoast-message">{message}</span>
        </div>
        <button className="ctoast-close" onClick={dismiss}>
          <IonIcon icon={closeOutline} />
        </button>
        <div
          className={`ctoast-progress ctoast-progress--${color}`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
};

/* =========================================
   LAPORAN PAGE
   ========================================= */
const LaporanPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("harian");

  const currentMonth = format(new Date(), "yyyy-MM");
  const currentYear = format(new Date(), "yyyy");

  const [selectedBulan, setSelectedBulan] = useState(currentMonth);
  const [selectedTahun, setSelectedTahun] = useState(currentYear);
  const [showTahunDropdown, setShowTahunDropdown] = useState(false);

  const [laporanHarian, setLaporanHarian] = useState<LaporanHarian[]>([]);
  const [laporanBulanan, setLaporanBulanan] = useState<LaporanBulanan[]>([]);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    color: "success" as ToastColor,
  });
  const showToast = (message: string, color: ToastColor = "success") =>
    setToast({ show: true, message, color });

  const loadData = () => {
    setLaporanHarian(getLaporanHarian(selectedBulan));
    setLaporanBulanan(getLaporanBulanan(selectedTahun));
  };

  useEffect(() => {
    loadData();
  }, [selectedBulan, selectedTahun]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadData();
    event.detail.complete();
  };

  const handleExport = async () => {
    if (viewMode === "harian") {
      const data = getLaporanHarian(selectedBulan);
      if (data.length === 0) {
        showToast("Tidak ada data untuk diekspor.", "warning");
        return;
      }
      try {
        await exportCSV(selectedBulan);
        showToast("CSV disimpan di folder Documents.");
      } catch {
        showToast("Gagal mengekspor CSV.", "danger");
      }
    } else {
      const data = getLaporanBulanan(selectedTahun);
      if (data.length === 0) {
        showToast("Tidak ada data untuk diekspor.", "warning");
        return;
      }
      try {
        await exportCSV(selectedTahun);
        showToast("CSV disimpan di folder Documents.");
      } catch {
        showToast("Gagal mengekspor CSV.", "danger");
      }
    }
  };

  const totalHarian = laporanHarian.reduce((s, l) => s + l.total_pemasukan, 0);
  const totalTrxHarian = laporanHarian.reduce(
    (s, l) => s + l.total_transaksi,
    0
  );
  const totalBulanan = laporanBulanan.reduce(
    (s, l) => s + l.total_pemasukan,
    0
  );
  const totalTrxBulanan = laporanBulanan.reduce(
    (s, l) => s + l.total_transaksi,
    0
  );

  const tahunOptions = Array.from({ length: 4 }, (_, i) =>
    String(new Date().getFullYear() - i)
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="laporan-toolbar">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/owner/dashboard"
              icon={chevronBackOutline}
              text=""
            />
          </IonButtons>
          <IonTitle>Laporan</IonTitle>
          <IonButtons slot="end">
            <button className="export-btn" onClick={handleExport}>
              <IonIcon icon={downloadOutline} />
              CSV
            </button>
          </IonButtons>
        </IonToolbar>

        {/* Tab Mode */}
        <div className="laporan-tabs">
          <button
            className={`laporan-tab ${viewMode === "harian" ? "active" : ""}`}
            onClick={() => {
              setViewMode("harian");
              setShowTahunDropdown(false);
            }}
          >
            Rekap Harian
          </button>
          <button
            className={`laporan-tab ${viewMode === "bulanan" ? "active" : ""}`}
            onClick={() => setViewMode("bulanan")}
          >
            Rekap Bulanan
          </button>
        </div>

        {/* Filter */}
        <div className="laporan-filter">
          {viewMode === "harian" ? (
            <div className="filter-input-wrap">
              <IonIcon icon={calendarOutline} className="filter-icon" />
              <input
                type="month"
                value={selectedBulan}
                onChange={(e) => setSelectedBulan(e.target.value)}
                className="filter-input"
              />
            </div>
          ) : (
            /* Custom Dropdown Tahun */
            <div className="tahun-dropdown-wrap">
              <div
                className={`filter-input-wrap clickable ${
                  showTahunDropdown ? "open" : ""
                }`}
                onClick={() => setShowTahunDropdown((v) => !v)}
              >
                <IonIcon icon={calendarOutline} className="filter-icon" />
                <span className="filter-input-value">
                  Tahun {selectedTahun}
                </span>
                <IonIcon
                  icon={chevronDownOutline}
                  className={`filter-chevron ${
                    showTahunDropdown ? "rotated" : ""
                  }`}
                />
              </div>

              {showTahunDropdown && (
                <div className="tahun-custom-dropdown">
                  {tahunOptions.map((t) => (
                    <div
                      key={t}
                      className={`tahun-dropdown-item ${
                        selectedTahun === t ? "is-selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedTahun(t);
                        setShowTahunDropdown(false);
                      }}
                    >
                      Tahun {t}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </IonHeader>

      <IonContent className="laporan-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* ---- REKAP HARIAN ---- */}
        {viewMode === "harian" && (
          <>
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-icon-wrap orange">
                  <IonIcon icon={cashOutline} />
                </div>
                <div className="summary-label">Total Pemasukan</div>
                <div className="summary-value">{formatRupiah(totalHarian)}</div>
              </div>
              <div className="summary-card">
                <div className="summary-icon-wrap purple">
                  <IonIcon icon={receiptOutline} />
                </div>
                <div className="summary-label">Total Transaksi</div>
                <div className="summary-value">{totalTrxHarian}</div>
              </div>
            </div>

            {laporanHarian.length === 0 && (
              <div className="empty-state">
                <IonIcon icon={documentTextOutline} />
                <h3>Tidak ada data</h3>
                <p>Belum ada transaksi pada bulan yang dipilih.</p>
              </div>
            )}

            {laporanHarian.length > 0 && (
              <div className="laporan-list">
                <div className="list-header">
                  <span>Tanggal</span>
                  <span>Transaksi</span>
                  <span>Pemasukan</span>
                </div>
                {laporanHarian.map((item) => (
                  <div key={item.tanggal} className="laporan-item">
                    <div className="laporan-tanggal">
                      <div className="tgl-day">
                        {format(new Date(item.tanggal + "T00:00:00"), "dd")}
                      </div>
                      <div className="tgl-month">
                        {format(new Date(item.tanggal + "T00:00:00"), "MMM", {
                          locale: localeId,
                        })}
                      </div>
                    </div>
                    <div className="laporan-trx">
                      <span className="trx-count">{item.total_transaksi}</span>
                      <span className="trx-label">transaksi</span>
                    </div>
                    <div className="laporan-nominal">
                      {formatRupiah(item.total_pemasukan)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ---- REKAP BULANAN ---- */}
        {viewMode === "bulanan" && (
          <>
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-icon-wrap orange">
                  <IonIcon icon={trendingUpOutline} />
                </div>
                <div className="summary-label">Total Pemasukan</div>
                <div className="summary-value">
                  {formatRupiah(totalBulanan)}
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon-wrap purple">
                  <IonIcon icon={receiptOutline} />
                </div>
                <div className="summary-label">Total Transaksi</div>
                <div className="summary-value">{totalTrxBulanan}</div>
              </div>
            </div>

            {laporanBulanan.length === 0 && (
              <div className="empty-state">
                <IonIcon icon={documentTextOutline} />
                <h3>Tidak ada data</h3>
                <p>Belum ada transaksi pada tahun yang dipilih.</p>
              </div>
            )}

            {laporanBulanan.length > 0 && (
              <div className="laporan-list">
                <div className="list-header">
                  <span>Bulan</span>
                  <span>Transaksi</span>
                  <span>Pemasukan</span>
                </div>
                {laporanBulanan.map((item) => (
                  <div key={item.bulan} className="laporan-item">
                    <div className="laporan-tanggal">
                      <div className="tgl-day">
                        {format(new Date(item.bulan + "-01"), "MMM", {
                          locale: localeId,
                        })}
                      </div>
                      <div className="tgl-month">
                        {format(new Date(item.bulan + "-01"), "yyyy")}
                      </div>
                    </div>
                    <div className="laporan-trx">
                      <span className="trx-count">{item.total_transaksi}</span>
                      <span className="trx-label">transaksi</span>
                    </div>
                    <div className="laporan-nominal">
                      {formatRupiah(item.total_pemasukan)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div style={{ height: 32 }} />
      </IonContent>

      <CustomToast
        show={toast.show}
        message={toast.message}
        color={toast.color}
        duration={2500}
        onDidDismiss={() => setToast({ ...toast, show: false })}
      />
    </IonPage>
  );
};

export default LaporanPage;
