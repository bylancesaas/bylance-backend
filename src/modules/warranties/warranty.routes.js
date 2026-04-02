import { Router } from 'express';
import { WarrantyController } from './warranty.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { tenantContext, requireModule } from '../../middlewares/tenant.js';

const router = Router();
router.use(authenticate, tenantContext, requireModule('warranties'));
router.get('/', WarrantyController.list);
router.get('/:id', WarrantyController.getById);
router.post('/', WarrantyController.create);
router.put('/:id', WarrantyController.update);
router.delete('/:id', WarrantyController.delete);
export default router;
