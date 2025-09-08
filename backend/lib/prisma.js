/**
 * @fileoverview Prisma client instance for database operations
 * This module exports a single Prisma client instance that can be used
 * throughout the application for database queries.
 */

import { PrismaClient } from '@prisma/client';

/**
 * Global Prisma client instance
 * @type {PrismaClient}
 */
let prisma;

/**
 * Get or create a Prisma client instance
 * In development, we store the client on the global object to prevent
 * creating multiple instances during hot reloads.
 * 
 * @returns {PrismaClient} The Prisma client instance
 */
function getPrismaClient() {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient();
  }

  // In development, store client on global to prevent multiple instances
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  
  return global.__prisma;
}

prisma = getPrismaClient();

/**
 * Graceful shutdown function for Prisma client
 * Call this when your application is shutting down
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

export default prisma;
