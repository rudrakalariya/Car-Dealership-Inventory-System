import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Vehicle } from '../models/vehicle.model';
import {
  validateVehicle,
  validateVehicleUpdate,
  validatePurchase,
  validateRestock
} from '../utils/validators';

export class VehicleController {
  static async createVehicle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validatedData = validateVehicle(req.body);
      const vehicle = await Vehicle.create(validatedData as Record<string, unknown>);
      res.status(201).json(vehicle);
    } catch (error: unknown) {
      /* istanbul ignore else */
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        /* istanbul ignore next */
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

  static async updateVehicle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid vehicle ID' });
        return;
      }

      const validatedData = validateVehicleUpdate(req.body);

      const vehicle = await Vehicle.update(id, validatedData as Record<string, unknown>);
      if (!vehicle) {
        res.status(404).json({ error: 'Vehicle not found' });
        return;
      }

      res.status(200).json(vehicle);
    } catch (error: unknown) {
      /* istanbul ignore else */
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        /* istanbul ignore next */
        res.status(400).json({ error: 'Unknown error occurred' });
      }
    }
  }

  static async deleteVehicle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid vehicle ID' });
        return;
      }

      const deleted = await Vehicle.delete(id);
      if (!deleted) {
        res.status(404).json({ error: 'Vehicle not found' });
        return;
      }

      res.status(204).send();
    } catch {
      res.status(500).json({ error: 'Failed to delete vehicle' });
    }
  }

  static async purchaseVehicle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid vehicle ID' });
        return;
      }

      const { quantity } = validatePurchase(req.body);

      const result = await Vehicle.purchase(id, quantity);

      if (!result.success) {
        if (result.error === 'Vehicle not found') {
          res.status(404).json({ error: result.error });
        } else {
          res.status(400).json({ error: result.error });
        }
        return;
      }

      res.status(200).json({ message: 'Purchase successful', vehicle: result.vehicle });
    } catch (error: unknown) {
      /* istanbul ignore else */
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        /* istanbul ignore next */
        res.status(400).json({ error: 'Unknown error occurred' });
      }
    }
  }

  static async restockVehicle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid vehicle ID' });
        return;
      }

      const { quantity } = validateRestock(req.body);

      const result = await Vehicle.restock(id, quantity);

      if (!result.success) {
        res.status(404).json({ error: result.error });
        return;
      }

      res.status(200).json({ message: 'Restock successful', vehicle: result.vehicle });
    } catch (error: unknown) {
      /* istanbul ignore else */
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        /* istanbul ignore next */
        res.status(400).json({ error: 'Unknown error occurred' });
      }
    }
  }
}
