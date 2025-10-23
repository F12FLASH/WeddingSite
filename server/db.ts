import * as dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Sử dụng pg Pool thay vì Neon serverless
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Thêm các config để ổn định kết nối
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(pool, { schema });

// Test connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to Neon database successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('📅 Database time:', result.rows[0].now);
    
    client.release();
  } catch (error) {
    console.error('❌ Failed to connect to Neon:', error);
  }
}

testConnection();