import { PrismaClient } from '@prisma/client';

// If separate DB vars are set, build the DATABASE_URL programmatically
// so special characters in the password (@, !) don't break URL parsing
if (process.env.DB_PASSWORD) {
  const user = encodeURIComponent(process.env.DB_USER || 'postgres');
  const pass = encodeURIComponent(process.env.DB_PASSWORD);
  const host = process.env.DB_HOST;
  const name = process.env.DB_NAME || 'postgres';
  process.env.DATABASE_URL =
    `postgresql://${user}:${pass}@${host}:6543/${name}?pgbouncer=true&connection_limit=1`;
  process.env.DIRECT_URL =
    `postgresql://${user}:${pass}@${host}:5432/${name}`;
}

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export default prisma;
