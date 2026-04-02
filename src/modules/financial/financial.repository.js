import prisma from '../../config/prisma.js';

export class FinancialRepository {
  static async findAllByTenant(tenantId) {
    return prisma.financial.findMany({
      where: { tenantId },
      include: {
        serviceOrder: {
          select: {
            id: true,
            description: true,
            client: { select: { name: true } },
            vehicle: { select: { plate: true, brand: true, model: true } },
            services: { include: { service: { select: { name: true } } } },
            items: { include: { item: { select: { name: true } } } },
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  static async findById(id, tenantId) {
    return prisma.financial.findFirst({ where: { id, tenantId }, include: { serviceOrder: true } });
  }

  static async getSummary(tenantId) {
    const [revenue, expenses] = await Promise.all([
      prisma.financial.aggregate({ where: { tenantId, type: 'revenue' }, _sum: { value: true } }),
      prisma.financial.aggregate({ where: { tenantId, type: 'expense' }, _sum: { value: true } }),
    ]);
    return {
      totalRevenue: revenue._sum.value || 0,
      totalExpenses: expenses._sum.value || 0,
      profit: (revenue._sum.value || 0) - (expenses._sum.value || 0),
    };
  }

  static async create(data) { return prisma.financial.create({ data }); }

  static async update(id, tenantId, data) {
    await prisma.financial.updateMany({ where: { id, tenantId }, data });
    return prisma.financial.findFirst({ where: { id, tenantId } });
  }

  static async delete(id, tenantId) { return prisma.financial.deleteMany({ where: { id, tenantId } }); }
}
