import { Router } from 'express';
import { RoomTypeController } from './roomType.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { tenantContext, requireModule } from '../../middlewares/tenant.js';

const router = Router();
router.use(authenticate, tenantContext, requireModule('roomTypes'));

router.get('/', RoomTypeController.list);
router.get('/:id', RoomTypeController.getById);
router.post('/', RoomTypeController.create);
router.put('/:id', RoomTypeController.update);
router.delete('/:id', RoomTypeController.delete);

export default router;
