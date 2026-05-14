import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import {
  mailOutline,
  lockClosedOutline,
  storefrontOutline,
  eyeOutline,
  eyeOffOutline,
} from "ionicons/icons";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const { doLogin } = useAuth();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">
              <IonIcon icon={storefrontOutline} />
            </div>
            <h1 className="login-title">WarungKu</h1>
            <p className="login-subtitle">Masuk untuk mulai berjualan</p>
          </div>

          {/* Card */}
          <div className="login-card">
            {/* Email */}
            <div className="login-field">
              <label className="login-label">Email</label>
              <div className="login-input-wrapper">
                <IonIcon icon={mailOutline} className="input-icon" />
                <input
                  type="email"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="login-input-native"
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrapper">
                <IonIcon icon={lockClosedOutline} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="login-input-native"
                  autoComplete="current-password"
                />
                <button
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              className="login-button"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? <IonSpinner name="crescent" /> : "MASUK"}
            </button>
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
