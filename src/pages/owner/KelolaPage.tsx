import React from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
} from "@ionic/react";
import {
  gridOutline,
  fastFoodOutline,
  peopleOutline,
  documentTextOutline,
  chevronForwardOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import OwnerNavbar from "../../components/OwnerNavbar";
import "./KelolaPage.css";

interface MenuItem {
  label: string;
  desc: string;
  icon: string;
  color: string;
  bg: string;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Kelola Kategori",
    desc: "Tambah, edit, hapus kategori menu",
    icon: gridOutline,
    color: "#8b5cf6",
    bg: "#f5f3ff",
    path: "/owner/kategori",
  },
  {
    label: "Kelola Menu",
    desc: "Atur daftar menu dan harga",
    icon: fastFoodOutline,
    color: "#f97316",
    bg: "#fff7ed",
    path: "/owner/menu",
  },
  {
    label: "Kelola Kasir",
    desc: "Tambah dan kelola akun kasir",
    icon: peopleOutline,
    color: "#ec4899",
    bg: "#fdf2f8",
    path: "/owner/users",
  },
  {
    label: "Laporan",
    desc: "Rekap harian & bulanan, export CSV",
    icon: documentTextOutline,
    color: "#10b981",
    bg: "#f0fdf4",
    path: "/owner/laporan",
  },
];

const KelolaPage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="kelola-toolbar">
          <IonTitle>Kelola</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="kelola-content">
        <div className="kelola-list">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className="kelola-item"
              onClick={() => history.push(item.path)}
            >
              <div className="kelola-icon-wrap" style={{ background: item.bg }}>
                <IonIcon icon={item.icon} style={{ color: item.color }} />
              </div>
              <div className="kelola-info">
                <div className="kelola-label">{item.label}</div>
                <div className="kelola-desc">{item.desc}</div>
              </div>
              <IonIcon
                icon={chevronForwardOutline}
                className="kelola-chevron"
              />
            </div>
          ))}
        </div>

        <div style={{ height: 80 }} />
      </IonContent>

      <OwnerNavbar />
    </IonPage>
  );
};

export default KelolaPage;
