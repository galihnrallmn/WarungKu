import {
  Transaksi,
  TransaksiDetail,
  TransaksiWithDetail,
  KeranjangItem,
  MetodePembayaran,
  DashboardData,
  MenuTerlaris,
  LaporanHarian,
  LaporanBulanan,
  STORAGE_KEYS,
} from "../types";
import {
  getData,
  setData,
  generateId,
  generateKodeTransaksi,
  nowISO,
} from "./storage.service";
import {
  format,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
} from "date-fns";

// --------------------------------
// GET
// --------------------------------

export function getAll(): Transaksi[] {
  return getData<Transaksi>(STORAGE_KEYS.TRANSAKSI);
}

export function getAllDetail(): TransaksiDetail[] {
  return getData<TransaksiDetail>(STORAGE_KEYS.TRANSAKSI_DETAIL);
}

export function getById(id: string): TransaksiWithDetail | null {
  const trx = getAll().find((t) => t.id === id);
  if (!trx) return null;
  const details = getAllDetail().filter((d) => d.transaksi_id === id);
  const users = getData<{ id: string; name: string }>(STORAGE_KEYS.USERS);
  const kasir = users.find((u) => u.id === trx.user_id);
  return { ...trx, detail: details, nama_kasir: kasir?.name || "-" };
}

export function getAllWithDetail(): TransaksiWithDetail[] {
  const transaksiList = getAll();
  const allDetail = getAllDetail();
  const users = getData<{ id: string; name: string }>(STORAGE_KEYS.USERS);
  return transaksiList.map((trx) => ({
    ...trx,
    detail: allDetail.filter((d) => d.transaksi_id === trx.id),
    nama_kasir: users.find((u) => u.id === trx.user_id)?.name || "-",
  }));
}

// --------------------------------
// SIMPAN TRANSAKSI
// --------------------------------

export interface SimpanTransaksiPayload {
  user_id: string;
  keranjang: KeranjangItem[];
  total: number;
  metode_pembayaran: MetodePembayaran;
  bayar: number;
  kembalian: number;
}

export function simpanTransaksi(payload: SimpanTransaksiPayload): Transaksi {
  const now = nowISO();
  const transaksiId = generateId();

  const transaksi: Transaksi = {
    id: transaksiId,
    kode_transaksi: generateKodeTransaksi(),
    user_id: payload.user_id,
    tanggal: now,
    total: payload.total,
    metode_pembayaran: payload.metode_pembayaran,
    bayar: payload.bayar,
    kembalian: payload.kembalian,
    struk_url: null,
    created_at: now,
    updated_at: now,
  };

  const details: TransaksiDetail[] = payload.keranjang.map((item) => ({
    id: generateId(),
    transaksi_id: transaksiId,
    menu_id: item.menu_id,
    nama_menu: item.nama_menu,
    harga: item.harga,
    qty: item.qty,
    subtotal: item.subtotal,
  }));

  // Simpan transaksi
  const transaksiList = getAll();
  setData<Transaksi>(STORAGE_KEYS.TRANSAKSI, [...transaksiList, transaksi]);

  // Simpan detail
  const detailList = getAllDetail();
  setData<TransaksiDetail>(STORAGE_KEYS.TRANSAKSI_DETAIL, [
    ...detailList,
    ...details,
  ]);

  return transaksi;
}

// Update struk_url setelah generate PNG
export function updateStrukUrl(transaksiId: string, url: string): void {
  const list = getAll();
  const idx = list.findIndex((t) => t.id === transaksiId);
  if (idx !== -1) {
    list[idx].struk_url = url;
    list[idx].updated_at = nowISO();
    setData<Transaksi>(STORAGE_KEYS.TRANSAKSI, list);
  }
}

// --------------------------------
// DASHBOARD DATA
// --------------------------------

