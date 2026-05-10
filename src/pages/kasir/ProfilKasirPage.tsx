import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonAlert,
  IonToast,
  IonModal,
  IonSpinner,
} from "@ionic/react";
import {
  personOutline,
  mailOutline,
  lockClosedOutline,
  logOutOutline,
  keyOutline,
  closeOutline,
  checkmarkOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { resetPassword } from "../../services/user.service";
import KasirNavbar from "../../components/KasirNavbar";
import "./ProfilKasirPage.css";

const ProfilKasirPage: React.FC = () => {
  const { user, doLogout } = useAuth();
  const history = useHistory();

  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    color: "success",
  });
  const showToast = (message: string, color = "success") =>
    setToast({ show: true, message, color });

  const handleLogout = () => {
    doLogout();
    history.replace("/login");
  };

  const handleResetPassword = () => {
    if (!passwordLama.trim()) {
      showToast("Password lama wajib diisi.", "danger");
      return;
    }
    if (!passwordBaru.trim() || passwordBaru.length < 6) {
      showToast("Password baru minimal 6 karakter.", "danger");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      // Validasi password lama
      const { getData } = require("../../services/storage.service");
      const { STORAGE_KEYS } = require("../../types");
      const users = getData(STORAGE_KEYS.USERS);
      const currentUser = users.find((u: any) => u.id === user?.id);

      if (!currentUser || currentUser.password !== passwordLama) {
        showToast("Password lama tidak sesuai.", "danger");
        setIsSaving(false);
        return;
      }

      const result = resetPassword(user!.id, passwordBaru);
      if (result.success) {
        showToast("Password berhasil diubah.");
        setShowResetModal(false);
        setPasswordLama("");
        setPasswordBaru("");
      } else {
        showToast(result.message || "Gagal mengubah password.", "danger");
      }
      setIsSaving(false);
    }, 300);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="profil-kasir-toolbar">
          <IonTitle>Profil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="profil-kasir-content">
        {/* Avatar & Info */}
        <div className="profil-kasir-hero">
          <div className="kasir-avatar">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="kasir-hero-name">{user?.name}</div>
          <div className="kasir-hero-role">Kasir</div>
        </div>

        {/* Info Card */}
        <div className="profil-kasir-card">
          <div className="pk-field">
            <div className="pk-icon-wrap blue">
              <IonIcon icon={personOutline} />
            </div>
            <div className="pk-info">
              <div className="pk-label">Nama</div>
              <div className="pk-val">{user?.name}</div>
            </div>
          </div>
          <div className="pk-divider" />
          <div className="pk-field">
            <div className="pk-icon-wrap orange">
              <IonIcon icon={mailOutline} />
            </div>
            <div className="pk-info">
              <div className="pk-label">Email</div>
              <div className="pk-val">{user?.email}</div>
            </div>
          </div>
          <div className="pk-divider" />
          <div className="pk-field">
            <div className="pk-icon-wrap green">
              <IonIcon icon={lockClosedOutline} />
            </div>
            <div className="pk-info">
              <div className="pk-label">Password</div>
              <div className="pk-val">••••••••</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="profil-kasir-actions">
          <button
            className="pk-action-btn reset"
            onClick={() => setShowResetModal(true)}
          >
            <IonIcon icon={keyOutline} />
            Ganti Password
          </button>
          <button
            className="pk-action-btn logout"
            onClick={() => setShowLogoutAlert(true)}
          >
            <IonIcon icon={logOutOutline} />
            Keluar
          </button>
        </div>

        <div style={{ height: 80 }} />

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          duration={2000}
          color={toast.color as any}
          position="top"
          onDidDismiss={() => setToast({ ...toast, show: false })}
        />
      </IonContent>

      <KasirNavbar />

      {/* Modal Ganti Password */}
      <IonModal
        isOpen={showResetModal}
        onDidDismiss={() => setShowResetModal(false)}
        breakpoints={[0, 0.6]}
        initialBreakpoint={0.6}
      >
        <IonContent className="reset-modal-content">
          <div className="modal-handle" />
          <div className="modal-body">
            <div className="modal-header">
              <h3>Ganti Password</h3>
              <button
                className="modal-close"
                onClick={() => setShowResetModal(false)}
              >
                <IonIcon icon={closeOutline} />
              </button>
            </div>

            <div className="modal-field">
              <label className="modal-label">Password Lama</label>
              <div className="modal-input-wrap">
                <IonIcon icon={lockClosedOutline} className="input-icon" />
                <input
                  type="password"
                  value={passwordLama}
                  onChange={(e) => setPasswordLama(e.target.value)}
                  placeholder="Masukkan password lama"
                  className="modal-input-native"
                  autoFocus
                />
              </div>
            </div>

            <div className="modal-field">
              <label className="modal-label">Password Baru</label>
              <div className="modal-input-wrap">
                <IonIcon icon={lockClosedOutline} className="input-icon" />
                <input
                  type="password"
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="modal-input-native"
                />
              </div>
            </div>

            <button
              className="modal-save-btn"
              onClick={handleResetPassword}
              disabled={isSaving}
            >
              {isSaving ? (
                <IonSpinner name="crescent" />
              ) : (
                <>
                  <IonIcon icon={checkmarkOutline} />
                  Simpan Password
                </>
              )}
            </button>
          </div>
        </IonContent>
      </IonModal>

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

export default ProfilKasirPage;
