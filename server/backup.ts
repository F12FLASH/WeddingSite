import { db } from "./db";
import { users, coupleInfo, scheduleEvents, photos, guestMessages, rsvps, registryItems, settings, weddingParty, faqs, popups } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

/**
 * Database Backup Script
 * Creates a complete backup of all database tables in JSON format
 * Run with: npx tsx server/backup.ts
 */

async function backupDatabase() {
  try {
    console.log("🚀 Starting database backup...");
    
    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        users: await db.select().from(users),
        coupleInfo: await db.select().from(coupleInfo),
        scheduleEvents: await db.select().from(scheduleEvents),
        photos: await db.select().from(photos),
        guestMessages: await db.select().from(guestMessages),
        rsvps: await db.select().from(rsvps),
        registryItems: await db.select().from(registryItems),
        settings: await db.select().from(settings),
        weddingParty: await db.select().from(weddingParty),
        faqs: await db.select().from(faqs),
        popups: await db.select().from(popups),
      },
    };

    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const filename = `wedding-db-backup-${new Date().toISOString().replace(/:/g, '-').split('.')[0]}.json`;
    const filepath = path.join(backupDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));

    console.log("✅ Database backup completed successfully!");
    console.log(`📁 Backup file: ${filepath}`);
    console.log(`📊 Total records:`);
    console.log(`   - Users: ${backup.data.users.length}`);
    console.log(`   - Couple Info: ${backup.data.coupleInfo.length}`);
    console.log(`   - Schedule Events: ${backup.data.scheduleEvents.length}`);
    console.log(`   - Photos: ${backup.data.photos.length}`);
    console.log(`   - Guest Messages: ${backup.data.guestMessages.length}`);
    console.log(`   - RSVPs: ${backup.data.rsvps.length}`);
    console.log(`   - Registry Items: ${backup.data.registryItems.length}`);
    console.log(`   - Settings: ${backup.data.settings.length}`);
    console.log(`   - Wedding Party: ${backup.data.weddingParty.length}`);
    console.log(`   - FAQs: ${backup.data.faqs.length}`);
    console.log(`   - Popups: ${backup.data.popups.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating backup:", error);
    process.exit(1);
  }
}

backupDatabase();
