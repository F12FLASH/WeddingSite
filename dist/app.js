var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/app.ts
import express2 from "express";
import path3 from "path";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  coupleInfo: () => coupleInfo,
  faqs: () => faqs,
  guestMessages: () => guestMessages,
  insertCoupleInfoSchema: () => insertCoupleInfoSchema,
  insertFaqSchema: () => insertFaqSchema,
  insertGuestMessageSchema: () => insertGuestMessageSchema,
  insertMusicTrackSchema: () => insertMusicTrackSchema,
  insertPhotoSchema: () => insertPhotoSchema,
  insertPopupSchema: () => insertPopupSchema,
  insertRegistryItemSchema: () => insertRegistryItemSchema,
  insertRsvpSchema: () => insertRsvpSchema,
  insertScheduleEventSchema: () => insertScheduleEventSchema,
  insertSettingsSchema: () => insertSettingsSchema,
  insertWeddingPartySchema: () => insertWeddingPartySchema,
  musicTracks: () => musicTracks,
  photos: () => photos,
  popups: () => popups,
  registryItems: () => registryItems,
  rsvps: () => rsvps,
  scheduleEvents: () => scheduleEvents,
  sessions: () => sessions,
  settings: () => settings,
  users: () => users,
  weddingParty: () => weddingParty
});
import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  password: varchar("password").notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var coupleInfo = pgTable("couple_info", {
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
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertCoupleInfoSchema = createInsertSchema(coupleInfo).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  weddingDate: z.coerce.date()
});
var scheduleEvents = pgTable("schedule_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  eventTime: timestamp("event_time").notNull(),
  location: varchar("location"),
  icon: varchar("icon"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertScheduleEventSchema = createInsertSchema(scheduleEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  eventTime: z.coerce.date()
});
var photos = pgTable("photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  caption: text("caption"),
  category: varchar("category").notNull().default("gallery"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var guestMessages = pgTable("guest_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guestName: varchar("guest_name").notNull(),
  message: text("message").notNull(),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var insertGuestMessageSchema = createInsertSchema(guestMessages).omit({
  id: true,
  createdAt: true,
  approved: true
});
var rsvps = pgTable("rsvps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guestName: varchar("guest_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  attending: boolean("attending").notNull(),
  guestCount: integer("guest_count").notNull().default(1),
  mealPreference: varchar("meal_preference"),
  specialRequirements: text("special_requirements"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertRsvpSchema = createInsertSchema(rsvps).omit({
  id: true,
  createdAt: true
});
var registryItems = pgTable("registry_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  price: integer("price"),
  imageUrl: text("image_url"),
  purchaseUrl: text("purchase_url"),
  isPurchased: boolean("is_purchased").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertRegistryItemSchema = createInsertSchema(registryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  venueName: varchar("venue_name"),
  venueAddress: text("venue_address"),
  venueMapLink: text("venue_map_link"),
  // Google Maps link instead of lat/lng
  venuePhone: varchar("venue_phone"),
  venueEmail: varchar("venue_email"),
  venueImage: text("venue_image"),
  // Venue image/photo
  eventStartTime: timestamp("event_start_time"),
  eventEndTime: timestamp("event_end_time"),
  backgroundMusicUrl: text("background_music_url"),
  // Deprecated - kept for backward compatibility
  backgroundMusicType: varchar("background_music_type"),
  // 'youtube', 'mp3', 'upload'
  backgroundMusicUrls: text("background_music_urls").array(),
  // Array of music URLs for playlist
  backgroundMusicNames: text("background_music_names").array(),
  // Array of custom song names (parallel to URLs)
  // Bank transfer information
  brideQrCodeUrl: text("bride_qr_code_url"),
  // QR code for bride's bank transfer
  groomQrCodeUrl: text("groom_qr_code_url"),
  // QR code for groom's bank transfer
  brideBankInfo: text("bride_bank_info"),
  // Bride's bank account information
  groomBankInfo: text("groom_bank_info"),
  // Groom's bank account information
  // Footer information
  footerText: text("footer_text"),
  // Custom footer message
  facebookUrl: text("facebook_url"),
  // Facebook link
  instagramUrl: text("instagram_url"),
  // Instagram link
  twitterUrl: text("twitter_url"),
  // Twitter link
  hashtag: varchar("hashtag"),
  // Wedding hashtag
  // Font customization
  fontHeading: varchar("font_heading"),
  // Font for headings (Parisienne, Alex Brush, Great Vibes, etc.)
  fontBody: varchar("font_body"),
  // Font for body text (Cormorant Garamond, Playfair Display, etc.)
  fontCursive: varchar("font_cursive"),
  // Font for cursive elements (Parisienne, Allura, Satisfy, etc.)
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true
}).extend({
  eventStartTime: z.coerce.date().optional(),
  eventEndTime: z.coerce.date().optional()
});
var weddingParty = pgTable("wedding_party", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  role: varchar("role").notNull(),
  description: text("description"),
  photoUrl: text("photo_url"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertWeddingPartySchema = createInsertSchema(weddingParty).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var faqs = pgTable("faqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var popups = pgTable("popups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull().unique(),
  // 'welcome' or 'scroll_end' - unique constraint
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  title: varchar("title"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertPopupSchema = createInsertSchema(popups).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var musicTracks = pgTable("music_tracks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  // Song title
  filename: varchar("filename").notNull(),
  // File name in wedding_music folder
  artist: varchar("artist"),
  // Artist name
  duration: integer("duration"),
  // Duration in seconds
  displayOrder: integer("display_order").notNull().default(0),
  // Order in playlist
  isActive: boolean("is_active").notNull().default(true),
  // Whether to include in playlist
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertMusicTrackSchema = createInsertSchema(musicTracks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
import * as dotenv from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  // Serverless optimization: Only 1 connection per instance
  max: 1,
  // Disable idle timeout - Vercel handles function lifecycle
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 1e4
});
var db = drizzle(pool, { schema: schema_exports });
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("\u2705 Connected to Neon database successfully!");
    const result = await client.query("SELECT NOW()");
    console.log("\u{1F4C5} Database time:", result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error("\u274C Failed to connect to database:", error);
    return false;
  }
}
if (process.env.NODE_ENV === "development" && process.env.TEST_DB_CONNECTION !== "false") {
  testConnection();
}

// server/storage.ts
import { eq, desc } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.username,
      set: {
        password: userData.password,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Couple Info
  async getCoupleInfo() {
    const [info] = await db.select().from(coupleInfo).limit(1);
    return info;
  }
  async upsertCoupleInfo(info) {
    const existing = await this.getCoupleInfo();
    if (existing) {
      const [updated] = await db.update(coupleInfo).set({ ...info, updatedAt: /* @__PURE__ */ new Date() }).where(eq(coupleInfo.id, existing.id)).returning();
      return updated;
    }
    const [created] = await db.insert(coupleInfo).values(info).returning();
    return created;
  }
  // Schedule Events
  async getAllScheduleEvents() {
    return await db.select().from(scheduleEvents).orderBy(scheduleEvents.order);
  }
  async getScheduleEvent(id) {
    const [event] = await db.select().from(scheduleEvents).where(eq(scheduleEvents.id, id));
    return event;
  }
  async createScheduleEvent(event) {
    const [created] = await db.insert(scheduleEvents).values(event).returning();
    return created;
  }
  async updateScheduleEvent(id, event) {
    const [updated] = await db.update(scheduleEvents).set({ ...event, updatedAt: /* @__PURE__ */ new Date() }).where(eq(scheduleEvents.id, id)).returning();
    return updated;
  }
  async deleteScheduleEvent(id) {
    await db.delete(scheduleEvents).where(eq(scheduleEvents.id, id));
  }
  // Photos
  async getAllPhotos() {
    return await db.select().from(photos).orderBy(photos.order);
  }
  async getPhoto(id) {
    const [photo] = await db.select().from(photos).where(eq(photos.id, id));
    return photo;
  }
  async createPhoto(photo) {
    const [created] = await db.insert(photos).values(photo).returning();
    return created;
  }
  async updatePhoto(id, photo) {
    const [updated] = await db.update(photos).set({ ...photo, updatedAt: /* @__PURE__ */ new Date() }).where(eq(photos.id, id)).returning();
    return updated;
  }
  async deletePhoto(id) {
    await db.delete(photos).where(eq(photos.id, id));
  }
  // Guest Messages
  async getAllGuestMessages(approvedOnly = false) {
    if (approvedOnly) {
      return await db.select().from(guestMessages).where(eq(guestMessages.approved, true)).orderBy(desc(guestMessages.createdAt));
    }
    return await db.select().from(guestMessages).orderBy(desc(guestMessages.createdAt));
  }
  async getGuestMessage(id) {
    const [message] = await db.select().from(guestMessages).where(eq(guestMessages.id, id));
    return message;
  }
  async createGuestMessage(message) {
    const [created] = await db.insert(guestMessages).values(message).returning();
    return created;
  }
  async approveGuestMessage(id, approved) {
    const [updated] = await db.update(guestMessages).set({ approved }).where(eq(guestMessages.id, id)).returning();
    return updated;
  }
  async deleteGuestMessage(id) {
    await db.delete(guestMessages).where(eq(guestMessages.id, id));
  }
  // RSVPs
  async getAllRsvps() {
    return await db.select().from(rsvps).orderBy(desc(rsvps.createdAt));
  }
  async getRsvp(id) {
    const [rsvp] = await db.select().from(rsvps).where(eq(rsvps.id, id));
    return rsvp;
  }
  async createRsvp(rsvp) {
    const [created] = await db.insert(rsvps).values(rsvp).returning();
    return created;
  }
  async deleteRsvp(id) {
    await db.delete(rsvps).where(eq(rsvps.id, id));
  }
  // Registry Items
  async getAllRegistryItems() {
    return await db.select().from(registryItems).orderBy(registryItems.order);
  }
  async getRegistryItem(id) {
    const [item] = await db.select().from(registryItems).where(eq(registryItems.id, id));
    return item;
  }
  async createRegistryItem(item) {
    const [created] = await db.insert(registryItems).values(item).returning();
    return created;
  }
  async updateRegistryItem(id, item) {
    const [updated] = await db.update(registryItems).set({ ...item, updatedAt: /* @__PURE__ */ new Date() }).where(eq(registryItems.id, id)).returning();
    return updated;
  }
  async deleteRegistryItem(id) {
    await db.delete(registryItems).where(eq(registryItems.id, id));
  }
  // Settings
  async getSettings() {
    const [settingsRow] = await db.select().from(settings).limit(1);
    return settingsRow;
  }
  async upsertSettings(settingsData) {
    const existing = await this.getSettings();
    if (existing) {
      const [updated] = await db.update(settings).set({ ...settingsData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(settings.id, existing.id)).returning();
      return updated;
    }
    const [created] = await db.insert(settings).values(settingsData).returning();
    return created;
  }
  // Wedding Party
  async getAllWeddingParty() {
    return await db.select().from(weddingParty).orderBy(weddingParty.order);
  }
  async getWeddingPartyMember(id) {
    const [member] = await db.select().from(weddingParty).where(eq(weddingParty.id, id));
    return member;
  }
  async createWeddingPartyMember(member) {
    const [created] = await db.insert(weddingParty).values(member).returning();
    return created;
  }
  async updateWeddingPartyMember(id, memberData) {
    const [updated] = await db.update(weddingParty).set({ ...memberData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(weddingParty.id, id)).returning();
    return updated;
  }
  async deleteWeddingPartyMember(id) {
    await db.delete(weddingParty).where(eq(weddingParty.id, id));
  }
  // Popups
  async getAllPopups() {
    return await db.select().from(popups);
  }
  async getPopup(id) {
    const [popup] = await db.select().from(popups).where(eq(popups.id, id));
    return popup;
  }
  async getPopupByType(type) {
    const [popup] = await db.select().from(popups).where(eq(popups.type, type));
    return popup;
  }
  async createPopup(popupData) {
    const [created] = await db.insert(popups).values(popupData).returning();
    return created;
  }
  async updatePopup(id, popupData) {
    const [updated] = await db.update(popups).set({ ...popupData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(popups.id, id)).returning();
    return updated;
  }
  async deletePopup(id) {
    await db.delete(popups).where(eq(popups.id, id));
  }
  // FAQs
  async getAllFaqs() {
    return await db.select().from(faqs).orderBy(faqs.order);
  }
  async getFaq(id) {
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    return faq;
  }
  async createFaq(faqData) {
    const [created] = await db.insert(faqs).values(faqData).returning();
    return created;
  }
  async updateFaq(id, faqData) {
    const [updated] = await db.update(faqs).set({ ...faqData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(faqs.id, id)).returning();
    return updated;
  }
  async deleteFaq(id) {
    await db.delete(faqs).where(eq(faqs.id, id));
  }
  // Music Tracks
  async getAllMusicTracks(activeOnly = false) {
    if (activeOnly) {
      return await db.select().from(musicTracks).where(eq(musicTracks.isActive, true)).orderBy(musicTracks.displayOrder);
    }
    return await db.select().from(musicTracks).orderBy(musicTracks.displayOrder);
  }
  async getMusicTrack(id) {
    const [track] = await db.select().from(musicTracks).where(eq(musicTracks.id, id));
    return track;
  }
  async createMusicTrack(trackData) {
    const [created] = await db.insert(musicTracks).values(trackData).returning();
    return created;
  }
  async updateMusicTrack(id, trackData) {
    const [updated] = await db.update(musicTracks).set({ ...trackData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(musicTracks.id, id)).returning();
    return updated;
  }
  async deleteMusicTrack(id) {
    await db.delete(musicTracks).where(eq(musicTracks.id, id));
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import connectPg from "connect-pg-simple";
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}
function getSession() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for session storage - sessions will NOT work without it!");
  }
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  if (!sessionStore) {
    throw new Error("Failed to create PostgreSQL session store - sessions will NOT work!");
  }
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: sessionTtl
    }
  });
}
async function setupAuth(app) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, { id: user.id, username: user.username });
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user ? { id: user.id, username: user.username } : null);
    } catch (error) {
      done(error);
    }
  });
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (err2) => {
        if (err2) {
          return res.status(500).json({ message: "Login failed" });
        }
        return res.json({ message: "Login successful", user });
      });
    })(req, res, next);
  });
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.redirect("/?error=logout_failed");
      }
      res.redirect("/");
    });
  });
  app.get("/api/auth/user", isAuthenticated, async (req, res) => {
    res.json(req.user);
  });
}
var isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// server/routes.ts
import { z as z2 } from "zod";
async function registerRoutes(app) {
  await setupAuth(app);
  app.get("/api/couple", async (req, res) => {
    try {
      const info = await storage.getCoupleInfo();
      res.json(info || null);
    } catch (error) {
      console.error("Error fetching couple info:", error);
      res.status(500).json({ message: "Failed to fetch couple info" });
    }
  });
  app.post("/api/couple", isAuthenticated, async (req, res) => {
    try {
      const validated = insertCoupleInfoSchema.parse(req.body);
      const info = await storage.upsertCoupleInfo(validated);
      res.json(info);
    } catch (error) {
      console.error("Error updating couple info:", error);
      res.status(400).json({ message: error.message || "Failed to update couple info" });
    }
  });
  app.get("/api/schedule", async (req, res) => {
    try {
      const events = await storage.getAllScheduleEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching schedule events:", error);
      res.status(500).json({ message: "Failed to fetch schedule events" });
    }
  });
  app.post("/api/schedule", isAuthenticated, async (req, res) => {
    try {
      const validated = insertScheduleEventSchema.parse(req.body);
      const event = await storage.createScheduleEvent(validated);
      res.json(event);
    } catch (error) {
      console.error("Error creating schedule event:", error);
      res.status(400).json({ message: error.message || "Failed to create schedule event" });
    }
  });
  app.patch("/api/schedule/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertScheduleEventSchema.partial().parse(req.body);
      const event = await storage.updateScheduleEvent(id, validated);
      if (!event) {
        return res.status(404).json({ message: "Schedule event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error updating schedule event:", error);
      res.status(400).json({ message: error.message || "Failed to update schedule event" });
    }
  });
  app.delete("/api/schedule/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteScheduleEvent(id);
      res.json({ message: "Schedule event deleted" });
    } catch (error) {
      console.error("Error deleting schedule event:", error);
      res.status(500).json({ message: "Failed to delete schedule event" });
    }
  });
  app.get("/api/photos", async (req, res) => {
    try {
      const photos2 = await storage.getAllPhotos();
      res.json(photos2);
    } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });
  app.post("/api/photos", isAuthenticated, async (req, res) => {
    try {
      const validated = insertPhotoSchema.parse(req.body);
      const photo = await storage.createPhoto(validated);
      res.json(photo);
    } catch (error) {
      console.error("Error creating photo:", error);
      res.status(400).json({ message: error.message || "Failed to create photo" });
    }
  });
  app.patch("/api/photos/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertPhotoSchema.partial().parse(req.body);
      const photo = await storage.updatePhoto(id, validated);
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }
      res.json(photo);
    } catch (error) {
      console.error("Error updating photo:", error);
      res.status(400).json({ message: error.message || "Failed to update photo" });
    }
  });
  app.delete("/api/photos/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePhoto(id);
      res.json({ message: "Photo deleted" });
    } catch (error) {
      console.error("Error deleting photo:", error);
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });
  app.get("/api/messages", async (req, res) => {
    try {
      const approvedOnly = req.query.approved === "true";
      const messages = await storage.getAllGuestMessages(approvedOnly);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching guest messages:", error);
      res.status(500).json({ message: "Failed to fetch guest messages" });
    }
  });
  app.post("/api/messages", async (req, res) => {
    try {
      const validated = insertGuestMessageSchema.parse(req.body);
      const message = await storage.createGuestMessage(validated);
      res.json(message);
    } catch (error) {
      console.error("Error creating guest message:", error);
      res.status(400).json({ message: error.message || "Failed to create guest message" });
    }
  });
  app.patch("/api/messages/:id/approve", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const approvalSchema = z2.object({ approved: z2.boolean() });
      const { approved } = approvalSchema.parse(req.body);
      const message = await storage.approveGuestMessage(id, approved);
      if (!message) {
        return res.status(404).json({ message: "Guest message not found" });
      }
      res.json(message);
    } catch (error) {
      console.error("Error approving guest message:", error);
      res.status(400).json({ message: error.message || "Failed to approve guest message" });
    }
  });
  app.delete("/api/messages/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGuestMessage(id);
      res.json({ message: "Guest message deleted" });
    } catch (error) {
      console.error("Error deleting guest message:", error);
      res.status(500).json({ message: "Failed to delete guest message" });
    }
  });
  app.get("/api/rsvps", isAuthenticated, async (req, res) => {
    try {
      const rsvps2 = await storage.getAllRsvps();
      res.json(rsvps2);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      res.status(500).json({ message: "Failed to fetch RSVPs" });
    }
  });
  app.post("/api/rsvps", async (req, res) => {
    try {
      const validated = insertRsvpSchema.parse(req.body);
      const rsvp = await storage.createRsvp(validated);
      res.json(rsvp);
    } catch (error) {
      console.error("Error creating RSVP:", error);
      res.status(400).json({ message: error.message || "Failed to create RSVP" });
    }
  });
  app.delete("/api/rsvps/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteRsvp(id);
      res.json({ message: "RSVP deleted" });
    } catch (error) {
      console.error("Error deleting RSVP:", error);
      res.status(500).json({ message: "Failed to delete RSVP" });
    }
  });
  app.get("/api/registry", async (req, res) => {
    try {
      const items = await storage.getAllRegistryItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching registry items:", error);
      res.status(500).json({ message: "Failed to fetch registry items" });
    }
  });
  app.post("/api/registry", isAuthenticated, async (req, res) => {
    try {
      const validated = insertRegistryItemSchema.parse(req.body);
      const item = await storage.createRegistryItem(validated);
      res.json(item);
    } catch (error) {
      console.error("Error creating registry item:", error);
      res.status(400).json({ message: error.message || "Failed to create registry item" });
    }
  });
  app.patch("/api/registry/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertRegistryItemSchema.partial().parse(req.body);
      const item = await storage.updateRegistryItem(id, validated);
      if (!item) {
        return res.status(404).json({ message: "Registry item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error updating registry item:", error);
      res.status(400).json({ message: error.message || "Failed to update registry item" });
    }
  });
  app.delete("/api/registry/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteRegistryItem(id);
      res.json({ message: "Registry item deleted" });
    } catch (error) {
      console.error("Error deleting registry item:", error);
      res.status(500).json({ message: "Failed to delete registry item" });
    }
  });
  app.get("/api/settings", async (req, res) => {
    try {
      const settings2 = await storage.getSettings();
      res.json(settings2 || null);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  app.post("/api/settings", isAuthenticated, async (req, res) => {
    try {
      const validated = insertSettingsSchema.parse(req.body);
      const settings2 = await storage.upsertSettings(validated);
      res.json(settings2);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(400).json({ message: error.message || "Failed to update settings" });
    }
  });
  app.get("/api/wedding-party", async (req, res) => {
    try {
      const members = await storage.getAllWeddingParty();
      res.json(members);
    } catch (error) {
      console.error("Error fetching wedding party:", error);
      res.status(500).json({ message: "Failed to fetch wedding party" });
    }
  });
  app.post("/api/wedding-party", isAuthenticated, async (req, res) => {
    try {
      const validated = insertWeddingPartySchema.parse(req.body);
      const member = await storage.createWeddingPartyMember(validated);
      res.json(member);
    } catch (error) {
      console.error("Error creating wedding party member:", error);
      res.status(400).json({ message: error.message || "Failed to create wedding party member" });
    }
  });
  app.patch("/api/wedding-party/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertWeddingPartySchema.partial().parse(req.body);
      const member = await storage.updateWeddingPartyMember(id, validated);
      if (!member) {
        return res.status(404).json({ message: "Wedding party member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error updating wedding party member:", error);
      res.status(400).json({ message: error.message || "Failed to update wedding party member" });
    }
  });
  app.delete("/api/wedding-party/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteWeddingPartyMember(id);
      res.json({ message: "Wedding party member deleted" });
    } catch (error) {
      console.error("Error deleting wedding party member:", error);
      res.status(500).json({ message: "Failed to delete wedding party member" });
    }
  });
  app.get("/api/popups", async (req, res) => {
    try {
      const popupsList = await storage.getAllPopups();
      res.json(popupsList);
    } catch (error) {
      console.error("Error fetching popups:", error);
      res.status(500).json({ message: "Failed to fetch popups" });
    }
  });
  app.get("/api/popups/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const popup = await storage.getPopupByType(type);
      res.json(popup || null);
    } catch (error) {
      console.error("Error fetching popup by type:", error);
      res.status(500).json({ message: "Failed to fetch popup" });
    }
  });
  app.post("/api/popups", isAuthenticated, async (req, res) => {
    try {
      const validated = insertPopupSchema.parse(req.body);
      const popup = await storage.createPopup(validated);
      res.json(popup);
    } catch (error) {
      console.error("Error creating popup:", error);
      res.status(400).json({ message: error.message || "Failed to create popup" });
    }
  });
  app.patch("/api/popups/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertPopupSchema.partial().parse(req.body);
      const popup = await storage.updatePopup(id, validated);
      if (!popup) {
        return res.status(404).json({ message: "Popup not found" });
      }
      res.json(popup);
    } catch (error) {
      console.error("Error updating popup:", error);
      res.status(400).json({ message: error.message || "Failed to update popup" });
    }
  });
  app.delete("/api/popups/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePopup(id);
      res.json({ message: "Popup deleted" });
    } catch (error) {
      console.error("Error deleting popup:", error);
      res.status(500).json({ message: "Failed to delete popup" });
    }
  });
  app.get("/api/faqs", async (req, res) => {
    try {
      const faqs2 = await storage.getAllFaqs();
      res.json(faqs2);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });
  app.get("/api/faqs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const faq = await storage.getFaq(id);
      if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      res.json(faq);
    } catch (error) {
      console.error("Error fetching FAQ:", error);
      res.status(500).json({ message: "Failed to fetch FAQ" });
    }
  });
  app.post("/api/faqs", isAuthenticated, async (req, res) => {
    try {
      const validated = insertFaqSchema.parse(req.body);
      const faq = await storage.createFaq(validated);
      res.json(faq);
    } catch (error) {
      console.error("Error creating FAQ:", error);
      res.status(400).json({ message: error.message || "Failed to create FAQ" });
    }
  });
  app.patch("/api/faqs/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertFaqSchema.partial().parse(req.body);
      const faq = await storage.updateFaq(id, validated);
      if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      res.json(faq);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      res.status(400).json({ message: error.message || "Failed to update FAQ" });
    }
  });
  app.delete("/api/faqs/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteFaq(id);
      res.json({ message: "FAQ deleted" });
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      res.status(500).json({ message: "Failed to delete FAQ" });
    }
  });
  app.get("/api/music-tracks", async (req, res) => {
    try {
      const activeOnly = req.query.activeOnly === "true";
      const tracks = await storage.getAllMusicTracks(activeOnly);
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching music tracks:", error);
      res.status(500).json({ message: "Failed to fetch music tracks" });
    }
  });
  app.get("/api/music-tracks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const track = await storage.getMusicTrack(id);
      if (!track) {
        return res.status(404).json({ message: "Music track not found" });
      }
      res.json(track);
    } catch (error) {
      console.error("Error fetching music track:", error);
      res.status(500).json({ message: "Failed to fetch music track" });
    }
  });
  app.post("/api/music-tracks", isAuthenticated, async (req, res) => {
    try {
      const validated = insertMusicTrackSchema.parse(req.body);
      const track = await storage.createMusicTrack(validated);
      res.json(track);
    } catch (error) {
      console.error("Error creating music track:", error);
      res.status(400).json({ message: error.message || "Failed to create music track" });
    }
  });
  app.patch("/api/music-tracks/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertMusicTrackSchema.partial().parse(req.body);
      const track = await storage.updateMusicTrack(id, validated);
      if (!track) {
        return res.status(404).json({ message: "Music track not found" });
      }
      res.json(track);
    } catch (error) {
      console.error("Error updating music track:", error);
      res.status(400).json({ message: error.message || "Failed to update music track" });
    }
  });
  app.delete("/api/music-tracks/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMusicTrack(id);
      res.json({ message: "Music track deleted" });
    } catch (error) {
      console.error("Error deleting music track:", error);
      res.status(500).json({ message: "Failed to delete music track" });
    }
  });
  const httpServer = createServer(app);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: "0.0.0.0",
    port: 5e3,
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
function serveStatic(app) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/app.ts
async function createApp() {
  const app = express2();
  app.use((req, res, next) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5000"];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
  app.use(express2.json({
    limit: "50mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  }));
  app.use(express2.urlencoded({ extended: false, limit: "50mb" }));
  app.use("/wedding_music", express2.static(path3.join(process.cwd(), "attached_assets", "wedding_music")));
  app.use("/attached_assets", express2.static(path3.join(process.cwd(), "attached_assets")));
  app.use((req, res, next) => {
    const start = Date.now();
    const path4 = req.path;
    let capturedJsonResponse = void 0;
    const originalResJson = res.json;
    res.json = function(bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };
    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path4.startsWith("/api")) {
        let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "\u2026";
        }
        log(logLine);
      }
    });
    next();
  });
  await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error("Error:", err);
  });
  if (app.get("env") !== "development") {
    serveStatic(app);
  }
  return app;
}
export {
  createApp
};
