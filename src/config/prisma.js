import { PrismaClient } from '@prisma/client';

// TEMP: hardcoded for testing - remove after confirming connection works
process.env.DATABASE_URL = 'postgresql://postgres.mlktbfbtiihodwuppahd:14272810bylance@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1';

console.log('[DB DEBUG] DATABASE_URL:', process.env.DATABASE_URL);


const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export default prisma;
