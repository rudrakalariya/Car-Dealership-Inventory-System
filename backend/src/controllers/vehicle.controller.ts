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

  static async getAllVehicles(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vehicles = await Vehicle.getAll();
      res.status(200).json(vehicles);
    } catch {
      res.status(500).json({ error: 'Failed to retrieve vehicles' });
    }
  }

  static async searchVehicles(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { make, model, category, minPrice, maxPrice } = req.query;

      const filters = {
        make: make as string,
        model: model as string,
        category: category as string,
        minPrice: minPrice as string,
        maxPrice: maxPrice as string
      };

      const vehicles = await Vehicle.search(filters);
      res.status(200).json(vehicles);
    } catch {
      res.status(500).json({ error: 'Failed to search vehicles' });
    }
  }
}
