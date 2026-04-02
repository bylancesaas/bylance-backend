import { UserService } from './user.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class UserController {
  static async list(req, res, next) {
    try {
      const users = await UserService.listByTenant(req.tenantId);
      return ApiResponse.success(res, users);
    } catch (error) { next(error); }
  }

  static async getById(req, res, next) {
    try {
      const user = await UserService.getById(req.params.id);
      return ApiResponse.success(res, user);
    } catch (error) {
      if (error.message === 'USER_NOT_FOUND') return ApiResponse.notFound(res);
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const user = await UserService.create({ ...req.body, tenantId: req.tenantId });
      return ApiResponse.created(res, user);
    } catch (error) {
      if (error.message === 'EMAIL_IN_USE') return ApiResponse.error(res, 'Email já em uso', 409);
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const user = await UserService.update(req.params.id, req.body);
      return ApiResponse.success(res, user, 'Usuário atualizado');
    } catch (error) { next(error); }
  }

  static async delete(req, res, next) {
    try {
      await UserService.delete(req.params.id);
      return ApiResponse.success(res, null, 'Usuário removido');
    } catch (error) { next(error); }
  }
}
