import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import {
  storefrontOutline,
  cashOutline,
  receiptOutline,
  trendingUpOutline,
  fastFoodOutline,
} from "ionicons/icons";
import { useAuth } from "../../context/AuthContext";
import { getDashboardData } from "../../services/transaksi.service";
import { getSingle } from "../../services/storage.service";
import { DashboardData, ProfilToko, STORAGE_KEYS } from "../../types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import OwnerNavbar from "../../components/OwnerNavbar";
import "./DashboardPage.css";

const formatRupiah = (amount: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [data, setData] = useState<DashboardData>({
    omzet_hari_ini: 0,
    omzet_bulan_ini: 0,
    transaksi_hari_ini: 0,
    transaksi_bulan_ini: 0,
    menu_terlaris: [],
  });
  const [profil, setProfil] = useState<ProfilToko | null>(null);

  const loadData = () => {
    setData(getDashboardData());
    setProfil(getSingle<ProfilToko>(STORAGE_KEYS.PROFIL_TOKO));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadData();
    event.detail.complete();
  };

  const today = format(new Date(), "EEEE, dd MMMM yyyy", { locale: localeId });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="dashboard-toolbar">
          <div className="dashboard-topbar">
            <div className="dashboard-brand">
              <div className="brand-icon">
                <IonIcon icon={storefrontOutline} />
              </div>
              <div>
                <div className="brand-name">
                  {profil?.nama_toko || "WarungKu"}
                </div>
                <div className="brand-role">Owner</div>
              </div>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="dashboard-content" fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Greeting */}
        <div className="dashboard-greeting">
          <p className="greeting-date">{today}</p>
          <h2 className="greeting-text">Halo, {user?.name}! 👋</h2>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrap orange">
              <IonIcon icon={cashOutline} />
            </div>
            <div className="stat-label">Omzet Hari Ini</div>
            <div className="stat-value">
              {formatRupiah(data.omzet_hari_ini)}
            </div>
            <div className="stat-sub">{data.transaksi_hari_ini} transaksi</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap purple">
              <IonIcon icon={trendingUpOutline} />
            </div>
            <div className="stat-label">Omzet Bulan Ini</div>
            <div className="stat-value">
              {formatRupiah(data.omzet_bulan_ini)}
            </div>
            <div className="stat-sub">{data.transaksi_bulan_ini} transaksi</div>
          </div>
        </div>

        {/* Ringkasan */}
        <div className="section-title">Ringkasan Hari Ini</div>
        <div className="summary-row">
          <div className="summary-card">
            <IonIcon icon={receiptOutline} className="summary-icon orange" />
            <div className="summary-val">{data.transaksi_hari_ini}</div>
            <div className="summary-lbl">Transaksi</div>
          </div>
          <div className="summary-card">
            <IonIcon icon={trendingUpOutline} className="summary-icon green" />
            <div className="summary-val">
              {formatRupiah(data.omzet_hari_ini)}
            </div>
            <div className="summary-lbl">Pemasukan</div>
          </div>
        </div>

        {/* Menu Terlaris */}
        <div className="section-title">Menu Terlaris</div>
        {data.menu_terlaris.length === 0 ? (
          <div className="empty-terlaris">
            <IonIcon icon={fastFoodOutline} />
            <p>Belum ada transaksi hari ini.</p>
          </div>
        ) : (
          <div className="terlaris-list">
            {data.menu_terlaris.map((item, idx) => (
              <div key={item.menu_id} className="terlaris-item">
                <div className={`terlaris-rank ${idx === 0 ? "first" : ""}`}>
                  {idx + 1}
                </div>
                <div className="terlaris-name">{item.nama_menu}</div>
                <div className="terlaris-qty">{item.total_terjual} terjual</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 80 }} />
      </IonContent>

      <OwnerNavbar />
    </IonPage>
  );
};

export default DashboardPage;
