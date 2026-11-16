import express from 'express';
import { pool } from '../db/connection.js';

const router = express.Router();

// Helper to compute daily recap between start and end date
async function getDailyRecapData(dari, sampai) {
  const startDate = dari || new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0];
  const endDate = sampai || new Date().toISOString().split('T')[0];

  const seriesRes = await pool.query(
    `SELECT d::date as tanggal 
     FROM generate_series($1::date, $2::date, '1 day'::interval) d 
     ORDER BY d DESC`,
    [startDate, endDate]
  );

  const dates = seriesRes.rows;

  const recap = await Promise.all(
    dates.map(async (row) => {
      const iso = row.tanggal.toISOString().split('T')[0];

      // Pesanan count
      const ordRes = await pool.query(
        'SELECT COUNT(*) as count FROM pesanan WHERE DATE(created_at) = $1',
        [iso]
      );
      const pesananCount = parseInt(ordRes.rows[0]?.count || 0);

      // Pemasukan
      const incRes = await pool.query(
        'SELECT COALESCE(SUM(jumlah), 0) as sum FROM pemasukan WHERE tanggal = $1',
        [iso]
      );
      const pemasukan = parseInt(incRes.rows[0]?.sum || 0);

      // Pengeluaran
      const expRes = await pool.query(
        'SELECT COALESCE(SUM(jumlah), 0) as sum FROM pengeluaran WHERE tanggal = $1',
        [iso]
      );
      const pengeluaran = parseInt(expRes.rows[0]?.sum || 0);

      const laba = pemasukan - pengeluaran;

      return {
        tanggal: iso,
        pesananCount,
        pemasukan,
        pengeluaran,
        laba,
      };
    })
  );

  return { startDate, endDate, recap };
}

// GET /api/rekap?dari=&sampai=
router.get('/', async (req, res) => {
  try {
    const { dari, sampai } = req.query;
    const { startDate, endDate, recap } = await getDailyRecapData(dari, sampai);

    let totalPesanan = 0;
    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    recap.forEach((r) => {
      totalPesanan += r.pesananCount;
      totalPemasukan += r.pemasukan;
      totalPengeluaran += r.pengeluaran;
    });

    res.json({
      range: { dari: startDate, sampai: endDate },
      summary: {
        totalPesanan,
        totalPemasukan,
        totalPengeluaran,
        totalLaba: totalPemasukan - totalPengeluaran,
      },
      recap,
    });
  } catch (err) {
    console.error('Error in rekap:', err);
    res.status(500).json({ error: 'Gagal mengambil data rekap usaha.' });
  }
});

// GET /api/rekap/export?dari=&sampai=
router.get('/export', async (req, res) => {
  try {
    const { dari, sampai } = req.query;
    const { startDate, endDate, recap } = await getDailyRecapData(dari, sampai);

    const headers = ['Tanggal', 'Jumlah Pesanan', 'Pemasukan (Rp)', 'Pengeluaran (Rp)', 'Laba / Rugi (Rp)'];
    const rows = recap.map((r) => [
      `"${r.tanggal}"`,
      r.pesananCount,
      r.pemasukan,
      r.pengeluaran,
      r.laba,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="rekap_family_kupi_${startDate}_sd_${endDate}.csv"`
    );
    res.send(csvContent);
  } catch (err) {
    console.error('Error exporting rekap CSV:', err);
    res.status(500).json({ error: 'Gagal mengekspor data rekap CSV.' });
  }
});

export default router;