export function getDashboardData(): DashboardData {
  const today = new Date();
  const allTrx = getAll();
  const allDetail = getAllDetail();

  const hariIni = allTrx.filter((t) =>
    isWithinInterval(parseISO(t.tanggal), {
      start: startOfDay(today),
      end: endOfDay(today),
    })
  );

  const bulanIni = allTrx.filter((t) =>
    isWithinInterval(parseISO(t.tanggal), {
      start: startOfMonth(today),
      end: endOfMonth(today),
    })
  );

  // Menu terlaris
  const menuCount: Record<string, { nama: string; total: number }> = {};
  allDetail.forEach((d) => {
    if (!menuCount[d.menu_id]) {
      menuCount[d.menu_id] = { nama: d.nama_menu, total: 0 };
    }
    menuCount[d.menu_id].total += d.qty;
  });

  const menuTerlaris: MenuTerlaris[] = Object.entries(menuCount)
    .map(([id, val]) => ({
      menu_id: id,
      nama_menu: val.nama,
      total_terjual: val.total,
    }))
    .sort((a, b) => b.total_terjual - a.total_terjual)
    .slice(0, 5);

  return {
    omzet_hari_ini: hariIni.reduce((sum, t) => sum + t.total, 0),
    omzet_bulan_ini: bulanIni.reduce((sum, t) => sum + t.total, 0),
    transaksi_hari_ini: hariIni.length,
    transaksi_bulan_ini: bulanIni.length,
    menu_terlaris: menuTerlaris,
  };
}

// --------------------------------
// LAPORAN
// --------------------------------

export function getLaporanHarian(bulan: string): LaporanHarian[] {
  // bulan format: "2025-05"
  const allTrx = getAll();
  const filtered = allTrx.filter((t) => t.tanggal.startsWith(bulan));

  const map: Record<string, LaporanHarian> = {};
  filtered.forEach((t) => {
    const tgl = t.tanggal.slice(0, 10);
    if (!map[tgl])
      map[tgl] = { tanggal: tgl, total_transaksi: 0, total_pemasukan: 0 };
    map[tgl].total_transaksi += 1;
    map[tgl].total_pemasukan += t.total;
  });

  return Object.values(map).sort((a, b) => a.tanggal.localeCompare(b.tanggal));
}

export function getLaporanBulanan(tahun: string): LaporanBulanan[] {
  const allTrx = getAll();
  const filtered = allTrx.filter((t) => t.tanggal.startsWith(tahun));

  const map: Record<string, LaporanBulanan> = {};
  filtered.forEach((t) => {
    const bulan = t.tanggal.slice(0, 7);
    if (!map[bulan])
      map[bulan] = { bulan, total_transaksi: 0, total_pemasukan: 0 };
    map[bulan].total_transaksi += 1;
    map[bulan].total_pemasukan += t.total;
  });

  return Object.values(map).sort((a, b) => a.bulan.localeCompare(b.bulan));
}

// --------------------------------
// EXPORT CSV
// --------------------------------

export async function exportCSV(bulan: string): Promise<void> {
  const allTrx = getAllWithDetail();
  const filtered = allTrx.filter((t) => t.tanggal.startsWith(bulan));

  const rows = [
    [
      "Kode Transaksi",
      "Tanggal",
      "Kasir",
      "Menu",
      "Qty",
      "Harga",
      "Subtotal",
      "Total",
      "Metode",
      "Bayar",
      "Kembalian",
    ],
  ];

  filtered.forEach((trx) => {
    trx.detail.forEach((d, i) => {
      rows.push([
        i === 0 ? trx.kode_transaksi : "",
        i === 0 ? format(parseISO(trx.tanggal), "dd/MM/yyyy HH:mm") : "",
        i === 0 ? trx.nama_kasir : "",
        d.nama_menu,
        String(d.qty),
        String(d.harga),
        String(d.subtotal),
        i === 0 ? String(trx.total) : "",
        i === 0 ? trx.metode_pembayaran.toUpperCase() : "",
        i === 0 ? String(trx.bayar) : "",
        i === 0 ? String(trx.kembalian) : "",
      ]);
    });
  });

  const csv = rows.map((r) => r.join(",")).join("\n");
  const fileName = `laporan-${bulan}.csv`;

  try {
    const { Capacitor } = await import("@capacitor/core");
    if (Capacitor.isNativePlatform()) {
      const { Filesystem, Directory } = await import("@capacitor/filesystem");
      await Filesystem.writeFile({
        path: fileName,
        data: btoa(unescape(encodeURIComponent(csv))),
        directory: Directory.Documents,
        recursive: true,
      });
    } else {
      // Fallback browser
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    console.error("Export CSV error:", err);
    throw err;
  }
}
