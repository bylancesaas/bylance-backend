import { ServiceOrderRepository } from './serviceOrder.repository.js';

export class ServiceOrderService {
  static async list(tenantId) { return ServiceOrderRepository.findAllByTenant(tenantId); }

  static async getById(id, tenantId) {
    const order = await ServiceOrderRepository.findById(id, tenantId);
    if (!order) throw new Error('NOT_FOUND');
    return order;
  }

  static async create(data) { return ServiceOrderRepository.create(data); }
  static async update(id, tenantId, data) { return ServiceOrderRepository.update(id, tenantId, data); }
  static async delete(id, tenantId) { return ServiceOrderRepository.delete(id, tenantId); }

  static async sendToFinancial(id, tenantId) {
    const order = await ServiceOrderRepository.findById(id, tenantId);
    if (!order) throw new Error('NOT_FOUND');
    if (order.financials?.length > 0) throw new Error('ALREADY_SENT');
    return ServiceOrderRepository.sendToFinancial(order, tenantId);
  }
}
