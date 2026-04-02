import prisma from '../../config/prisma.js';

export class ItemRepository {
  static async findAllByTenant(tenantId) {
    return prisma.item.findMany({ where: { tenantId }, orderBy: { name: 'asc' } });
  }
  static async findById(id, tenantId) {
    return prisma.item.findFirst({ where: { id, tenantId } });
  }
  static async create(data) { return prisma.item.create({ data }); }
  static async update(id, tenantId, data) {
    await prisma.item.updateMany({ where: { id, tenantId }, data });
    return prisma.item.findFirst({ where: { id, tenantId } });
  }
  static async delete(id, tenantId) { return prisma.item.deleteMany({ where: { id, tenantId } }); }
}
