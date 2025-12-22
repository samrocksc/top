import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Debug: Log the DATABASE_URL to verify it's loaded
// eslint-disable-next-line no-console
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Loaded" : "Not found");

// Create PostgreSQL pool for Prisma 7 adapter
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Prisma 7 client initialization with PostgreSQL adapter
const prisma = new PrismaClient({
  adapter,
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
    {
      emit: "event",
      level: "error",
    },
  ],
});

export default prisma;
