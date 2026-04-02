import prisma from '../../config/prisma.js';

export class ServiceOrderRepository {
  static async findAllByTenant(tenantId) {
    return prisma.serviceOrder.findMany({
      where: { tenantId },
      include: {
        client: { select: { id: true, name: true, email: true, phone: true, document: true, address: true } },
        vehicle: { select: { id: true, plate: true, brand: true, model: true, year: true, color: true } },
        items: { include: { item: { select: { id: true, name: true } } } },
        services: { include: { service: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findById(id, tenantId) {
    return prisma.serviceOrder.findFirst({
      where: { id, tenantId },
      include: {
        client: true,
        vehicle: true,
        items: { include: { item: true } },
        services: { include: { service: true } },
        warranties: true,
        financials: true,
      },
    });
  }

  static async create(data) {
    const { items, services, ...orderData } = data;

    return prisma.serviceOrder.create({
      data: {
        ...orderData,
        items: items?.length ? { create: items } : undefined,
        services: services?.length ? { create: services } : undefined,
      },
      include: {
        client: true, vehicle: true,
        items: { include: { item: true } },
        services: { include: { service: true } },
      },
    });
  }

  static async update(id, tenantId, data) {
    const { items, services, ...orderData } = data;

    // Update the order
    await prisma.serviceOrder.updateMany({ where: { id, tenantId }, data: orderData });

    // Replace items if provided
    if (items) {
      await prisma.serviceOrderItem.deleteMany({ where: { serviceOrderId: id } });
      if (items.length) {
        await prisma.serviceOrderItem.createMany({
          data: items.map(i => ({ ...i, serviceOrderId: id })),
        });
      }
    }

    // Replace services if provided
    if (services) {
      await prisma.serviceOrderService.deleteMany({ where: { serviceOrderId: id } });
      if (services.length) {
        await prisma.serviceOrderService.createMany({
          data: services.map(s => ({ ...s, serviceOrderId: id })),
        });
      }
    }

    return this.findById(id, tenantId);
  }

  static async delete(id, tenantId) {
    return prisma.serviceOrder.deleteMany({ where: { id, tenantId } });
  }

  static async sendToFinancial(order, tenantId) {
    return prisma.financial.create({
      data: {
        tenantId,
        type: 'revenue',
        category: 'Ordem de Serviço',
        description: `OS #${order.id.slice(0, 8)} - ${order.client?.name || 'Cliente'}`,
        value: order.total,
        date: new Date(),
        serviceOrderId: order.id,
      },
    });
  }
}
