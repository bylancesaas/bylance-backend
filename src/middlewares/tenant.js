import { ApiResponse } from '../utils/apiResponse.js';
import prisma from '../config/prisma.js';

export const tenantContext = async (req, res, next) => {
  try {
    // Super admins don't need tenant context
    if (req.user?.role === 'super_admin') {
      req.tenantId = null;
      return next();
    }

    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return ApiResponse.forbidden(res, 'Usuário sem empresa associada');
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId, active: true },
      include: { modules: true },
    });

    if (!tenant) {
      return ApiResponse.forbidden(res, 'Empresa não encontrada ou inativa');
    }

    req.tenantId = tenant.id;
    req.tenant = tenant;
    req.activeModules = tenant.modules
      .filter(m => m.active)
      .map(m => m.module);

    next();
  } catch (error) {
    return ApiResponse.error(res, 'Erro ao verificar contexto da empresa');
  }
};

export const requireModule = (moduleName) => {
  return (req, res, next) => {
    // Super admins bypass module checks
    if (req.user?.role === 'super_admin') return next();

    if (!req.activeModules || !req.activeModules.includes(moduleName)) {
      return ApiResponse.forbidden(res, `Módulo "${moduleName}" não está ativo para sua empresa`);
    }
    next();
  };
};
