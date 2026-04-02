import { ServiceRepository } from './service.repository.js';
export class ServiceService {
  static async list(tenantId) { return ServiceRepository.findAllByTenant(tenantId); }
  static async getById(id, tenantId) {
    const s = await ServiceRepository.findById(id, tenantId);
    if (!s) throw new Error('NOT_FOUND');
    return s;
  }
  static async create(data) { return ServiceRepository.create(data); }
  static async update(id, tenantId, data) { return ServiceRepository.update(id, tenantId, data); }
  static async delete(id, tenantId) { return ServiceRepository.delete(id, tenantId); }
}
