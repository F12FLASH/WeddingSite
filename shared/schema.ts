import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - For admin authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  password: varchar("password").notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Couple information
export const coupleInfo = pgTable("couple_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brideName: varchar("bride_name").notNull(),
  groomName: varchar("groom_name").notNull(),
  bridePhoto: text("bride_photo"),
  groomPhoto: text("groom_photo"),
  ourStory: text("our_story"),
  weddingDate: timestamp("wedding_date").notNull(),
  heroImage: text("hero_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCoupleInfoSchema = createInsertSchema(coupleInfo).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  weddingDate: z.coerce.date(),
});

export type InsertCoupleInfo = z.infer<typeof insertCoupleInfoSchema>;
export type CoupleInfo = typeof coupleInfo.$inferSelect;

// Wedding schedule events
export const scheduleEvents = pgTable("schedule_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  eventTime: timestamp("event_time").notNull(),
  location: varchar("location"),
  icon: varchar("icon"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertScheduleEventSchema = createInsertSchema(scheduleEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  eventTime: z.coerce.date(),
});

export type InsertScheduleEvent = z.infer<typeof insertScheduleEventSchema>;
export type ScheduleEvent = typeof scheduleEvents.$inferSelect;

// Photo gallery
export const photos = pgTable("photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  caption: text("caption"),
  category: varchar("category").notNull().default("gallery"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

// Guest messages
export const guestMessages = pgTable("guest_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guestName: varchar("guest_name").notNull(),
  message: text("message").notNull(),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGuestMessageSchema = createInsertSchema(guestMessages).omit({
  id: true,
  createdAt: true,
  approved: true,
});

export type InsertGuestMessage = z.infer<typeof insertGuestMessageSchema>;
export type GuestMessage = typeof guestMessages.$inferSelect;

// RSVPs
export const rsvps = pgTable("rsvps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guestName: varchar("guest_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  attending: boolean("attending").notNull(),
  guestCount: integer("guest_count").notNull().default(1),
  mealPreference: varchar("meal_preference"),
  specialRequirements: text("special_requirements"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRsvpSchema = createInsertSchema(rsvps).omit({
  id: true,
  createdAt: true,
});

export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
export type Rsvp = typeof rsvps.$inferSelect;

// Gift registry items
export const registryItems = pgTable("registry_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  price: integer("price"),
  imageUrl: text("image_url"),
  purchaseUrl: text("purchase_url"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRegistryItemSchema = createInsertSchema(registryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRegistryItem = z.infer<typeof insertRegistryItemSchema>;
export type RegistryItem = typeof registryItems.$inferSelect;

// Wedding settings
export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  venueName: varchar("venue_name"),
  venueAddress: text("venue_address"),
  venueMapLink: text("venue_map_link"), // Google Maps link instead of lat/lng
  backgroundMusicUrl: text("background_music_url"), // YouTube, MP3 link, or uploaded file
  backgroundMusicType: varchar("background_music_type"), // 'youtube', 'mp3', 'upload'
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
