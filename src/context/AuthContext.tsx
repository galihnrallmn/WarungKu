import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser } from "../types";
import { getSession, login, logout } from "../services/auth.service";
import { initSeedData } from "../services/storage.service";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  doLogin: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  doLogout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Init seed data (owner default) saat pertama buka app
    initSeedData();

    // Cek session yang masih aktif
    const session = getSession();
    if (session) {
      setUser(session);
    }
    setIsLoading(false);
  }, []);

  const doLogin = async (email: string, password: string) => {
    const result = login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, message: result.message };
  };

  const doLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, doLogin, doLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
};
