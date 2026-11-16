export const initialMenu = [
  { id: 1, nama_menu: 'Nasi Ayam Penyet', kategori: 'Makanan', harga: 18000, status: 'Tersedia' },
  { id: 2, nama_menu: 'Nasi Ayam Cabe Ijo', kategori: 'Makanan', harga: 18000, status: 'Tersedia' },
  { id: 3, nama_menu: 'Nasi Ayam Geprek', kategori: 'Makanan', harga: 17000, status: 'Tersedia' },
  { id: 4, nama_menu: 'Nasi Ayam Bakar', kategori: 'Makanan', harga: 20000, status: 'Tersedia' },
  { id: 5, nama_menu: 'Mie Goreng', kategori: 'Makanan', harga: 13000, status: 'Tersedia' },
  { id: 6, nama_menu: 'Mie Rebus', kategori: 'Makanan', harga: 13000, status: 'Tersedia' },
  { id: 7, nama_menu: 'Nasi Goreng', kategori: 'Makanan', harga: 15000, status: 'Tersedia' },
  { id: 8, nama_menu: 'Sop Iga', kategori: 'Makanan', harga: 25000, status: 'Tersedia' },
  { id: 9, nama_menu: 'Ketoprak', kategori: 'Makanan', harga: 12000, status: 'Tersedia' },
  { id: 10, nama_menu: 'Nasi Kuah', kategori: 'Makanan', harga: 12000, status: 'Tersedia' },
  { id: 11, nama_menu: 'Indomie', kategori: 'Makanan', harga: 10000, status: 'Tersedia' },
  { id: 12, nama_menu: 'Nasi Putih', kategori: 'Makanan', harga: 5000, status: 'Tersedia' },
  { id: 13, nama_menu: 'Teh Dingin', kategori: 'Minuman', harga: 5000, status: 'Tersedia' },
  { id: 14, nama_menu: 'Kopi', kategori: 'Minuman', harga: 7000, status: 'Tersedia' },
  { id: 15, nama_menu: 'Es Jeruk', kategori: 'Minuman', harga: 8000, status: 'Tersedia' },
  { id: 16, nama_menu: 'Es Teh', kategori: 'Minuman', harga: 5000, status: 'Tersedia' },
  { id: 17, nama_menu: 'Air Mineral', kategori: 'Minuman', harga: 4000, status: 'Tersedia' },
  { id: 18, nama_menu: 'Paket Hemat Anak Kuliah', kategori: 'Paket', harga: 15000, status: 'Tersedia' },
];

export const initialBahan = [
  { id: 1, nama_bahan: 'Beras', satuan: 'kg', jumlah: 25, batas_minimum: 10 },
  { id: 2, nama_bahan: 'Ayam', satuan: 'kg', jumlah: 3.5, batas_minimum: 5 }, // Menipis
  { id: 3, nama_bahan: 'Mie Instan', satuan: 'pcs', jumlah: 45, batas_minimum: 20 },
  { id: 4, nama_bahan: 'Minyak Goreng', satuan: 'liter', jumlah: 12, batas_minimum: 5 },
  { id: 5, nama_bahan: 'Gula Pasir', satuan: 'kg', jumlah: 8, batas_minimum: 4 },
  { id: 6, nama_bahan: 'Kopi Bubuk', satuan: 'bungkus', jumlah: 3, batas_minimum: 5 }, // Menipis
  { id: 7, nama_bahan: 'Teh Celup', satuan: 'pcs', jumlah: 30, batas_minimum: 15 },
  { id: 8, nama_bahan: 'Jeruk', satuan: 'kg', jumlah: 10, batas_minimum: 5 },
  { id: 9, nama_bahan: 'Telur', satuan: 'butir', jumlah: 50, batas_minimum: 25 },
  { id: 10, nama_bahan: 'Bawang Merah', satuan: 'kg', jumlah: 6, batas_minimum: 3 },
  { id: 11, nama_bahan: 'Bawang Putih', satuan: 'kg', jumlah: 5, batas_minimum: 3 },
  { id: 12, nama_bahan: 'Cabai Merah', satuan: 'kg', jumlah: 7, batas_minimum: 4 },
  { id: 13, nama_bahan: 'Cabai Rawit', satuan: 'kg', jumlah: 2, batas_minimum: 3 }, // Menipis
  { id: 14, nama_bahan: 'Garam', satuan: 'bungkus', jumlah: 8, batas_minimum: 5 },
  { id: 15, nama_bahan: 'Kecap Manis', satuan: 'botol', jumlah: 9, batas_minimum: 4 },
  { id: 16, nama_bahan: 'Saus Sambal', satuan: 'botol', jumlah: 7, batas_minimum: 4 },
  { id: 17, nama_bahan: 'Gas LPG 3kg', satuan: 'tabung', jumlah: 1, batas_minimum: 2 }, // Menipis
  { id: 18, nama_bahan: 'Iga Sapi', satuan: 'kg', jumlah: 6, batas_minimum: 3 },
  { id: 19, nama_bahan: 'Tahu', satuan: 'pcs', jumlah: 35, batas_minimum: 20 },
  { id: 20, nama_bahan: 'Tempe', satuan: 'pcs', jumlah: 25, batas_minimum: 15 },
  { id: 21, nama_bahan: 'Air Galon', satuan: 'galon', jumlah: 5, batas_minimum: 3 },
];

