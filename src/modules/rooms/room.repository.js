import prisma from '../../config/prisma.js';

export class RoomRepository {
  static async findAllByTenant(tenantId) {
    return prisma.room.findMany({
      where: { tenantId },
      include: {
        roomType: true,
        _count: { select: { reservations: true } },
      },
      orderBy: [{ floor: 'asc' }, { number: 'asc' }],
    });
  }

  static async findById(id, tenantId) {
    return prisma.room.findFirst({
      where: { id, tenantId },
      include: {
        roomType: true,
        reservations: {
          where: { status: { in: ['confirmed', 'checked_in'] } },
          include: { guest: true },
          orderBy: { checkIn: 'asc' },
          take: 5,
        },
        housekeeping: {
          where: { status: { in: ['pending', 'in_progress'] } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  static async create(data) {
    return prisma.room.create({ data, include: { roomType: true } });
  }

  static async update(id, tenantId, data) {
    await prisma.room.updateMany({ where: { id, tenantId }, data });
    return prisma.room.findFirst({ where: { id, tenantId }, include: { roomType: true } });
  }

  static async updateStatus(id, tenantId, status) {
    await prisma.room.updateMany({ where: { id, tenantId }, data: { status } });
    return prisma.room.findFirst({ where: { id, tenantId }, include: { roomType: true } });
  }

  static async delete(id, tenantId) {
    return prisma.room.deleteMany({ where: { id, tenantId } });
  }
}
