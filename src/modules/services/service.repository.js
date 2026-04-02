import prisma from '../../config/prisma.js';
export class ServiceRepository {
  static async findAllByTenant(tenantId) {
    return prisma.service.findMany({ where: { tenantId }, orderBy: { name: 'asc' } });
  }
  static async findById(id, tenantId) { return prisma.service.findFirst({ where: { id, tenantId } }); }
  static async create(data) { return prisma.service.create({ data }); }
  static async update(id, tenantId, data) {
    await prisma.service.updateMany({ where: { id, tenantId }, data });
    return prisma.service.findFirst({ where: { id, tenantId } });
  }
  static async delete(id, tenantId) { return prisma.service.deleteMany({ where: { id, tenantId } }); }
}
