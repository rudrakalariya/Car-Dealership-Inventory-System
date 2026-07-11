import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);

export const connectDB = async () => {
  try {
    // Attempt a simple query to verify the connection
    await pool.query('SELECT 1');
    console.log('Connected to PostgreSQL (NeonDb) database');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
};

export const clearDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    // Centralized way to drop or truncate test database tables
    await pool.query('TRUNCATE TABLE users, vehicles RESTART IDENTITY CASCADE');
  }
};

export const closeDB = async () => {
  await pool.end();
};
