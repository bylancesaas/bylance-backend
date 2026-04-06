import { HousekeepingService } from './housekeeping.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class HousekeepingController {
  static async list(req, res, next) {
    try {
      const data = await HousekeepingService.list(req.tenantId);
      return ApiResponse.success(res, data);
    } catch (e) { next(e); }
  }

  static async getById(req, res, next) {
    try {
      const data = await HousekeepingService.getById(req.params.id, req.tenantId);
      return ApiResponse.success(res, data);
    } catch (e) {
      if (e.message === 'NOT_FOUND') return ApiResponse.notFound(res);
      next(e);
    }
  }

  static async create(req, res, next) {
    try {
      const data = await HousekeepingService.create({ ...req.body, tenantId: req.tenantId });
      return ApiResponse.created(res, data);
    } catch (e) { next(e); }
  }

  static async update(req, res, next) {
    try {
      const data = await HousekeepingService.update(req.params.id, req.tenantId, req.body);
      return ApiResponse.success(res, data);
    } catch (e) { next(e); }
  }

  static async updateStatus(req, res, next) {
    try {
      const data = await HousekeepingService.updateStatus(req.params.id, req.tenantId, req.body.status);
      return ApiResponse.success(res, data);
    } catch (e) {
      if (e.message === 'INVALID_STATUS') return ApiResponse.error(res, 'Status inválido', 422);
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      await HousekeepingService.delete(req.params.id, req.tenantId);
      return ApiResponse.success(res, null, 'Tarefa removida');
    } catch (e) { next(e); }
  }
}
