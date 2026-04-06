import { RoomTypeService } from './roomType.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class RoomTypeController {
  static async list(req, res, next) {
    try {
      const data = await RoomTypeService.list(req.tenantId);
      return ApiResponse.success(res, data);
    } catch (e) { next(e); }
  }

  static async getById(req, res, next) {
    try {
      const data = await RoomTypeService.getById(req.params.id, req.tenantId);
      return ApiResponse.success(res, data);
    } catch (e) {
      if (e.message === 'NOT_FOUND') return ApiResponse.notFound(res);
      next(e);
    }
  }

  static async create(req, res, next) {
    try {
      const data = await RoomTypeService.create({ ...req.body, tenantId: req.tenantId });
      return ApiResponse.created(res, data);
    } catch (e) { next(e); }
  }

  static async update(req, res, next) {
    try {
      const data = await RoomTypeService.update(req.params.id, req.tenantId, req.body);
      return ApiResponse.success(res, data);
    } catch (e) { next(e); }
  }

  static async delete(req, res, next) {
    try {
      await RoomTypeService.delete(req.params.id, req.tenantId);
      return ApiResponse.success(res, null, 'Tipo de quarto removido');
    } catch (e) { next(e); }
  }
}
