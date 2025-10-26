import * as dotenv from 'dotenv';
dotenv.config();

import { pool } from '../server/db';
import * as fs from 'fs';
import * as path from 'path';

async function createBackup() {
  const client = await pool.connect();
  
  try {
    console.log('📦 Creating database backup...');
    
    let backup = `-- Wedding Website Database Backup
-- Generated: ${new Date().toISOString()}
-- Database: PostgreSQL (Neon)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

`;

    const tables = [
      'couple_info',
      'schedule_events',
      'photos',
      'guest_messages',
      'rsvps',
      'registry_items',
      'settings',
      'wedding_party',
      'faqs'
    ];

    for (const table of tables) {
      console.log(`  Exporting ${table}...`);
      
      const result = await client.query(`SELECT * FROM ${table}`);
      
      if (result.rows.length > 0) {
        backup += `\n-- Data for table ${table}\n`;
        backup += `TRUNCATE TABLE ${table} CASCADE;\n`;
        
        const columns = Object.keys(result.rows[0]);
        
        // Quote column names to handle reserved keywords like 'order'
        const quotedColumns = columns.map(col => `"${col}"`);
        
        for (const row of result.rows) {
          const values = columns.map(col => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'string') {
              // Properly escape single quotes and backslashes
              return `'${val.replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
            }
            if (val instanceof Date) {
              return `'${val.toISOString()}'`;
            }
            if (typeof val === 'boolean') {
              return val ? 'true' : 'false';
            }
            if (typeof val === 'number') {
              return val.toString();
            }
            if (Array.isArray(val)) {
              // Properly escape array values
              const escapedValues = val.map(v => {
                if (typeof v === 'string') {
                  return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
                }
                return `'${v}'`;
              });
              return `ARRAY[${escapedValues.join(',')}]`;
            }
            // Handle objects as JSON
            return `'${JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
          });
          
          backup += `INSERT INTO "${table}" (${quotedColumns.join(', ')}) VALUES (${values.join(', ')});\n`;
        }
      }
    }

    backup += `\n-- Backup completed: ${new Date().toISOString()}\n`;

    const backupPath = path.join(process.cwd(), 'database_backup.sql');
    fs.writeFileSync(backupPath, backup, 'utf8');
    
    console.log(`✅ Backup created successfully: ${backupPath}`);
    console.log(`📊 Backup size: ${(fs.statSync(backupPath).size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Error creating backup:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createBackup().catch(console.error);
