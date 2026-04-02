import { WarrantyRepository } from './warranty.repository.js';
export class WarrantyService {
  static async list(tenantId) { return WarrantyRepository.findAllByTenant(tenantId); }
  static async getById(id, tenantId) {
    const w = await WarrantyRepository.findById(id, tenantId);
    if (!w) throw new Error('NOT_FOUND');
    return w;
  }
  static async create(data) { return WarrantyRepository.create(data); }
  static async update(id, tenantId, data) { return WarrantyRepository.update(id, tenantId, data); }
  static async delete(id, tenantId) { return WarrantyRepository.delete(id, tenantId); }
}
