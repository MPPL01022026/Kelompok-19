import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function test() {
  try {
    console.log('Connecting to Neon PostgreSQL...');
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time, version()');
    console.log('Connected successfully!');
    console.log('Server time:', res.rows[0].current_time);
    console.log('Version:', res.rows[0].version);
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

test();
