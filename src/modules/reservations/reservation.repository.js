import prisma from '../../config/prisma.js';

export class ReservationRepository {
  static async findAllByTenant(tenantId) {
    return prisma.reservation.findMany({
      where: { tenantId },
      include: {
        guest: { select: { id: true, name: true, phone: true, vip: true } },
        room:  { select: { id: true, number: true, floor: true, roomType: { select: { name: true } } } },
      },
      orderBy: { checkIn: 'desc' },
    });
  }

  static async findById(id, tenantId) {
    return prisma.reservation.findFirst({
      where: { id, tenantId },
      include: { guest: true, room: { include: { roomType: true } } },
    });
  }

  static async create(data) {
    return prisma.reservation.create({
      data,
      include: { guest: true, room: { include: { roomType: true } } },
    });
  }

  static async update(id, tenantId, data) {
    await prisma.reservation.updateMany({ where: { id, tenantId }, data });
    return prisma.reservation.findFirst({
      where: { id, tenantId },
      include: { guest: true, room: { include: { roomType: true } } },
    });
  }

  static async updateStatus(id, tenantId, status) {
    await prisma.reservation.updateMany({ where: { id, tenantId }, data: { status } });
    return prisma.reservation.findFirst({
      where: { id, tenantId },
      include: { guest: true, room: { include: { roomType: true } } },
    });
  }

  static async delete(id, tenantId) {
    return prisma.reservation.deleteMany({ where: { id, tenantId } });
  }

  static async findConflicts(tenantId, roomId, checkIn, checkOut, excludeId) {
    const where = {
      tenantId,
      roomId,
      status: { notIn: ['cancelled', 'checked_out'] },
      OR: [
        { checkIn: { lt: checkOut }, checkOut: { gt: checkIn } },
      ],
    };
    if (excludeId) where.id = { not: excludeId };
    return prisma.reservation.findMany({ where });
  }
}
