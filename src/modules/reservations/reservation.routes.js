import { Router } from 'express';
import { ReservationController } from './reservation.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { tenantContext, requireModule } from '../../middlewares/tenant.js';

const router = Router();
router.use(authenticate, tenantContext, requireModule('reservations'));

router.get('/', ReservationController.list);
router.get('/:id', ReservationController.getById);
router.post('/', ReservationController.create);
router.put('/:id', ReservationController.update);
router.patch('/:id/status', ReservationController.updateStatus);
router.delete('/:id', ReservationController.delete);

export default router;
