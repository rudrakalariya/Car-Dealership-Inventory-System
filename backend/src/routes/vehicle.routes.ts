import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import {
  authenticateToken,
  authenticateCustomer,
  authenticateCustomerOrAdmin,
  authenticateAdmin
} from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, authenticateAdmin, VehicleController.createVehicle);
router.get(
  '/search',
  authenticateToken,
  authenticateCustomerOrAdmin,
  VehicleController.searchVehicles
);
router.get('/', authenticateToken, authenticateCustomerOrAdmin, VehicleController.getAllVehicles);
router.put('/:id', authenticateToken, authenticateAdmin, VehicleController.updateVehicle);
router.delete('/:id', authenticateToken, authenticateAdmin, VehicleController.deleteVehicle);
router.post(
  '/:id/purchase',
  authenticateToken,
  authenticateCustomer,
  VehicleController.purchaseVehicle
);
router.post('/:id/restock', authenticateToken, authenticateAdmin, VehicleController.restockVehicle);

export default router;
