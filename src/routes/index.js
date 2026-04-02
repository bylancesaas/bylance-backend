import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import tenantRoutes from '../modules/tenants/tenant.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import clientRoutes from '../modules/clients/client.routes.js';
import vehicleRoutes from '../modules/vehicles/vehicle.routes.js';
import itemRoutes from '../modules/items/item.routes.js';
import serviceRoutes from '../modules/services/service.routes.js';
import serviceOrderRoutes from '../modules/serviceOrders/serviceOrder.routes.js';
import warrantyRoutes from '../modules/warranties/warranty.routes.js';
import financialRoutes from '../modules/financial/financial.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tenants', tenantRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/items', itemRoutes);
router.use('/services', serviceRoutes);
router.use('/service-orders', serviceOrderRoutes);
router.use('/warranties', warrantyRoutes);
router.use('/financial', financialRoutes);

export { router as routes };
