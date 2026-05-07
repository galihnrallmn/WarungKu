import React from "react";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect, Switch } from "react-router-dom";

/* Ionic CSS */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";

/* Context */
import { AuthProvider, useAuth } from "./context/AuthContext";

/* Pages - Auth */
import LoginPage from "./pages/auth/LoginPage";

/* Pages - Owner (lazy import siap untuk nanti) */
import DashboardPage from "./pages/owner/DashboardPage";
import KategoriPage from "./pages/owner/KategoriPage";
import MenuPage from "./pages/owner/MenuPage";
// import TransaksiPage from './pages/owner/TransaksiPage';
// import LaporanPage from './pages/owner/LaporanPage';
// import ProfilTokoPage from './pages/owner/ProfilTokoPage';
// import UserPage from './pages/owner/UserPage';

/* Pages - Kasir (lazy import siap untuk nanti) */
// import PesananPage from './pages/kasir/PesananPage';
// import PembayaranPage from './pages/kasir/PembayaranPage';

setupIonicReact();

// --------------------------------
// AUTH GUARD
// Redirect ke login jika belum login
// Redirect ke halaman sesuai role jika sudah login
// --------------------------------

const PrivateRoute: React.FC<{
  component: React.ComponentType<any>;
  path: string;
  role?: "owner" | "kasir";
  exact?: boolean;
}> = ({ component: Component, role, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        // Belum login → ke halaman login
        if (!user) return <Redirect to="/login" />;

        // Akses halaman owner tapi role kasir → redirect ke halaman kasir
        if (role === "owner" && user.role !== "owner") {
          return <Redirect to="/kasir/pesanan" />;
        }

        // Akses halaman kasir tapi role owner → redirect ke dashboard owner
        if (role === "kasir" && user.role !== "kasir") {
          return <Redirect to="/owner/dashboard" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

// --------------------------------
// ROOT REDIRECT
// Arahkan ke halaman sesuai role saat buka app
// --------------------------------

const RootRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) return <Redirect to="/login" />;

  if (user.role === "owner") return <Redirect to="/owner/dashboard" />;

  return <Redirect to="/kasir/pesanan" />;
};

// --------------------------------
// PLACEHOLDER PAGE
// Sementara sebelum halaman dibuat
// --------------------------------

const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      gap: 12,
      fontFamily: "sans-serif",
      color: "#6b7280",
      background: "#f0f4f8",
    }}
  >
    <span style={{ fontSize: 48 }}>🚧</span>
    <h2 style={{ color: "#1a1a2e", margin: 0 }}>{title}</h2>
    <p style={{ margin: 0 }}>Halaman ini sedang dalam pengerjaan</p>
  </div>
);

// --------------------------------
// APP ROUTES
// --------------------------------

const AppRoutes: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Switch>
        {/* Root */}
        <Route exact path="/" component={RootRedirect} />

        {/* Auth */}
        <Route exact path="/login" component={LoginPage} />

        {/* Owner Routes */}
        <PrivateRoute
          exact
          path="/owner/dashboard"
          role="owner"
          component={DashboardPage}
        />
        <PrivateRoute
          exact
          path="/owner/kategori"
          role="owner"
          component={KategoriPage}
        />
        <PrivateRoute
          exact
          path="/owner/menu"
          role="owner"
          component={MenuPage}
        />
        <PrivateRoute
          exact
          path="/owner/transaksi"
          role="owner"
          component={() => <ComingSoon title="Riwayat Transaksi" />}
        />
        <PrivateRoute
          exact
          path="/owner/laporan"
          role="owner"
          component={() => <ComingSoon title="Laporan" />}
        />
        <PrivateRoute
          exact
          path="/owner/profil-toko"
          role="owner"
          component={() => <ComingSoon title="Profil Toko" />}
        />
        <PrivateRoute
          exact
          path="/owner/users"
          role="owner"
          component={() => <ComingSoon title="Kelola Kasir" />}
        />

        {/* Kasir Routes */}
        <PrivateRoute
          exact
          path="/kasir/pesanan"
          role="kasir"
          component={() => <ComingSoon title="Input Pesanan" />}
        />
        <PrivateRoute
          exact
          path="/kasir/pembayaran"
          role="kasir"
          component={() => <ComingSoon title="Pembayaran" />}
        />

        {/* Fallback */}
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </IonRouterOutlet>
  );
};

// --------------------------------
// APP ROOT
// --------------------------------

const App: React.FC = () => {
  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <AppRoutes />
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
};

export default App;
