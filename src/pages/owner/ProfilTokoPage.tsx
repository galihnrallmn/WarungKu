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
  IonBackButton,
  IonButtons,
  IonSpinner,
  RefresherEventDetail,
} from "@ionic/react";
import {
  storefrontOutline,
  chevronBackOutline,
  locationOutline,
  callOutline,
  checkmarkOutline,
  createOutline,
} from "ionicons/icons";
import { ProfilToko, STORAGE_KEYS } from "../../types";
import {
  getSingle,
  setSingle,
  nowISO,
  generateId,
} from "../../services/storage.service";
import "./ProfilTokoPage.css";
import OwnerNavbar from "../../components/OwnerNavbar";

const ProfilTokoPage: React.FC = () => {
  const [profil, setProfil] = useState<ProfilToko | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleEdit = () => setIsEditing(true);

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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="profil-toolbar">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/owner/dashboard"
              icon={chevronBackOutline}
              text=""
            />
          </IonButtons>
          <IonTitle>Profil Toko</IonTitle>
          {!isEditing && (
            <IonButtons slot="end">
              <button className="edit-btn" onClick={handleEdit}>
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

        {/* Logo / Icon Toko */}
        <div className="profil-hero">
          <div className="profil-avatar">
            <IonIcon icon={storefrontOutline} />
          </div>
          <div className="profil-hero-name">
            {profil?.nama_toko || "WarungKu"}
          </div>
          <div className="profil-hero-sub">Profil Toko</div>
        </div>

        {/* Form / View */}
        <div className="profil-card">
          {/* Nama Toko */}
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

          {/* Alamat */}
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

          {/* Nomor HP */}
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

        <div style={{ height: 32 }} />

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          duration={2000}
          color={toast.color as any}
          position="top"
          onDidDismiss={() => setToast({ ...toast, show: false })}
        />
      </IonContent>
      <OwnerNavbar />
    </IonPage>
  );
};

export default ProfilTokoPage;
