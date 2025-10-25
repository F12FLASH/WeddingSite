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
  brideDescription: text("bride_description"),
  groomDescription: text("groom_description"),
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
  isPurchased: boolean("is_purchased").notNull().default(false),
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
  venuePhone: varchar("venue_phone"),
  venueEmail: varchar("venue_email"),
  venueImage: text("venue_image"), // Venue image/photo
  eventStartTime: timestamp("event_start_time"),
  eventEndTime: timestamp("event_end_time"),
  backgroundMusicUrl: text("background_music_url"), // Deprecated - kept for backward compatibility
  backgroundMusicType: varchar("background_music_type"), // 'youtube', 'mp3', 'upload'
  backgroundMusicUrls: text("background_music_urls").array(), // Array of music URLs for playlist
  backgroundMusicNames: text("background_music_names").array(), // Array of custom song names (parallel to URLs)
  // Bank transfer information
  brideQrCodeUrl: text("bride_qr_code_url"), // QR code for bride's bank transfer
  groomQrCodeUrl: text("groom_qr_code_url"), // QR code for groom's bank transfer
  brideBankInfo: text("bride_bank_info"), // Bride's bank account information
  groomBankInfo: text("groom_bank_info"), // Groom's bank account information
  // Footer information
  footerText: text("footer_text"), // Custom footer message
  facebookUrl: text("facebook_url"), // Facebook link
  instagramUrl: text("instagram_url"), // Instagram link
  twitterUrl: text("twitter_url"), // Twitter link
  hashtag: varchar("hashtag"), // Wedding hashtag
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
}).extend({
  eventStartTime: z.coerce.date().optional(),
  eventEndTime: z.coerce.date().optional(),
});

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

// Wedding party members
export const weddingParty = pgTable("wedding_party", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  role: varchar("role").notNull(),
  description: text("description"),
  photoUrl: text("photo_url"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWeddingPartySchema = createInsertSchema(weddingParty).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWeddingParty = z.infer<typeof insertWeddingPartySchema>;
export type WeddingParty = typeof weddingParty.$inferSelect;

// FAQs
export const faqs = pgTable("faqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;

// Popups
export const popups = pgTable("popups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull().unique(), // 'welcome' or 'scroll_end' - unique constraint
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  title: varchar("title"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPopupSchema = createInsertSchema(popups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPopup = z.infer<typeof insertPopupSchema>;
export type Popup = typeof popups.$inferSelect;
