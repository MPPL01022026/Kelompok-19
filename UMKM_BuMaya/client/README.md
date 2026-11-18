# ☕ Digital Twin Warung Bu Maya — Frontend (Client)

Panduan lengkap instalasi dan menjalankan antarmuka (*frontend*) aplikasi **Digital Twin Warung Bu Maya** pada laptop baru / laptop kawan.

---

## 💻 1. Prasyarat Sistem (Sebelum Mulai)

Pastikan laptop kawan2 sudah memiliki:
1. **Node.js** (Disarankan versi LTS: v18, v20, atau v22 ke atas)  
   👉 Unduh jika belum ada: [https://nodejs.org/](https://nodejs.org/) (pilih versi *LTS*, install dengan mencentang opsi *Add to PATH*).
2. **Web Browser Modern** (Google Chrome, Microsoft Edge, Mozilla Firefox, dll).
3. **Terminal / Shell** (PowerShell, Command Prompt / CMD, atau Git Bash).

---

## 🚀 2. Langkah-Langkah Instalasi & Menjalankan

### Langkah 1: Buka Folder Client di Terminal
Buka aplikasi terminal (PowerShell / Command Prompt / Git Bash), lalu arahkan (*navigate*) ke folder `client`:

```bash
# Contoh jika folder project berada di Desktop:
cd "lokasi\folder\Kelompok-19\UMKM_BuMaya\client"
```

> 💡 **Tips cepat untuk pengguna Windows:**  
> Buka folder `UMKM_BuMaya/client` lewat File Explorer, klik pada *address bar* di bagian atas, ketik `cmd` atau `powershell`, lalu tekan **Enter**. Terminal akan langsung terbuka di folder tersebut.

---

### Langkah 2: Pastikan Node.js dan NPM Terpasang
Ketik perintah berikut di terminal untuk memastikan Node.js sudah siap:

```bash
node -v
npm -v
```
*Jika muncul versi angka (misal `v22.19.0` dan `10.9.3`), berarti Node.js sudah siap digunakan.*

---

### Langkah 3: Install Dependensi Project
Jalankan perintah ini untuk mengunduh semua pustaka (*packages*) yang dibutuhkan:

```bash
npm install
```

> ℹ️ **Catatan:** Folder `node_modules` sengaja tidak disertakan saat meng-copy/meng-clone file project agar ukuran file ringan. Perintah `npm install` di atas akan otomatis mendownload seluruh dependensi yang tercatat di `package.json`.

---

### Langkah 4: Jalankan Server Frontend
Setelah instalasi paket selesai, jalankan server pengembangannya:

```bash
npm run dev
```

Jika berhasil, terminal akan menampilkan output seperti ini:

```text
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Langkah 5: Buka di Browser
1. Buka peramban web (Chrome / Edge / Firefox).
2. Ketik alamat: **`http://localhost:5173`** lalu tekan Enter.
3. Halaman Login **Digital Twin Warung Bu Maya** akan tampil.

---

## 🔑 3. Akun Login untuk Demo

Gunakan kredensial default pemilik warung berikut:

| Field | Kredensial |
|---|---|
| **Username** | `bumaya` |
| **Password** | `familykupi123` |

> 💡 **Kemudahan Demo:** Pada halaman login, Anda juga bisa langsung mengklik kotak kuning **"Akun Default Bu Maya (Klik untuk isi cepat)"**, form akan otomatis terisi sendiri!

---

## ❓ 4. Masalah Umum & Solusi (Troubleshooting)

### A. Muncul error `npm : The term 'npm' is not recognized...`
- **Penyebab:** Node.js belum diinstall atau path sistem belum diperbarui.
- **Solusi:** Install Node.js dari [nodejs.org](https://nodejs.org). Setelah install, **tutup semua jendela terminal** lalu buka terminal baru.

### B. Muncul error PowerShell `cannot be loaded because running scripts is disabled...`
- **Penyebab:** Kebijakan eksekusi skrip bawaan Windows PowerShell memblokir script npm.
- **Solusi:** Buka PowerShell sebagai Administrator, lalu jalankan:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
  ```
  Atau jalankan perintah lewat **Command Prompt (CMD)** biasa.

### C. Port 5173 sudah dipakai aplikasi lain
- **Solusi:** Vite akan otomatis menggunakan port berikutnya (misal `http://localhost:5174`). Perhatikan URL yang muncul pada terminal saat `npm run dev` dijalankan.

---

## 🛠️ 5. Teknologi yang Digunakan
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Grafik & Visualisasi Data**: Recharts
- **Ikon**: Lucide React
- **Notifikasi**: React Hot Toast
- **Database Lokal Demo**: LocalStorage dengan Seed Data Realistis (Menu, Stok Bahan, Pesanan 7 Hari, Pemasukan & Pengeluaran Kas)
