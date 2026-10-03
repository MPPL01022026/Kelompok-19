# 📊 Project Charter
## Digital Twin Warung Kak Ros

> **Nama Proyek:** Pengembangan Sistem Informasi dan Statistik Penjualan UMKM Kak Ros  
> **Konsep:** Digital Twin Warung Kak Ros  
> **Sponsor / Pemilik Proyek:** Kak Ros  
> **Manajer Proyek:** Hamdani  
> **Tim Pengembang:** Unedo Hesekiel Clinton Sirait, Mustaqim  

---

## A. 📌 Informasi Proyek

| Komponen | Keterangan |
|---|---|
| **Nama Project** | Pengembangan Sistem Informasi dan Statistik Penjualan UMKM Kak Ros |
| **Konsep Project** | Digital Twin Warung Kak Ros |
| **Sponsor / Pemilik Proyek** | Kak Ros |
| **Manajer Proyek** | Hamdani |
| **Tim Pengembang** | Unedo Hesekiel Clinton Sirait, Mustaqim |

---

## B. 📝 Latar Belakang

Warung Kak Ros merupakan usaha mikro yang bergerak di bidang penjualan makanan dan minuman. Dalam kegiatan operasionalnya, beberapa proses seperti pencatatan pesanan, pemeriksaan stok, serta pencatatan pemasukan dan pengeluaran masih dilakukan secara manual.

Kondisi tersebut dapat menyulitkan pemantauan ketika jumlah pelanggan meningkat, terutama pada jam ramai. Pemilik juga membutuhkan informasi yang lebih mudah untuk melihat kondisi stok, pesanan, pemasukan, pengeluaran, rekap usaha, serta perkembangan usaha.

Berdasarkan hasil observasi tersebut, diperlukan sebuah sistem yang dapat merepresentasikan kondisi operasional Warung Kak Ros secara digital dan menyajikan informasi tersebut dalam satu tempat.

---

## C. 💡 Ide Proyek

Proyek ini mengusulkan **Digital Twin Warung Kak Ros**, yaitu representasi digital dari kondisi operasional warung yang memanfaatkan data kegiatan usaha untuk membantu proses pemantauan.

Sistem akan memusatkan beberapa informasi utama, yaitu:

- 🧾 Pesanan
- 📦 Stok
- 💰 Pemasukan
- 💸 Pengeluaran
- 📋 Rekap usaha
- 📈 Perkembangan usaha

Seluruh informasi tersebut akan disajikan melalui sebuah **dashboard terintegrasi**.

---

## D. 🔍 Kondisi, Kebutuhan, dan Solusi

| Kondisi Saat Ini | Kebutuhan | Solusi yang Diusulkan |
|---|---|---|
| Pesanan masih dipantau secara manual | Pemantauan pesanan yang lebih terstruktur | Pencatatan dan pemantauan pesanan |
| Stok diperiksa secara manual | Informasi stok yang mudah dipantau | Monitoring stok |
| Pemasukan dan pengeluaran dicatat manual | Pencatatan keuangan yang lebih terstruktur | Pencatatan pemasukan dan pengeluaran |
| Rekap usaha masih dilakukan secara manual | Rekap yang mudah dilihat | Dashboard rekap usaha |
| Perkembangan usaha belum divisualisasikan | Informasi perkembangan dalam bentuk visual | Grafik perkembangan usaha |

---

## E. 🎯 Tujuan Proyek

Membangun sebuah **Digital Twin** yang dapat merepresentasikan kondisi operasional Warung Kak Ros secara digital sehingga informasi mengenai:

- Pesanan
- Stok
- Pemasukan
- Pengeluaran
- Rekap
- Perkembangan usaha

dapat dipantau dalam **satu sistem terintegrasi**.

---

## F. 🚀 Solusi yang Diusulkan

Mengembangkan sistem **Digital Twin berbasis dashboard** yang merepresentasikan kondisi operasional Warung Kak Ros berdasarkan data yang dimasukkan ke dalam sistem.

### Fitur Utama

- 🧾 Pencatatan dan pemantauan pesanan
- 📦 Monitoring stok bahan
- 💰 Pencatatan pemasukan
- 💸 Pencatatan pengeluaran
- 📋 Rekap kegiatan usaha
- 📊 Grafik perkembangan usaha
- 🖥️ Dashboard kondisi operasional warung

