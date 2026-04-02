import { PrismaClient } from '@prisma/client';

// TEMP: hardcoded for testing - pooler with correct region (us-west-2)
process.env.DATABASE_URL = 'postgresql://postgres.mlktbfbtiihodwuppahd:14272810bylance@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

console.log('[DB DEBUG] DATABASE_URL:', process.env.DATABASE_URL);


const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export default prisma;
