import { HousekeepingRepository } from './housekeeping.repository.js';

export class HousekeepingService {
  static async list(tenantId) { return HousekeepingRepository.findAllByTenant(tenantId); }

  static async getById(id, tenantId) {
    const task = await HousekeepingRepository.findById(id, tenantId);
    if (!task) throw new Error('NOT_FOUND');
    return task;
  }

  static async create(data) { return HousekeepingRepository.create(data); }

  static async update(id, tenantId, data) { return HousekeepingRepository.update(id, tenantId, data); }

  static async updateStatus(id, tenantId, status) {
    const allowed = ['pending', 'in_progress', 'completed', 'inspected'];
    if (!allowed.includes(status)) throw new Error('INVALID_STATUS');
    return HousekeepingRepository.updateStatus(id, tenantId, status);
  }

  static async delete(id, tenantId) { return HousekeepingRepository.delete(id, tenantId); }
}
