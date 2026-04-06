import { Router } from 'express';
import { TenantController } from './tenant.controller.js';
import { authenticate, isSuperAdmin } from '../../middlewares/auth.js';
import { logoUpload, contractUpload } from '../../config/upload.js';

const router = Router();

router.use(authenticate, isSuperAdmin);

router.get('/', TenantController.list);
router.get('/:id', TenantController.getById);
router.post('/', TenantController.create);
router.put('/:id', TenantController.update);
router.delete('/:id', TenantController.delete);
router.put('/:id/modules', TenantController.updateModules);
router.post('/:id/logo', logoUpload.single('logo'), TenantController.uploadLogo);
router.put('/:id/contract', TenantController.updateContract);
router.post('/:id/contract/file', contractUpload.single('contract'), TenantController.uploadContract);
router.post('/:id/audit-log', TenantController.addAuditLog);

export default router;
