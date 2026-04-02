import { Router } from 'express';
import { ClientController } from './client.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { tenantContext, requireModule } from '../../middlewares/tenant.js';

const router = Router();
router.use(authenticate, tenantContext, requireModule('clients'));

router.get('/', ClientController.list);
router.get('/:id', ClientController.getById);
router.post('/', ClientController.create);
router.put('/:id', ClientController.update);
router.delete('/:id', ClientController.delete);

export default router;
