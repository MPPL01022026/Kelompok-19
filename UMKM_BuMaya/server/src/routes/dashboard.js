import express from 'express';
import { pool } from '../db/connection.js';

const router = express.Router();

// GET /api/dashboard (Ringkasan hari ini)
router.get('/', async (req, res) => {
  try {
    // 1. Total pesanan hari ini
    const pesananRes = await pool.query(
      'SELECT COUNT(*) as total FROM pesanan WHERE DATE(created_at) = CURRENT_DATE'
    );
    const total_pesanan = parseInt(pesananRes.rows[0]?.total || 0);

    // 2. Total pemasukan hari ini
    const pemasukanRes = await pool.query(
      'SELECT COALESCE(SUM(jumlah), 0) as total FROM pemasukan WHERE tanggal = CURRENT_DATE'
    );
    const total_pemasukan = parseInt(pemasukanRes.rows[0]?.total || 0);

    // 3. Total pengeluaran hari ini
    const pengeluaranRes = await pool.query(
      'SELECT COALESCE(SUM(jumlah), 0) as total FROM pengeluaran WHERE tanggal = CURRENT_DATE'
    );
    const total_pengeluaran = parseInt(pengeluaranRes.rows[0]?.total || 0);

    // 4. Laba rugi hari ini
    const laba_rugi = total_pemasukan - total_pengeluaran;

    // 5. Jumlah item stok menipis (jumlah <= batas_minimum)
    const stokRes = await pool.query(
      'SELECT COUNT(*) as total FROM bahan WHERE jumlah <= batas_minimum'
    );
    const stok_menipis = parseInt(stokRes.rows[0]?.total || 0);

    res.json({
      total_pesanan,
      total_pemasukan,
      total_pengeluaran,
      laba_rugi,
      stok_menipis,
    });
  } catch (err) {
    console.error('Error fetching dashboard summary:', err);
    res.status(500).json({ error: 'Gagal mengambil ringkasan dashboard.' });
  }
});

// GET /api/dashboard/grafik (Data 7 hari terakhir)
router.get('/grafik', async (req, res) => {
  try {
    const datesQuery = await pool.query(`
      SELECT 
        d::date as tanggal,
        TO_CHAR(d::date, 'DD Mon') as label
      FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day'::interval) d
      ORDER BY d ASC
    `);

    const days = datesQuery.rows;

    const data = await Promise.all(
      days.map(async (day) => {
        const iso = day.tanggal.toISOString().split('T')[0];

        // Pemasukan for this date
        const incRes = await pool.query(
          'SELECT COALESCE(SUM(jumlah), 0) as sum FROM pemasukan WHERE tanggal = $1',
          [iso]
        );
        const pemasukan = parseInt(incRes.rows[0]?.sum || 0);

        // Pengeluaran for this date
        const expRes = await pool.query(
          'SELECT COALESCE(SUM(jumlah), 0) as sum FROM pengeluaran WHERE tanggal = $1',
          [iso]
        );
        const pengeluaran = parseInt(expRes.rows[0]?.sum || 0);

        // Pesanan count for this date
        const ordRes = await pool.query(
          'SELECT COUNT(*) as count FROM pesanan WHERE DATE(created_at) = $1',
          [iso]
        );
        const pesanan = parseInt(ordRes.rows[0]?.count || 0);

        return {
          date: iso,
          name: day.label,
          pemasukan,
          pengeluaran,
          pesanan,
          laba: pemasukan - pengeluaran,
        };
      })
    );

    res.json(data);
  } catch (err) {
    console.error('Error fetching dashboard charts:', err);
    res.status(500).json({ error: 'Gagal mengambil data grafik dashboard.' });
  }
});

// GET /api/dashboard/menu-terlaris (Top 5 menu terlaris)
router.get('/menu-terlaris', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COALESCE(m.nama_menu, 'Menu Lainnya') as name,
        SUM(pi.qty)::int as value
      FROM pesanan_item pi
      JOIN pesanan p ON pi.pesanan_id = p.id
      LEFT JOIN menu m ON pi.menu_id = m.id
      WHERE p.status != 'Dibatalkan'
      GROUP BY m.id, m.nama_menu
      ORDER BY value DESC
      LIMIT 5
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu terlaris:', err);
    res.status(500).json({ error: 'Gagal mengambil data menu terlaris.' });
  }
});

export default router;
