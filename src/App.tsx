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

/* Auth */
import LoginPage from "./pages/auth/LoginPage";

/* Owner Pages */
import DashboardPage from "./pages/owner/DashboardPage";
import KategoriPage from "./pages/owner/KategoriPage";
import MenuPage from "./pages/owner/MenuPage";
import TransaksiPage from "./pages/owner/TransaksiPage";
import LaporanPage from "./pages/owner/LaporanPage";
import ProfilTokoPage from "./pages/owner/ProfilTokoPage";
import UserPage from "./pages/owner/UserPage";
import KelolaPage from "./pages/owner/KelolaPage";

/* Kasir Pages */
import PesananPage from "./pages/kasir/PesananPage";
import RiwayatKasirPage from "./pages/kasir/RiwayatKasirPage";
import ProfilKasirPage from "./pages/kasir/ProfilKasirPage";

setupIonicReact();

// --------------------------------
// PLACEHOLDER
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
// PRIVATE ROUTE
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
        if (!user) return <Redirect to="/login" />;
        if (role === "owner" && user.role !== "owner")
          return <Redirect to="/kasir/pesanan" />;
        if (role === "kasir" && user.role !== "kasir")
          return <Redirect to="/owner/dashboard" />;
        return <Component {...props} />;
      }}
    />
  );
};

// --------------------------------
// ROOT REDIRECT
// --------------------------------
const RootRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Redirect to="/login" />;
  if (user.role === "owner") return <Redirect to="/owner/dashboard" />;
  return <Redirect to="/kasir/pesanan" />;
};

// --------------------------------
// ROUTES
// --------------------------------
const AppRoutes: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Switch>
        {/* Root */}
        <Route exact path="/" component={RootRedirect} />

        {/* Auth */}
        <Route exact path="/login" component={LoginPage} />

        {/* Owner - Navbar Routes */}
        <PrivateRoute
          exact
          path="/owner/dashboard"
          role="owner"
          component={DashboardPage}
        />
        <PrivateRoute
          exact
          path="/owner/transaksi"
          role="owner"
          component={TransaksiPage}
        />
        <PrivateRoute
          exact
          path="/owner/kelola"
          role="owner"
          component={KelolaPage}
        />
        <PrivateRoute
          exact
          path="/owner/profil-toko"
          role="owner"
          component={ProfilTokoPage}
        />

        {/* Owner - Sub Routes (dari Kelola) */}
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
          path="/owner/laporan"
          role="owner"
          component={LaporanPage}
        />
        <PrivateRoute
          exact
          path="/owner/users"
          role="owner"
          component={UserPage}
        />

        {/* Kasir Routes */}
        <PrivateRoute
          exact
          path="/kasir/pesanan"
          role="kasir"
          component={PesananPage}
        />
        <PrivateRoute
          exact
          path="/kasir/riwayat"
          role="kasir"
          component={RiwayatKasirPage}
        />
        <PrivateRoute
          exact
          path="/kasir/profil"
          role="kasir"
          component={ProfilKasirPage}
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
