import path from 'path';
import crypto from 'crypto';
import { TenantService } from './tenant.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { supabase } from '../../config/supabase.js';

export class TenantController {
  static async list(req, res, next) {
    try {
      const tenants = await TenantService.list();
      return ApiResponse.success(res, tenants);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const tenant = await TenantService.getById(req.params.id);
      return ApiResponse.success(res, tenant);
    } catch (error) {
      if (error.message === 'TENANT_NOT_FOUND') return ApiResponse.notFound(res, 'Empresa não encontrada');
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const tenant = await TenantService.create(req.body);
      return ApiResponse.created(res, tenant, 'Empresa criada com sucesso');
    } catch (error) {
      if (error.message === 'SLUG_IN_USE') return ApiResponse.error(res, 'Slug já em uso', 409);
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const tenant = await TenantService.update(req.params.id, req.body);
      return ApiResponse.success(res, tenant, 'Empresa atualizada com sucesso');
    } catch (error) {
      if (error.message === 'SLUG_IN_USE') return ApiResponse.error(res, 'Slug já em uso', 409);
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await TenantService.delete(req.params.id);
      return ApiResponse.success(res, null, 'Empresa removida com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async updateModules(req, res, next) {
    try {
      const modules = await TenantService.updateModules(req.params.id, req.body.modules);
      return ApiResponse.success(res, modules, 'Módulos atualizados com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async uploadLogo(req, res, next) {
    try {
      if (!req.file) return ApiResponse.error(res, 'Nenhum arquivo enviado', 422);

      const ext = path.extname(req.file.originalname).toLowerCase();
      const filename = `${crypto.randomBytes(8).toString('hex')}${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

      if (uploadError) throw new Error(uploadError.message);

      const { data } = supabase.storage.from('logos').getPublicUrl(filename);
      const logoUrl = data.publicUrl;

      const tenant = await TenantService.update(req.params.id, { logo: logoUrl });
      return ApiResponse.success(res, { logo: logoUrl, tenant }, 'Logo atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}
