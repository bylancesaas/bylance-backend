import { ReservationService } from './reservation.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class ReservationController {
  static async list(req, res, next) {
    try {
      const data = await ReservationService.list(req.tenantId);
      return ApiResponse.success(res, data);
    } catch (e) { next(e); }
  }

  static async getById(req, res, next) {
    try {
      const data = await ReservationService.getById(req.params.id, req.tenantId);
      return ApiResponse.success(res, data);
    } catch (e) {
      if (e.message === 'NOT_FOUND') return ApiResponse.notFound(res);
      next(e);
    }
  }

  static async create(req, res, next) {
    try {
      const data = await ReservationService.create({ ...req.body, tenantId: req.tenantId });
      return ApiResponse.created(res, data);
    } catch (e) {
      if (e.message === 'ROOM_CONFLICT') return ApiResponse.error(res, 'Quarto já reservado para este período', 409);
      next(e);
    }
  }

  static async update(req, res, next) {
    try {
      const data = await ReservationService.update(req.params.id, req.tenantId, req.body);
      return ApiResponse.success(res, data);
    } catch (e) {
      if (e.message === 'ROOM_CONFLICT') return ApiResponse.error(res, 'Quarto já reservado para este período', 409);
      next(e);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const data = await ReservationService.updateStatus(req.params.id, req.tenantId, req.body.status);
      return ApiResponse.success(res, data);
    } catch (e) {
      if (e.message === 'INVALID_STATUS') return ApiResponse.error(res, 'Status inválido', 422);
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      await ReservationService.delete(req.params.id, req.tenantId);
      return ApiResponse.success(res, null, 'Reserva removida');
    } catch (e) { next(e); }
  }
}
