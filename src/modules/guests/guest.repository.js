import prisma from '../../config/prisma.js';

export class GuestRepository {
  static async findAllByTenant(tenantId) {
    return prisma.guest.findMany({
      where: { tenantId },
      include: { _count: { select: { reservations: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findById(id, tenantId) {
    return prisma.guest.findFirst({
      where: { id, tenantId },
      include: {
        reservations: {
          include: { room: { include: { roomType: true } } },
          orderBy: { checkIn: 'desc' },
          take: 20,
        },
      },
    });
  }

  static async create(data) {
    return prisma.guest.create({ data });
  }

  static async update(id, tenantId, data) {
    await prisma.guest.updateMany({ where: { id, tenantId }, data });
    return prisma.guest.findFirst({ where: { id, tenantId } });
  }

  static async delete(id, tenantId) {
    return prisma.guest.deleteMany({ where: { id, tenantId } });
  }
}
