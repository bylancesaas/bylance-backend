import { Router } from 'express';
import { VehicleController } from './vehicle.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { tenantContext, requireModule } from '../../middlewares/tenant.js';

const router = Router();
router.use(authenticate, tenantContext, requireModule('clients'));

router.get('/', VehicleController.list);
router.get('/:id', VehicleController.getById);
router.post('/', VehicleController.create);
router.put('/:id', VehicleController.update);
router.delete('/:id', VehicleController.delete);

export default router;
