import express from 'express';
import { pool } from '../db/connection.js';

const router = express.Router();

// GET /api/pemasukan (?dari=&sampai=)
router.get('/', async (req, res) => {
  try {
    const { dari, sampai } = req.query;
    let query = 'SELECT * FROM pemasukan WHERE 1=1';
    const params = [];

    if (dari) {
      params.push(dari);
      query += ` AND tanggal >= $${params.length}`;
    }

    if (sampai) {
      params.push(sampai);
      query += ` AND tanggal <= $${params.length}`;
    }

    query += ' ORDER BY tanggal DESC, id DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching pemasukan:', err);
    res.status(500).json({ error: 'Gagal mengambil data pemasukan.' });
  }
});

// POST /api/pemasukan (tambah manual, sumber: 'Lainnya')
router.post('/', async (req, res) => {
  try {
    const { tanggal, keterangan, jumlah, sumber } = req.body;
    if (!keterangan || jumlah === undefined) {
      return res.status(400).json({ error: 'Keterangan dan jumlah pemasukan wajib diisi.' });
    }

    const tgl = tanggal || new Date().toISOString().split('T')[0];
    const src = sumber || 'Lainnya';

    const result = await pool.query(
      `INSERT INTO pemasukan (tanggal, sumber, keterangan, jumlah, pesanan_id, created_at) 
       VALUES ($1, $2, $3, $4, NULL, NOW()) 
       RETURNING *`,
      [tgl, src, keterangan.trim(), parseInt(jumlah)]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating pemasukan:', err);
    res.status(500).json({ error: 'Gagal menambahkan pemasukan manual.' });
  }
});

// DELETE /api/pemasukan/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM pemasukan WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pemasukan tidak ditemukan.' });
    }
    res.json({ message: 'Pemasukan berhasil dihapus.', id: result.rows[0].id });
  } catch (err) {
    console.error('Error deleting pemasukan:', err);
    res.status(500).json({ error: 'Gagal menghapus pemasukan.' });
  }
});

export default router;
