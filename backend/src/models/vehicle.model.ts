import { query } from '../config/db';
import { QueryBuilder } from '../utils/queryBuilder';
import { validateStock } from '../utils/stockValidator';

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
    const { text, values } = new QueryBuilder('vehicles')
      .select(['id', 'make', 'model', 'category', 'price', 'quantity', 'created_at', 'updated_at'])
      .whereIlike('make', filters.make)
      .whereIlike('model', filters.model)
      .whereIlike('category', filters.category)
      .whereGte('price', filters.minPrice)
      .whereLte('price', filters.maxPrice)
      .orderBy('created_at', 'DESC')
      .build();

    const result = await query(text, values);
    return result.rows;
  }

  static async update(
    id: number,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown> | null> {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      // If no data to update, just return the existing record or throw?
      // Better to fetch and return existing if no update data
      const existing = await query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
      return existing.rows[0] || null;
    }

    let queryStr = 'UPDATE vehicles SET ';
    const values: (string | number)[] = [];

    keys.forEach((key, index) => {
      queryStr += `${key} = $${index + 1}, `;
      values.push(data[key] as string | number);
    });

    // Add updated_at
    queryStr += `updated_at = NOW() WHERE id = $${values.length + 1} RETURNING *`;
    values.push(id);

    const result = await query(queryStr, values);
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM vehicles WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  static async purchase(
    id: number,
    quantity: number
  ): Promise<{ success: boolean; error?: string; vehicle?: Record<string, unknown> }> {
    // 1. Check if vehicle exists and get current quantity
    const checkResult = await query('SELECT quantity FROM vehicles WHERE id = $1', [id]);

    if (checkResult.rows.length === 0) {
      return { success: false, error: 'Vehicle not found' };
    }

    const currentQuantity = checkResult.rows[0].quantity as number;
    const stockError = validateStock(currentQuantity, quantity);

    if (stockError) {
      return { success: false, error: stockError };
    }

    // 2. Perform purchase update
    const updateResult = await query(
      'UPDATE vehicles SET quantity = quantity - $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [quantity, id]
    );

    return { success: true, vehicle: updateResult.rows[0] };
  }
}
