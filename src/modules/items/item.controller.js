import { ItemService } from './item.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class ItemController {
  static async list(req, res, next) {
    try { return ApiResponse.success(res, await ItemService.list(req.tenantId)); } catch (e) { next(e); }
  }
  static async getById(req, res, next) {
    try {
      return ApiResponse.success(res, await ItemService.getById(req.params.id, req.tenantId));
    } catch (e) { if (e.message === 'NOT_FOUND') return ApiResponse.notFound(res); next(e); }
  }
  static async create(req, res, next) {
    try { return ApiResponse.created(res, await ItemService.create({ ...req.body, tenantId: req.tenantId })); } catch (e) { next(e); }
  }
  static async listMovements(req, res, next) {
    try {
      return ApiResponse.success(res, await ItemService.listMovements(req.params.id, req.tenantId));
    } catch (e) {
      if (e.message === 'NOT_FOUND') return ApiResponse.notFound(res);
      next(e);
    }
  }
  static async createMovement(req, res, next) {
    try {
      const data = await ItemService.registerMovement(req.params.id, req.tenantId, req.body);
      return ApiResponse.created(res, data, 'Movimentacao registrada');
    } catch (e) {
      if (e.message === 'NOT_FOUND') return ApiResponse.notFound(res);
      if (e.message === 'INVALID_MOVEMENT_TYPE') return ApiResponse.error(res, 'Tipo de movimentacao invalido', 422);
      if (e.message === 'INVALID_MOVEMENT_QUANTITY') return ApiResponse.error(res, 'Quantidade invalida', 422);
      if (e.message === 'INVALID_MOVEMENT_DATE') return ApiResponse.error(res, 'Data invalida', 422);
      if (e.message === 'INVALID_MOVEMENT_UNIT_COST') return ApiResponse.error(res, 'Custo unitario invalido', 422);
      if (e.message === 'INSUFFICIENT_STOCK') return ApiResponse.error(res, 'Saldo insuficiente para essa saida', 409);
      next(e);
    }
  }
  static async update(req, res, next) {
    try { return ApiResponse.success(res, await ItemService.update(req.params.id, req.tenantId, req.body)); } catch (e) { next(e); }
  }
  static async delete(req, res, next) {
    try { await ItemService.delete(req.params.id, req.tenantId); return ApiResponse.success(res, null, 'Removido'); } catch (e) { next(e); }
  }
}
