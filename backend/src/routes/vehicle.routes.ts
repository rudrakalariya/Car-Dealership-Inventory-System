import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import {
  authenticateToken,
  authenticateCustomer,
  authenticateAdmin
} from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, authenticateCustomer, VehicleController.createVehicle);
router.get('/search', authenticateToken, authenticateCustomer, VehicleController.searchVehicles);
router.get('/', authenticateToken, authenticateCustomer, VehicleController.getAllVehicles);
router.put('/:id', authenticateToken, authenticateCustomer, VehicleController.updateVehicle);
router.delete('/:id', authenticateToken, authenticateAdmin, VehicleController.deleteVehicle);
router.post(
  '/:id/purchase',
  authenticateToken,
  authenticateCustomer,
  VehicleController.purchaseVehicle
);
router.post('/:id/restock', authenticateToken, authenticateAdmin, VehicleController.restockVehicle);

export default router;
