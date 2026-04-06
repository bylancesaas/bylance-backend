import { GuestRepository } from './guest.repository.js';

export class GuestService {
  static async list(tenantId) { return GuestRepository.findAllByTenant(tenantId); }

  static async getById(id, tenantId) {
    const guest = await GuestRepository.findById(id, tenantId);
    if (!guest) throw new Error('NOT_FOUND');
    return guest;
  }

  static async create(data) { return GuestRepository.create(data); }

  static async update(id, tenantId, data) { return GuestRepository.update(id, tenantId, data); }

  static async delete(id, tenantId) { return GuestRepository.delete(id, tenantId); }
}
