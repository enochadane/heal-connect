// Safe PrismaClient Loader
let PrismaClientClass: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const prismaPkg = require('@prisma/client');
  PrismaClientClass = prismaPkg.PrismaClient;
} catch {
  // Prisma client not yet generated or installed
}

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

export const prisma =
  globalForPrisma.prisma ??
  (PrismaClientClass ? new PrismaClientClass({ log: ['error'] }) : null);

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}
