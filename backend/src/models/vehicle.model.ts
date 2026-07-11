import { z } from 'zod';
import { query } from '../config/db';

const VehicleSchema = z.object({
  make: z.string(),
  model: z.string(),
  category: z.string(),
  price: z.number().positive('Price must be a positive number'),
  quantity: z
    .number()
    .int('Quantity must be a non-negative integer')
    .min(0, 'Quantity must be a non-negative integer')
});

export class Vehicle {
  static async create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      const validatedData = VehicleSchema.parse(data);

      const result = await query(
        `INSERT INTO vehicles (make, model, category, price, quantity, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING id, make, model, category, price, quantity, created_at, updated_at`,
        [
          validatedData.make,
          validatedData.model,
          validatedData.category,
          validatedData.price,
          validatedData.quantity
        ]
      );

      return result.rows[0];
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        if (error.issues && error.issues.length > 0) {
          const issue = error.issues[0];
          if (issue) {
            let message = issue.message;
            if (
              message.includes('expected string, received undefined') ||
              message.includes('expected number, received undefined') ||
              message === 'Required'
            ) {
              const field = String(issue.path[0]);
              message = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            }
            throw new Error(message, { cause: error });
          }
        }
        throw new Error('Validation failed', { cause: error });
      }
      throw error;
    }
  }
}
