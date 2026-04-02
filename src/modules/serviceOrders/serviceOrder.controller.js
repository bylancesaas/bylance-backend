import { ServiceOrderService } from './serviceOrder.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class ServiceOrderController {
  static async list(req, res, next) {
    try { return ApiResponse.success(res, await ServiceOrderService.list(req.tenantId)); } catch (e) { next(e); }
  }
  static async getById(req, res, next) {
    try { return ApiResponse.success(res, await ServiceOrderService.getById(req.params.id, req.tenantId)); }
    catch (e) { if (e.message === 'NOT_FOUND') return ApiResponse.notFound(res); next(e); }
  }
  static async create(req, res, next) {
    try { return ApiResponse.created(res, await ServiceOrderService.create({ ...req.body, tenantId: req.tenantId })); } catch (e) { next(e); }
  }
  static async update(req, res, next) {
    try { return ApiResponse.success(res, await ServiceOrderService.update(req.params.id, req.tenantId, req.body)); } catch (e) { next(e); }
  }
  static async delete(req, res, next) {
    try { await ServiceOrderService.delete(req.params.id, req.tenantId); return ApiResponse.success(res, null, 'Removido'); } catch (e) { next(e); }
  }

  static async sendToFinancial(req, res, next) {
    try {
      return ApiResponse.success(res, await ServiceOrderService.sendToFinancial(req.params.id, req.tenantId));
    } catch (e) {
      if (e.message === 'NOT_FOUND') return ApiResponse.notFound(res);
      if (e.message === 'ALREADY_SENT') return ApiResponse.error(res, 'Esta OS já foi lançada no financeiro', 400);
      next(e);
    }
  }
}
