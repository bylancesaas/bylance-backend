import { Router } from 'express';
import { ServiceController } from './service.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { tenantContext, requireModule } from '../../middlewares/tenant.js';

const router = Router();
router.use(authenticate, tenantContext, requireModule('services'));
router.get('/', ServiceController.list);
router.get('/:id', ServiceController.getById);
router.post('/', ServiceController.create);
router.put('/:id', ServiceController.update);
router.delete('/:id', ServiceController.delete);
export default router;
