import { ApiResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, _req, res, _next) => {
  console.error('❌ Error:', err.message);

  if (err.code === 'P2002') {
    return ApiResponse.error(res, 'Registro duplicado. Este dado já existe.', 409);
  }

  if (err.code === 'P2025') {
    return ApiResponse.notFound(res, 'Registro não encontrado');
  }

  if (err.name === 'ZodError') {
    const errors = err.errors.map(e => ({ field: e.path.join('.'), message: e.message }));
    return ApiResponse.error(res, 'Dados inválidos', 422, errors);
  }

  return ApiResponse.error(res, err.message || 'Erro interno do servidor', err.statusCode || 500);
};
