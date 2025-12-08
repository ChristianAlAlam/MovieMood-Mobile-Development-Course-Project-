import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Parse the connection string
const connectionString = process.env.DATABASE_URL;

// Create connection pool with explicit config
const pool = new pg.Pool({
  connectionString: connectionString,
  // For Supabase pooler with pgbouncer
  ssl: false, // pgbouncer doesn't use SSL
  max: 1, // Limit connections
});

// Create adapter
const adapter = new PrismaPg(pool);

// Create Prisma Client
const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"], // Reduce logging for cleaner output
});

// Test connection
prisma
  .$connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((error) => console.error("❌ Database connection failed:", error));

export default prisma;
