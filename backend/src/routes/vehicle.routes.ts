import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, VehicleController.createVehicle);

export default router;
