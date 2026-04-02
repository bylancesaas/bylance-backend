import prisma from '../../config/prisma.js';

export class UserRepository {
  static async findAllByTenant(tenantId) {
    return prisma.user.findMany({
      where: { tenantId },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, active: true, tenantId: true, createdAt: true },
    });
  }

  static async update(id, data) {
    return prisma.user.update({ where: { id }, data });
  }

  static async delete(id) {
    return prisma.user.delete({ where: { id } });
  }
}
