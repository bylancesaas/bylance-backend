import { Router } from 'express';
import { RoomController } from './room.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { tenantContext, requireModule } from '../../middlewares/tenant.js';

const router = Router();
router.use(authenticate, tenantContext, requireModule('rooms'));

router.get('/', RoomController.list);
router.get('/:id', RoomController.getById);
router.post('/', RoomController.create);
router.put('/:id', RoomController.update);
router.patch('/:id/status', RoomController.updateStatus);
router.delete('/:id', RoomController.delete);

export default router;
