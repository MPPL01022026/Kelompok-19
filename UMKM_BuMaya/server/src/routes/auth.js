import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db/connection.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi!' });
    }

    const userRes = await pool.query(
      'SELECT id, username, password, nama FROM users WHERE username = $1',
      [username.trim().toLowerCase()]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: 'Username atau password salah!' });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Username atau password salah!' });
    }

    const userSession = {
      id: user.id,
      username: user.username,
      nama: user.nama,
      role: 'Pemilik Warung',
    };

    req.session.user = userSession;

    res.json({
      message: 'Login berhasil! Selamat datang, ' + user.nama,
      user: userSession,
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server saat login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal mengakhiri sesi login.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout berhasil! Sampai jumpa Bu Maya.' });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ user: req.session.user });
  }
  res.status(401).json({ error: 'Sesi belum login atau telah berakhir.' });
});

// PUT /api/auth/profile (Ganti Username & Kata Sandi)
router.put('/profile', async (req, res) => {
  try {
    const { username, nama, currentPassword, newPassword } = req.body;

    const userId = req.session?.user?.id || 1;

    // Ambil data user saat ini dari DB
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    const user = userRes.rows[0];

    // Wajib verifikasi password saat ini demi keamanan
    if (!currentPassword) {
      return res.status(400).json({ error: 'Kata sandi saat ini wajib diisi untuk konfirmasi keamanan.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Kata sandi saat ini (lama) salah!' });
    }

    // Cek jika username baru diganti dan sudah dipakai user lain
    const targetUsername = username ? username.trim().toLowerCase() : user.username;
    if (targetUsername !== user.username) {
      const checkUname = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [targetUsername, userId]
      );
      if (checkUname.rows.length > 0) {
        return res.status(400).json({ error: `Username "${targetUsername}" sudah digunakan oleh akun lain.` });
      }
    }

    // Update password jika ada kata sandi baru
    let updatedPasswordHash = user.password;
    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 4) {
        return res.status(400).json({ error: 'Kata sandi baru minimal 4 karakter.' });
      }
      updatedPasswordHash = await bcrypt.hash(newPassword.trim(), 10);
    }

    const targetNama = nama ? nama.trim() : user.nama;

    const updateRes = await pool.query(
      `UPDATE users 
       SET username = $1, nama = $2, password = $3 
       WHERE id = $4 
       RETURNING id, username, nama`,
      [targetUsername, targetNama, updatedPasswordHash, userId]
    );

    const updatedUser = updateRes.rows[0];
    const newSession = {
      id: updatedUser.id,
      username: updatedUser.username,
      nama: updatedUser.nama,
      role: 'Pemilik Warung',
    };

    req.session.user = newSession;

    res.json({
      message: 'Username dan kata sandi berhasil diperbarui!',
      user: newSession,
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Gagal memperbarui username dan sandi akun.' });
  }
});

export default router;
