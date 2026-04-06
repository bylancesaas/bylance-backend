import { Router } from 'express';
import { GuestController } from './guest.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { tenantContext, requireModule } from '../../middlewares/tenant.js';

const router = Router();
router.use(authenticate, tenantContext, requireModule('guests'));

router.get('/', GuestController.list);
router.get('/:id', GuestController.getById);
router.post('/', GuestController.create);
router.put('/:id', GuestController.update);
router.delete('/:id', GuestController.delete);

export default router;
