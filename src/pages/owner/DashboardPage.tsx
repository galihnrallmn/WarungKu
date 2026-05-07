import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButton,
  IonAlert,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import {
  storefrontOutline,
  cashOutline,
  receiptOutline,
  trendingUpOutline,
  gridOutline,
  fastFoodOutline,
  peopleOutline,
  documentTextOutline,
  logOutOutline,
  settingsOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardData } from "../../services/transaksi.service";
import { getSingle } from "../../services/storage.service";
import { DashboardData, ProfilToko, STORAGE_KEYS } from "../../types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import "./DashboardPage.css";

const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const DashboardPage: React.FC = () => {
  const { user, doLogout } = useAuth();
  const history = useHistory();

  const [data, setData] = useState<DashboardData>({
    omzet_hari_ini: 0,
    omzet_bulan_ini: 0,
    transaksi_hari_ini: 0,
    transaksi_bulan_ini: 0,
    menu_terlaris: [],
  });
  const [profil, setProfil] = useState<ProfilToko | null>(null);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

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

  const handleLogout = () => {
    doLogout();
    history.replace("/login");
  };

  const today = format(new Date(), "EEEE, dd MMMM yyyy", { locale: localeId });

  const menuItems = [
    {
      label: "Kategori",
      icon: gridOutline,
      path: "/owner/kategori",
      color: "#8b5cf6",
    },
    {
      label: "Menu",
      icon: fastFoodOutline,
      path: "/owner/menu",
      color: "#f97316",
    },
    {
      label: "Transaksi",
      icon: receiptOutline,
      path: "/owner/transaksi",
      color: "#06b6d4",
    },
    {
      label: "Laporan",
      icon: documentTextOutline,
      path: "/owner/laporan",
      color: "#10b981",
    },
    {
      label: "Profil Toko",
      icon: settingsOutline,
      path: "/owner/profil-toko",
      color: "#f59e0b",
    },
    {
      label: "Kelola Kasir",
      icon: peopleOutline,
      path: "/owner/users",
      color: "#ec4899",
    },
  ];

  return (
    <IonPage>
      <IonHeader className="dashboard-header" collapse="fade">
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
            <IonButton
              fill="clear"
              className="logout-btn"
              onClick={() => setShowLogoutAlert(true)}
            >
              <IonIcon icon={logOutOutline} slot="icon-only" />
            </IonButton>
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
          <h2 className="greeting-text">Selamat datang, {user?.name}! 👋</h2>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div
              className="stat-icon-wrap"
              style={{ background: "rgba(249,115,22,0.15)" }}
            >
              <IonIcon icon={cashOutline} style={{ color: "#f97316" }} />
            </div>
            <div className="stat-label">Omzet Hari Ini</div>
            <div className="stat-value">
              {formatRupiah(data.omzet_hari_ini)}
            </div>
            <div className="stat-sub">{data.transaksi_hari_ini} transaksi</div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon-wrap"
              style={{ background: "rgba(99,102,241,0.12)" }}
            >
              <IonIcon icon={trendingUpOutline} style={{ color: "#6366f1" }} />
            </div>
            <div className="stat-label">Omzet Bulan Ini</div>
            <div className="stat-value">
              {formatRupiah(data.omzet_bulan_ini)}
            </div>
            <div className="stat-sub">{data.transaksi_bulan_ini} transaksi</div>
          </div>
        </div>

        {/* Menu Navigasi */}
        <div className="section-title">Menu</div>
        <div className="nav-grid">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className="nav-card"
              onClick={() => history.push(item.path)}
            >
              <div
                className="nav-icon-wrap"
                style={{ background: item.color + "18" }}
              >
                <IonIcon icon={item.icon} style={{ color: item.color }} />
              </div>
              <div className="nav-label">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Menu Terlaris */}
        {data.menu_terlaris.length > 0 && (
          <>
            <div className="section-title">Menu Terlaris</div>
            <div className="terlaris-list">
              {data.menu_terlaris.map((item, idx) => (
                <div key={item.menu_id} className="terlaris-item">
                  <div className="terlaris-rank">{idx + 1}</div>
                  <div className="terlaris-name">{item.nama_menu}</div>
                  <div className="terlaris-qty">
                    {item.total_terjual} terjual
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty state menu terlaris */}
        {data.menu_terlaris.length === 0 && (
          <div className="empty-terlaris">
            <IonIcon icon={fastFoodOutline} />
            <p>
              Belum ada transaksi.
              <br />
              Mulai berjualan untuk melihat menu terlaris.
            </p>
          </div>
        )}

        <div style={{ height: 32 }} />
      </IonContent>

      <IonAlert
        isOpen={showLogoutAlert}
        header="Keluar"
        message="Yakin ingin keluar dari aplikasi?"
        buttons={[
          { text: "Batal", role: "cancel" },
          { text: "Keluar", role: "destructive", handler: handleLogout },
        ]}
        onDidDismiss={() => setShowLogoutAlert(false)}
      />
    </IonPage>
  );
};

export default DashboardPage;
