import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './db/connection.js';

import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import bahanRoutes from './routes/bahan.js';
import pesananRoutes from './routes/pesanan.js';
import pemasukanRoutes from './routes/pemasukan.js';
import pengeluaranRoutes from './routes/pengeluaran.js';
import dashboardRoutes from './routes/dashboard.js';
import rekapRoutes from './routes/rekap.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

// Trust proxy for secure cookies behind reverse proxies like Vercel
app.set('trust proxy', 1);

// Middleware CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same origin)
      if (!origin || origin === CLIENT_URL || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session store setup (using PostgreSQL so sessions persist across Serverless lambdas)
const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: 'user_sessions',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'familykupi_secret_key_bumaya_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    },
  })
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Digital Twin Family Kupi API',
    database: 'Neon PostgreSQL Connected',
    time: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/bahan', bahanRoutes);
app.use('/api/pesanan', pesananRoutes);
app.use('/api/pemasukan', pemasukanRoutes);
app.use('/api/pengeluaran', pengeluaranRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/rekap', rekapRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} tidak ditemukan.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Terjadi kesalahan internal pada server.',
    detail: err.message,
  });
});

// Hanya panggil listen jika dijalankan secara lokal (bukan di Vercel serverless)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server Backend Family Kupi berjalan di http://localhost:${PORT}`);
    console.log(`📡 CORS diizinkan untuk: ${CLIENT_URL}`);
  });
}

export default app;
