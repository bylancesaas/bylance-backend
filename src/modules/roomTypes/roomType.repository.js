import prisma from '../../config/prisma.js';

export class RoomTypeRepository {
  static async findAllByTenant(tenantId) {
    return prisma.roomType.findMany({
      where: { tenantId },
      include: { _count: { select: { rooms: true } } },
      orderBy: { name: 'asc' },
    });
  }

  static async findById(id, tenantId) {
    return prisma.roomType.findFirst({
      where: { id, tenantId },
      include: { rooms: true },
    });
  }

  static async create(data) {
    return prisma.roomType.create({ data });
  }

  static async update(id, tenantId, data) {
    await prisma.roomType.updateMany({ where: { id, tenantId }, data });
    return prisma.roomType.findFirst({ where: { id, tenantId } });
  }

  static async delete(id, tenantId) {
    return prisma.roomType.deleteMany({ where: { id, tenantId } });
  }
}
