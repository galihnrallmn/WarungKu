import { User, AuthUser, STORAGE_KEYS } from "../types";
import { getData, getSingle, setSingle, removeItem } from "./storage.service";

// LOGIN

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  message?: string;
}

export function login(email: string, password: string): LoginResult {
  const users = getData<User>(STORAGE_KEYS.USERS);

  const found = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!found) {
    return {
      success: false,
      message: "Email atau password salah.",
    };
  }

  const authUser: AuthUser = {
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role,
  };

  // Simpan session ke LocalStorage
  setSingle<AuthUser>(STORAGE_KEYS.AUTH_USER, authUser);

  return {
    success: true,
    user: authUser,
  };
}

// LOGOUT

export function logout(): void {
  removeItem(STORAGE_KEYS.AUTH_USER);
}

// GET SESSION

export function getSession(): AuthUser | null {
  return getSingle<AuthUser>(STORAGE_KEYS.AUTH_USER);
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}

export function isOwner(): boolean {
  const session = getSession();
  return session?.role === "owner";
}

export function isKasir(): boolean {
  const session = getSession();
  return session?.role === "kasir";
}
