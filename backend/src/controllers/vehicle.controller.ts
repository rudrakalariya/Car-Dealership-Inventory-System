import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Vehicle } from '../models/vehicle.model';
import { validateVehicle } from '../utils/validators';

export class VehicleController {
  static async createVehicle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validatedData = validateVehicle(req.body);
      const vehicle = await Vehicle.create(validatedData as Record<string, unknown>);
      res.status(201).json(vehicle);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Unknown error occurred' });
      }
    }
  }
}
