import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonToast,
  IonRefresher,
  IonRefresherContent,
  IonButtons,
  IonAlert,
  IonSpinner,
  RefresherEventDetail,
} from "@ionic/react";
import {
  storefrontOutline,
  locationOutline,
  callOutline,
  checkmarkOutline,
  createOutline,
  logOutOutline,
  shieldOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ProfilToko, STORAGE_KEYS } from "../../types";
import {
  getSingle,
  setSingle,
  nowISO,
  generateId,
} from "../../services/storage.service";
import OwnerNavbar from "../../components/OwnerNavbar";
import "./ProfilTokoPage.css";
import CustomToast from "../../components/CustomToast";

const ProfilTokoPage: React.FC = () => {
  const { doLogout } = useAuth();
  const history = useHistory();

  const [profil, setProfil] = useState<ProfilToko | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const [formNama, setFormNama] = useState("");
  const [formAlamat, setFormAlamat] = useState("");
  const [formNoHp, setFormNoHp] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    color: "success",
  });
  const showToast = (message: string, color = "success") =>
    setToast({ show: true, message, color });

  const loadData = () => {
    const data = getSingle<ProfilToko>(STORAGE_KEYS.PROFIL_TOKO);
    setProfil(data);
    if (data) {
      setFormNama(data.nama_toko);
      setFormAlamat(data.alamat);
      setFormNoHp(data.no_hp);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadData();
    event.detail.complete();
  };

  const handleCancel = () => {
    if (profil) {
      setFormNama(profil.nama_toko);
      setFormAlamat(profil.alamat);
      setFormNoHp(profil.no_hp);
    }
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!formNama.trim()) {
      showToast("Nama toko wajib diisi.", "danger");
      return;
    }
    if (!formAlamat.trim()) {
      showToast("Alamat wajib diisi.", "danger");
      return;
    }
    if (!formNoHp.trim()) {
      showToast("Nomor HP wajib diisi.", "danger");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const now = nowISO();
      const updated: ProfilToko = {
        id: profil?.id || generateId(),
        nama_toko: formNama.trim(),
        alamat: formAlamat.trim(),
        no_hp: formNoHp.trim(),
        created_at: profil?.created_at || now,
        updated_at: now,
      };
      setSingle<ProfilToko>(STORAGE_KEYS.PROFIL_TOKO, updated);
      setProfil(updated);
      setIsEditing(false);
      setIsSaving(false);
      showToast("Profil toko berhasil disimpan.");
    }, 300);
  };

  const handleLogout = () => {
    doLogout();
    history.replace("/login");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="profil-toolbar">
          <IonTitle>Setting</IonTitle>
          {!isEditing && (
            <IonButtons slot="end">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <IonIcon icon={createOutline} />
                Edit
              </button>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent className="profil-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Hero */}
        <div className="profil-hero">
          <div className="profil-avatar">
            <IonIcon icon={storefrontOutline} />
          </div>
          <div className="profil-hero-name">
            {profil?.nama_toko || "WarungKu"}
          </div>
          <div className="profil-hero-sub">Profil Toko</div>
        </div>

        {/* Form Card */}
        <div className="profil-card">
          <div className="profil-field">
            <div className="profil-field-icon orange">
              <IonIcon icon={storefrontOutline} />
            </div>
            <div className="profil-field-content">
              <label className="profil-label">Nama Toko</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Nama toko Anda"
                  className="profil-input"
                  autoFocus
                />
              ) : (
                <div className="profil-value">{profil?.nama_toko || "-"}</div>
              )}
            </div>
          </div>

          <div className="profil-divider" />

          <div className="profil-field">
            <div className="profil-field-icon blue">
              <IonIcon icon={locationOutline} />
            </div>
            <div className="profil-field-content">
              <label className="profil-label">Alamat</label>
              {isEditing ? (
                <textarea
                  value={formAlamat}
                  onChange={(e) => setFormAlamat(e.target.value)}
                  placeholder="Alamat lengkap toko"
                  className="profil-input profil-textarea"
                  rows={3}
                />
              ) : (
                <div className="profil-value">{profil?.alamat || "-"}</div>
              )}
            </div>
          </div>

          <div className="profil-divider" />

          <div className="profil-field">
            <div className="profil-field-icon green">
              <IonIcon icon={callOutline} />
            </div>
            <div className="profil-field-content">
              <label className="profil-label">Nomor HP</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formNoHp}
                  onChange={(e) => setFormNoHp(e.target.value)}
                  placeholder="contoh: 08123456789"
                  className="profil-input"
                  inputMode="tel"
                />
              ) : (
                <div className="profil-value">{profil?.no_hp || "-"}</div>
              )}
            </div>
          </div>
        </div>

        {/* Tombol Simpan & Batal */}
        {isEditing && (
          <div className="profil-actions">
            <button className="profil-btn cancel" onClick={handleCancel}>
              Batal
            </button>
            <button
              className="profil-btn save"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <IonSpinner name="crescent" />
              ) : (
                <>
                  <IonIcon icon={checkmarkOutline} />
                  Simpan
                </>
              )}
            </button>
          </div>
        )}

        {/* Preferensi */}
        {!isEditing && (
          <>
            <div className="setting-section-title">Preferensi</div>
            <div className="setting-card">
              <div className="profil-divider" />

              {/* Versi */}
              <div className="setting-item">
                <div className="setting-icon gray">
                  <IonIcon icon={shieldOutline} />
                </div>
                <div className="setting-label">Versi Aplikasi</div>
                <div className="setting-val">v1.0.0</div>
              </div>
            </div>

            {/* Logout */}
            <div className="logout-wrap">
              <button
                className="logout-btn"
                onClick={() => setShowLogoutAlert(true)}
              >
                <IonIcon icon={logOutOutline} />
                Keluar dari Akun
              </button>
            </div>
          </>
        )}

        <div style={{ height: 80 }} />

        <CustomToast
          show={toast.show}
          message={toast.message}
          color={toast.color as any}
          duration={2500}
          onDidDismiss={() => setToast({ ...toast, show: false })}
        />
      </IonContent>

      <OwnerNavbar />

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

export default ProfilTokoPage;
