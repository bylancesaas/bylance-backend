import { ItemRepository } from './item.repository.js';
export class ItemService {
  static async list(tenantId) { return ItemRepository.findAllByTenant(tenantId); }
  static async getById(id, tenantId) {
    const item = await ItemRepository.findById(id, tenantId);
    if (!item) throw new Error('NOT_FOUND');
    return item;
  }
  static async listMovements(id, tenantId) {
    const item = await ItemRepository.findById(id, tenantId);
    if (!item) throw new Error('NOT_FOUND');
    return ItemRepository.findMovementsByItem(id, tenantId);
  }

  static async registerMovement(id, tenantId, payload) {
    const type = String(payload?.type || '').toLowerCase();
    if (!['in', 'out'].includes(type)) throw new Error('INVALID_MOVEMENT_TYPE');

    const quantity = Number.parseInt(payload?.quantity, 10);
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('INVALID_MOVEMENT_QUANTITY');

    const movementDate = payload?.movementDate ? new Date(payload.movementDate) : new Date();
    if (Number.isNaN(movementDate.getTime())) throw new Error('INVALID_MOVEMENT_DATE');

    let unitCost = null;
    if (payload?.unitCost !== undefined && payload?.unitCost !== null && payload?.unitCost !== '') {
      unitCost = Number(payload.unitCost);
      if (!Number.isFinite(unitCost) || unitCost < 0) throw new Error('INVALID_MOVEMENT_UNIT_COST');
    }

    const clean = (v) => (typeof v === 'string' ? v.trim() : '');

    return ItemRepository.createMovement(id, tenantId, {
      type,
      quantity,
      movementDate,
      unitCost,
      entryType: type === 'in' ? (clean(payload?.entryType) || null) : null,
      supplier: type === 'in' ? (clean(payload?.supplier) || null) : null,
      document: type === 'in' ? (clean(payload?.document) || null) : null,
      notes: clean(payload?.notes) || null,
    });
  }

  static async create(data) { return ItemRepository.create(data); }
  static async update(id, tenantId, data) { return ItemRepository.update(id, tenantId, data); }
  static async delete(id, tenantId) { return ItemRepository.delete(id, tenantId); }
}
