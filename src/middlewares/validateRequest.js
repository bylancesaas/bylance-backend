import { ApiResponse } from '../utils/apiResponse.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const errors = error.errors.map(e => ({ field: e.path.join('.'), message: e.message }));
        return ApiResponse.error(res, 'Dados inválidos', 422, errors);
      }
      next(error);
    }
  };
};
