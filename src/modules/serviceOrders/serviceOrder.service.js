import { ServiceOrderRepository } from './serviceOrder.repository.js';

const VALID_ORDER_STATUSES = new Set(['pending', 'in_progress', 'completed', 'cancelled']);

export class ServiceOrderService {
  static async list(tenantId) { return ServiceOrderRepository.findAllByTenant(tenantId); }

  static async getById(id, tenantId) {
    const order = await ServiceOrderRepository.findById(id, tenantId);
    if (!order) throw new Error('NOT_FOUND');
    return order;
  }

  static async create(data) { return ServiceOrderRepository.create(data); }
  static async update(id, tenantId, data) { return ServiceOrderRepository.update(id, tenantId, data); }

  static async updateStatus(id, tenantId, status) {
    if (!VALID_ORDER_STATUSES.has(status)) throw new Error('INVALID_STATUS');
    const order = await ServiceOrderRepository.updateStatus(id, tenantId, status);
    if (!order) throw new Error('NOT_FOUND');
    return order;
  }

  static async delete(id, tenantId) { return ServiceOrderRepository.delete(id, tenantId); }

  static async sendToFinancial(id, tenantId) {
    const order = await ServiceOrderRepository.findById(id, tenantId);
    if (!order) throw new Error('NOT_FOUND');
    if (order.financials?.length > 0) throw new Error('ALREADY_SENT');
    return ServiceOrderRepository.sendToFinancial(order, tenantId);
  }
}
