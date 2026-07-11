import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { validateUserRegistration } from '../utils/validators';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = validateUserRegistration(req.body);
      const user = await User.create(validatedData as Record<string, unknown>);

      // Remove password from response
      const { password, ...userWithoutPassword } = user as any;

      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
