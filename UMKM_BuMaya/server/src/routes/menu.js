import express from 'express';
import { pool } from '../db/connection.js';

const router = express.Router();

// GET /api/menu
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ error: 'Gagal mengambil daftar menu.' });
  }
});

// POST /api/menu
router.post('/', async (req, res) => {
  try {
    const { nama_menu, kategori, harga, status } = req.body;
    if (!nama_menu || !kategori || harga === undefined) {
      return res.status(400).json({ error: 'Nama menu, kategori, dan harga wajib diisi.' });
    }

    const result = await pool.query(
      `INSERT INTO menu (nama_menu, kategori, harga, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, NOW(), NOW()) 
       RETURNING *`,
      [nama_menu.trim(), kategori, parseInt(harga), status || 'Tersedia']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating menu:', err);
    res.status(500).json({ error: 'Gagal menambahkan menu baru.' });
  }
});

// PUT /api/menu/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_menu, kategori, harga, status } = req.body;

    const existing = await pool.query('SELECT * FROM menu WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Menu tidak ditemukan.' });
    }

    const updated = await pool.query(
      `UPDATE menu 
       SET nama_menu = COALESCE($1, nama_menu),
           kategori = COALESCE($2, kategori),
           harga = COALESCE($3, harga),
           status = COALESCE($4, status),
           updated_at = NOW()
       WHERE id = $5 
       RETURNING *`,
      [
        nama_menu ? nama_menu.trim() : null,
        kategori || null,
        harga !== undefined ? parseInt(harga) : null,
        status || null,
        id,
      ]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error('Error updating menu:', err);
    res.status(500).json({ error: 'Gagal memperbarui data menu.' });
  }
});

// DELETE /api/menu/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM menu WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu tidak ditemukan.' });
    }
    res.json({ message: `Menu "${result.rows[0].nama_menu}" berhasil dihapus.`, id: result.rows[0].id });
  } catch (err) {
    console.error('Error deleting menu:', err);
    res.status(500).json({ error: 'Gagal menghapus menu.' });
  }
});

export default router;
