import { VehicleService } from './vehicle.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class VehicleController {
  static async list(req, res, next) {
    try {
      const data = req.query.clientId
        ? await VehicleService.getByClient(req.query.clientId, req.tenantId)
        : await VehicleService.list(req.tenantId);
      return ApiResponse.success(res, data);
    } catch (e) { next(e); }
  }
  static async getById(req, res, next) {
    try {
      const data = await VehicleService.getById(req.params.id, req.tenantId);
      return ApiResponse.success(res, data);
    } catch (e) {
      if (e.message === 'NOT_FOUND') return ApiResponse.notFound(res);
      next(e);
    }
  }
  static async create(req, res, next) {
    try {
      const data = await VehicleService.create({ ...req.body, tenantId: req.tenantId });
      return ApiResponse.created(res, data);
    } catch (e) { next(e); }
  }
  static async update(req, res, next) {
    try {
      const data = await VehicleService.update(req.params.id, req.tenantId, req.body);
      return ApiResponse.success(res, data);
    } catch (e) { next(e); }
  }
  static async delete(req, res, next) {
    try {
      await VehicleService.delete(req.params.id, req.tenantId);
      return ApiResponse.success(res, null, 'Removido');
    } catch (e) { next(e); }
  }
}
