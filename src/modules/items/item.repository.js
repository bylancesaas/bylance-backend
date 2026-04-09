import prisma from '../../config/prisma.js';

export class ItemRepository {
  static async findAllByTenant(tenantId) {
    return prisma.item.findMany({ where: { tenantId }, orderBy: { name: 'asc' } });
  }
  static async findById(id, tenantId) {
    return prisma.item.findFirst({ where: { id, tenantId } });
  }
  static async findMovementsByItem(itemId, tenantId) {
    return prisma.stockMovement.findMany({
      where: { itemId, tenantId },
      orderBy: { movementDate: 'desc' },
    });
  }

  static async createMovement(itemId, tenantId, data) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.item.findFirst({ where: { id: itemId, tenantId } });
      if (!item) throw new Error('NOT_FOUND');

      const previousQuantity = item.stockQuantity || 0;
      const resultingQuantity = data.type === 'in'
        ? previousQuantity + data.quantity
        : previousQuantity - data.quantity;

      if (data.type === 'out' && resultingQuantity < 0) {
        throw new Error('INSUFFICIENT_STOCK');
      }

      const movement = await tx.stockMovement.create({
        data: {
          tenantId,
          itemId,
          type: data.type,
          entryType: data.entryType,
          quantity: data.quantity,
          unitCost: data.unitCost,
          supplier: data.supplier,
          document: data.document,
          notes: data.notes,
          movementDate: data.movementDate,
          previousQuantity,
          resultingQuantity,
        },
      });

      const itemUpdateData = { stockQuantity: resultingQuantity };
      if (data.type === 'in' && data.unitCost !== null) {
        itemUpdateData.costPrice = data.unitCost;
      }

      const updatedItem = await tx.item.update({
        where: { id: item.id },
        data: itemUpdateData,
      });

      return { item: updatedItem, movement };
    });
  }

  static async create(data) { return prisma.item.create({ data }); }
  static async update(id, tenantId, data) {
    await prisma.item.updateMany({ where: { id, tenantId }, data });
    return prisma.item.findFirst({ where: { id, tenantId } });
  }
  static async delete(id, tenantId) { return prisma.item.deleteMany({ where: { id, tenantId } }); }
}
