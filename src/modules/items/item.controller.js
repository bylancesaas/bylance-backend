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
  static async update(req, res, next) {
    try { return ApiResponse.success(res, await ItemService.update(req.params.id, req.tenantId, req.body)); } catch (e) { next(e); }
  }
  static async delete(req, res, next) {
    try { await ItemService.delete(req.params.id, req.tenantId); return ApiResponse.success(res, null, 'Removido'); } catch (e) { next(e); }
  }
}
