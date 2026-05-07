# WarungKu 🛍️

Aplikasi kasir digital untuk warung kecil dan menengah, dibangun dengan Ionic 7 + React + TypeScript. Dirancang untuk mempermudah pengelolaan menu, transaksi, dan laporan keuangan secara offline menggunakan LocalStorage. Aplikasi ini mendukung dua peran pengguna: Owner (Admin) untuk manajemen penuh, dan Kasir untuk operasional transaksi sehari-hari.

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Keterangan |
|---|---|
| [Ionic 7](https://ionicframework.com/) | UI Framework mobile-first |
| [React 18](https://react.dev/) | Library UI |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Capacitor](https://capacitorjs.com/) | Native mobile runtime |
| LocalStorage | Penyimpanan data lokal (offline) |
| Ionicons | Icon library |

---

## ✨ Fitur Utama
 
### 🔐 Autentikasi
- Login pengguna dengan sistem berbasis peran
- **Role Owner** — akses penuh ke seluruh fitur manajemen
- **Role Kasir** — akses ke fitur transaksi dan pesanan
- Logout aman dari sesi aktif
---
 
### 👑 Fitur Owner (Admin)
 
#### 📊 Dashboard
- Rekap **omzet harian & bulanan**
- Total jumlah transaksi
- Informasi menu terlaris *(opsional)*
#### 🗂️ Kelola Kategori
- Tambah, edit, dan hapus kategori menu
- Proteksi penghapusan:
  - Jika kategori **kosong** → 1x konfirmasi
  - Jika kategori **memiliki menu** → double confirmation dengan peringatan jumlah menu yang akan ikut terhapus
  - *(Opsional)* input teks `"HAPUS"` sebagai konfirmasi akhir
#### 🍽️ Kelola Menu
- Tambah, edit, dan hapus item menu
- Pilih kategori saat menambah atau mengedit menu
- Menu yang pernah dipakai transaksi **tidak dapat dihapus**
#### 🧾 Riwayat Transaksi
- Tampilkan seluruh riwayat transaksi
- Detail per transaksi
- Filter berdasarkan **tanggal** dan **metode pembayaran**
- Pencarian berdasarkan **kode transaksi**
#### 📈 Laporan
- Rekap pemasukan harian & bulanan
- Total pemasukan dan jumlah transaksi
- **Export laporan ke CSV**
#### 🏪 Profil Toko
- Kelola nama toko, alamat, dan nomor HP
- Informasi ini digunakan pada struk transaksi
#### 👥 Kelola User Kasir
- Tambah, edit, dan hapus akun kasir
- Reset password kasir
---
 
### 🧑‍💼 Fitur Kasir
 
#### 🛍️ Input Pesanan
- Pilih menu berdasarkan kategori
- Tombol **➕** untuk menambah item
- Tombol **➖** untuk mengurangi item
#### 🛒 Keranjang Pesanan
- Tampil detail: nama menu, harga satuan, qty, subtotal, dan **total keseluruhan**
- Tambah/kurang qty langsung dari keranjang
- Hapus item atau **reset seluruh pesanan**
#### 💳 Pembayaran
- Modal pembayaran dengan detail pesanan lengkap
- Pilihan metode pembayaran:
  - **Cash** — input nominal uang pelanggan, hitung kembalian otomatis; validasi jika uang kurang dari total
  - **QRIS** — kasir mengkonfirmasi pembayaran berhasil sebelum transaksi disimpan
#### 🧾 Struk (PNG — On Demand)
Struk **tidak dibuat otomatis**, hanya dibuat saat kasir menekan tombol **"Simpan Struk" / "Lihat Struk"**.
 
Isi struk meliputi:
- Nama & alamat toko, nomor HP toko
- Nama kasir yang bertugas
- Tanggal & jam transaksi
- Detail item: nama menu, qty, harga, subtotal
- Total pembayaran & metode pembayaran
> Struk disimpan dalam format **PNG**. Path file disimpan di data transaksi (`struk_url`). Jika struk sudah pernah dibuat, file yang sama akan digunakan kembali.
 
#### 🔔 Notifikasi
- Notifikasi sukses setelah transaksi tersimpan:
  > *"Transaksi berhasil disimpan"*
---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js >= 16
- npm atau yarn
- Ionic CLI

### Instalasi

```bash
# Clone repositori
https://github.com/galihnrallmn/WarungKu.git
cd warungku

# Install dependensi
npm install

# Jalankan di browser
ionic serve
```

### Build untuk Android

```bash
ionic build
npx cap add android
npx cap sync
npx cap open android
```
---

## 📸 Screenshot

> *Coming soon*
---

## 📝 Lisensi

Project ini dibuat untuk keperluan pribadi / portofolio.
---
