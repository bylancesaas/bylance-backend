import { Router } from 'express';
import { ItemController } from './item.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { tenantContext, requireModule } from '../../middlewares/tenant.js';

const router = Router();
router.use(authenticate, tenantContext, requireModule('items'));
router.get('/', ItemController.list);
router.get('/:id/movements', ItemController.listMovements);
router.get('/:id', ItemController.getById);
router.post('/', ItemController.create);
router.post('/:id/movements', ItemController.createMovement);
router.put('/:id', ItemController.update);
router.delete('/:id', ItemController.delete);
export default router;
