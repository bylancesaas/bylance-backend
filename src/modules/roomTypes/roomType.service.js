import { RoomTypeRepository } from './roomType.repository.js';

export class RoomTypeService {
  static async list(tenantId) { return RoomTypeRepository.findAllByTenant(tenantId); }

  static async getById(id, tenantId) {
    const rt = await RoomTypeRepository.findById(id, tenantId);
    if (!rt) throw new Error('NOT_FOUND');
    return rt;
  }

  static async create(data) { return RoomTypeRepository.create(data); }

  static async update(id, tenantId, data) { return RoomTypeRepository.update(id, tenantId, data); }

  static async delete(id, tenantId) { return RoomTypeRepository.delete(id, tenantId); }
}
