import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Vehicle } from '../models/vehicle.model';

export class VehicleController {
  static async createVehicle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vehicle = await Vehicle.create(req.body);
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
