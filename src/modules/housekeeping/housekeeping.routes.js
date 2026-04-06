import { Router } from 'express';
import { HousekeepingController } from './housekeeping.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { tenantContext, requireModule } from '../../middlewares/tenant.js';

const router = Router();
router.use(authenticate, tenantContext, requireModule('housekeeping'));

router.get('/', HousekeepingController.list);
router.get('/:id', HousekeepingController.getById);
router.post('/', HousekeepingController.create);
router.put('/:id', HousekeepingController.update);
router.patch('/:id/status', HousekeepingController.updateStatus);
router.delete('/:id', HousekeepingController.delete);

export default router;
