import React, { useState, useEffect } from "react";
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
  IonBackButton,
  IonButtons,
  RefresherEventDetail,
} from "@ionic/react";
import {
  receiptOutline,
  chevronBackOutline,
  closeOutline,
  searchOutline,
  calendarOutline,
  cardOutline,
  cashOutline,
  chevronDownOutline,
  timeOutline,
  personOutline,
} from "ionicons/icons";
import { TransaksiWithDetail } from "../../types";
import { getAllWithDetail } from "../../services/transaksi.service";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import "./TransaksiPage.css";

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

type FilterMetode = "all" | "cash" | "qris";

const metodeOptions: { value: FilterMetode; label: string }[] = [
  { value: "all", label: "Semua Metode" },
  { value: "cash", label: "Cash" },
  { value: "qris", label: "QRIS" },
];

const TransaksiPage: React.FC = () => {
  const [list, setList] = useState<TransaksiWithDetail[]>([]);
  const [filtered, setFiltered] = useState<TransaksiWithDetail[]>([]);

  const [search, setSearch] = useState("");
  const [filterMetode, setFilterMetode] = useState<FilterMetode>("all");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [showMetodeDropdown, setShowMetodeDropdown] = useState(false);

  const [selected, setSelected] = useState<TransaksiWithDetail | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const loadData = () => {
    const data = getAllWithDetail().sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );
    setList(data);
    applyFilter(data, search, filterMetode, filterTanggal);
  };

  const applyFilter = (
    data: TransaksiWithDetail[],
    q: string,
    metode: string,
    tanggal: string
  ) => {
    let result = [...data];
    if (q.trim()) {
      result = result.filter((t) =>
        t.kode_transaksi.toLowerCase().includes(q.toLowerCase())
      );
    }
    if (metode !== "all") {
      result = result.filter((t) => t.metode_pembayaran === metode);
    }
    if (tanggal) {
      result = result.filter((t) => t.tanggal.startsWith(tanggal));
    }
    setFiltered(result);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilter(list, search, filterMetode, filterTanggal);
  }, [search, filterMetode, filterTanggal]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadData();
    event.detail.complete();
  };

  const openDetail = (item: TransaksiWithDetail) => {
    setSelected(item);
    setShowDetail(true);
  };

  const totalFiltered = filtered.reduce((sum, t) => sum + t.total, 0);

  const selectedMetodeLabel =
    metodeOptions.find((o) => o.value === filterMetode)?.label ??
    "Semua Metode";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="trx-toolbar">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/owner/dashboard"
              icon={chevronBackOutline}
              text=""
            />
          </IonButtons>
          <IonTitle>Riwayat Transaksi</IonTitle>
        </IonToolbar>

        {/* Search & Filter */}
        <div className="trx-filter-area">
          {/* Search */}
          <div className="search-wrap">
            <IonIcon icon={searchOutline} className="search-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode transaksi..."
              className="search-input"
            />
          </div>

          <div className="filter-row">
            {/* Filter Metode — Custom Dropdown */}
            <div className="filter-dropdown-wrap">
              <div
                className={`filter-select-wrap ${
                  showMetodeDropdown ? "open" : ""
                }`}
                onClick={() => setShowMetodeDropdown((v) => !v)}
              >
                <IonIcon icon={cardOutline} className="filter-icon" />
                <span className="filter-select-value">
                  {selectedMetodeLabel}
                </span>
                <IonIcon
                  icon={chevronDownOutline}
                  className={`select-chevron ${
                    showMetodeDropdown ? "rotated" : ""
                  }`}
                />
              </div>

              {showMetodeDropdown && (
                <div className="filter-custom-dropdown">
                  {metodeOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className={`filter-dropdown-item ${
                        filterMetode === opt.value ? "is-selected" : ""
                      }`}
                      onClick={() => {
                        setFilterMetode(opt.value);
                        setShowMetodeDropdown(false);
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Tanggal */}
            <div className="filter-select-wrap date-wrap">
              <IonIcon icon={calendarOutline} className="filter-icon" />
              <input
                type="date"
                value={filterTanggal}
                onChange={(e) => setFilterTanggal(e.target.value)}
                className="filter-date-input"
              />
            </div>
          </div>
        </div>
      </IonHeader>

      <IonContent className="trx-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Summary */}
        {filtered.length > 0 && (
          <div className="trx-summary">
            <div className="summary-item">
              <span className="summary-label">Total Transaksi</span>
              <span className="summary-value">{filtered.length}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-item">
              <span className="summary-label">Total Pemasukan</span>
              <span className="summary-value primary">
                {formatRupiah(totalFiltered)}
              </span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="empty-state">
            <IonIcon icon={receiptOutline} />
            <h3>Tidak ada transaksi</h3>
            <p>
              {list.length === 0
                ? "Belum ada transaksi yang tersimpan."
                : "Tidak ada transaksi yang sesuai filter."}
            </p>
            {(search || filterMetode !== "all" || filterTanggal) && (
              <button
                className="reset-filter-btn"
                onClick={() => {
                  setSearch("");
                  setFilterMetode("all");
                  setFilterTanggal("");
                }}
              >
                Reset Filter
              </button>
            )}
          </div>
        )}

        {/* List */}
        {filtered.length > 0 && (
          <div className="trx-list">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="trx-item"
                onClick={() => openDetail(item)}
              >
                <div className="trx-item-left">
                  <div className={`trx-metode-icon ${item.metode_pembayaran}`}>
                    <IonIcon
                      icon={
                        item.metode_pembayaran === "cash"
                          ? cashOutline
                          : cardOutline
                      }
                    />
                  </div>
                  <div className="trx-info">
                    <div className="trx-kode">{item.kode_transaksi}</div>
                    <div className="trx-meta">
                      <IonIcon icon={timeOutline} />
                      {format(parseISO(item.tanggal), "dd MMM yyyy, HH:mm", {
                        locale: localeId,
                      })}
                    </div>
                    <div className="trx-meta">
                      <IonIcon icon={personOutline} />
                      {item.nama_kasir}
                    </div>
                  </div>
                </div>
                <div className="trx-item-right">
                  <div className="trx-total">{formatRupiah(item.total)}</div>
                  <div className={`trx-badge ${item.metode_pembayaran}`}>
                    {item.metode_pembayaran.toUpperCase()}
                  </div>
                  <div className="trx-item-count">
                    {item.detail.length} item
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 24 }} />
      </IonContent>

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

              <div className="detail-info-row">
                <div className="detail-info-item">
                  <span className="detail-info-label">Kasir</span>
                  <span className="detail-info-val">{selected.nama_kasir}</span>
                </div>
                <div className="detail-info-item">
                  <span className="detail-info-label">Metode</span>
                  <span className={`trx-badge ${selected.metode_pembayaran}`}>
                    {selected.metode_pembayaran.toUpperCase()}
                  </span>
                </div>
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
            </div>
          )}
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default TransaksiPage;
