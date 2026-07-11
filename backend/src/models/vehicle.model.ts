import { query } from '../config/db';

export class Vehicle {
  static async create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const result = await query(
      `INSERT INTO vehicles (make, model, category, price, quantity, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, make, model, category, price, quantity, created_at, updated_at`,
      [data.make, data.model, data.category, data.price, data.quantity]
    );

    return result.rows[0];
  }

  static async getAll(): Promise<Record<string, unknown>[]> {
    const result = await query(
      `SELECT id, make, model, category, price, quantity, created_at, updated_at 
       FROM vehicles 
       ORDER BY created_at DESC`
    );
    return result.rows;
  }
}
