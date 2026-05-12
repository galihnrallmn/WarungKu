import React from "react";
import { IonIcon } from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import {
  homeOutline,
  home,
  receiptOutline,
  receipt,
  gridOutline,
  grid,
  settingsOutline,
  settings,
} from "ionicons/icons";
import "./OwnerNavbar.css";

const navItems = [
  {
    label: "Home",
    path: "/owner/dashboard",
    icon: homeOutline,
    iconActive: home,
  },
  {
    label: "Histori",
    path: "/owner/transaksi",
    icon: receiptOutline,
    iconActive: receipt,
  },
  {
    label: "Kelola",
    path: "/owner/kelola",
    icon: gridOutline,
    iconActive: grid,
  },
  {
    label: "Setting",
    path: "/owner/profil-toko",
    icon: settingsOutline,
    iconActive: settings,
  },
];

const OwnerNavbar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/owner/kelola") {
      return [
        "/owner/kelola",
        "/owner/kategori",
        "/owner/menu",
        "/owner/users",
        "/owner/laporan",
      ].includes(location.pathname);
    }
    return location.pathname === path;
  };

  return (
    <div className="owner-navbar">
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <button
            key={item.path}
            className={`navbar-item ${active ? "active" : ""}`}
            onClick={() => history.push(item.path)}
          >
            <div className={`navbar-icon-wrap ${active ? "active" : ""}`}>
              <IonIcon icon={active ? item.iconActive : item.icon} />
            </div>
            <span className="navbar-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default OwnerNavbar;
