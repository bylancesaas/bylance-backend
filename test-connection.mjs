import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load dotenv manually
const fs = await import('fs');
const path = await import('path');

// Test multiple connection strings
const variants = [
  `postgresql://postgres.mlktbfbtiihodwuppahd:1411578%40bylance%212026@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres:1411578%40bylance%212026@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.mlktbfbtiihodwuppahd:1411578%40bylance%212026@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`,
];

for (const url of variants) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient({ datasources: { db: { url } } });
    const result = await prisma.$queryRaw`SELECT current_user`;
    console.log(`✅ SUCCESS with: ${url.replace(/:.*@/, ':***@')}`);
    console.log('   User:', result[0]);
    await prisma.$disconnect();
    break;
  } catch (e) {
    console.log(`❌ FAIL [${url.replace(/:.*@/, ':***@')}]: ${e.message?.split('\n').slice(0,3).join(' | ')}`);
  }
}

