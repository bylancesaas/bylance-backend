import { RoomRepository } from './room.repository.js';

export class RoomService {
  static async list(tenantId) { return RoomRepository.findAllByTenant(tenantId); }

  static async getById(id, tenantId) {
    const room = await RoomRepository.findById(id, tenantId);
    if (!room) throw new Error('NOT_FOUND');
    return room;
  }

  static async create(data) { return RoomRepository.create(data); }

  static async update(id, tenantId, data) { return RoomRepository.update(id, tenantId, data); }

  static async updateStatus(id, tenantId, status) {
    const allowed = ['available', 'occupied', 'maintenance', 'cleaning'];
    if (!allowed.includes(status)) throw new Error('INVALID_STATUS');
    return RoomRepository.updateStatus(id, tenantId, status);
  }

  static async delete(id, tenantId) { return RoomRepository.delete(id, tenantId); }
}
