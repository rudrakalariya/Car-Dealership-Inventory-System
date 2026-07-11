import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticateToken, authenticateCustomer } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, authenticateCustomer, VehicleController.createVehicle);

export default router;