---

## G. 📐 Ruang Lingkup

### ✅ Termasuk dalam Proyek

- Pengelolaan data pesanan
- Pengelolaan data stok
- Pengelolaan pemasukan dan penjualan
- Pengelolaan pengeluaran
- Rekap data operasional
- Dashboard dan visualisasi data
- Representasi kondisi operasional Warung Kak Ros secara digital

### ❌ Tidak Termasuk dalam Proyek

- Penggunaan sensor atau perangkat IoT
- Otomatisasi pengukuran stok secara fisik
- Pemodelan 3D warung
- Integrasi dengan sistem eksternal

---

## H. 🗓️ Jadwal Kasar (High-Level Timeline)

| Tahap | Kegiatan Utama | Perkiraan Waktu |
|---|---|---|
| **1. Inisiasi & Perencanaan** | Observasi, wawancara, penentuan ide proyek, Project Charter, stakeholder, WBS, dan pembagian tugas | Minggu 1 |
| **2. Analisis Kebutuhan** | Analisis proses operasional dan kebutuhan sistem | Minggu 1–2 |
| **3. Perancangan & Pengembangan** | Perancangan database dan antarmuka serta pengembangan fitur utama | Minggu 2–3 |
| **4. Pengujian & Finalisasi** | Pengujian, perbaikan, dokumentasi, dan persiapan presentasi | Minggu 4 |

---

## I. ⚙️ Batasan dan Asumsi

- Data sistem diperoleh dari kegiatan operasional Warung Kak Ros.
- Sistem tidak menggunakan IoT atau sensor.
- Pencatatan penggunaan bahan per pesanan masih berdasarkan data yang tersedia dari pemilik.
- Sistem berfokus pada pemantauan dan representasi kondisi operasional, bukan otomatisasi seluruh kegiatan warung.

---

## J. 👥 Daftar Stakeholder

| No. | Stakeholder | Peran | Kepentingan dalam Proyek | Keterlibatan |
|---:|---|---|---|---|
| 1 | **Kak Ros** | Pemilik UMKM | Membutuhkan sistem untuk membantu memantau kondisi operasional warung | Memberikan informasi kebutuhan, masukan, dan menjadi pengguna utama |
| 2 | **Bang Amat** | Pengelola Operasional | Membantu menjalankan kegiatan operasional warung | Memberikan informasi proses operasional dan dapat menggunakan sistem |
| 3 | **Hamdani** | Project Manager UMKM | Menghasilkan sistem Digital Twin sesuai kebutuhan proyek | Analisis, perancangan, pengembangan, pengujian, dan dokumentasi |
| 4 | **Unedo Hesekiel Clinton Sirait** | Developer | Menghasilkan sistem Digital Twin sesuai kebutuhan proyek | Analisis, perancangan, pengembangan, pengujian, dan dokumentasi |
| 5 | **Mustaqim** | Developer | Menghasilkan sistem Digital Twin sesuai kebutuhan proyek | Analisis, perancangan, pengembangan, pengujian, dan dokumentasi |
| 6 | **Ibu Cut Alna Fadila** | Dosen / Supervisor | Memastikan proyek berjalan sesuai tujuan dan ketentuan tugas | Memberikan arahan, evaluasi, dan masukan terhadap hasil proyek |

---

## K. 📊 Klasifikasi Stakeholder

Berdasarkan tingkat pengaruh dan kepentingannya terhadap proyek:

| Stakeholder | Pengaruh | Kepentingan |
|---|:---:|:---:|
| Kak Ros | Tinggi | Tinggi |
| Bang Amat | Tinggi | Tinggi |
| Hamdani | Tinggi | Tinggi |
| Unedo Hesekiel Clinton Sirait | Tinggi | Tinggi |
| Mustaqim | Tinggi | Tinggi |
| Ibu Cut Alna Fadila | Tinggi | Tinggi |

> **Kategori:** Seluruh stakeholder utama berada pada tingkat **pengaruh tinggi** dan **kepentingan tinggi**, sehingga komunikasi dan koordinasi perlu dilakukan secara aktif selama proyek berlangsung.

---

# L. 🧩 Work Breakdown Structure (WBS)

## 1. Struktur Pekerjaan Proyek

