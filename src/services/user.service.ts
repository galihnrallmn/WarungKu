// ================================
// WARUNGKU - User Service
// ================================

import { User, UserForm, STORAGE_KEYS } from "../types";
import { getData, setData, generateId, nowISO } from "./storage.service";

export function getAll(): User[] {
  return getData<User>(STORAGE_KEYS.USERS);
}

export function getKasirList(): User[] {
  return getAll().filter((u) => u.role === "kasir");
}

export function getById(id: string): User | undefined {
  return getAll().find((u) => u.id === id);
}

export function create(form: UserForm): { success: boolean; message?: string } {
  const list = getAll();
  const exists = list.find(
    (u) => u.email.toLowerCase() === form.email.toLowerCase()
  );
  if (exists) {
    return { success: false, message: "Email sudah digunakan." };
  }
  const now = nowISO();
  const newUser: User = {
    id: generateId(),
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
    role: "kasir",
    created_at: now,
    updated_at: now,
  };
  setData<User>(STORAGE_KEYS.USERS, [...list, newUser]);
  return { success: true };
}

export function update(
  id: string,
  form: Omit<UserForm, "password">
): { success: boolean; message?: string } {
  const list = getAll();
  const idx = list.findIndex((u) => u.id === id);
  if (idx === -1) return { success: false, message: "User tidak ditemukan." };

  // Cek email duplikat (selain diri sendiri)
  const duplicate = list.find(
    (u) => u.email.toLowerCase() === form.email.toLowerCase() && u.id !== id
  );
  if (duplicate) return { success: false, message: "Email sudah digunakan." };

  list[idx] = {
    ...list[idx],
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    updated_at: nowISO(),
  };
  setData<User>(STORAGE_KEYS.USERS, list);
  return { success: true };
}

export function resetPassword(
  id: string,
  newPassword: string
): { success: boolean; message?: string } {
  const list = getAll();
  const idx = list.findIndex((u) => u.id === id);
  if (idx === -1) return { success: false, message: "User tidak ditemukan." };
  list[idx].password = newPassword;
  list[idx].updated_at = nowISO();
  setData<User>(STORAGE_KEYS.USERS, list);
  return { success: true };
}

export function remove(id: string): boolean {
  const list = getAll();
  setData<User>(
    STORAGE_KEYS.USERS,
    list.filter((u) => u.id !== id)
  );
  return true;
}
