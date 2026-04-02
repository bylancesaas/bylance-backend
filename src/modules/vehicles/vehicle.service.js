import { VehicleRepository } from './vehicle.repository.js';

export class VehicleService {
  static async list(tenantId) { return VehicleRepository.findAllByTenant(tenantId); }
  static async getByClient(clientId, tenantId) { return VehicleRepository.findByClient(clientId, tenantId); }
  static async getById(id, tenantId) {
    const v = await VehicleRepository.findById(id, tenantId);
    if (!v) throw new Error('NOT_FOUND');
    return v;
  }
  static async create(data) { return VehicleRepository.create(data); }
  static async update(id, tenantId, data) { return VehicleRepository.update(id, tenantId, data); }
  static async delete(id, tenantId) { return VehicleRepository.delete(id, tenantId); }
}
