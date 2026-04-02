import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create super admin
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@scale.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@scale.com',
      password: hashedPassword,
      role: 'super_admin',
      active: true,
    },
  });
  console.log(`✅ Super admin created: ${admin.email}`);

  // Create a demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Empresa Demo',
      slug: 'demo',
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      businessType: 'refrigeracao',
      active: true,
      plan: 'premium',
    },
  });
  console.log(`✅ Demo tenant created: ${tenant.name}`);

  // Create default modules for demo tenant
  const modules = [
    'dashboard', 'clients', 'items', 'services',
    'serviceOrders', 'warranties', 'financial', 'userManagement',
  ];

  for (const mod of modules) {
    await prisma.tenantModule.upsert({
      where: { tenantId_module: { tenantId: tenant.id, module: mod } },
      update: {},
      create: { tenantId: tenant.id, module: mod, active: true },
    });
  }
  console.log(`✅ Modules created for demo tenant`);

  // Create a director user for the demo tenant
  const directorPassword = await bcrypt.hash('demo123', 12);
  const director = await prisma.user.upsert({
    where: { email: 'diretor@demo.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Diretor Demo',
      email: 'diretor@demo.com',
      password: directorPassword,
      role: 'director',
      active: true,
    },
  });
  console.log(`✅ Director user created: ${director.email}`);

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
