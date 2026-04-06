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
      await TenantService.addAuditLog(tenant.id, {
        action: 'tenant_created',
        category: 'cadastro',
        description: 'Empresa criada na plataforma',
        performedBy: req.user.name,
        meta: { createdBy: req.user.id },
      });
      return ApiResponse.created(res, tenant, 'Empresa criada com sucesso');
    } catch (error) {
      if (error.message === 'SLUG_IN_USE') return ApiResponse.error(res, 'Slug já em uso', 409);
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const tenant = await TenantService.update(req.params.id, req.body, req.user.name);
      return ApiResponse.success(res, tenant, 'Empresa atualizada com sucesso');
    } catch (error) {
      if (error.message === 'SLUG_IN_USE') return ApiResponse.error(res, 'Slug já em uso', 409);
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      // Front-end must send { confirmName: "<exact company name>" } in the body
      const { confirmName } = req.body || {};
      const tenant = await TenantService.getById(req.params.id).catch(() => null);
      if (!tenant) return ApiResponse.notFound(res, 'Empresa não encontrada');
      if (!confirmName || confirmName.trim() !== tenant.name.trim()) {
        return ApiResponse.error(res, 'Confirmação inválida: o nome digitado não corresponde à empresa', 422);
      }
      await TenantService.delete(req.params.id, req.user.name);
      return ApiResponse.success(res, null, 'Empresa excluída permanentemente');
    } catch (error) {
      next(error);
    }
  }

  static async updateModules(req, res, next) {
    try {
      const modules = await TenantService.updateModules(req.params.id, req.body.modules, req.user.name);
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

  static async updateContract(req, res, next) {
    try {
      const { contractStatus, contractSentTo, contractSignedBy, contractNotes } = req.body;
      const contractData = { contractStatus };

      if (contractStatus === 'gerado')   contractData.contractGeneratedAt = new Date();
      if (contractStatus === 'enviado')  { contractData.contractSentAt = new Date(); if (contractSentTo) contractData.contractSentTo = contractSentTo; }
      if (contractStatus === 'assinado') { contractData.contractSignedAt = new Date(); if (contractSignedBy) contractData.contractSignedBy = contractSignedBy; }
      if (contractNotes !== undefined)   contractData.contractNotes = contractNotes;

      const tenant = await TenantService.updateContract(req.params.id, contractData, req.user.name);
      return ApiResponse.success(res, tenant, 'Contrato atualizado');
    } catch (error) {
      if (error.message === 'CONTRACT_STATUS_REQUIRED') return ApiResponse.error(res, 'Status do contrato é obrigatório', 422);
      next(error);
    }
  }

  static async uploadContract(req, res, next) {
    try {
      if (!req.file) return ApiResponse.error(res, 'Nenhum arquivo enviado', 422);

      const ext = path.extname(req.file.originalname).toLowerCase();
      const filename = `contracts/${req.params.id}/${crypto.randomBytes(8).toString('hex')}${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

      if (uploadError) throw new Error(uploadError.message);

      const { data } = supabase.storage.from('contracts').getPublicUrl(filename);
      const fileUrl = data.publicUrl;

      const tenant = await TenantService.updateContract(
        req.params.id,
        { contractStatus: 'assinado', contractSignedAt: new Date(), contractFileUrl: fileUrl },
        req.user.name,
      );

      await TenantService.addAuditLog(req.params.id, {
        action: 'contract_uploaded',
        category: 'contrato',
        description: 'Arquivo do contrato assinado enviado',
        performedBy: req.user.name,
      });

      return ApiResponse.success(res, { contractFileUrl: fileUrl, tenant }, 'Contrato enviado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  static async addAuditLog(req, res, next) {
    try {
      const { action, category, description, meta } = req.body;
      if (!action || !description) return ApiResponse.error(res, 'action e description são obrigatórios', 422);
      const log = await TenantService.addAuditLog(req.params.id, {
        action, category, description, performedBy: req.user.name, meta,
      });
      return ApiResponse.success(res, log, 'Log registrado');
    } catch (error) {
      next(error);
    }
  }
}
