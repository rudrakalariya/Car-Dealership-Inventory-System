import fs from 'fs';
import path from 'path';
import { query } from './db';

export const initDB = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Initializing database schema...');
    await query(schemaSql);
    console.log('✅ Database schema initialized successfully (tables created on NeonDb)!');
  } catch (error) {
    console.error('❌ Failed to initialize database schema:', error);
  }
};