export const initialPesanan = [
  // 14 Nov 2026 (Hari ini)
  {
    id: 101,
    nama_pelanggan: 'Pak Budi Santoso',
    total_harga: 46000,
    status: 'Selesai',
    created_at: '2026-11-14T08:30:00.000Z',
    items: [
      { menu_id: 1, nama_menu: 'Nasi Ayam Penyet', qty: 2, harga: 18000, subtotal: 36000 },
      { menu_id: 13, nama_menu: 'Teh Dingin', qty: 2, harga: 5000, subtotal: 10000 },
    ],
  },
  {
    id: 102,
    nama_pelanggan: 'Mas Dimas (Meja 3)',
    total_harga: 32000,
    status: 'Diproses',
    created_at: '2026-11-14T11:15:00.000Z',
    items: [
      { menu_id: 7, nama_menu: 'Nasi Goreng', qty: 1, harga: 15000, subtotal: 15000 },
      { menu_id: 11, nama_menu: 'Indomie', qty: 1, harga: 10000, subtotal: 10000 },
      { menu_id: 14, nama_menu: 'Kopi', qty: 1, harga: 7000, subtotal: 7000 },
    ],
  },
  {
    id: 103,
    nama_pelanggan: 'Rian & Teman',
    total_harga: 45000,
    status: 'Diproses',
    created_at: '2026-11-14T11:45:00.000Z',
    items: [
      { menu_id: 18, nama_menu: 'Paket Hemat Anak Kuliah', qty: 3, harga: 15000, subtotal: 45000 },
    ],
  },
  {
    id: 104,
    nama_pelanggan: 'Bu Ratna',
    total_harga: 58000,
    status: 'Selesai',
    created_at: '2026-11-14T09:40:00.000Z',
    items: [
      { menu_id: 8, nama_menu: 'Sop Iga', qty: 2, harga: 25000, subtotal: 50000 },
      { menu_id: 15, nama_menu: 'Es Jeruk', qty: 1, harga: 8000, subtotal: 8000 },
    ],
  },
  {
    id: 105,
    nama_pelanggan: 'Doni',
    total_harga: 23000,
    status: 'Dibatalkan',
    created_at: '2026-11-14T10:05:00.000Z',
    items: [
      { menu_id: 3, nama_menu: 'Nasi Ayam Geprek', qty: 1, harga: 17000, subtotal: 17000 },
      { menu_id: 16, nama_menu: 'Es Teh', qty: 1, harga: 5000, subtotal: 5000 },
    ],
  },
  {
    id: 106,
    nama_pelanggan: 'Siti Wardani',
    total_harga: 36000,
    status: 'Selesai',
    created_at: '2026-11-14T10:30:00.000Z',
    items: [
      { menu_id: 2, nama_menu: 'Nasi Ayam Cabe Ijo', qty: 1, harga: 18000, subtotal: 18000 },
      { menu_id: 5, nama_menu: 'Mie Goreng', qty: 1, harga: 13000, subtotal: 13000 },
      { menu_id: 16, nama_menu: 'Es Teh', qty: 1, harga: 5000, subtotal: 5000 },
    ],
  },

  // 13 Nov 2026
  {
    id: 107,
    nama_pelanggan: 'Ahmad Fauzi',
    total_harga: 51000,
    status: 'Selesai',
    created_at: '2026-11-13T12:30:00.000Z',
    items: [
      { menu_id: 4, nama_menu: 'Nasi Ayam Bakar', qty: 2, harga: 20000, subtotal: 40000 },
      { menu_id: 14, nama_menu: 'Kopi', qty: 1, harga: 7000, subtotal: 7000 },
      { menu_id: 17, nama_menu: 'Air Mineral', qty: 1, harga: 4000, subtotal: 4000 },
    ],
  },
  {
    id: 108,
    nama_pelanggan: 'Meja 5 (Rombongan Mahasiswa)',
    total_harga: 90000,
    status: 'Selesai',
    created_at: '2026-11-13T13:10:00.000Z',
    items: [
      { menu_id: 18, nama_menu: 'Paket Hemat Anak Kuliah', qty: 6, harga: 15000, subtotal: 90000 },
    ],
  },
  {
    id: 109,
    nama_pelanggan: 'Pak RT Hendra',
    total_harga: 65000,
    status: 'Selesai',
    created_at: '2026-11-13T18:20:00.000Z',
    items: [
      { menu_id: 8, nama_menu: 'Sop Iga', qty: 2, harga: 25000, subtotal: 50000 },
      { menu_id: 12, nama_menu: 'Nasi Putih', qty: 1, harga: 5000, subtotal: 5000 },
      { menu_id: 13, nama_menu: 'Teh Dingin', qty: 2, harga: 5000, subtotal: 10000 },
    ],
  },
  {
    id: 110,
    nama_pelanggan: 'Mba Nina',
    total_harga: 25000,
    status: 'Selesai',
    created_at: '2026-11-13T19:00:00.000Z',
    items: [
      { menu_id: 9, nama_menu: 'Ketoprak', qty: 1, harga: 12000, subtotal: 12000 },
      { menu_id: 15, nama_menu: 'Es Jeruk', qty: 1, harga: 8000, subtotal: 8000 },
      { menu_id: 12, nama_menu: 'Nasi Putih', qty: 1, harga: 5000, subtotal: 5000 },
    ],
  },
  {
    id: 111,
    nama_pelanggan: 'Ojol GoFood #441',
    total_harga: 36000,
    status: 'Selesai',
    created_at: '2026-11-13T20:15:00.000Z',
    items: [
      { menu_id: 1, nama_menu: 'Nasi Ayam Penyet', qty: 2, harga: 18000, subtotal: 36000 },
    ],
  },

  // 12 Nov 2026
  {
    id: 112,
    nama_pelanggan: 'Keluarga Pak Joko',
    total_harga: 112000,
    status: 'Selesai',
    created_at: '2026-11-12T12:00:00.000Z',
    items: [
      { menu_id: 4, nama_menu: 'Nasi Ayam Bakar', qty: 3, harga: 20000, subtotal: 60000 },
      { menu_id: 8, nama_menu: 'Sop Iga', qty: 1, harga: 25000, subtotal: 25000 },
      { menu_id: 13, nama_menu: 'Teh Dingin', qty: 3, harga: 5000, subtotal: 15000 },
      { menu_id: 10, nama_menu: 'Nasi Kuah', qty: 1, harga: 12000, subtotal: 12000 },
    ],
  },
  {
    id: 113,
    nama_pelanggan: 'Mas Kevin',
    total_harga: 22000,
    status: 'Selesai',
    created_at: '2026-11-12T14:30:00.000Z',
    items: [
      { menu_id: 3, nama_menu: 'Nasi Ayam Geprek', qty: 1, harga: 17000, subtotal: 17000 },
      { menu_id: 16, nama_menu: 'Es Teh', qty: 1, harga: 5000, subtotal: 5000 },
    ],
  },
  {
    id: 114,
    nama_pelanggan: 'Bu Larasati',
    total_harga: 48000,
    status: 'Selesai',
    created_at: '2026-11-12T17:10:00.000Z',
    items: [
      { menu_id: 2, nama_menu: 'Nasi Ayam Cabe Ijo', qty: 2, harga: 18000, subtotal: 36000 },
      { menu_id: 10, nama_menu: 'Nasi Kuah', qty: 1, harga: 12000, subtotal: 12000 },
    ],
  },
  {
    id: 115,
    nama_pelanggan: 'Meja 2 (Anak Kos)',
    total_harga: 30000,
    status: 'Selesai',
    created_at: '2026-11-12T19:40:00.000Z',
    items: [
      { menu_id: 18, nama_menu: 'Paket Hemat Anak Kuliah', qty: 2, harga: 15000, subtotal: 30000 },
    ],
  },

  // 11 Nov 2026
  {
    id: 116,
    nama_pelanggan: 'Pak Yono Bengkel',
    total_harga: 42000,
    status: 'Selesai',
    created_at: '2026-11-11T11:50:00.000Z',
    items: [
      { menu_id: 1, nama_menu: 'Nasi Ayam Penyet', qty: 2, harga: 18000, subtotal: 36000 },
      { menu_id: 14, nama_menu: 'Kopi', qty: 1, harga: 7000, subtotal: 7000 },
    ],
  },
  {
    id: 117,
    nama_pelanggan: 'Dian',
    total_harga: 28000,
    status: 'Selesai',
    created_at: '2026-11-11T13:20:00.000Z',
    items: [
      { menu_id: 7, nama_menu: 'Nasi Goreng', qty: 1, harga: 15000, subtotal: 15000 },
      { menu_id: 6, nama_menu: 'Mie Rebus', qty: 1, harga: 13000, subtotal: 13000 },
    ],
  },
  {
    id: 118,
    nama_pelanggan: 'Komunitas Motor',
    total_harga: 85000,
    status: 'Selesai',
    created_at: '2026-11-11T16:45:00.000Z',
    items: [
      { menu_id: 14, nama_menu: 'Kopi', qty: 5, harga: 7000, subtotal: 35000 },
      { menu_id: 5, nama_menu: 'Mie Goreng', qty: 3, harga: 13000, subtotal: 39000 },
      { menu_id: 11, nama_menu: 'Indomie', qty: 1, harga: 10000, subtotal: 10000 },
    ],
  },
  {
    id: 119,
    nama_pelanggan: 'Fajar',
    total_harga: 30000,
    status: 'Selesai',
    created_at: '2026-11-11T20:10:00.000Z',
    items: [
      { menu_id: 18, nama_menu: 'Paket Hemat Anak Kuliah', qty: 2, harga: 15000, subtotal: 30000 },
    ],
  },

  // 10 Nov 2026
  {
    id: 120,
    nama_pelanggan: 'Bu Lurah',
    total_harga: 95000,
    status: 'Selesai',
    created_at: '2026-11-10T11:30:00.000Z',
    items: [
      { menu_id: 8, nama_menu: 'Sop Iga', qty: 3, harga: 25000, subtotal: 75000 },
      { menu_id: 12, nama_menu: 'Nasi Putih', qty: 3, harga: 5000, subtotal: 15000 },
      { menu_id: 16, nama_menu: 'Es Teh', qty: 1, harga: 5000, subtotal: 5000 },
    ],
  },
  {
    id: 121,
    nama_pelanggan: 'Rizky',
    total_harga: 23000,
    status: 'Selesai',
    created_at: '2026-11-10T14:15:00.000Z',
    items: [
      { menu_id: 1, nama_menu: 'Nasi Ayam Penyet', qty: 1, harga: 18000, subtotal: 18000 },
      { menu_id: 13, nama_menu: 'Teh Dingin', qty: 1, harga: 5000, subtotal: 5000 },
    ],
  },
  {
    id: 122,
    nama_pelanggan: 'Pak Danu',
    total_harga: 34000,
    status: 'Selesai',
    created_at: '2026-11-10T18:00:00.000Z',
    items: [
      { menu_id: 3, nama_menu: 'Nasi Ayam Geprek', qty: 2, harga: 17000, subtotal: 34000 },
    ],
  },

  // 09 Nov 2026
  {
    id: 123,
    nama_pelanggan: 'Geng Ngopi Siang',
    total_harga: 56000,
    status: 'Selesai',
    created_at: '2026-11-09T13:45:00.000Z',
    items: [
      { menu_id: 14, nama_menu: 'Kopi', qty: 4, harga: 7000, subtotal: 28000 },
      { menu_id: 15, nama_menu: 'Es Jeruk', qty: 2, harga: 8000, subtotal: 16000 },
      { menu_id: 9, nama_menu: 'Ketoprak', qty: 1, harga: 12000, subtotal: 12000 },
    ],
  },
  {
    id: 124,
    nama_pelanggan: 'Keluarga Bu Dewi',
    total_harga: 75000,
    status: 'Selesai',
    created_at: '2026-11-09T17:30:00.000Z',
    items: [
      { menu_id: 4, nama_menu: 'Nasi Ayam Bakar', qty: 3, harga: 20000, subtotal: 60000 },
      { menu_id: 18, nama_menu: 'Paket Hemat Anak Kuliah', qty: 1, harga: 15000, subtotal: 15000 },
    ],
  },
  {
    id: 125,
    nama_pelanggan: 'Bagas',
    total_harga: 25000,
    status: 'Selesai',
    created_at: '2026-11-09T19:20:00.000Z',
    items: [
      { menu_id: 7, nama_menu: 'Nasi Goreng', qty: 1, harga: 15000, subtotal: 15000 },
      { menu_id: 11, nama_menu: 'Indomie', qty: 1, harga: 10000, subtotal: 10000 },
    ],
  },

  // 08 Nov 2026
  {
    id: 126,
    nama_pelanggan: 'Meja 4 (Acara Ulang Tahun Kecil)',
    total_harga: 120000,
    status: 'Selesai',
    created_at: '2026-11-08T12:00:00.000Z',
    items: [
      { menu_id: 1, nama_menu: 'Nasi Ayam Penyet', qty: 4, harga: 18000, subtotal: 72000 },
      { menu_id: 18, nama_menu: 'Paket Hemat Anak Kuliah', qty: 2, harga: 15000, subtotal: 30000 },
      { menu_id: 15, nama_menu: 'Es Jeruk', qty: 2, harga: 8000, subtotal: 16000 },
      { menu_id: 17, nama_menu: 'Air Mineral', qty: 1, harga: 4000, subtotal: 4000 },
    ],
  },
  {
    id: 127,
    nama_pelanggan: 'Pak Guru Wahyu',
    total_harga: 43000,
    status: 'Selesai',
    created_at: '2026-11-08T15:20:00.000Z',
    items: [
      { menu_id: 8, nama_menu: 'Sop Iga', qty: 1, harga: 25000, subtotal: 25000 },
      { menu_id: 2, nama_menu: 'Nasi Ayam Cabe Ijo', qty: 1, harga: 18000, subtotal: 18000 },
    ],
  },
  {
    id: 128,
    nama_pelanggan: 'Bayu & Angga',
    total_harga: 32000,
    status: 'Selesai',
    created_at: '2026-11-08T18:10:00.000Z',
    items: [
      { menu_id: 5, nama_menu: 'Mie Goreng', qty: 2, harga: 13000, subtotal: 26000 },
      { menu_id: 14, nama_menu: 'Kopi', qty: 1, harga: 7000, subtotal: 7000 },
    ],
  },
  {
    id: 129,
    nama_pelanggan: 'Pelanggan Walk-in',
    total_harga: 17000,
    status: 'Selesai',
    created_at: '2026-11-08T20:30:00.000Z',
    items: [
      { menu_id: 3, nama_menu: 'Nasi Ayam Geprek', qty: 1, harga: 17000, subtotal: 17000 },
    ],
  },
];

