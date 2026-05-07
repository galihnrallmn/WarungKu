export type UserRole = "owner" | "kasir";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// PROFIL TOKO

export interface ProfilToko {
  id: string;
  nama_toko: string;
  alamat: string;
  no_hp: string;
  created_at: string;
  updated_at: string;
}

// KATEGORI

export interface Kategori {
  id: string;
  nama_kategori: string;
  created_at: string;
  updated_at: string;
}

// MENU

export interface Menu {
  id: string;
  nama_menu: string;
  harga: number;
  kategori_id: string;
  created_at: string;
  updated_at: string;
}

// Menu dengan nama kategori (untuk tampilan)
export interface MenuWithKategori extends Menu {
  nama_kategori: string;
}

// TRANSAKSI

export type MetodePembayaran = "cash" | "qris";

export interface Transaksi {
  id: string;
  kode_transaksi: string;
  user_id: string;
  tanggal: string;
  total: number;
  metode_pembayaran: MetodePembayaran;
  bayar: number;
  kembalian: number;
  struk_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransaksiDetail {
  id: string;
  transaksi_id: string;
  menu_id: string;
  nama_menu: string;
  harga: number;
  qty: number;
  subtotal: number;
}

// Transaksi lengkap dengan detail & kasir (untuk tampilan)
export interface TransaksiWithDetail extends Transaksi {
  detail: TransaksiDetail[];
  nama_kasir: string;
}

// KERANJANG (state sementara, tidak disimpan)

export interface KeranjangItem {
  menu_id: string;
  nama_menu: string;
  harga: number;
  qty: number;
  subtotal: number;
}

// FORM TYPES

export interface LoginForm {
  email: string;
  password: string;
}

export interface KategoriForm {
  nama_kategori: string;
}

export interface MenuForm {
  nama_menu: string;
  harga: number;
  kategori_id: string;
}

export interface UserForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface ProfilTokoForm {
  nama_toko: string;
  alamat: string;
  no_hp: string;
}

export interface PembayaranForm {
  metode_pembayaran: MetodePembayaran;
  bayar: number;
}

// LAPORAN

export interface LaporanHarian {
  tanggal: string;
  total_transaksi: number;
  total_pemasukan: number;
}

export interface LaporanBulanan {
  bulan: string; // format: "2025-01"
  total_transaksi: number;
  total_pemasukan: number;
}

export interface DashboardData {
  omzet_hari_ini: number;
  omzet_bulan_ini: number;
  transaksi_hari_ini: number;
  transaksi_bulan_ini: number;
  menu_terlaris: MenuTerlaris[];
}

export interface MenuTerlaris {
  menu_id: string;
  nama_menu: string;
  total_terjual: number;
}

// STORAGE KEYS

export const STORAGE_KEYS = {
  USERS: "wk_users",
  KATEGORI: "wk_kategori",
  MENU: "wk_menu",
  TRANSAKSI: "wk_transaksi",
  TRANSAKSI_DETAIL: "wk_transaksi_detail",
  PROFIL_TOKO: "wk_profil_toko",
  AUTH_USER: "wk_auth_user",
} as const;
