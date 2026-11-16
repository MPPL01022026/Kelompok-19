import express from 'express';
import { pool } from '../db/connection.js';

const router = express.Router();

// Helper to attach items to an array of orders
async function attachItemsToOrders(orders) {
  if (orders.length === 0) return [];
  const orderIds = orders.map((o) => o.id);

  const itemsRes = await pool.query(
    `SELECT pi.id, pi.pesanan_id, pi.menu_id, pi.qty, pi.subtotal, m.nama_menu, m.harga, m.kategori
     FROM pesanan_item pi
     LEFT JOIN menu m ON pi.menu_id = m.id
     WHERE pi.pesanan_id = ANY($1::int[])
     ORDER BY pi.id ASC`,
    [orderIds]
  );

  const itemsByOrder = {};
  itemsRes.rows.forEach((item) => {
    if (!itemsByOrder[item.pesanan_id]) {
      itemsByOrder[item.pesanan_id] = [];
    }
    itemsByOrder[item.pesanan_id].push({
      id: item.id,
      menu_id: item.menu_id,
      nama_menu: item.nama_menu || 'Menu Terhapus',
      harga: item.harga || 0,
      kategori: item.kategori,
      qty: item.qty,
      subtotal: item.subtotal,
    });
  });

  return orders.map((o) => ({
    ...o,
    items: itemsByOrder[o.id] || [],
  }));
}

// GET /api/pesanan (query: ?tanggal=&status=)
router.get('/', async (req, res) => {
  try {
    const { tanggal, status } = req.query;
    let query = 'SELECT * FROM pesanan WHERE 1=1';
    const params = [];

    if (tanggal) {
      params.push(tanggal);
      query += ` AND DATE(created_at) = $${params.length}`;
    }

    if (status && status !== 'Semua') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC, id DESC';

    const result = await pool.query(query, params);
    const ordersWithItems = await attachItemsToOrders(result.rows);
    res.json(ordersWithItems);
  } catch (err) {
    console.error('Error fetching pesanan:', err);
    res.status(500).json({ error: 'Gagal mengambil data pesanan.' });
  }
});

// GET /api/pesanan/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orderRes = await pool.query('SELECT * FROM pesanan WHERE id = $1', [id]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
    }

    const [orderWithItems] = await attachItemsToOrders(orderRes.rows);
    res.json(orderWithItems);
  } catch (err) {
    console.error('Error fetching order detail:', err);
    res.status(500).json({ error: 'Gagal mengambil detail pesanan.' });
  }
});

// POST /api/pesanan
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { nama_pelanggan, total_harga, status, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Pesanan harus memiliki minimal 1 item menu.' });
    }

    // Calculate total from items
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const menuRes = await client.query('SELECT id, nama_menu, harga FROM menu WHERE id = $1', [item.menu_id]);
      if (menuRes.rows.length > 0) {
        const m = menuRes.rows[0];
        const qty = parseInt(item.qty) || 1;
        const subtotal = m.harga * qty;
        calculatedTotal += subtotal;
        validatedItems.push({
          menu_id: m.id,
          nama_menu: m.nama_menu,
          harga: m.harga,
          qty,
          subtotal,
        });
      }
    }

    const orderStatus = status || 'Diproses';
    const customerName = nama_pelanggan?.trim() || 'Pelanggan Walk-in';
    const finalTotal = total_harga !== undefined ? parseInt(total_harga) : calculatedTotal;

    // Insert pesanan
    const orderRes = await client.query(
      `INSERT INTO pesanan (nama_pelanggan, total_harga, status, created_at) 
       VALUES ($1, $2, $3, NOW()) 
       RETURNING *`,
      [customerName, finalTotal, orderStatus]
    );

    const newOrder = orderRes.rows[0];

    // Insert pesanan_item
    for (const vi of validatedItems) {
      await client.query(
        'INSERT INTO pesanan_item (pesanan_id, menu_id, qty, subtotal) VALUES ($1, $2, $3, $4)',
        [newOrder.id, vi.menu_id, vi.qty, vi.subtotal]
      );
    }

    // Otomatis buat record pemasukan jika status Selesai
    if (orderStatus === 'Selesai') {
      await client.query(
        `INSERT INTO pemasukan (tanggal, sumber, keterangan, jumlah, pesanan_id, created_at) 
         VALUES (CURRENT_DATE, 'Penjualan', $1, $2, $3, NOW())`,
        [`Pesanan #${newOrder.id} - ${customerName}`, finalTotal, newOrder.id]
      );
    }

    await client.query('COMMIT');

    const [fullOrder] = await attachItemsToOrders([newOrder]);
    res.status(201).json(fullOrder);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating pesanan:', err);
    res.status(500).json({ error: 'Gagal membuat pesanan baru.' });
  } finally {
    client.release();
  }
});

// PUT /api/pesanan/:id
router.put('/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const { nama_pelanggan, status, total_harga } = req.body;

    const existingRes = await client.query('SELECT * FROM pesanan WHERE id = $1', [id]);
    if (existingRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
    }

    const currentOrder = existingRes.rows[0];
    const newStatus = status || currentOrder.status;

    const updatedRes = await client.query(
      `UPDATE pesanan 
       SET nama_pelanggan = COALESCE($1, nama_pelanggan),
           status = COALESCE($2, status),
           total_harga = COALESCE($3, total_harga)
       WHERE id = $4 
       RETURNING *`,
      [
        nama_pelanggan !== undefined ? nama_pelanggan.trim() : null,
        status || null,
        total_harga !== undefined ? parseInt(total_harga) : null,
        id,
      ]
    );

    const updatedOrder = updatedRes.rows[0];

    // Otomatis buat record pemasukan jika status diubah ke 'Selesai'
    if (newStatus === 'Selesai' && currentOrder.status !== 'Selesai') {
      // Check if already exists in pemasukan
      const existingIncome = await client.query(
        'SELECT id FROM pemasukan WHERE pesanan_id = $1',
        [id]
      );
      if (existingIncome.rows.length === 0) {
        await client.query(
          `INSERT INTO pemasukan (tanggal, sumber, keterangan, jumlah, pesanan_id, created_at) 
           VALUES (CURRENT_DATE, 'Penjualan', $1, $2, $3, NOW())`,
          [
            `Pesanan #${id} - ${updatedOrder.nama_pelanggan || 'Pelanggan'}`,
            updatedOrder.total_harga,
            id,
          ]
        );
      }
    } else if (newStatus === 'Dibatalkan' && currentOrder.status === 'Selesai') {
      // Remove auto income if cancelled
      await client.query('DELETE FROM pemasukan WHERE pesanan_id = $1', [id]);
    }

    await client.query('COMMIT');

    const [fullOrder] = await attachItemsToOrders([updatedOrder]);
    res.json(fullOrder);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating pesanan:', err);
    res.status(500).json({ error: 'Gagal memperbarui data pesanan.' });
  } finally {
    client.release();
  }
});

// DELETE /api/pesanan/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Pemasukan with foreign key on delete set null will stay or can be removed if desired
    const result = await pool.query('DELETE FROM pesanan WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
    }
    res.json({ message: `Pesanan #${id} berhasil dihapus.`, id: parseInt(id) });
  } catch (err) {
    console.error('Error deleting pesanan:', err);
    res.status(500).json({ error: 'Gagal menghapus pesanan.' });
  }
});

export default router;
