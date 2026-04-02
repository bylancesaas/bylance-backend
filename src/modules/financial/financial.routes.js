import { Router } from 'express';
import { FinancialController } from './financial.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { tenantContext, requireModule } from '../../middlewares/tenant.js';

const router = Router();
router.use(authenticate, tenantContext, requireModule('financial'));
router.get('/summary', authorize('director', 'assistant', 'super_admin'), FinancialController.getSummary);
router.get('/', authorize('director', 'assistant', 'super_admin'), FinancialController.list);
router.get('/:id', authorize('director', 'assistant', 'super_admin'), FinancialController.getById);
router.post('/', authorize('director', 'assistant', 'super_admin'), FinancialController.create);
router.put('/:id', authorize('director', 'assistant', 'super_admin'), FinancialController.update);
router.delete('/:id', authorize('director', 'super_admin'), FinancialController.delete);
export default router;
