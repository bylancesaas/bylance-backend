import prisma from '../../config/prisma.js';
export class WarrantyRepository {
  static async findAllByTenant(tenantId) {
    return prisma.warranty.findMany({
      where: { tenantId },
      include: {
        client: { select: { id: true, name: true, email: true, phone: true, document: true, address: true } },
        serviceOrder: { select: { id: true, description: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  static async findById(id, tenantId) {
    return prisma.warranty.findFirst({ where: { id, tenantId }, include: { client: true, serviceOrder: true } });
  }
  static async create(data) { return prisma.warranty.create({ data }); }
  static async update(id, tenantId, data) {
    await prisma.warranty.updateMany({ where: { id, tenantId }, data });
    return prisma.warranty.findFirst({ where: { id, tenantId } });
  }
  static async delete(id, tenantId) { return prisma.warranty.deleteMany({ where: { id, tenantId } }); }
}
