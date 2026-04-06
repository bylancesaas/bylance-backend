import { GuestService } from './guest.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class GuestController {
  static async list(req, res, next) {
    try {
      const data = await GuestService.list(req.tenantId);
      return ApiResponse.success(res, data);
    } catch (e) { next(e); }
  }

  static async getById(req, res, next) {
    try {
      const data = await GuestService.getById(req.params.id, req.tenantId);
      return ApiResponse.success(res, data);
    } catch (e) {
      if (e.message === 'NOT_FOUND') return ApiResponse.notFound(res);
      next(e);
    }
  }

  static async create(req, res, next) {
    try {
      const data = await GuestService.create({ ...req.body, tenantId: req.tenantId });
      return ApiResponse.created(res, data);
    } catch (e) { next(e); }
  }

  static async update(req, res, next) {
    try {
      const data = await GuestService.update(req.params.id, req.tenantId, req.body);
      return ApiResponse.success(res, data);
    } catch (e) { next(e); }
  }

  static async delete(req, res, next) {
    try {
      await GuestService.delete(req.params.id, req.tenantId);
      return ApiResponse.success(res, null, 'Hóspede removido');
    } catch (e) { next(e); }
  }
}
