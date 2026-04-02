import { PrismaClient } from '@prisma/client';

// If separate DB vars are set, build the DATABASE_URL programmatically
// so special characters in the password (@, !) don't break URL parsing
if (process.env.DB_PASSWORD) {
  const user = encodeURIComponent(process.env.DB_USER || 'postgres');
  // encodeURIComponent leaves ! unencoded; Supabase pgbouncer requires %21
  const pass = encodeURIComponent(process.env.DB_PASSWORD).replace(/!/g, '%21');
  const host = process.env.DB_HOST;
  const name = process.env.DB_NAME || 'postgres';
  process.env.DATABASE_URL =
    `postgresql://${user}:${pass}@${host}:6543/${name}?pgbouncer=true&connection_limit=1`;
  process.env.DIRECT_URL =
    `postgresql://${user}:${pass}@${host}:5432/${name}`;
  console.log('[DB DEBUG] DB_USER:', process.env.DB_USER);
  console.log('[DB DEBUG] DB_PASSWORD raw:', process.env.DB_PASSWORD);
  console.log('[DB DEBUG] DB_PASSWORD encoded:', pass);
  console.log('[DB DEBUG] DB_HOST:', host);
  console.log('[DB DEBUG] DATABASE_URL built:', process.env.DATABASE_URL);
} else {
  console.log('[DB DEBUG] Using DATABASE_URL from env:', process.env.DATABASE_URL);
}

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export default prisma;
