# ☕ Digital Twin Warung Bu Maya — Monorepo (Fullstack)

> **Sistem Informasi dan Dashboard Digital Twin Operasional UMKM Warung Bu Maya**  
> *Tagline:* Ngopi • Makan • Santai  
> *Pemilik Warung:* Bu Maya  

Aplikasi sistem informasi monorepo lengkap terdiri dari antarmuka React (`/client`) dan REST API Node.js Express (`/server`) yang terhubung langsung ke database cloud **Neon Serverless PostgreSQL**.

---

## 🏗️ Arsitektur & Tech Stack

- **Frontend (`/client`)**: React 19, Vite, Tailwind CSS, Recharts, Lucide Icons, React Hot Toast
- **Backend (`/server`)**: Node.js, Express.js (REST API), Drizzle ORM, `pg` (node-postgres), BcryptJS, Express-Session
- **Database**: PostgreSQL (Neon Serverless PostgreSQL Cloud)

---

## 🚀 Panduan Lengkap: Cara Clone & Menjalankan Project

Ikuti langkah-langkah di bawah ini untuk mengklon dan menjalankan project ini di komputer / laptop baru:

### 1. Prasyarat Sistem
Pastikan laptop Anda sudah memiliki:
- **Git**: [https://git-scm.com/](https://git-scm.com/)
- **Node.js** (Versi 18 LTS ke atas, disarankan v20 atau v22): [https://nodejs.org/](https://nodejs.org/)

---

### 2. Langkah 1: Clone Repository dari GitHub
Buka terminal (Git Bash, PowerShell, atau Command Prompt), lalu jalankan perintah berikut:

```bash
# Clone repository 
git clone https://github.com/MPPL01022026/Kelompok-19.git

# Clone repository jika sudah ada / anggota kelompok
git fetch origin

# Masuk ke folder aplikasi UMKM_BuMaya
cd Kelompok-19/UMKM_BuMaya
```

---

### 3. Langkah 2: Install Seluruh Dependensi

Jalankan instalasi dependensi untuk root, backend (`server`), dan frontend (`client`):

```bash
# 1. Install dependensi root monorepo (concurrently)
npm install

# 2. Install dependensi backend
cd server
npm install
cd ..

# 3. Install dependensi frontend
cd client
npm install
cd ..
```

> 💡 **Shortcut 1 Baris di Windows PowerShell:**
> ```powershell
> npm install; cd server; npm install; cd ../client; npm install; cd ..
> ```

---

### 4. Langkah 3: Konfigurasi File Environment (`server/.env`)

Masuk ke folder `server` dan buat file `.env` dari contoh yang tersedia:

```bash
cd server
cp .env.example .env
cd ..
```
*(Di Windows PowerShell dapat menggunakan: `Copy-Item server/.env.example server/.env`)*

Pastikan isi file `server/.env` berisi konfigurasi database Neon Anda:

```env
Minta Dari Edo
```

---

### 5. Langkah 4: Inisialisasi & Seeding Database (Jika Database Baru)

Jika tabel di Neon PostgreSQL belum dibuat atau ingin memasukkan data awal:

```bash
# Membuat tabel-tabel di PostgreSQL
npm run db:init

# Memasukkan seed data awal (user, menu, bahan, pesanan 7 hari, kas)
npm run db:seed
```

---

### 6. Langkah 5: Jalankan Project (Sekali Run)

Cukup jalankan satu perintah dari folder root `UMKM_BuMaya`:

```bash
npm run dev
```

Perintah di atas akan secara otomatis menjalankan:
- 🔵 **Backend Express**: Berjalan di `http://localhost:5000`
- 🟡 **Frontend React**: Berjalan di `http://localhost:5173`

Buka browser Anda dan akses: **`http://localhost:5173`**

> 💡 **Opsi Menjalankan Terpisah (Bila Diperlukan):**
> - Hanya Backend: `npm run dev:server`
> - Hanya Frontend: `npm run dev:client`

---

## 🔑 Kredensial Login Demo

| Field | Kredensial |
|---|---|
| **Username Default** | `bumaya` |
| **Password Default** | `familykupi123` |

> 💡 **Kemudahan Login:** Di halaman login terdapat tombol kartu **"Akun Default Bu Maya (Klik untuk isi cepat)"** untuk mengisi form secara otomatis.  
> ⚠️ **Catatan Keamanan:** Tersedia fitur **Ganti Username & Sandi** di dalam aplikasi (klik avatar profil di header atau menu "Ganti Akun & Sandi" di sidebar).

---

## 🗄️ Database Schema di Neon PostgreSQL

1. **`users`**: Akun login pengelola warung (`id`, `username`, `password` hash bcrypt, `nama`, `created_at`).
2. **`menu`**: 18 item katalog hidangan (`id`, `nama_menu`, `kategori` [Makanan, Minuman, Paket], `harga`, `status` [Tersedia, Habis]).
3. **`bahan`**: 21 item stok bahan baku dapur (`id`, `nama_bahan`, `satuan`, `jumlah`, `batas_minimum`). Dilengkapi status otomatis: Aman, Menipis, Habis.
4. **`pesanan`**: Transaksi pemesanan meja & walk-in (`id`, `nama_pelanggan`, `total_harga`, `status` [Diproses, Selesai, Dibatalkan], `created_at`).
5. **`pesanan_item`**: Relasi rincian hidangan per pesanan (`id`, `pesanan_id`, `menu_id`, `qty`, `subtotal`).
6. **`pemasukan`**: Arus kas masuk (`id`, `tanggal`, `sumber` [Penjualan, Lainnya], `keterangan`, `jumlah`, `pesanan_id`). *Otomatis tercatat saat pesanan Selesai.*
7. **`pengeluaran`**: Arus kas keluar (`id`, `tanggal`, `kategori` [Bahan Baku, Operasional, Lainnya], `keterangan`, `jumlah`).

---

## 📡 REST API Endpoints

### 🔐 Autentikasi & Akun
- `POST /api/auth/login` — Login pengguna
- `POST /api/auth/logout` — Logout dan hapus sesi
- `GET /api/auth/me` — Cek sesi login aktif
- `PUT /api/auth/profile` — Ganti username, nama, dan kata sandi baru (dilengkapi verifikasi sandi lama)

### 🍽️ Menu
- `GET /api/menu` — Daftar semua menu
- `POST /api/menu` — Tambah menu baru
- `PUT /api/menu/:id` — Update data/status menu
- `DELETE /api/menu/:id` — Hapus menu

### 📦 Stok Bahan
- `GET /api/bahan` — Daftar stok bahan baku dapur
- `POST /api/bahan` — Tambah bahan baru
- `PUT /api/bahan/:id` — Edit bahan
- `PATCH /api/bahan/:id/kurangi` — Pengurangan stok cepat `{ jumlah }`
- `PATCH /api/bahan/:id/tambah` — Penambahan stok cepat `{ jumlah }`
- `DELETE /api/bahan/:id` — Hapus bahan

### 🧾 Pesanan
- `GET /api/pesanan?tanggal=&status=` — Daftar pesanan dengan item rincian
- `GET /api/pesanan/:id` — Detail pesanan spesifik
- `POST /api/pesanan` — Buat pesanan baru *(otomatis catat ke pemasukan jika status Selesai)*
- `PUT /api/pesanan/:id` — Update status pesanan *(sinkronisasi otomatis ke kas pemasukan)*
- `DELETE /api/pesanan/:id` — Hapus pesanan

### 💰 Pemasukan
- `GET /api/pemasukan?dari=&sampai=` — Riwayat kas masuk
- `POST /api/pemasukan` — Tambah pemasukan manual
- `DELETE /api/pemasukan/:id` — Hapus pemasukan

### 💸 Pengeluaran
- `GET /api/pengeluaran?dari=&sampai=&kategori=` — Riwayat kas keluar
- `POST /api/pengeluaran` — Catat pengeluaran baru
- `PUT /api/pengeluaran/:id` — Edit pengeluaran
- `DELETE /api/pengeluaran/:id` — Hapus pengeluaran

### 📊 Dashboard & Rekap
- `GET /api/dashboard` — Ringkasan hari ini (total pesanan, pemasukan, pengeluaran, laba/rugi, stok menipis)
- `GET /api/dashboard/grafik` — Data 7 hari terakhir untuk line chart & bar chart
- `GET /api/dashboard/menu-terlaris` — Top 5 menu terlaris untuk pie chart
- `GET /api/rekap?dari=&sampai=` — Rekapitulasi finansial harian dalam rentang tanggal
- `GET /api/rekap/export?dari=&sampai=` — Export laporan ke format file CSV
