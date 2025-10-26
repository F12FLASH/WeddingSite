import * as dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Optimized for Vercel Serverless Functions
// Use minimal connections to avoid "too many connections" errors
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Serverless optimization: Only 1 connection per instance
  max: 1,
  // Disable idle timeout - Vercel handles function lifecycle
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(pool, { schema });

// Optional: Test connection function (call manually in development)
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to Neon database successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('📅 Database time:', result.rows[0].now);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    return false;
  }
}

// Only test connection in development mode, not in serverless
if (process.env.NODE_ENV === 'development' && process.env.TEST_DB_CONNECTION !== 'false') {
  testConnection();
}