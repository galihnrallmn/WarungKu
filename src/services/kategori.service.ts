import { Kategori, KategoriForm, STORAGE_KEYS } from "../types";
import { getData, setData, generateId, nowISO } from "./storage.service";
import { getAll as getAllMenu } from "./menu.service";

export function getAll(): Kategori[] {
  return getData<Kategori>(STORAGE_KEYS.KATEGORI);
}

export function getById(id: string): Kategori | undefined {
  return getAll().find((k) => k.id === id);
}

export function create(form: KategoriForm): Kategori {
  const list = getAll();
  const now = nowISO();
  const newItem: Kategori = {
    id: generateId(),
    nama_kategori: form.nama_kategori.trim(),
    created_at: now,
    updated_at: now,
  };
  setData<Kategori>(STORAGE_KEYS.KATEGORI, [...list, newItem]);
  return newItem;
}

export function update(id: string, form: KategoriForm): boolean {
  const list = getAll();
  const idx = list.findIndex((k) => k.id === id);
  if (idx === -1) return false;
  list[idx] = {
    ...list[idx],
    nama_kategori: form.nama_kategori.trim(),
    updated_at: nowISO(),
  };
  setData<Kategori>(STORAGE_KEYS.KATEGORI, list);
  return true;
}

export function remove(id: string): boolean {
  const list = getAll();
  setData<Kategori>(
    STORAGE_KEYS.KATEGORI,
    list.filter((k) => k.id !== id)
  );
  return true;
}

// Cek apakah kategori punya menu
export function countMenu(kategoriId: string): number {
  return getAllMenu().filter((m) => m.kategori_id === kategoriId).length;
}
