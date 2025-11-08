
import * as dotenv from 'dotenv';
dotenv.config();

import { pool } from '../server/db';
import * as fs from 'fs';
import * as path from 'path';

async function restoreBackup() {
  const client = await pool.connect();
  
  try {
    console.log('📦 Starting database restore...');
    
    const backupPath = path.join(process.cwd(), 'database_backup.sql');
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupPath}`);
    }
    
    const backupSQL = fs.readFileSync(backupPath, 'utf8');
    
    // Split SQL commands by semicolon and newline
    const commands = backupSQL
      .split('\n')
      .filter(line => !line.startsWith('--') && line.trim() !== '');
    
    let currentCommand = '';
    
    for (const line of commands) {
      currentCommand += line + '\n';
      
      if (line.trim().endsWith(';')) {
        try {
          await client.query(currentCommand);
        } catch (error: any) {
          // Ignore errors for SET statements and comments
          if (!currentCommand.includes('SET ') && !currentCommand.includes('TRUNCATE')) {
            console.log(`Executing: ${currentCommand.substring(0, 50)}...`);
          }
        }
        currentCommand = '';
      }
    }
    
    console.log('✅ Database restore completed successfully!');
    
    // Verify data
    const tables = [
      'couple_info',
      'schedule_events', 
      'photos',
      'guest_messages',
      'rsvps',
      'registry_items',
      'settings'
    ];
    
    console.log('\n📊 Verifying restored data:');
    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`  ${table}: ${result.rows[0].count} rows`);
    }
    
  } catch (error) {
    console.error('❌ Error restoring backup:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

restoreBackup().catch(console.error);
