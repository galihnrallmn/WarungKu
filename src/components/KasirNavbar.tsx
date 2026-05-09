import React from "react";
import { IonIcon } from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import {
  cartOutline,
  cart,
  receiptOutline,
  receipt,
  personOutline,
  person,
} from "ionicons/icons";
import "./KasirNavbar.css";

interface NavItem {
  label: string;
  path: string;
  icon: string;
  iconActive: string;
}

const navItems: NavItem[] = [
  {
    label: "Pesanan",
    path: "/kasir/pesanan",
    icon: cartOutline,
    iconActive: cart,
  },
  {
    label: "Riwayat",
    path: "/kasir/riwayat",
    icon: receiptOutline,
    iconActive: receipt,
  },
  {
    label: "Profil",
    path: "/kasir/profil",
    icon: personOutline,
    iconActive: person,
  },
];

const KasirNavbar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="kasir-navbar">
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

export default KasirNavbar;
