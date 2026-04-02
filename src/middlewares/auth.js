import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { ApiResponse } from '../utils/apiResponse.js';
import prisma from '../config/prisma.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'Token não fornecido');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId, active: true },
      select: { id: true, name: true, email: true, role: true, tenantId: true, active: true },
    });

    if (!user) {
      return ApiResponse.unauthorized(res, 'Usuário não encontrado ou inativo');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Token expirado');
    }
    return ApiResponse.unauthorized(res, 'Token inválido');
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'Sem permissão para acessar este recurso');
    }
    next();
  };
};

export const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'super_admin') {
    return ApiResponse.forbidden(res, 'Acesso restrito a super administradores');
  }
  next();
};
