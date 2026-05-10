import React, { useState, useEffect, useRef } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonModal,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  RefresherEventDetail,
} from "@ionic/react";
import {
  receiptOutline,
  closeOutline,
  cashOutline,
  cardOutline,
  timeOutline,
  documentTextOutline,
  downloadOutline,
  checkmarkCircleOutline,
  warningOutline,
  closeCircleOutline,
} from "ionicons/icons";
import { useAuth } from "../../context/AuthContext";
import { TransaksiWithDetail, ProfilToko } from "../../types";
import {
  getAllWithDetail,
  updateStrukUrl,
} from "../../services/transaksi.service";
import { getSingle } from "../../services/storage.service";
import { STORAGE_KEYS } from "../../types";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import KasirNavbar from "../../components/KasirNavbar";
import "./RiwayatKasirPage.css";

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

/* =========================================
   CUSTOM TOAST — inline
   ========================================= */
type ToastColor = "success" | "warning" | "danger";

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
   STRUK COMPONENT
   ========================================= */
interface StrukProps {
  transaksi: TransaksiWithDetail;
  profil: ProfilToko | null;
}

const StrukContent: React.FC<StrukProps> = ({ transaksi, profil }) => {
  return (
    <div className="struk-paper">
      {/* Header Toko */}
      <div className="struk-header">
        <div className="struk-toko-nama">{profil?.nama_toko || "WarungKu"}</div>
        {profil?.alamat && (
          <div className="struk-toko-info">{profil.alamat}</div>
        )}
        {profil?.no_hp && (
          <div className="struk-toko-info">Telp: {profil.no_hp}</div>
        )}
      </div>

      {/* Divider */}
      <div className="struk-divider dashed" />

      {/* Info Transaksi */}
      <div className="struk-info-row">
        <span className="struk-info-label">No. Transaksi</span>
        <span className="struk-info-val">{transaksi.kode_transaksi}</span>
      </div>
      <div className="struk-info-row">
        <span className="struk-info-label">Tanggal</span>
        <span className="struk-info-val">
          {format(parseISO(transaksi.tanggal), "dd/MM/yyyy HH:mm", {
            locale: localeId,
          })}
        </span>
      </div>
      <div className="struk-info-row">
        <span className="struk-info-label">Kasir</span>
        <span className="struk-info-val">{transaksi.nama_kasir}</span>
      </div>

      {/* Divider */}
      <div className="struk-divider dashed" />

      {/* Item List */}
      <div className="struk-items">
        {transaksi.detail.map((d) => (
          <div key={d.id} className="struk-item">
            <div className="struk-item-name">{d.nama_menu}</div>
            <div className="struk-item-calc">
              <span className="struk-item-qty">
                {d.qty} x {formatRupiah(d.harga)}
              </span>
              <span className="struk-item-subtotal">
                {formatRupiah(d.subtotal)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="struk-divider dashed" />

      {/* Total */}
      <div className="struk-total-section">
        <div className="struk-total-row">
          <span>Total</span>
          <span className="struk-total-val">
            {formatRupiah(transaksi.total)}
          </span>
        </div>
        <div className="struk-total-row">
          <span>Metode</span>
          <span className="struk-metode-badge">
            {transaksi.metode_pembayaran.toUpperCase()}
          </span>
        </div>
        <div className="struk-total-row">
          <span>Bayar</span>
          <span>{formatRupiah(transaksi.bayar)}</span>
        </div>
        <div className="struk-total-row">
          <span>Kembalian</span>
          <span className="struk-kembalian">
            {formatRupiah(transaksi.kembalian)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="struk-divider dashed" />

      {/* Footer */}
      <div className="struk-footer">
        <p>Terima kasih telah berbelanja!</p>
        <p>Simpan struk ini sebagai bukti pembelian.</p>
      </div>

      {/* Dekorasi bawah */}
      <div className="struk-zigzag" />
    </div>
  );
};

/* =========================================
   RIWAYAT KASIR PAGE
   ========================================= */
const RiwayatKasirPage: React.FC = () => {
  const { user } = useAuth();
  const [list, setList] = useState<TransaksiWithDetail[]>([]);
  const [selected, setSelected] = useState<TransaksiWithDetail | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showStruk, setShowStruk] = useState(false);
  const [profil, setProfil] = useState<ProfilToko | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const strukRef = useRef<HTMLDivElement>(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    color: "success" as ToastColor,
  });
  const showToast = (message: string, color: ToastColor = "success") =>
    setToast({ show: true, message, color });

  const loadData = () => {
    const all = getAllWithDetail()
      .filter((t) => t.user_id === user?.id)
      .sort(
        (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
      );
    setList(all);
    setProfil(getSingle<ProfilToko>(STORAGE_KEYS.PROFIL_TOKO));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadData();
    event.detail.complete();
  };

  const openDetail = (item: TransaksiWithDetail) => {
    setSelected(item);
    setShowDetail(true);
  };

  const openStruk = () => {
    setShowDetail(false);
    setTimeout(() => setShowStruk(true), 300);
  };

  const handleDownloadStruk = async () => {
    if (!strukRef.current || !selected) return;
    setIsDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(strukRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const url = canvas.toDataURL("image/png");

      // Download
      const a = document.createElement("a");
      a.href = url;
      a.download = `struk-${selected.kode_transaksi}.png`;
      a.click();

      // Simpan struk_url ke transaksi jika belum ada
      if (!selected.struk_url) {
        updateStrukUrl(selected.id, url);
      }

      showToast("Struk berhasil diunduh.");
    } catch (err) {
      showToast("Gagal mengunduh struk.", "danger");
    } finally {
      setIsDownloading(false);
    }
  };

  const totalHari = list
    .filter((t) => t.tanggal.startsWith(new Date().toISOString().slice(0, 10)))
    .reduce((s, t) => s + t.total, 0);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="riwayat-toolbar">
          <IonTitle>Riwayat Saya</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="riwayat-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Summary */}
        {list.length > 0 && (
          <div className="riwayat-summary">
            <div className="rs-item">
              <div className="rs-label">Total Transaksi</div>
              <div className="rs-val">{list.length}</div>
            </div>
            <div className="rs-divider" />
            <div className="rs-item">
              <div className="rs-label">Omzet Hari Ini</div>
              <div className="rs-val primary">{formatRupiah(totalHari)}</div>
            </div>
          </div>
        )}

        {/* Empty */}
        {list.length === 0 && (
          <div className="empty-state">
            <IonIcon icon={receiptOutline} />
            <h3>Belum ada transaksi</h3>
            <p>Transaksi yang Anda proses akan muncul di sini.</p>
          </div>
        )}

        {/* List */}
        {list.length > 0 && (
          <div className="riwayat-list">
            {list.map((item) => (
              <div
                key={item.id}
                className="riwayat-item"
                onClick={() => openDetail(item)}
              >
                <div
                  className={`riwayat-metode-icon ${item.metode_pembayaran}`}
                >
                  <IonIcon
                    icon={
                      item.metode_pembayaran === "cash"
                        ? cashOutline
                        : cardOutline
                    }
                  />
                </div>
                <div className="riwayat-info">
                  <div className="riwayat-kode">{item.kode_transaksi}</div>
                  <div className="riwayat-meta">
                    <IonIcon icon={timeOutline} />
                    {format(parseISO(item.tanggal), "dd MMM yyyy, HH:mm", {
                      locale: localeId,
                    })}
                  </div>
                  <div className="riwayat-items-count">
                    {item.detail.length} item
                  </div>
                </div>
                <div className="riwayat-right">
                  <div className="riwayat-total">
                    {formatRupiah(item.total)}
                  </div>
                  <div className={`riwayat-badge ${item.metode_pembayaran}`}>
                    {item.metode_pembayaran.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 80 }} />
      </IonContent>

      <KasirNavbar />

      {/* ---- MODAL DETAIL ---- */}
      <IonModal
        isOpen={showDetail}
        onDidDismiss={() => setShowDetail(false)}
        breakpoints={[0, 0.85]}
        initialBreakpoint={0.85}
      >
        <IonContent className="detail-modal-content">
          <div className="modal-handle" />
          {selected && (
            <div className="detail-body">
              <div className="detail-header">
                <div>
                  <div className="detail-kode">{selected.kode_transaksi}</div>
                  <div className="detail-tanggal">
                    {format(
                      parseISO(selected.tanggal),
                      "EEEE, dd MMMM yyyy • HH:mm",
                      { locale: localeId }
                    )}
                  </div>
                </div>
                <button
                  className="modal-close"
                  onClick={() => setShowDetail(false)}
                >
                  <IonIcon icon={closeOutline} />
                </button>
              </div>

              <div className="detail-section-title">Detail Pesanan</div>
              <div className="detail-items">
                {selected.detail.map((d) => (
                  <div key={d.id} className="detail-item-row">
                    <div className="detail-item-name">{d.nama_menu}</div>
                    <div className="detail-item-right">
                      <span className="detail-item-qty">{d.qty}x</span>
                      <span className="detail-item-price">
                        {formatRupiah(d.subtotal)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="detail-total-wrap">
                <div className="detail-total-row">
                  <span>Total</span>
                  <span className="detail-total-val">
                    {formatRupiah(selected.total)}
                  </span>
                </div>
                <div className="detail-total-row">
                  <span>Metode</span>
                  <span
                    className={`riwayat-badge ${selected.metode_pembayaran}`}
                  >
                    {selected.metode_pembayaran.toUpperCase()}
                  </span>
                </div>
                <div className="detail-total-row">
                  <span>Bayar</span>
                  <span>{formatRupiah(selected.bayar)}</span>
                </div>
                <div className="detail-total-row">
                  <span>Kembalian</span>
                  <span className="detail-kembalian">
                    {formatRupiah(selected.kembalian)}
                  </span>
                </div>
              </div>

              {/* Tombol Lihat Struk */}
              <button className="lihat-struk-btn" onClick={openStruk}>
                <IonIcon icon={documentTextOutline} />
                Lihat Struk
              </button>
            </div>
          )}
        </IonContent>
      </IonModal>

      {/* ---- MODAL STRUK ---- */}
      <IonModal
        isOpen={showStruk}
        onDidDismiss={() => setShowStruk(false)}
        breakpoints={[0, 0.95]}
        initialBreakpoint={0.95}
      >
        <IonContent className="struk-modal-content">
          <div className="modal-handle" />
          <div className="struk-modal-body">
            {/* Header Modal */}
            <div className="struk-modal-header">
              <h3>Pratinjau Struk</h3>
              <button
                className="modal-close"
                onClick={() => setShowStruk(false)}
              >
                <IonIcon icon={closeOutline} />
              </button>
            </div>

            {/* Pratinjau Struk */}
            {selected && (
              <div className="struk-preview-wrap">
                <div ref={strukRef}>
                  <StrukContent transaksi={selected} profil={profil} />
                </div>
              </div>
            )}

            {/* Tombol Download */}
            <button
              className="download-struk-btn"
              onClick={handleDownloadStruk}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <IonSpinner name="crescent" />
              ) : (
                <>
                  <IonIcon icon={downloadOutline} />
                  Download PNG
                </>
              )}
            </button>
          </div>
        </IonContent>
      </IonModal>

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

export default RiwayatKasirPage;