export const initialPengeluaran = [
  { id: 1, tanggal: '2026-11-14', kategori: 'Bahan Baku', keterangan: 'Belanja sayur segar & cabai rawit ke pasar pagi', jumlah: 65000, created_at: '2026-11-14T06:00:00.000Z' },
  { id: 2, tanggal: '2026-11-14', kategori: 'Operasional', keterangan: 'Beli es batu kristal 2 balok', jumlah: 24000, created_at: '2026-11-14T07:30:00.000Z' },
  { id: 3, tanggal: '2026-11-13', kategori: 'Bahan Baku', keterangan: 'Beli Ayam potong segar 10 kg', jumlah: 280000, created_at: '2026-11-13T06:15:00.000Z' },
  { id: 4, tanggal: '2026-11-13', kategori: 'Operasional', keterangan: 'Isi ulang Gas LPG 3kg (2 tabung)', jumlah: 44000, created_at: '2026-11-13T09:00:00.000Z' },
  { id: 5, tanggal: '2026-11-13', kategori: 'Lainnya', keterangan: 'Beli kantong kresek & kotak nasi takeaway', jumlah: 35000, created_at: '2026-11-13T10:45:00.000Z' },
  { id: 6, tanggal: '2026-11-12', kategori: 'Bahan Baku', keterangan: 'Beras Pandan Wangi 1 karung 25kg', jumlah: 340000, created_at: '2026-11-12T07:00:00.000Z' },
  { id: 7, tanggal: '2026-11-12', kategori: 'Bahan Baku', keterangan: 'Minyak goreng kemasan 2 pouch (4 Liter)', jumlah: 68000, created_at: '2026-11-12T08:00:00.000Z' },
  { id: 8, tanggal: '2026-11-12', kategori: 'Operasional', keterangan: 'Air Galon isi ulang (4 galon)', jumlah: 24000, created_at: '2026-11-12T09:30:00.000Z' },
  { id: 9, tanggal: '2026-11-11', kategori: 'Bahan Baku', keterangan: 'Bumbu dapur lengkap (bawang merah, putih, jahe, lengkuas)', jumlah: 85000, created_at: '2026-11-11T06:30:00.000Z' },
  { id: 10, tanggal: '2026-11-11', kategori: 'Bahan Baku', keterangan: 'Iga Sapi segar 5kg untuk menu Sop Iga', jumlah: 450000, created_at: '2026-11-11T07:15:00.000Z' },
  { id: 11, tanggal: '2026-11-11', kategori: 'Operasional', keterangan: 'Token listrik PLN warung mingguan', jumlah: 100000, created_at: '2026-11-11T14:00:00.000Z' },
  { id: 12, tanggal: '2026-11-10', kategori: 'Bahan Baku', keterangan: 'Restock Kopi Bubuk Robusta & Teh Celup', jumlah: 90000, created_at: '2026-11-10T08:00:00.000Z' },
  { id: 13, tanggal: '2026-11-10', kategori: 'Bahan Baku', keterangan: 'Telur ayam 2 piring (60 butir)', jumlah: 110000, created_at: '2026-11-10T09:00:00.000Z' },
  { id: 14, tanggal: '2026-11-09', kategori: 'Bahan Baku', keterangan: 'Ayam potong segar 8 kg', jumlah: 224000, created_at: '2026-11-09T06:15:00.000Z' },
  { id: 15, tanggal: '2026-11-09', kategori: 'Operasional', keterangan: 'Sabun cuci piring & pembersih lantai', jumlah: 30000, created_at: '2026-11-09T10:00:00.000Z' },
  { id: 16, tanggal: '2026-11-08', kategori: 'Bahan Baku', keterangan: 'Jeruk peras segar 8 kg', jumlah: 96000, created_at: '2026-11-08T06:45:00.000Z' },
  { id: 17, tanggal: '2026-11-08', kategori: 'Bahan Baku', keterangan: 'Tahu & Tempe segar pasar', jumlah: 40000, created_at: '2026-11-08T07:30:00.000Z' },
  { id: 18, tanggal: '2026-11-08', kategori: 'Lainnya', keterangan: 'Sedotan kertas & tisu meja', jumlah: 28000, created_at: '2026-11-08T11:00:00.000Z' },
];

export const initialPemasukanManual = [
  { id: 901, tanggal: '2026-11-13', sumber: 'Lainnya', keterangan: 'Pesanan snack box pengajian tetangga Bu Maya', jumlah: 150000, pesanan_id: null, created_at: '2026-11-13T15:00:00.000Z' },
  { id: 902, tanggal: '2026-11-10', sumber: 'Lainnya', keterangan: 'Tips / sedekah pelanggan rombongan kantor', jumlah: 35000, pesanan_id: null, created_at: '2026-11-10T19:30:00.000Z' },
];
