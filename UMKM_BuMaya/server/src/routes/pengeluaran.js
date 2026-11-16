import express from 'express';
import { pool } from '../db/connection.js';

const router = express.Router();

// GET /api/pengeluaran (?dari=&sampai=&kategori=)
router.get('/', async (req, res) => {
  try {
    const { dari, sampai, kategori } = req.query;
    let query = 'SELECT * FROM pengeluaran WHERE 1=1';
    const params = [];

    if (dari) {
      params.push(dari);
      query += ` AND tanggal >= $${params.length}`;
    }

    if (sampai) {
      params.push(sampai);
      query += ` AND tanggal <= $${params.length}`;
    }

    if (kategori && kategori !== 'Semua') {
      params.push(kategori);
      query += ` AND kategori = $${params.length}`;
    }

    query += ' ORDER BY tanggal DESC, id DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching pengeluaran:', err);
    res.status(500).json({ error: 'Gagal mengambil data pengeluaran.' });
  }
});

// POST /api/pengeluaran
router.post('/', async (req, res) => {
  try {
    const { tanggal, kategori, keterangan, jumlah } = req.body;
    if (!keterangan || jumlah === undefined) {
      return res.status(400).json({ error: 'Keterangan dan jumlah pengeluaran wajib diisi.' });
    }

    const tgl = tanggal || new Date().toISOString().split('T')[0];
    const kat = kategori || 'Bahan Baku';

    const result = await pool.query(
      `INSERT INTO pengeluaran (tanggal, kategori, keterangan, jumlah, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING *`,
      [tgl, kat, keterangan.trim(), parseInt(jumlah)]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating pengeluaran:', err);
    res.status(500).json({ error: 'Gagal mencatat pengeluaran.' });
  }
});

// PUT /api/pengeluaran/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tanggal, kategori, keterangan, jumlah } = req.body;

    const existing = await pool.query('SELECT * FROM pengeluaran WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Catatan pengeluaran tidak ditemukan.' });
    }

    const updated = await pool.query(
      `UPDATE pengeluaran 
       SET tanggal = COALESCE($1, tanggal),
           kategori = COALESCE($2, kategori),
           keterangan = COALESCE($3, keterangan),
           jumlah = COALESCE($4, jumlah)
       WHERE id = $5 
       RETURNING *`,
      [
        tanggal || null,
        kategori || null,
        keterangan ? keterangan.trim() : null,
        jumlah !== undefined ? parseInt(jumlah) : null,
        id,
      ]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error('Error updating pengeluaran:', err);
    res.status(500).json({ error: 'Gagal memperbarui catatan pengeluaran.' });
  }
});

// DELETE /api/pengeluaran/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM pengeluaran WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Catatan pengeluaran tidak ditemukan.' });
    }
    res.json({ message: 'Pengeluaran berhasil dihapus.', id: result.rows[0].id });
  } catch (err) {
    console.error('Error deleting pengeluaran:', err);
    res.status(500).json({ error: 'Gagal menghapus pengeluaran.' });
  }
});

export default router;
