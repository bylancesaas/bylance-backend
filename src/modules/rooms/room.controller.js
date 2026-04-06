import { RoomService } from './room.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class RoomController {
  static async list(req, res, next) {
    try {
      const data = await RoomService.list(req.tenantId);
      return ApiResponse.success(res, data);
    } catch (e) { next(e); }
  }

  static async getById(req, res, next) {
    try {
      const data = await RoomService.getById(req.params.id, req.tenantId);
      return ApiResponse.success(res, data);
    } catch (e) {
      if (e.message === 'NOT_FOUND') return ApiResponse.notFound(res);
      next(e);
    }
  }

  static async create(req, res, next) {
    try {
      const data = await RoomService.create({ ...req.body, tenantId: req.tenantId });
      return ApiResponse.created(res, data);
    } catch (e) { next(e); }
  }

  static async update(req, res, next) {
    try {
      const data = await RoomService.update(req.params.id, req.tenantId, req.body);
      return ApiResponse.success(res, data);
    } catch (e) { next(e); }
  }

  static async updateStatus(req, res, next) {
    try {
      const data = await RoomService.updateStatus(req.params.id, req.tenantId, req.body.status);
      return ApiResponse.success(res, data);
    } catch (e) {
      if (e.message === 'INVALID_STATUS') return ApiResponse.error(res, 'Status inválido', 422);
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      await RoomService.delete(req.params.id, req.tenantId);
      return ApiResponse.success(res, null, 'Quarto removido');
    } catch (e) { next(e); }
  }
}
