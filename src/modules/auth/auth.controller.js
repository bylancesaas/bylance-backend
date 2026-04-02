import { AuthService } from './auth.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return ApiResponse.error(res, 'Email e senha são obrigatórios', 422);
      }
      const result = await AuthService.login(email, password);
      return ApiResponse.success(res, result, 'Login realizado com sucesso');
    } catch (error) {
      if (error.message === 'INVALID_CREDENTIALS') {
        return ApiResponse.unauthorized(res, 'Email ou senha inválidos');
      }
      if (error.message === 'USER_INACTIVE') {
        return ApiResponse.forbidden(res, 'Usuário inativo');
      }
      if (error.message === 'TENANT_INACTIVE') {
        return ApiResponse.forbidden(res, 'Empresa inativa');
      }
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body);
      return ApiResponse.created(res, user, 'Usuário registrado com sucesso');
    } catch (error) {
      if (error.message === 'EMAIL_IN_USE') {
        return ApiResponse.error(res, 'Email já está em uso', 409);
      }
      next(error);
    }
  }

  static async me(req, res, next) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      return ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  }
}
