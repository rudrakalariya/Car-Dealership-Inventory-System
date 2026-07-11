import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { validateUserRegistration, validateUserLogin } from '../utils/validators';
import { generateToken } from '../utils/tokenGenerator';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = validateUserRegistration(req.body);
      const user = await User.create(validatedData as Record<string, unknown>);

      // Remove password from response
      const userWithoutPassword = { ...user } as Record<string, unknown>;
      delete userWithoutPassword.password;

      res.status(201).json(userWithoutPassword);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Unknown error occurred' });
      }
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = validateUserLogin(req.body);

      // Find user by email
      const user = await User.findByEmail(validatedData.email);
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Compare password
      const isMatch = await User.comparePassword(validatedData.password, user.password as string);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Generate JWT
      const token = generateToken({ id: user.id, username: user.username, role: user.role });

      // Remove password from response
      const userWithoutPassword = { ...user } as Record<string, unknown>;
      delete userWithoutPassword.password;

      res.status(200).json({
        token,
        user: userWithoutPassword
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Unknown error occurred' });
      }
    }
  }
}
