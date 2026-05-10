import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonModal,
  IonToast,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import {
  cartOutline,
  addOutline,
  removeOutline,
  trashOutline,
  closeOutline,
  cashOutline,
  cardOutline,
  fastFoodOutline,
  refreshOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";
import { useAuth } from "../../context/AuthContext";
import { KeranjangItem, Kategori, Menu, STORAGE_KEYS } from "../../types";
import { getData } from "../../services/storage.service";
import { simpanTransaksi } from "../../services/transaksi.service";
import KasirNavbar from "../../components/KasirNavbar";
import "./PesananPage.css";

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const PesananPage: React.FC = () => {
  const { user } = useAuth();

  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [activeKategori, setActiveKategori] = useState<string>("all");
  const [keranjang, setKeranjang] = useState<KeranjangItem[]>([]);

  // Modal bayar
  const [showBayar, setShowBayar] = useState(false);
  const [metodeBayar, setMetodeBayar] = useState<"cash" | "qris">("cash");
  const [uangBayar, setUangBayar] = useState("");

  // Modal sukses
  const [showSukses, setShowSukses] = useState(false);
  const [kodeTransaksi, setKodeTransaksi] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    color: "success",
  });
  const showToast = (message: string, color = "success") =>
    setToast({ show: true, message, color });

  const loadData = () => {
    setKategoriList(getData<Kategori>(STORAGE_KEYS.KATEGORI));
    setMenuList(getData<Menu>(STORAGE_KEYS.MENU));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadData();
    event.detail.complete();
  };

  // ---- Filter Menu ----
  const filteredMenu =
    activeKategori === "all"
      ? menuList
      : menuList.filter((m) => m.kategori_id === activeKategori);

  // ---- Keranjang ----
  const totalItem = keranjang.reduce((s, i) => s + i.qty, 0);
  const totalHarga = keranjang.reduce((s, i) => s + i.subtotal, 0);

  const tambahItem = (menu: Menu) => {
    setKeranjang((prev) => {
      const idx = prev.findIndex((i) => i.menu_id === menu.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          qty: updated[idx].qty + 1,
          subtotal: (updated[idx].qty + 1) * updated[idx].harga,
        };
        return updated;
      }
      return [
        ...prev,
        {
          menu_id: menu.id,
          nama_menu: menu.nama_menu,
          harga: menu.harga,
          qty: 1,
          subtotal: menu.harga,
        },
      ];
    });
  };

  const kurangItem = (menuId: string) => {
    setKeranjang((prev) => {
      const idx = prev.findIndex((i) => i.menu_id === menuId);
      if (idx < 0) return prev;
      if (prev[idx].qty === 1) return prev.filter((i) => i.menu_id !== menuId);
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        qty: updated[idx].qty - 1,
        subtotal: (updated[idx].qty - 1) * updated[idx].harga,
      };
      return updated;
    });
  };

  const hapusItem = (menuId: string) => {
    setKeranjang((prev) => prev.filter((i) => i.menu_id !== menuId));
  };

  const resetKeranjang = () => setKeranjang([]);

  const getQty = (menuId: string) =>
    keranjang.find((i) => i.menu_id === menuId)?.qty || 0;

  // ---- Pembayaran ----
  const kembalian = metodeBayar === "cash" ? Number(uangBayar) - totalHarga : 0;

  const handleBayar = () => {
    if (keranjang.length === 0) {
      showToast("Keranjang masih kosong.", "warning");
      return;
    }
    setMetodeBayar("cash");
    setUangBayar("");
    setShowBayar(true);
  };

  const handleKonfirmasiBayar = () => {
    if (metodeBayar === "cash") {
      if (!uangBayar || Number(uangBayar) < totalHarga) {
        showToast("Uang tidak cukup.", "danger");
        return;
      }
    }

    const trx = simpanTransaksi({
      user_id: user!.id,
      keranjang,
      total: totalHarga,
      metode_pembayaran: metodeBayar,
      bayar: metodeBayar === "cash" ? Number(uangBayar) : totalHarga,
      kembalian: metodeBayar === "cash" ? kembalian : 0,
    });

    setKodeTransaksi(trx.kode_transaksi);
    setShowBayar(false);
    setShowSukses(true);
    resetKeranjang();
  };

  const handleSuksesDismiss = () => {
    setShowSukses(false);
    setKodeTransaksi("");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pesanan-toolbar">
          <IonTitle>Pesanan</IonTitle>
          {keranjang.length > 0 && (
            <div slot="end" className="reset-btn" onClick={resetKeranjang}>
              <IonIcon icon={refreshOutline} />
            </div>
          )}
        </IonToolbar>

        {/* Filter Kategori */}
        <div className="kategori-bar">
          <button
            className={`kat-chip ${activeKategori === "all" ? "active" : ""}`}
            onClick={() => setActiveKategori("all")}
          >
            Semua
          </button>
          {kategoriList.map((k) => (
            <button
              key={k.id}
              className={`kat-chip ${activeKategori === k.id ? "active" : ""}`}
              onClick={() => setActiveKategori(k.id)}
            >
              {k.nama_kategori}
            </button>
          ))}
        </div>
      </IonHeader>

      <IonContent className="pesanan-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Empty menu */}
        {filteredMenu.length === 0 && (
          <div className="empty-state">
            <IonIcon icon={fastFoodOutline} />
            <h3>Belum ada menu</h3>
            <p>Minta owner untuk menambahkan menu terlebih dahulu.</p>
          </div>
        )}

        {/* Grid Menu */}
        {filteredMenu.length > 0 && (
          <div className="menu-grid">
            {filteredMenu.map((menu) => {
              const qty = getQty(menu.id);
              return (
                <div key={menu.id} className="menu-card">
                  <div className="menu-card-icon">
                    <IonIcon icon={fastFoodOutline} />
                  </div>
                  <div className="menu-card-name">{menu.nama_menu}</div>
                  <div className="menu-card-harga">
                    {formatRupiah(menu.harga)}
                  </div>
                  {qty === 0 ? (
                    <button
                      className="menu-card-add"
                      onClick={() => tambahItem(menu)}
                    >
                      <IonIcon icon={addOutline} />
                    </button>
                  ) : (
                    <div className="menu-card-qty">
                      <button
                        className="qty-btn minus"
                        onClick={() => kurangItem(menu.id)}
                      >
                        <IonIcon icon={removeOutline} />
                      </button>
                      <span>{qty}</span>
                      <button
                        className="qty-btn plus"
                        onClick={() => tambahItem(menu)}
                      >
                        <IonIcon icon={addOutline} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ height: keranjang.length > 0 ? 160 : 80 }} />
      </IonContent>

      {/* Tombol Bayar */}
      {keranjang.length > 0 && (
        <div className="bayar-bar">
          <div className="bayar-info">
            <span className="bayar-item-count">{totalItem} item</span>
            <span className="bayar-total">{formatRupiah(totalHarga)}</span>
          </div>
          <button className="bayar-btn" onClick={handleBayar}>
            <IonIcon icon={cartOutline} />
            Bayar
          </button>
        </div>
      )}

      <KasirNavbar />

      {/* ---- MODAL BAYAR ---- */}
      <IonModal
        isOpen={showBayar}
        onDidDismiss={() => setShowBayar(false)}
        breakpoints={[0, 0.85]}
        initialBreakpoint={0.85}
      >
        <IonContent className="bayar-modal-content">
          <div className="modal-handle" />
          <div className="bayar-modal-body">
            <div className="modal-header">
              <h3>Pembayaran</h3>
              <button
                className="modal-close"
                onClick={() => setShowBayar(false)}
              >
                <IonIcon icon={closeOutline} />
              </button>
            </div>

            {/* Detail Pesanan */}
            <div className="bayar-items">
              {keranjang.map((item) => (
                <div key={item.menu_id} className="bayar-item-row">
                  <div className="bayar-item-info">
                    <span className="bayar-item-nama">{item.nama_menu}</span>
                    <span className="bayar-item-qty">
                      {item.qty}x {formatRupiah(item.harga)}
                    </span>
                  </div>
                  <div className="bayar-item-actions">
                    <span className="bayar-item-subtotal">
                      {formatRupiah(item.subtotal)}
                    </span>
                    <button
                      className="hapus-item-btn"
                      onClick={() => hapusItem(item.menu_id)}
                    >
                      <IonIcon icon={trashOutline} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bayar-total-row">
              <span>Total</span>
              <span className="bayar-total-val">
                {formatRupiah(totalHarga)}
              </span>
            </div>

            {/* Metode Bayar */}
            <div className="metode-label">Metode Pembayaran</div>
            <div className="metode-grid">
              <button
                className={`metode-btn ${
                  metodeBayar === "cash" ? "active" : ""
                }`}
                onClick={() => setMetodeBayar("cash")}
              >
                <IonIcon icon={cashOutline} />
                Cash
              </button>
              <button
                className={`metode-btn ${
                  metodeBayar === "qris" ? "active" : ""
                }`}
                onClick={() => setMetodeBayar("qris")}
              >
                <IonIcon icon={cardOutline} />
                QRIS
              </button>
            </div>

            {/* Input Cash */}
            {metodeBayar === "cash" && (
              <div className="cash-section">
                <label className="modal-label">Uang Diterima (Rp)</label>
                <div className="modal-input-wrap">
                  <input
                    type="number"
                    value={uangBayar}
                    onChange={(e) => setUangBayar(e.target.value)}
                    placeholder="contoh: 50000"
                    className="modal-input-native"
                    inputMode="numeric"
                    autoFocus
                  />
                </div>
                {Number(uangBayar) >= totalHarga && (
                  <div className="kembalian-wrap">
                    <span>Kembalian</span>
                    <span className="kembalian-val">
                      {formatRupiah(Number(uangBayar) - totalHarga)}
                    </span>
                  </div>
                )}
                {Number(uangBayar) > 0 && Number(uangBayar) < totalHarga && (
                  <div className="kurang-wrap">
                    Uang kurang {formatRupiah(totalHarga - Number(uangBayar))}
                  </div>
                )}
              </div>
            )}

            {/* QRIS Info */}
            {metodeBayar === "qris" && (
              <div className="qris-section">
                <IonIcon icon={cardOutline} />
                <p>Konfirmasi setelah pelanggan melakukan pembayaran QRIS.</p>
              </div>
            )}

            <button
              className="konfirmasi-btn"
              onClick={handleKonfirmasiBayar}
              disabled={
                metodeBayar === "cash" &&
                (!uangBayar || Number(uangBayar) < totalHarga)
              }
            >
              <IonIcon icon={checkmarkCircleOutline} />
              {metodeBayar === "cash"
                ? "Konfirmasi Bayar"
                : "Pembayaran Berhasil"}
            </button>
          </div>
        </IonContent>
      </IonModal>

      {/* ---- MODAL SUKSES ---- */}
      <IonModal
        isOpen={showSukses}
        onDidDismiss={handleSuksesDismiss}
        breakpoints={[0, 0.45]}
        initialBreakpoint={0.45}
      >
        <IonContent className="sukses-modal-content">
          <div className="sukses-body">
            <div className="sukses-icon">
              <IonIcon icon={checkmarkCircleOutline} />
            </div>
            <h3 className="sukses-title">Transaksi Berhasil!</h3>
            <p className="sukses-kode">{kodeTransaksi}</p>
            <p className="sukses-sub">Transaksi berhasil disimpan.</p>
            <button className="sukses-btn" onClick={handleSuksesDismiss}>
              Selesai
            </button>
          </div>
        </IonContent>
      </IonModal>

      <IonToast
        isOpen={toast.show}
        message={toast.message}
        duration={2000}
        color={toast.color as any}
        position="top"
        onDidDismiss={() => setToast({ ...toast, show: false })}
      />
    </IonPage>
  );
};

export default PesananPage;
