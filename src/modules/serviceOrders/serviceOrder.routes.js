import { Router } from 'express';
import { ServiceOrderController } from './serviceOrder.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { tenantContext, requireModule } from '../../middlewares/tenant.js';

const router = Router();
router.use(authenticate, tenantContext, requireModule('serviceOrders'));
router.get('/', ServiceOrderController.list);
router.get('/:id', ServiceOrderController.getById);
router.post('/', ServiceOrderController.create);
router.post('/:id/to-financial', ServiceOrderController.sendToFinancial);
router.patch('/:id/status', ServiceOrderController.updateStatus);
router.put('/:id', ServiceOrderController.update);
router.delete('/:id', ServiceOrderController.delete);
export default router;
