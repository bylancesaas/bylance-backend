import { WarrantyService } from './warranty.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
export class WarrantyController {
  static async list(req, res, next) {
    try { return ApiResponse.success(res, await WarrantyService.list(req.tenantId)); } catch (e) { next(e); }
  }
  static async getById(req, res, next) {
    try { return ApiResponse.success(res, await WarrantyService.getById(req.params.id, req.tenantId)); }
    catch (e) { if (e.message === 'NOT_FOUND') return ApiResponse.notFound(res); next(e); }
  }
  static async create(req, res, next) {
    try { return ApiResponse.created(res, await WarrantyService.create({ ...req.body, tenantId: req.tenantId })); } catch (e) { next(e); }
  }
  static async update(req, res, next) {
    try { return ApiResponse.success(res, await WarrantyService.update(req.params.id, req.tenantId, req.body)); } catch (e) { next(e); }
  }
  static async delete(req, res, next) {
    try { await WarrantyService.delete(req.params.id, req.tenantId); return ApiResponse.success(res, null, 'Removido'); } catch (e) { next(e); }
  }
}
