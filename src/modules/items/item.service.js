import { ItemRepository } from './item.repository.js';
export class ItemService {
  static async list(tenantId) { return ItemRepository.findAllByTenant(tenantId); }
  static async getById(id, tenantId) {
    const item = await ItemRepository.findById(id, tenantId);
    if (!item) throw new Error('NOT_FOUND');
    return item;
  }
  static async create(data) { return ItemRepository.create(data); }
  static async update(id, tenantId, data) { return ItemRepository.update(id, tenantId, data); }
  static async delete(id, tenantId) { return ItemRepository.delete(id, tenantId); }
}
