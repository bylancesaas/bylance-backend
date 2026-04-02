import prisma from '../../config/prisma.js';

export class TenantRepository {
  static async findAll() {
    return prisma.tenant.findMany({
      include: { modules: true, _count: { select: { users: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findById(id) {
    return prisma.tenant.findUnique({
      where: { id },
      include: { modules: true, _count: { select: { users: true, clients: true, serviceOrders: true } } },
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
          create: [
            'dashboard', 'clients', 'items', 'services',
            'serviceOrders', 'warranties', 'financial', 'userManagement',
          ].map(mod => ({ module: mod, active: true })),
        },
      },
      include: { modules: true },
    });
  }

  static async update(id, data) {
    return prisma.tenant.update({ where: { id }, data });
  }

  static async delete(id) {
    return prisma.tenant.delete({ where: { id } });
  }

  static async updateModules(tenantId, modules) {
    // modules = [{ module: 'dashboard', active: true }, ...]
    const ops = modules.map(m =>
      prisma.tenantModule.upsert({
        where: { tenantId_module: { tenantId, module: m.module } },
        update: { active: m.active },
        create: { tenantId, module: m.module, active: m.active },
      })
    );
    return prisma.$transaction(ops);
  }
}
