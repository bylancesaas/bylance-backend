import { FinancialRepository } from './financial.repository.js';
export class FinancialService {
  static async list(tenantId) { return FinancialRepository.findAllByTenant(tenantId); }
  static async getById(id, tenantId) {
    const f = await FinancialRepository.findById(id, tenantId);
    if (!f) throw new Error('NOT_FOUND');
    return f;
  }
  static async getSummary(tenantId) { return FinancialRepository.getSummary(tenantId); }
  static async create(data) { return FinancialRepository.create(data); }
  static async update(id, tenantId, data) { return FinancialRepository.update(id, tenantId, data); }
  static async delete(id, tenantId) { return FinancialRepository.delete(id, tenantId); }
}
