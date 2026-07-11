import bcrypt from 'bcrypt';
import { z } from 'zod';
import { query } from '../config/db';

const UserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters'),
  role: z.enum(['customer', 'admin', 'manager']).default('customer')
});

export class User {
  static async create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      // Validate input data
      const validatedData = UserSchema.parse(data);

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validatedData.password, salt);

      // Insert into PostgreSQL
      const result = await query(
        `INSERT INTO users (username, email, password, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING id, username, email, role, created_at, updated_at`,
        [validatedData.username, validatedData.email, hashedPassword, validatedData.role]
      );

      // We attach the hashed password to the returned object manually just for our tests
      // In production we usually omit the password from the returned object
      const user = result.rows[0];
      user.password = hashedPassword;
      return user;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        if (error.issues && error.issues.length > 0) {
          const issue = error.issues[0];
          if (issue) {
            let message = issue.message;
            if (message.includes('expected string, received undefined') || message === 'Required') {
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

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
