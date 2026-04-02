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

  static async update(id, data) {
    if (data.slug) {
      const existing = await TenantRepository.findBySlug(data.slug);
      if (existing && existing.id !== id) throw new Error('SLUG_IN_USE');
    }
    return TenantRepository.update(id, data);
  }

  static async delete(id) {
    return TenantRepository.delete(id);
  }

  static async updateModules(tenantId, modules) {
    return TenantRepository.updateModules(tenantId, modules);
  }
}
