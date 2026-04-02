import prisma from '../../config/prisma.js';

export class VehicleRepository {
  static async findAllByTenant(tenantId) {
    return prisma.vehicle.findMany({
      where: { tenantId },
      include: { client: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findByClient(clientId, tenantId) {
    return prisma.vehicle.findMany({ where: { clientId, tenantId } });
  }

  static async findById(id, tenantId) {
    return prisma.vehicle.findFirst({ where: { id, tenantId }, include: { client: true } });
  }

  static async create(data) { return prisma.vehicle.create({ data }); }

  static async update(id, tenantId, data) {
    await prisma.vehicle.updateMany({ where: { id, tenantId }, data });
    return prisma.vehicle.findFirst({ where: { id, tenantId } });
  }

  static async delete(id, tenantId) { return prisma.vehicle.deleteMany({ where: { id, tenantId } }); }
}
