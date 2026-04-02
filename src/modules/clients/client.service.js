import { ClientRepository } from './client.repository.js';

export class ClientService {
  static async list(tenantId) { return ClientRepository.findAllByTenant(tenantId); }

  static async getById(id, tenantId) {
    const client = await ClientRepository.findById(id, tenantId);
    if (!client) throw new Error('NOT_FOUND');
    return client;
  }

  static async create(data) { return ClientRepository.create(data); }

  static async update(id, tenantId, data) { return ClientRepository.update(id, tenantId, data); }

  static async delete(id, tenantId) { return ClientRepository.delete(id, tenantId); }
}
