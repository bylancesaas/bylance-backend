import { TenantRepository } from './tenant.repository.js';

export class TenantService {
  static async list() {
    return TenantRepository.findAll();
  }

  static async getById(id) {
    const tenant = await TenantRepository.findById(id);
    if (!tenant) throw new Error('TENANT_NOT_FOUND');
    return tenant;
  }

  static async create(data) {
    const existing = await TenantRepository.findBySlug(data.slug);
    if (existing) throw new Error('SLUG_IN_USE');
    return TenantRepository.create(data);
  }

  static async update(id, data, performedBy) {
    if (data.slug) {
      const existing = await TenantRepository.findBySlug(data.slug);
      if (existing && existing.id !== id) throw new Error('SLUG_IN_USE');
    }
    const tenant = await TenantRepository.update(id, data);
    if (performedBy) {
      await TenantRepository.addAuditLog({
        tenantId: id,
        action: 'tenant_updated',
        category: 'cadastro',
        description: 'Dados da empresa atualizados',
        performedBy,
        meta: { fieldsChanged: Object.keys(data) },
      });
    }
    return tenant;
  }

  static async delete(id, performedBy) {
    const tenant = await TenantRepository.findById(id);
    if (!tenant) throw new Error('TENANT_NOT_FOUND');
    return TenantRepository.softDelete(id, performedBy, tenant.name);
  }

  static async updateModules(tenantId, modules, performedBy) {
    const result = await TenantRepository.updateModules(tenantId, modules);
    if (performedBy) {
      await TenantRepository.addAuditLog({
        tenantId,
        action: 'modules_updated',
        category: 'modulos',
        description: 'Módulos da empresa atualizados',
        performedBy,
        meta: { modules },
      });
    }
    return result;
  }

  static async updateContract(id, contractData, performedBy) {
    if (!contractData.contractStatus) throw new Error('CONTRACT_STATUS_REQUIRED');
    return TenantRepository.updateContract(id, contractData, performedBy);
  }

  static async addAuditLog(tenantId, { action, category, description, performedBy, meta }) {
    return TenantRepository.addAuditLog({ tenantId, action, category, description, performedBy, meta });
  }
}
