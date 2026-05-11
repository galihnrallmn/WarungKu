// ================================
// WARUNGKU - Dummy Data
// Tema: Kafe & Coffee Shop
// ================================

import { v4 as uuidv4 } from "uuid";
import { setData, setSingle, getData } from "../services/storage.service";
import {
  STORAGE_KEYS,
  User,
  Kategori,
  Menu,
  Transaksi,
  TransaksiDetail,
  ProfilToko,
} from "../types";

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateKode(index: number, date: Date): string {
  const d = date.toISOString().slice(0, 10).replace(/-/g, "");
  return `TRX-${d}-${String(index).padStart(4, "0")}`;
}

function daysAgo(n: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// ---- PROFIL TOKO ----
const profilToko: ProfilToko = {
  id: uuidv4(),
  nama_toko: "Kopi Nusantara",
  alamat: "Jl. Merdeka No. 12, Banjarmasin",
  no_hp: "08112345678",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// ---- USERS ----
const ownerUser: User = {
  id: "owner-001",
  name: "Galih",
  email: "owner@kopinusantara.com",
  password: "owner123",
  role: "owner",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const kasir1: User = {
  id: "kasir-001",
  name: "Siti Aminah",
  email: "siti@kopinusantara.com",
  password: "kasir123",
  role: "kasir",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const kasir2: User = {
  id: "kasir-002",
  name: "Rizky Pratama",
  email: "rizky@kopinusantara.com",
  password: "kasir123",
  role: "kasir",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// ---- KATEGORI ----
const kategoriList: Kategori[] = [
  {
    id: "kat-001",
    nama_kategori: "Kopi",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "kat-002",
    nama_kategori: "Non Kopi",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "kat-003",
    nama_kategori: "Makanan",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "kat-004",
    nama_kategori: "Snack",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ---- MENU ----
const menuList: Menu[] = [
  {
    id: "menu-001",
    nama_menu: "Americano",
    harga: 18000,
    kategori_id: "kat-001",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-002",
    nama_menu: "Cappuccino",
    harga: 22000,
    kategori_id: "kat-001",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-003",
    nama_menu: "Latte",
    harga: 24000,
    kategori_id: "kat-001",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-004",
    nama_menu: "Espresso",
    harga: 15000,
    kategori_id: "kat-001",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-005",
    nama_menu: "Kopi Susu",
    harga: 20000,
    kategori_id: "kat-001",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-006",
    nama_menu: "Cold Brew",
    harga: 26000,
    kategori_id: "kat-001",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-007",
    nama_menu: "Matcha Latte",
    harga: 25000,
    kategori_id: "kat-002",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-008",
    nama_menu: "Teh Tarik",
    harga: 15000,
    kategori_id: "kat-002",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-009",
    nama_menu: "Coklat Panas",
    harga: 20000,
    kategori_id: "kat-002",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-010",
    nama_menu: "Es Teh Manis",
    harga: 8000,
    kategori_id: "kat-002",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-011",
    nama_menu: "Juice Alpukat",
    harga: 18000,
    kategori_id: "kat-002",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-012",
    nama_menu: "Nasi Goreng",
    harga: 22000,
    kategori_id: "kat-003",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-013",
    nama_menu: "Mie Goreng",
    harga: 20000,
    kategori_id: "kat-003",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-014",
    nama_menu: "Roti Bakar",
    harga: 15000,
    kategori_id: "kat-003",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-015",
    nama_menu: "Sandwich",
    harga: 25000,
    kategori_id: "kat-003",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-016",
    nama_menu: "Kentang Goreng",
    harga: 15000,
    kategori_id: "kat-004",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-017",
    nama_menu: "Pisang Goreng",
    harga: 12000,
    kategori_id: "kat-004",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "menu-018",
    nama_menu: "Donat",
    harga: 8000,
    kategori_id: "kat-004",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ---- GENERATE TRANSAKSI ----
function generateTransaksi() {
  const transaksiList: Transaksi[] = [];
  const detailList: TransaksiDetail[] = [];
  const kasirIds = [kasir1.id, kasir2.id];
  let trxIndex = 1;

  for (let day = 30; day >= 0; day--) {
    const jumlahTrx = randomBetween(6, 16);

    for (let t = 0; t < jumlahTrx; t++) {
      const trxId = uuidv4();
      const kasirId = randomItem(kasirIds);
      const metode: "cash" | "qris" = Math.random() > 0.45 ? "cash" : "qris";
      const hour = randomBetween(8, 21);
      const minute = randomBetween(0, 59);
      const tanggal = daysAgo(day, hour, minute);
      const tanggalDate = new Date(tanggal);

      const jumlahItem = randomBetween(1, 4);
      const usedIds = new Set<string>();
      const selectedMenus: Menu[] = [];

      for (let i = 0; i < jumlahItem; i++) {
        let menu = randomItem(menuList);
        let attempt = 0;
        while (usedIds.has(menu.id) && attempt < 10) {
          menu = randomItem(menuList);
          attempt++;
        }
        if (!usedIds.has(menu.id)) {
          usedIds.add(menu.id);
          selectedMenus.push(menu);
        }
      }

      const details: TransaksiDetail[] = selectedMenus.map((menu) => {
        const qty = randomBetween(1, 3);
        return {
          id: uuidv4(),
          transaksi_id: trxId,
          menu_id: menu.id,
          nama_menu: menu.nama_menu,
          harga: menu.harga,
          qty,
          subtotal: menu.harga * qty,
        };
      });

      const total = details.reduce((s, d) => s + d.subtotal, 0);
      const bayar =
        metode === "cash"
          ? Math.ceil(total / 5000) * 5000 + randomItem([0, 5000, 10000, 20000])
          : total;

      transaksiList.push({
        id: trxId,
        kode_transaksi: generateKode(trxIndex++, tanggalDate),
        user_id: kasirId,
        tanggal,
        total,
        metode_pembayaran: metode,
        bayar,
        kembalian: bayar - total,
        struk_url: null,
        created_at: tanggal,
        updated_at: tanggal,
      });

      detailList.push(...details);
    }
  }

  return { transaksi: transaksiList, detail: detailList };
}

// --------------------------------
// LOAD DUMMY DATA
// Panggil fungsi ini dari mana saja
// --------------------------------

export function loadDummyData(): void {
  const existing = getData<User>(STORAGE_KEYS.USERS);
  const alreadyLoaded = existing.some(
    (u) => u.email === "owner@kopinusantara.com"
  );

  if (alreadyLoaded) {
    console.log("[DummyData] Data dummy sudah ada, skip.");
    return;
  }

  // Clear data lama
  localStorage.clear();

  setSingle<ProfilToko>(STORAGE_KEYS.PROFIL_TOKO, profilToko);
  setData<User>(STORAGE_KEYS.USERS, [ownerUser, kasir1, kasir2]);
  setData<Kategori>(STORAGE_KEYS.KATEGORI, kategoriList);
  setData<Menu>(STORAGE_KEYS.MENU, menuList);

  const { transaksi, detail } = generateTransaksi();
  setData<Transaksi>(STORAGE_KEYS.TRANSAKSI, transaksi);
  setData<TransaksiDetail>(STORAGE_KEYS.TRANSAKSI_DETAIL, detail);

  console.log(`✅ [DummyData] ${transaksi.length} transaksi berhasil dimuat!`);
  console.log("🔑 Owner   : owner@kopinusantara.com / owner123");
  console.log("🔑 Kasir 1 : siti@kopinusantara.com / kasir123");
  console.log("🔑 Kasir 2 : rizky@kopinusantara.com / kasir123");
}

// --------------------------------
// RESET DUMMY DATA
// --------------------------------

export function resetDummyData(): void {
  localStorage.clear();
  console.log("🗑️ [DummyData] Semua data telah dihapus.");
  window.location.reload();
}
