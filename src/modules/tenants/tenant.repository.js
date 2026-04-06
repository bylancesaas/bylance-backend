import prisma from '../../config/prisma.js';

export class TenantRepository {
  static async findAll() {
    return prisma.tenant.findMany({
      where: { deletedAt: null },
      include: { modules: true, _count: { select: { users: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findById(id) {
    return prisma.tenant.findFirst({
      where: { id, deletedAt: null },
      include: {
        modules: true,
        users: {
          select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
          orderBy: { createdAt: 'asc' },
        },
        auditLogs: {
          orderBy: { performedAt: 'desc' },
          take: 50,
        },
        _count: { select: { users: true, clients: true, serviceOrders: true } },
      },
    });
  }

  static async findBySlug(slug) {
    return prisma.tenant.findUnique({ where: { slug } });
  }

  static async create(data) {
    return prisma.tenant.create({
      data: {
        ...data,
        modules: {
          create: (data.vertical === 'hotel'
            ? ['dashboard', 'guests', 'roomTypes', 'rooms', 'reservations', 'housekeeping', 'financial', 'userManagement']
            : ['dashboard', 'clients', 'items', 'services', 'serviceOrders', 'warranties', 'financial', 'userManagement']
          ).map(mod => ({ module: mod, active: true })),
        },
      },
      include: { modules: true },
    });
  }

  static async update(id, data) {
    return prisma.tenant.update({ where: { id }, data });
  }

  static async softDelete(id, performedBy, tenantName) {
    // Log before soft-deleting so the record is preserved and the audit entry stays
    await TenantRepository.addAuditLog({
      tenantId: id,
      action: 'tenant_deleted',
      category: 'cadastro',
      description: `Empresa "${tenantName}" excluída permanentemente`,
      performedBy,
      meta: { tenantName, deletedAt: new Date().toISOString() },
    });
    return prisma.tenant.update({
      where: { id },
      data: { deletedAt: new Date(), active: false },
    });
  }

  // Keep for emergency use only — destroys all history
  static async hardDelete(id) {
    return prisma.tenant.delete({ where: { id } });
  }

  static async updateModules(tenantId, modules) {
    const ops = modules.map(m =>
      prisma.tenantModule.upsert({
        where: { tenantId_module: { tenantId, module: m.module } },
        update: { active: m.active },
        create: { tenantId, module: m.module, active: m.active },
      })
    );
    return prisma.$transaction(ops);
  }

  static async addAuditLog({ tenantId, action, category = 'geral', description, performedBy, meta }) {
    return prisma.tenantAuditLog.create({
      data: { tenantId, action, category, description, performedBy, meta: meta ? JSON.stringify(meta) : null },
    });
  }

  static async updateContract(id, contractData, performedBy) {
    const tenant = await prisma.tenant.update({
      where: { id },
      data: contractData,
    });
    const descriptions = {
      nao_gerado: 'Contrato redefinido para não gerado',
      gerado:     'Contrato gerado',
      enviado:    'Contrato enviado para assinatura',
      assinado:   'Contrato marcado como assinado',
      cancelado:  'Contrato cancelado',
    };
    await TenantRepository.addAuditLog({
      tenantId: id,
      action: 'contract_status_change',
      category: 'contrato',
      description: descriptions[contractData.contractStatus] || 'Status do contrato atualizado',
      performedBy,
      meta: { status: contractData.contractStatus },
    });
    return tenant;
  }
}
