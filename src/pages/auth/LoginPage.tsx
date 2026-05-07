import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
  IonInputPasswordToggle,
} from "@ionic/react";
import {
  mailOutline,
  lockClosedOutline,
  storefrontOutline,
} from "ionicons/icons";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const { doLogin } = useAuth();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setToastMsg("Email dan password wajib diisi.");
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    const result = await doLogin(email.trim(), password);
    setIsLoading(false);

    if (result.success) {
      // Redirect berdasarkan role (ditangani di App.tsx)
      history.replace("/");
    } else {
      setToastMsg(result.message || "Login gagal.");
      setShowToast(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <IonPage>
      <IonContent className="login-content" fullscreen>
        <div className="login-wrapper">
          {/* Logo & Header */}
          <div className="login-header">
            <div className="login-logo">
              <IonIcon icon={storefrontOutline} />
            </div>
            <h1 className="login-title">WarungKu</h1>
            <p className="login-subtitle">Masuk untuk mulai berjualan</p>
          </div>

          {/* Form Card */}
          <div className="login-card">
            <div className="login-field">
              <label className="login-label">Email</label>
              <div className="login-input-wrapper">
                <IonIcon icon={mailOutline} className="input-icon" />
                <IonInput
                  type="email"
                  placeholder="contoh@email.com"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value || "")}
                  onKeyDown={handleKeyDown}
                  className="login-input"
                  autocomplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrapper">
                <IonIcon icon={lockClosedOutline} className="input-icon" />
                <IonInput
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value || "")}
                  onKeyDown={handleKeyDown}
                  className="login-input"
                  autocomplete="current-password"
                >
                  <IonInputPasswordToggle slot="end" />
                </IonInput>
              </div>
            </div>

            <IonButton
              expand="block"
              className="login-button"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? <IonSpinner name="crescent" /> : "Masuk"}
            </IonButton>

            {/* Info default akun */}
            <div className="login-hint">
              <p>Akun default Owner:</p>
              <code>owner@warungku.com / owner123</code>
            </div>
          </div>

          <p className="login-footer">
            WarungKu &copy; {new Date().getFullYear()}
          </p>
        </div>

        <IonToast
          isOpen={showToast}
          message={toastMsg}
          duration={2500}
          color="danger"
          onDidDismiss={() => setShowToast(false)}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