```text
1. Digital Twin Warung Kak Ros
│
├── 1.1 Inisiasi Proyek
│   ├── 1.1.1 Identifikasi objek UMKM
│   ├── 1.1.2 Observasi dan wawancara
│   ├── 1.1.3 Penyusunan Latar Belakang & Ide Proyek
│   ├── 1.1.4 Penyusunan Project Charter
│   └── 1.1.5 Identifikasi Stakeholder
│
├── 1.2 Perencanaan Proyek
│   ├── 1.2.1 Penyusunan WBS
│   ├── 1.2.2 Identifikasi kebutuhan sistem
│   ├── 1.2.3 Perhitungan Function Point
│   ├── 1.2.4 Pembagian tugas tim
│   ├── 1.2.5 Penyusunan jadwal proyek
│   └── 1.2.6 Pengelolaan tugas menggunakan Trello
│
├── 1.3 Analisis Kebutuhan
│   ├── 1.3.1 Analisis proses operasional warung
│   ├── 1.3.2 Analisis kebutuhan pesanan
│   ├── 1.3.3 Analisis kebutuhan stok
│   ├── 1.3.4 Analisis kebutuhan pemasukan dan pengeluaran
│   ├── 1.3.5 Analisis kebutuhan rekap
│   └── 1.3.6 Analisis kebutuhan dashboard
│
├── 1.4 Perancangan Sistem
│   ├── 1.4.1 Perancangan alur sistem
│   ├── 1.4.2 Perancangan database
│   ├── 1.4.3 Perancangan antarmuka
│   └── 1.4.4 Perancangan dashboard Digital Twin
│
├── 1.5 Pengembangan Sistem
│   ├── 1.5.1 Pengembangan modul pesanan
│   ├── 1.5.2 Pengembangan modul stok
│   ├── 1.5.3 Pengembangan modul pemasukan
│   ├── 1.5.4 Pengembangan modul pengeluaran
│   ├── 1.5.5 Pengembangan rekap
│   └── 1.5.6 Pengembangan dashboard dan grafik
│
├── 1.6 Pengujian Sistem
│   ├── 1.6.1 Pengujian fitur pesanan
│   ├── 1.6.2 Pengujian fitur stok
│   ├── 1.6.3 Pengujian fitur keuangan
│   ├── 1.6.4 Pengujian dashboard
│   └── 1.6.5 Evaluasi bersama pemilik
│
└── 1.7 Dokumentasi dan Penyelesaian
    ├── 1.7.1 Dokumentasi proses pengembangan
    ├── 1.7.2 Dokumentasi hasil pengujian
    ├── 1.7.3 Penyusunan laporan proyek
    └── 1.7.4 Finalisasi dan presentasi
```

### 🔗 Project Management

Untuk pengelolaan task, pembagian pekerjaan, dan pemantauan progres proyek digunakan **Trello**.

**Board Trello:**  
[Digital Twin Warung Kak Ros](https://trello.com/b/uidA3Hw4/digital-twin-warung-kak-ros)

> Trello digunakan sebagai media pendukung WBS untuk memvisualisasikan pekerjaan proyek, status tugas, pembagian tugas anggota, serta progres pengembangan.

---

# 📌 Ringkasan Proyek

| Aspek | Ringkasan |
|---|---|
| **Proyek** | Digital Twin Warung Kak Ros |
| **Fokus** | Sistem informasi dan statistik penjualan UMKM |
| **Objek** | Warung Kak Ros |
| **Konsep Utama** | Representasi digital kondisi operasional warung |
| **Data Utama** | Pesanan, stok, pemasukan, pengeluaran, rekap |
| **Output Utama** | Dashboard dan visualisasi perkembangan usaha |
| **Manajemen Tugas** | Trello |
| **Durasi** | 4 Minggu |
| **Pengguna Utama** | Kak Ros dan pengelola operasional |
| **Batasan Utama** | Tanpa IoT, sensor, 3D, dan integrasi sistem eksternal |

---

## 🔗 Referensi Proyek

- **Trello Board:** [Digital Twin Warung Kak Ros](https://trello.com/b/uidA3Hw4/digital-twin-warung-kak-ros)

---

<div align="center">

### 🏪 Digital Twin Warung Kak Ros

**Sistem Informasi dan Statistik Penjualan UMKM**

> *Mengubah data operasional menjadi informasi yang mudah dipantau.*

</div>
