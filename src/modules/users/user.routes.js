import { Router } from 'express';
import { UserController } from './user.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { tenantContext, requireModule } from '../../middlewares/tenant.js';

const router = Router();

router.use(authenticate, tenantContext, requireModule('userManagement'));

router.get('/', authorize('director', 'super_admin'), UserController.list);
router.get('/:id', authorize('director', 'super_admin'), UserController.getById);
router.post('/', authorize('director', 'super_admin'), UserController.create);
router.put('/:id', authorize('director', 'super_admin'), UserController.update);
router.delete('/:id', authorize('director', 'super_admin'), UserController.delete);

export default router;
