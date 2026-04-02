import prisma from '../../config/prisma.js';

export class ClientRepository {
  static async findAllByTenant(tenantId) {
    return prisma.client.findMany({
      where: { tenantId },
      include: { vehicles: true, _count: { select: { serviceOrders: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findById(id, tenantId) {
    return prisma.client.findFirst({
      where: { id, tenantId },
      include: { vehicles: true },
    });
  }

  static async create(data) {
    return prisma.client.create({ data, include: { vehicles: true } });
  }

  static async update(id, tenantId, data) {
    return prisma.client.updateMany({ where: { id, tenantId }, data }).then(() =>
      prisma.client.findFirst({ where: { id, tenantId }, include: { vehicles: true } })
    );
  }

  static async delete(id, tenantId) {
    return prisma.client.deleteMany({ where: { id, tenantId } });
  }
}
