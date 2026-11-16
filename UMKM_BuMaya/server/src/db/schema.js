import { 
  pgTable, 
  serial, 
  varchar, 
  integer, 
  numeric, 
  timestamp, 
  date,
  text
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  nama: varchar('nama', { length: 100 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// 2. Menu Table
export const menu = pgTable('menu', {
  id: serial('id').primaryKey(),
  nama_menu: varchar('nama_menu', { length: 150 }).notNull(),
  kategori: varchar('kategori', { length: 50 }).notNull(), // 'Makanan', 'Minuman', 'Paket'
  harga: integer('harga').notNull(),
  status: varchar('status', { length: 50 }).default('Tersedia').notNull(), // 'Tersedia', 'Habis'
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Bahan (Stok) Table
export const bahan = pgTable('bahan', {
  id: serial('id').primaryKey(),
  nama_bahan: varchar('nama_bahan', { length: 150 }).notNull(),
  satuan: varchar('satuan', { length: 50 }).notNull(), // 'kg', 'liter', 'pcs', 'bungkus', 'butir'
  jumlah: numeric('jumlah', { precision: 10, scale: 2 }).default('0').notNull(),
  batas_minimum: numeric('batas_minimum', { precision: 10, scale: 2 }).default('0').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Pesanan Table
export const pesanan = pgTable('pesanan', {
  id: serial('id').primaryKey(),
  nama_pelanggan: varchar('nama_pelanggan', { length: 150 }),
  total_harga: integer('total_harga').default(0).notNull(),
  status: varchar('status', { length: 50 }).default('Diproses').notNull(), // 'Diproses', 'Selesai', 'Dibatalkan'
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// 5. Pesanan Item Table
export const pesananItem = pgTable('pesanan_item', {
  id: serial('id').primaryKey(),
  pesanan_id: integer('pesanan_id').references(() => pesanan.id, { onDelete: 'cascade' }).notNull(),
  menu_id: integer('menu_id').references(() => menu.id, { onDelete: 'set null' }),
  qty: integer('qty').default(1).notNull(),
  subtotal: integer('subtotal').default(0).notNull(),
});

// 6. Pemasukan Table
export const pemasukan = pgTable('pemasukan', {
  id: serial('id').primaryKey(),
  tanggal: date('tanggal').defaultNow().notNull(),
  sumber: varchar('sumber', { length: 50 }).notNull(), // 'Penjualan', 'Lainnya'
  keterangan: varchar('keterangan', { length: 255 }).notNull(),
  jumlah: integer('jumlah').notNull(),
  pesanan_id: integer('pesanan_id').references(() => pesanan.id, { onDelete: 'set null' }),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// 7. Pengeluaran Table
export const pengeluaran = pgTable('pengeluaran', {
  id: serial('id').primaryKey(),
  tanggal: date('tanggal').defaultNow().notNull(),
  kategori: varchar('kategori', { length: 50 }).notNull(), // 'Bahan Baku', 'Operasional', 'Lainnya'
  keterangan: varchar('keterangan', { length: 255 }).notNull(),
  jumlah: integer('jumlah').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const pesananRelations = relations(pesanan, ({ many, one }) => ({
  items: many(pesananItem),
  pemasukan: one(pemasukan, {
    fields: [pesanan.id],
    references: [pemasukan.pesanan_id],
  }),
}));

export const pesananItemRelations = relations(pesananItem, ({ one }) => ({
  pesanan: one(pesanan, {
    fields: [pesananItem.pesanan_id],
    references: [pesanan.id],
  }),
  menu: one(menu, {
    fields: [pesananItem.menu_id],
    references: [menu.id],
  }),
}));

export const pemasukanRelations = relations(pemasukan, ({ one }) => ({
  pesanan: one(pesanan, {
    fields: [pemasukan.pesanan_id],
    references: [pesanan.id],
  }),
}));
