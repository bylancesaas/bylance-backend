import prisma from '../../config/prisma.js';

export class HousekeepingRepository {
  static async findAllByTenant(tenantId) {
    return prisma.housekeepingTask.findMany({
      where: { tenantId },
      include: {
        room: { select: { id: true, number: true, floor: true, roomType: { select: { name: true } } } },
      },
      orderBy: [{ status: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async findById(id, tenantId) {
    return prisma.housekeepingTask.findFirst({
      where: { id, tenantId },
      include: { room: { include: { roomType: true } } },
    });
  }

  static async create(data) {
    return prisma.housekeepingTask.create({
      data,
      include: { room: { include: { roomType: true } } },
    });
  }

  static async update(id, tenantId, data) {
    await prisma.housekeepingTask.updateMany({ where: { id, tenantId }, data });
    return prisma.housekeepingTask.findFirst({
      where: { id, tenantId },
      include: { room: { include: { roomType: true } } },
    });
  }

  static async updateStatus(id, tenantId, status) {
    const data = { status };
    if (status === 'completed' || status === 'inspected') data.completedAt = new Date();
    await prisma.housekeepingTask.updateMany({ where: { id, tenantId }, data });
    return prisma.housekeepingTask.findFirst({
      where: { id, tenantId },
      include: { room: { include: { roomType: true } } },
    });
  }

  static async delete(id, tenantId) {
    return prisma.housekeepingTask.deleteMany({ where: { id, tenantId } });
  }
}
