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

  static async search(filters: {
    make?: string;
    model?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }): Promise<Record<string, unknown>[]> {
    let queryStr = `SELECT id, make, model, category, price, quantity, created_at, updated_at 
                    FROM vehicles WHERE 1=1`;
    const values: (string | number)[] = [];

    if (filters.make) {
      values.push(`%${filters.make}%`);
      queryStr += ` AND make ILIKE $${values.length}`;
    }

    if (filters.model) {
      values.push(`%${filters.model}%`);
      queryStr += ` AND model ILIKE $${values.length}`;
    }

    if (filters.category) {
      values.push(`%${filters.category}%`);
      queryStr += ` AND category ILIKE $${values.length}`;
    }

    if (filters.minPrice) {
      values.push(parseFloat(filters.minPrice));
      queryStr += ` AND price >= $${values.length}`;
    }

    if (filters.maxPrice) {
      values.push(parseFloat(filters.maxPrice));
      queryStr += ` AND price <= $${values.length}`;
    }

    queryStr += ` ORDER BY created_at DESC`;

    const result = await query(queryStr, values);
    return result.rows;
  }
}
