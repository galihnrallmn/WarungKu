import { STORAGE_KEYS, User, ProfilToko } from "../types";
import { v4 as uuidv4 } from "uuid";

import { STORAGE_KEYS, User, ProfilToko } from "../types";
import { v4 as uuidv4 } from "uuid";

export function getData<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setData<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`[WarungKu] Gagal menyimpan data ke key: ${key}`, e);
  }
}

export function getSingle<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSingle<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`[WarungKu] Gagal menyimpan data ke key: ${key}`, e);
  }
}

export function removeItem(key: string): void {
  localStorage.removeItem(key);
}

export function initSeedData(): void {
  const users = getData<User>(STORAGE_KEYS.USERS);

  if (users.length === 0) {
    const now = new Date().toISOString();

    // Default owner account
    const defaultOwner: User = {
      id: uuidv4(),
      name: "Owner",
      email: "owner@warungku.com",
      password: "owner123",
      role: "owner",
      created_at: now,
      updated_at: now,
    };

    setData<User>(STORAGE_KEYS.USERS, [defaultOwner]);

    // Default profil toko
    const defaultProfil: ProfilToko = {
      id: uuidv4(),
      nama_toko: "WarungKu",
      alamat: "Jl. Contoh No. 1",
      no_hp: "08123456789",
      created_at: now,
      updated_at: now,
    };

    setSingle<ProfilToko>(STORAGE_KEYS.PROFIL_TOKO, defaultProfil);

    console.log("[WarungKu] Seed data berhasil dibuat");
    console.log("[WarungKu] Login default → owner@warungku.com / owner123");
  }
}

export function generateId(): string {
  return uuidv4();
}

export function generateKodeTransaksi(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const time = now.getTime().toString().slice(-6);
  return `TRX-${date}-${time}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}
