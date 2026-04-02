import { PrismaClient } from '@prisma/client';

// TEMP: hardcoded for testing - using direct connection (not pooler)
process.env.DATABASE_URL = 'postgresql://postgres:14272810bylance@db.mlktbfbtiihodwuppahd.supabase.co:5432/postgres';

console.log('[DB DEBUG] DATABASE_URL:', process.env.DATABASE_URL);


const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export default prisma;
