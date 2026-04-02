import { FinancialService } from './financial.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class FinancialController {
  static async list(req, res, next) {
    try { return ApiResponse.success(res, await FinancialService.list(req.tenantId)); } catch (e) { next(e); }
  }
  static async getById(req, res, next) {
    try { return ApiResponse.success(res, await FinancialService.getById(req.params.id, req.tenantId)); }
    catch (e) { if (e.message === 'NOT_FOUND') return ApiResponse.notFound(res); next(e); }
  }
  static async getSummary(req, res, next) {
    try { return ApiResponse.success(res, await FinancialService.getSummary(req.tenantId)); } catch (e) { next(e); }
  }
  static async create(req, res, next) {
    try { return ApiResponse.created(res, await FinancialService.create({ ...req.body, tenantId: req.tenantId })); } catch (e) { next(e); }
  }
  static async update(req, res, next) {
    try { return ApiResponse.success(res, await FinancialService.update(req.params.id, req.tenantId, req.body)); } catch (e) { next(e); }
  }
  static async delete(req, res, next) {
    try { await FinancialService.delete(req.params.id, req.tenantId); return ApiResponse.success(res, null, 'Removido'); } catch (e) { next(e); }
  }
}
