import { Menu, MenuForm, MenuWithKategori, STORAGE_KEYS } from "../types";
import { getData, setData, generateId, nowISO } from "./storage.service";

export function getAll(): Menu[] {
  return getData<Menu>(STORAGE_KEYS.MENU);
}

export function getById(id: string): Menu | undefined {
  return getAll().find((m) => m.id === id);
}

export function getByKategori(kategoriId: string): Menu[] {
  return getAll().filter((m) => m.kategori_id === kategoriId);
}

export function getAllWithKategori(): MenuWithKategori[] {
  const menus = getAll();
  const kategoriList = getData<{ id: string; nama_kategori: string }>(
    STORAGE_KEYS.KATEGORI
  );
  return menus.map((m) => ({
    ...m,
    nama_kategori:
      kategoriList.find((k) => k.id === m.kategori_id)?.nama_kategori || "-",
  }));
}

export function create(form: MenuForm): Menu {
  const list = getAll();
  const now = nowISO();
  const newItem: Menu = {
    id: generateId(),
    nama_menu: form.nama_menu.trim(),
    harga: Number(form.harga),
    kategori_id: form.kategori_id,
    created_at: now,
    updated_at: now,
  };
  setData<Menu>(STORAGE_KEYS.MENU, [...list, newItem]);
  return newItem;
}

export function update(id: string, form: MenuForm): boolean {
  const list = getAll();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  list[idx] = {
    ...list[idx],
    nama_menu: form.nama_menu.trim(),
    harga: Number(form.harga),
    kategori_id: form.kategori_id,
    updated_at: nowISO(),
  };
  setData<Menu>(STORAGE_KEYS.MENU, list);
  return true;
}

export function remove(id: string): boolean {
  const list = getAll();
  setData<Menu>(
    STORAGE_KEYS.MENU,
    list.filter((m) => m.id !== id)
  );
  return true;
}

// Cek apakah menu sudah pernah dipakai di transaksi
export function isUsedInTransaksi(menuId: string): boolean {
  const details = getData<{ menu_id: string }>(STORAGE_KEYS.TRANSAKSI_DETAIL);
  return details.some((d) => d.menu_id === menuId);
}
