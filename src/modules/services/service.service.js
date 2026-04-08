import { ServiceRepository } from './service.repository.js';

function normalizeServicePayload(data = {}) {
  const payload = {
    name: data.name?.trim(),
    description: data.description?.trim() || null,
    estimatedTime: data.estimatedTime?.trim() || null,
    category: data.category?.trim() || null,
  };

  const parsedPrice = Number(data.price);
  payload.price = Number.isFinite(parsedPrice) ? parsedPrice : 0;

  return payload;
}

export class ServiceService {
  static async list(tenantId) { return ServiceRepository.findAllByTenant(tenantId); }
  static async getById(id, tenantId) {
    const s = await ServiceRepository.findById(id, tenantId);
    if (!s) throw new Error('NOT_FOUND');
    return s;
  }
  static async create(data) {
    return ServiceRepository.create({
      ...normalizeServicePayload(data),
      tenantId: data.tenantId,
    });
  }

  static async update(id, tenantId, data) {
    return ServiceRepository.update(id, tenantId, normalizeServicePayload(data));
  }

  static async delete(id, tenantId) { return ServiceRepository.delete(id, tenantId); }
}
