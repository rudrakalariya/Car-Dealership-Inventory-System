import bcrypt from 'bcrypt';
import { query } from '../config/db';

export class User {
  static async create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(String(data.password), saltRounds);

    try {
      const result = await query(
        `INSERT INTO users (username, email, password, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING id, username, email, password, role, created_at, updated_at`,
        [data.username, data.email, hashedPassword, data.role || 'customer']
      );

      return result.rows[0];
    } catch (error: unknown) {
      const pgError = error as { code?: string; constraint?: string };
      if (pgError.code === '23505') {
        if (pgError.constraint === 'users_username_key') {
          throw new Error('Username already exists', { cause: error });
        }
        if (pgError.constraint === 'users_email_key') {
          throw new Error('Email already exists', { cause: error });
        }
        throw new Error('Duplicate entry found', { cause: error });
      }
      throw error;
    }
  }

  static async comparePassword(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
