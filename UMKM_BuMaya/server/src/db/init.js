import { pool } from './connection.js';

export async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('🔄 Menginisialisasi tabel-tabel di Neon PostgreSQL...');

    await client.query('BEGIN');

    // 1. Table users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nama VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // 2. Table menu
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu (
        id SERIAL PRIMARY KEY,
        nama_menu VARCHAR(150) NOT NULL,
        kategori VARCHAR(50) NOT NULL,
        harga INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'Tersedia' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // 3. Table bahan
    await client.query(`
      CREATE TABLE IF NOT EXISTS bahan (
        id SERIAL PRIMARY KEY,
        nama_bahan VARCHAR(150) NOT NULL,
        satuan VARCHAR(50) NOT NULL,
        jumlah NUMERIC(10, 2) DEFAULT 0 NOT NULL,
        batas_minimum NUMERIC(10, 2) DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // 4. Table pesanan
    await client.query(`
      CREATE TABLE IF NOT EXISTS pesanan (
        id SERIAL PRIMARY KEY,
        nama_pelanggan VARCHAR(150),
        total_harga INTEGER DEFAULT 0 NOT NULL,
        status VARCHAR(50) DEFAULT 'Diproses' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // 5. Table pesanan_item
    await client.query(`
      CREATE TABLE IF NOT EXISTS pesanan_item (
        id SERIAL PRIMARY KEY,
        pesanan_id INTEGER NOT NULL REFERENCES pesanan(id) ON DELETE CASCADE,
        menu_id INTEGER REFERENCES menu(id) ON DELETE SET NULL,
        qty INTEGER DEFAULT 1 NOT NULL,
        subtotal INTEGER DEFAULT 0 NOT NULL
      );
    `);

    // 6. Table pemasukan
    await client.query(`
      CREATE TABLE IF NOT EXISTS pemasukan (
        id SERIAL PRIMARY KEY,
        tanggal DATE DEFAULT CURRENT_DATE NOT NULL,
        sumber VARCHAR(50) NOT NULL,
        keterangan VARCHAR(255) NOT NULL,
        jumlah INTEGER NOT NULL,
        pesanan_id INTEGER REFERENCES pesanan(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // 7. Table pengeluaran
    await client.query(`
      CREATE TABLE IF NOT EXISTS pengeluaran (
        id SERIAL PRIMARY KEY,
        tanggal DATE DEFAULT CURRENT_DATE NOT NULL,
        kategori VARCHAR(50) NOT NULL,
        keterangan VARCHAR(255) NOT NULL,
        jumlah INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // Indexes for fast lookup
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pesanan_created_at ON pesanan(created_at);
      CREATE INDEX IF NOT EXISTS idx_pesanan_status ON pesanan(status);
      CREATE INDEX IF NOT EXISTS idx_pemasukan_tanggal ON pemasukan(tanggal);
      CREATE INDEX IF NOT EXISTS idx_pengeluaran_tanggal ON pengeluaran(tanggal);
      CREATE INDEX IF NOT EXISTS idx_pesanan_item_pesanan_id ON pesanan_item(pesanan_id);
    `);

    await client.query('COMMIT');
    console.log('✅ Semua tabel berhasil diinisialisasi di Neon PostgreSQL!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Gagal inisialisasi database:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Run directly if called as a script
if (process.argv[1]?.endsWith('init.js')) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
