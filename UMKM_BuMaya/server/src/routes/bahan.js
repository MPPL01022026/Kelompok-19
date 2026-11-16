import express from 'express';
import { pool } from '../db/connection.js';

const router = express.Router();

// GET /api/bahan
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bahan ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching bahan:', err);
    res.status(500).json({ error: 'Gagal mengambil daftar stok bahan.' });
  }
});

// POST /api/bahan
router.post('/', async (req, res) => {
  try {
    const { nama_bahan, satuan, jumlah, batas_minimum } = req.body;
    if (!nama_bahan || !satuan) {
      return res.status(400).json({ error: 'Nama bahan dan satuan wajib diisi.' });
    }

    const result = await pool.query(
      `INSERT INTO bahan (nama_bahan, satuan, jumlah, batas_minimum, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, NOW(), NOW()) 
       RETURNING *`,
      [
        nama_bahan.trim(),
        satuan.trim(),
        parseFloat(jumlah) || 0,
        parseFloat(batas_minimum) || 0,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating bahan:', err);
    res.status(500).json({ error: 'Gagal menambahkan bahan baku baru.' });
  }
});

// PUT /api/bahan/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_bahan, satuan, jumlah, batas_minimum } = req.body;

    const existing = await pool.query('SELECT * FROM bahan WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Bahan baku tidak ditemukan.' });
    }

    const updated = await pool.query(
      `UPDATE bahan 
       SET nama_bahan = COALESCE($1, nama_bahan),
           satuan = COALESCE($2, satuan),
           jumlah = COALESCE($3, jumlah),
           batas_minimum = COALESCE($4, batas_minimum),
           updated_at = NOW()
       WHERE id = $5 
       RETURNING *`,
      [
        nama_bahan ? nama_bahan.trim() : null,
        satuan ? satuan.trim() : null,
        jumlah !== undefined ? parseFloat(jumlah) : null,
        batas_minimum !== undefined ? parseFloat(batas_minimum) : null,
        id,
      ]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error('Error updating bahan:', err);
    res.status(500).json({ error: 'Gagal memperbarui data bahan.' });
  }
});

// PATCH /api/bahan/:id/kurangi
router.patch('/:id/kurangi', async (req, res) => {
  try {
    const { id } = req.params;
    const { jumlah } = req.body;
    const amount = parseFloat(jumlah);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Jumlah pengurangan stok harus berupa angka positif.' });
    }

    const existing = await pool.query('SELECT * FROM bahan WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Bahan baku tidak ditemukan.' });
    }

    const currentQty = parseFloat(existing.rows[0].jumlah);
    const newQty = Math.max(0, currentQty - amount);

    const updated = await pool.query(
      'UPDATE bahan SET jumlah = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newQty, id]
    );

    res.json({
      message: `Stok ${existing.rows[0].nama_bahan} berhasil dikurangi ${amount} ${existing.rows[0].satuan}.`,
      data: updated.rows[0],
    });
  } catch (err) {
    console.error('Error reducing bahan stock:', err);
    res.status(500).json({ error: 'Gagal mengurangi stok bahan.' });
  }
});

// PATCH /api/bahan/:id/tambah
router.patch('/:id/tambah', async (req, res) => {
  try {
    const { id } = req.params;
    const { jumlah } = req.body;
    const amount = parseFloat(jumlah);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Jumlah penambahan stok harus berupa angka positif.' });
    }

    const existing = await pool.query('SELECT * FROM bahan WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Bahan baku tidak ditemukan.' });
    }

    const currentQty = parseFloat(existing.rows[0].jumlah);
    const newQty = currentQty + amount;

    const updated = await pool.query(
      'UPDATE bahan SET jumlah = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newQty, id]
    );

    res.json({
      message: `Stok ${existing.rows[0].nama_bahan} berhasil ditambah ${amount} ${existing.rows[0].satuan}.`,
      data: updated.rows[0],
    });
  } catch (err) {
    console.error('Error adding bahan stock:', err);
    res.status(500).json({ error: 'Gagal menambah stok bahan.' });
  }
});

// DELETE /api/bahan/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM bahan WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bahan baku tidak ditemukan.' });
    }
    res.json({ message: `Bahan "${result.rows[0].nama_bahan}" berhasil dihapus.`, id: result.rows[0].id });
  } catch (err) {
    console.error('Error deleting bahan:', err);
    res.status(500).json({ error: 'Gagal menghapus bahan baku.' });
  }
});

export default router;
