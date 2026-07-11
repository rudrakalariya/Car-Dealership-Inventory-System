import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticateToken, authenticateCustomer } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, authenticateCustomer, VehicleController.createVehicle);
router.get('/search', authenticateToken, authenticateCustomer, VehicleController.searchVehicles);
router.get('/', authenticateToken, authenticateCustomer, VehicleController.getAllVehicles);

export default router;
