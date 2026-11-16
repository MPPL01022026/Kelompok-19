import bcrypt from 'bcryptjs';
import { pool } from './connection.js';

export async function seedDatabase() {
  const client = await pool.connect();
  try {
    console.log('🌱 Memulai proses seeding data Family Kupi ke Neon PostgreSQL...');
    await client.query('BEGIN');

    // 1. Seed User (Bu Maya)
    const existingUser = await client.query('SELECT id FROM users WHERE username = $1', ['bumaya']);
    if (existingUser.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('familykupi123', 10);
      await client.query(
        'INSERT INTO users (username, password, nama) VALUES ($1, $2, $3)',
        ['bumaya', hashedPassword, 'Bu Maya']
      );
      console.log('👤 User "bumaya" berhasil dibuat.');
    } else {
      console.log('👤 User "bumaya" sudah ada, melewati pembuatan user.');
    }

    // 2. Seed Menu
    const menuItems = [
      { nama_menu: 'Nasi Ayam Penyet', kategori: 'Makanan', harga: 18000, status: 'Tersedia' },
      { nama_menu: 'Nasi Ayam Cabe Ijo', kategori: 'Makanan', harga: 18000, status: 'Tersedia' },
      { nama_menu: 'Nasi Ayam Geprek', kategori: 'Makanan', harga: 17000, status: 'Tersedia' },
      { nama_menu: 'Nasi Ayam Bakar', kategori: 'Makanan', harga: 20000, status: 'Tersedia' },
      { nama_menu: 'Mie Goreng', kategori: 'Makanan', harga: 13000, status: 'Tersedia' },
      { nama_menu: 'Mie Rebus', kategori: 'Makanan', harga: 13000, status: 'Tersedia' },
      { nama_menu: 'Nasi Goreng', kategori: 'Makanan', harga: 15000, status: 'Tersedia' },
      { nama_menu: 'Sop Iga', kategori: 'Makanan', harga: 25000, status: 'Tersedia' },
      { nama_menu: 'Ketoprak', kategori: 'Makanan', harga: 12000, status: 'Tersedia' },
      { nama_menu: 'Nasi Kuah', kategori: 'Makanan', harga: 12000, status: 'Tersedia' },
      { nama_menu: 'Indomie', kategori: 'Makanan', harga: 10000, status: 'Tersedia' },
      { nama_menu: 'Nasi Putih', kategori: 'Makanan', harga: 5000, status: 'Tersedia' },
      { nama_menu: 'Teh Dingin', kategori: 'Minuman', harga: 5000, status: 'Tersedia' },
      { nama_menu: 'Kopi', kategori: 'Minuman', harga: 7000, status: 'Tersedia' },
      { nama_menu: 'Es Jeruk', kategori: 'Minuman', harga: 8000, status: 'Tersedia' },
      { nama_menu: 'Es Teh', kategori: 'Minuman', harga: 5000, status: 'Tersedia' },
      { nama_menu: 'Air Mineral', kategori: 'Minuman', harga: 4000, status: 'Tersedia' },
      { nama_menu: 'Paket Hemat Anak Kuliah', kategori: 'Paket', harga: 15000, status: 'Tersedia' },
    ];

    const menuCount = await client.query('SELECT COUNT(*) FROM menu');
    if (parseInt(menuCount.rows[0].count) === 0) {
      for (const m of menuItems) {
        await client.query(
          'INSERT INTO menu (nama_menu, kategori, harga, status) VALUES ($1, $2, $3, $4)',
          [m.nama_menu, m.kategori, m.harga, m.status]
        );
      }
      console.log(`🍽️ ${menuItems.length} menu berhasil di-seed.`);
    } else {
      console.log('🍽️ Menu sudah ada, melewati seed menu.');
    }

    // 3. Seed Bahan (Stok)
    const bahanItems = [
      { nama_bahan: 'Beras', satuan: 'kg', jumlah: 25, batas_minimum: 10 },
      { nama_bahan: 'Ayam', satuan: 'kg', jumlah: 3.5, batas_minimum: 5 }, // Menipis
      { nama_bahan: 'Mie Instan', satuan: 'pcs', jumlah: 45, batas_minimum: 20 },
      { nama_bahan: 'Minyak Goreng', satuan: 'liter', jumlah: 12, batas_minimum: 5 },
      { nama_bahan: 'Gula Pasir', satuan: 'kg', jumlah: 8, batas_minimum: 4 },
      { nama_bahan: 'Kopi Bubuk', satuan: 'bungkus', jumlah: 3, batas_minimum: 5 }, // Menipis
      { nama_bahan: 'Teh Celup', satuan: 'pcs', jumlah: 30, batas_minimum: 15 },
      { nama_bahan: 'Jeruk', satuan: 'kg', jumlah: 10, batas_minimum: 5 },
      { nama_bahan: 'Telur', satuan: 'butir', jumlah: 50, batas_minimum: 25 },
      { nama_bahan: 'Bawang Merah', satuan: 'kg', jumlah: 6, batas_minimum: 3 },
      { nama_bahan: 'Bawang Putih', satuan: 'kg', jumlah: 5, batas_minimum: 3 },
      { nama_bahan: 'Cabai Merah', satuan: 'kg', jumlah: 7, batas_minimum: 4 },
      { nama_bahan: 'Cabai Rawit', satuan: 'kg', jumlah: 2, batas_minimum: 3 }, // Menipis
      { nama_bahan: 'Garam', satuan: 'bungkus', jumlah: 8, batas_minimum: 5 },
      { nama_bahan: 'Kecap Manis', satuan: 'botol', jumlah: 9, batas_minimum: 4 },
      { nama_bahan: 'Saus Sambal', satuan: 'botol', jumlah: 7, batas_minimum: 4 },
      { nama_bahan: 'Gas LPG 3kg', satuan: 'tabung', jumlah: 1, batas_minimum: 2 }, // Menipis
      { nama_bahan: 'Iga Sapi', satuan: 'kg', jumlah: 6, batas_minimum: 3 },
      { nama_bahan: 'Tahu', satuan: 'pcs', jumlah: 35, batas_minimum: 20 },
      { nama_bahan: 'Tempe', satuan: 'pcs', jumlah: 25, batas_minimum: 15 },
      { nama_bahan: 'Air Galon', satuan: 'galon', jumlah: 5, batas_minimum: 3 },
    ];

    const bahanCount = await client.query('SELECT COUNT(*) FROM bahan');
    if (parseInt(bahanCount.rows[0].count) === 0) {
      for (const b of bahanItems) {
        await client.query(
          'INSERT INTO bahan (nama_bahan, satuan, jumlah, batas_minimum) VALUES ($1, $2, $3, $4)',
          [b.nama_bahan, b.satuan, b.jumlah, b.batas_minimum]
        );
      }
      console.log(`📦 ${bahanItems.length} bahan baku berhasil di-seed (dengan 4 status menipis).`);
    } else {
      console.log('📦 Bahan baku sudah ada, melewati seed bahan.');
    }

    // 4. Seed Pengeluaran (18 records in 7 days)
    const pengeluaranItems = [
      { tanggal: '2026-11-16', kategori: 'Bahan Baku', keterangan: 'Belanja sayur segar & cabai rawit ke pasar pagi', jumlah: 65000 },
      { tanggal: '2026-11-16', kategori: 'Operasional', keterangan: 'Beli es batu kristal 2 balok', jumlah: 24000 },
      { tanggal: '2026-11-15', kategori: 'Bahan Baku', keterangan: 'Beli Ayam potong segar 10 kg', jumlah: 280000 },
      { tanggal: '2026-11-15', kategori: 'Operasional', keterangan: 'Isi ulang Gas LPG 3kg (2 tabung)', jumlah: 44000 },
      { tanggal: '2026-11-15', kategori: 'Lainnya', keterangan: 'Beli kantong kresek & kotak nasi takeaway', jumlah: 35000 },
      { tanggal: '2026-11-14', kategori: 'Bahan Baku', keterangan: 'Beras Pandan Wangi 1 karung 25kg', jumlah: 340000 },
      { tanggal: '2026-11-14', kategori: 'Bahan Baku', keterangan: 'Minyak goreng kemasan 2 pouch (4 Liter)', jumlah: 68000 },
      { tanggal: '2026-11-14', kategori: 'Operasional', keterangan: 'Air Galon isi ulang (4 galon)', jumlah: 24000 },
      { tanggal: '2026-11-13', kategori: 'Bahan Baku', keterangan: 'Bumbu dapur lengkap (bawang merah, putih, jahe, lengkuas)', jumlah: 85000 },
      { tanggal: '2026-11-13', kategori: 'Bahan Baku', keterangan: 'Iga Sapi segar 5kg untuk menu Sop Iga', jumlah: 450000 },
      { tanggal: '2026-11-13', kategori: 'Operasional', keterangan: 'Token listrik PLN warung mingguan', jumlah: 100000 },
      { tanggal: '2026-11-12', kategori: 'Bahan Baku', keterangan: 'Restock Kopi Bubuk Robusta & Teh Celup', jumlah: 90000 },
      { tanggal: '2026-11-12', kategori: 'Bahan Baku', keterangan: 'Telur ayam 2 piring (60 butir)', jumlah: 110000 },
      { tanggal: '2026-11-11', kategori: 'Bahan Baku', keterangan: 'Ayam potong segar 8 kg', jumlah: 224000 },
      { tanggal: '2026-11-11', kategori: 'Operasional', keterangan: 'Sabun cuci piring & pembersih lantai', jumlah: 30000 },
      { tanggal: '2026-11-10', kategori: 'Bahan Baku', keterangan: 'Jeruk peras segar 8 kg', jumlah: 96000 },
      { tanggal: '2026-11-10', kategori: 'Bahan Baku', keterangan: 'Tahu & Tempe segar pasar', jumlah: 40000 },
      { tanggal: '2026-11-10', kategori: 'Lainnya', keterangan: 'Sedotan kertas & tisu meja', jumlah: 28000 },
    ];

    const pengeluaranCount = await client.query('SELECT COUNT(*) FROM pengeluaran');
    if (parseInt(pengeluaranCount.rows[0].count) === 0) {
      for (const p of pengeluaranItems) {
        await client.query(
          'INSERT INTO pengeluaran (tanggal, kategori, keterangan, jumlah) VALUES ($1, $2, $3, $4)',
          [p.tanggal, p.kategori, p.keterangan, p.jumlah]
        );
      }
      console.log(`💸 ${pengeluaranItems.length} transaksi pengeluaran berhasil di-seed.`);
    } else {
      console.log('💸 Pengeluaran sudah ada, melewati seed pengeluaran.');
    }

    // 5. Seed Pesanan + Pesanan Items + Pemasukan Otomatis
    const pesananCount = await client.query('SELECT COUNT(*) FROM pesanan');
    if (parseInt(pesananCount.rows[0].count) === 0) {
      // Get menu map: nama_menu -> { id, harga }
      const menuRes = await client.query('SELECT id, nama_menu, harga FROM menu');
      const menuMap = {};
      menuRes.rows.forEach(r => { menuMap[r.nama_menu] = r; });

      const rawOrders = [
        // 2026-11-16 (Hari ini)
        {
          pelanggan: 'Pak Budi Santoso',
          status: 'Selesai',
          created_at: '2026-11-16 08:30:00',
          items: [{ menu: 'Nasi Ayam Penyet', qty: 2 }, { menu: 'Teh Dingin', qty: 2 }]
        },
        {
          pelanggan: 'Mas Dimas (Meja 3)',
          status: 'Diproses',
          created_at: '2026-11-16 10:15:00',
          items: [{ menu: 'Nasi Goreng', qty: 1 }, { menu: 'Indomie', qty: 1 }, { menu: 'Kopi', qty: 1 }]
        },
        {
          pelanggan: 'Rian & Teman',
          status: 'Diproses',
          created_at: '2026-11-16 10:45:00',
          items: [{ menu: 'Paket Hemat Anak Kuliah', qty: 3 }]
        },
        {
          pelanggan: 'Bu Ratna',
          status: 'Selesai',
          created_at: '2026-11-16 09:40:00',
          items: [{ menu: 'Sop Iga', qty: 2 }, { menu: 'Es Jeruk', qty: 1 }]
        },
        {
          pelanggan: 'Doni',
          status: 'Dibatalkan',
          created_at: '2026-11-16 09:05:00',
          items: [{ menu: 'Nasi Ayam Geprek', qty: 1 }, { menu: 'Es Teh', qty: 1 }]
        },
        {
          pelanggan: 'Siti Wardani',
          status: 'Selesai',
          created_at: '2026-11-16 11:30:00',
          items: [{ menu: 'Nasi Ayam Cabe Ijo', qty: 1 }, { menu: 'Mie Goreng', qty: 1 }, { menu: 'Es Teh', qty: 1 }]
        },

        // 2026-11-15
        {
          pelanggan: 'Ahmad Fauzi',
          status: 'Selesai',
          created_at: '2026-11-15 12:30:00',
          items: [{ menu: 'Nasi Ayam Bakar', qty: 2 }, { menu: 'Kopi', qty: 1 }, { menu: 'Air Mineral', qty: 1 }]
        },
        {
          pelanggan: 'Meja 5 (Rombongan Mahasiswa)',
          status: 'Selesai',
          created_at: '2026-11-15 13:10:00',
          items: [{ menu: 'Paket Hemat Anak Kuliah', qty: 6 }]
        },
        {
          pelanggan: 'Pak RT Hendra',
          status: 'Selesai',
          created_at: '2026-11-15 18:20:00',
          items: [{ menu: 'Sop Iga', qty: 2 }, { menu: 'Nasi Putih', qty: 1 }, { menu: 'Teh Dingin', qty: 2 }]
        },
        {
          pelanggan: 'Mba Nina',
          status: 'Selesai',
          created_at: '2026-11-15 19:00:00',
          items: [{ menu: 'Ketoprak', qty: 1 }, { menu: 'Es Jeruk', qty: 1 }, { menu: 'Nasi Putih', qty: 1 }]
        },
        {
          pelanggan: 'Ojol GoFood #441',
          status: 'Selesai',
          created_at: '2026-11-15 20:15:00',
          items: [{ menu: 'Nasi Ayam Penyet', qty: 2 }]
        },

        // 2026-11-14
        {
          pelanggan: 'Keluarga Pak Joko',
          status: 'Selesai',
          created_at: '2026-11-14 12:00:00',
          items: [{ menu: 'Nasi Ayam Bakar', qty: 3 }, { menu: 'Sop Iga', qty: 1 }, { menu: 'Teh Dingin', qty: 3 }, { menu: 'Nasi Kuah', qty: 1 }]
        },
        {
          pelanggan: 'Mas Kevin',
          status: 'Selesai',
          created_at: '2026-11-14 14:30:00',
          items: [{ menu: 'Nasi Ayam Geprek', qty: 1 }, { menu: 'Es Teh', qty: 1 }]
        },
        {
          pelanggan: 'Bu Larasati',
          status: 'Selesai',
          created_at: '2026-11-14 17:10:00',
          items: [{ menu: 'Nasi Ayam Cabe Ijo', qty: 2 }, { menu: 'Nasi Kuah', qty: 1 }]
        },
        {
          pelanggan: 'Meja 2 (Anak Kos)',
          status: 'Selesai',
          created_at: '2026-11-14 19:40:00',
          items: [{ menu: 'Paket Hemat Anak Kuliah', qty: 2 }]
        },

        // 2026-11-13
        {
          pelanggan: 'Pak Yono Bengkel',
          status: 'Selesai',
          created_at: '2026-11-13 11:50:00',
          items: [{ menu: 'Nasi Ayam Penyet', qty: 2 }, { menu: 'Kopi', qty: 1 }]
        },
        {
          pelanggan: 'Dian',
          status: 'Selesai',
          created_at: '2026-11-13 13:20:00',
          items: [{ menu: 'Nasi Goreng', qty: 1 }, { menu: 'Mie Rebus', qty: 1 }]
        },
        {
          pelanggan: 'Komunitas Motor',
          status: 'Selesai',
          created_at: '2026-11-13 16:45:00',
          items: [{ menu: 'Kopi', qty: 5 }, { menu: 'Mie Goreng', qty: 3 }, { menu: 'Indomie', qty: 1 }]
        },
        {
          pelanggan: 'Fajar',
          status: 'Selesai',
          created_at: '2026-11-13 20:10:00',
          items: [{ menu: 'Paket Hemat Anak Kuliah', qty: 2 }]
        },

        // 2026-11-12
        {
          pelanggan: 'Bu Lurah',
          status: 'Selesai',
          created_at: '2026-11-12 11:30:00',
          items: [{ menu: 'Sop Iga', qty: 3 }, { menu: 'Nasi Putih', qty: 3 }, { menu: 'Es Teh', qty: 1 }]
        },
        {
          pelanggan: 'Rizky',
          status: 'Selesai',
          created_at: '2026-11-12 14:15:00',
          items: [{ menu: 'Nasi Ayam Penyet', qty: 1 }, { menu: 'Teh Dingin', qty: 1 }]
        },
        {
          pelanggan: 'Pak Danu',
          status: 'Selesai',
          created_at: '2026-11-12 18:00:00',
          items: [{ menu: 'Nasi Ayam Geprek', qty: 2 }]
        },

        // 2026-11-11
        {
          pelanggan: 'Geng Ngopi Siang',
          status: 'Selesai',
          created_at: '2026-11-11 13:45:00',
          items: [{ menu: 'Kopi', qty: 4 }, { menu: 'Es Jeruk', qty: 2 }, { menu: 'Ketoprak', qty: 1 }]
        },
        {
          pelanggan: 'Keluarga Bu Dewi',
          status: 'Selesai',
          created_at: '2026-11-11 17:30:00',
          items: [{ menu: 'Nasi Ayam Bakar', qty: 3 }, { menu: 'Paket Hemat Anak Kuliah', qty: 1 }]
        },
        {
          pelanggan: 'Bagas',
          status: 'Selesai',
          created_at: '2026-11-11 19:20:00',
          items: [{ menu: 'Nasi Goreng', qty: 1 }, { menu: 'Indomie', qty: 1 }]
        },

        // 2026-11-10
        {
          pelanggan: 'Meja 4 (Acara Ulang Tahun Kecil)',
          status: 'Selesai',
          created_at: '2026-11-10 12:00:00',
          items: [{ menu: 'Nasi Ayam Penyet', qty: 4 }, { menu: 'Paket Hemat Anak Kuliah', qty: 2 }, { menu: 'Es Jeruk', qty: 2 }, { menu: 'Air Mineral', qty: 1 }]
        },
        {
          pelanggan: 'Pak Guru Wahyu',
          status: 'Selesai',
          created_at: '2026-11-10 15:20:00',
          items: [{ menu: 'Sop Iga', qty: 1 }, { menu: 'Nasi Ayam Cabe Ijo', qty: 1 }]
        },
        {
          pelanggan: 'Bayu & Angga',
          status: 'Selesai',
          created_at: '2026-11-10 18:10:00',
          items: [{ menu: 'Mie Goreng', qty: 2 }, { menu: 'Kopi', qty: 1 }]
        },
        {
          pelanggan: 'Pelanggan Walk-in',
          status: 'Selesai',
          created_at: '2026-11-10 20:30:00',
          items: [{ menu: 'Nasi Ayam Geprek', qty: 1 }]
        },
      ];

      for (const ord of rawOrders) {
        // Calculate total
        let total = 0;
        const resolvedItems = ord.items.map(it => {
          const m = menuMap[it.menu] || { id: 1, harga: 15000 };
          const subtotal = m.harga * it.qty;
          total += subtotal;
          return { menu_id: m.id, qty: it.qty, subtotal };
        });

        // Insert pesanan
        const res = await client.query(
          'INSERT INTO pesanan (nama_pelanggan, total_harga, status, created_at) VALUES ($1, $2, $3, $4) RETURNING id',
          [ord.pelanggan, total, ord.status, ord.created_at]
        );
        const pesananId = res.rows[0].id;

        // Insert pesanan_items
        for (const item of resolvedItems) {
          await client.query(
            'INSERT INTO pesanan_item (pesanan_id, menu_id, qty, subtotal) VALUES ($1, $2, $3, $4)',
            [pesananId, item.menu_id, item.qty, item.subtotal]
          );
        }

        // If status Selesai, record in pemasukan
        if (ord.status === 'Selesai') {
          const tanggal = ord.created_at.split(' ')[0];
          await client.query(
            'INSERT INTO pemasukan (tanggal, sumber, keterangan, jumlah, pesanan_id, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
            [tanggal, 'Penjualan', `Pesanan #${pesananId} - ${ord.pelanggan}`, total, pesananId, ord.created_at]
          );
        }
      }
      console.log(`🧾 ${rawOrders.length} pesanan realistis dan pemasukan otomatis berhasil di-seed.`);
    } else {
      console.log('🧾 Pesanan sudah ada, melewati seed pesanan.');
    }

    // 6. Seed Pemasukan Manual (2 records)
    const pemasukanManualCount = await client.query('SELECT COUNT(*) FROM pemasukan WHERE pesanan_id IS NULL');
    if (parseInt(pemasukanManualCount.rows[0].count) === 0) {
      await client.query(
        'INSERT INTO pemasukan (tanggal, sumber, keterangan, jumlah, pesanan_id) VALUES ($1, $2, $3, $4, NULL)',
        ['2026-11-15', 'Lainnya', 'Pesanan snack box pengajian tetangga Bu Maya', 150000]
      );
      await client.query(
        'INSERT INTO pemasukan (tanggal, sumber, keterangan, jumlah, pesanan_id) VALUES ($1, $2, $3, $4, NULL)',
        ['2026-11-12', 'Lainnya', 'Tips / sedekah pelanggan rombongan kantor', 35000]
      );
      console.log('💰 2 pemasukan manual berhasil di-seed.');
    }

    await client.query('COMMIT');
    console.log('🎉 Seeding database Neon PostgreSQL selesai sempurna!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Gagal seeding database:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Run directly if called as a script
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
