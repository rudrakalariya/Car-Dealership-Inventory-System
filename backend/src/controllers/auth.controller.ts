import { Request, Response } from 'express';
import { User } from '../models/user.model';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.create(req.body);

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
