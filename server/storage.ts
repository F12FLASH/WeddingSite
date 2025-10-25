// Storage implementation with database operations
import {
  users,
  coupleInfo,
  scheduleEvents,
  photos,
  guestMessages,
  rsvps,
  registryItems,
  settings,
  weddingParty,
  popups,
  type User,
  type UpsertUser,
  type CoupleInfo,
  type InsertCoupleInfo,
  type ScheduleEvent,
  type InsertScheduleEvent,
  type Photo,
  type InsertPhoto,
  type GuestMessage,
  type InsertGuestMessage,
  type Rsvp,
  type InsertRsvp,
  type RegistryItem,
  type InsertRegistryItem,
  type Settings,
  type InsertSettings,
  type WeddingParty,
  type InsertWeddingParty,
  type Popup,
  type InsertPopup,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Couple Info
  getCoupleInfo(): Promise<CoupleInfo | undefined>;
  upsertCoupleInfo(info: InsertCoupleInfo): Promise<CoupleInfo>;

  // Schedule Events
  getAllScheduleEvents(): Promise<ScheduleEvent[]>;
  getScheduleEvent(id: string): Promise<ScheduleEvent | undefined>;
  createScheduleEvent(event: InsertScheduleEvent): Promise<ScheduleEvent>;
  updateScheduleEvent(id: string, event: Partial<InsertScheduleEvent>): Promise<ScheduleEvent | undefined>;
  deleteScheduleEvent(id: string): Promise<void>;

  // Photos
  getAllPhotos(): Promise<Photo[]>;
  getPhoto(id: string): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(id: string, photo: Partial<InsertPhoto>): Promise<Photo | undefined>;
  deletePhoto(id: string): Promise<void>;

  // Guest Messages
  getAllGuestMessages(approvedOnly?: boolean): Promise<GuestMessage[]>;
  getGuestMessage(id: string): Promise<GuestMessage | undefined>;
  createGuestMessage(message: InsertGuestMessage): Promise<GuestMessage>;
  approveGuestMessage(id: string, approved: boolean): Promise<GuestMessage | undefined>;
  deleteGuestMessage(id: string): Promise<void>;

  // RSVPs
  getAllRsvps(): Promise<Rsvp[]>;
  getRsvp(id: string): Promise<Rsvp | undefined>;
  createRsvp(rsvp: InsertRsvp): Promise<Rsvp>;
  deleteRsvp(id: string): Promise<void>;

  // Registry Items
  getAllRegistryItems(): Promise<RegistryItem[]>;
  getRegistryItem(id: string): Promise<RegistryItem | undefined>;
  createRegistryItem(item: InsertRegistryItem): Promise<RegistryItem>;
  updateRegistryItem(id: string, item: Partial<InsertRegistryItem>): Promise<RegistryItem | undefined>;
  deleteRegistryItem(id: string): Promise<void>;

  // Settings
  getSettings(): Promise<Settings | undefined>;
  upsertSettings(settings: InsertSettings): Promise<Settings>;

  // Wedding Party
  getAllWeddingParty(): Promise<WeddingParty[]>;
  getWeddingPartyMember(id: string): Promise<WeddingParty | undefined>;
  createWeddingPartyMember(member: InsertWeddingParty): Promise<WeddingParty>;
  updateWeddingPartyMember(id: string, member: Partial<InsertWeddingParty>): Promise<WeddingParty | undefined>;
  deleteWeddingPartyMember(id: string): Promise<void>;

  // Popups
  getAllPopups(): Promise<Popup[]>;
  getPopup(id: string): Promise<Popup | undefined>;
  getPopupByType(type: string): Promise<Popup | undefined>;
  createPopup(popup: InsertPopup): Promise<Popup>;
  updatePopup(id: string, popup: Partial<InsertPopup>): Promise<Popup | undefined>;
  deletePopup(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Couple Info
  async getCoupleInfo(): Promise<CoupleInfo | undefined> {
    const [info] = await db.select().from(coupleInfo).limit(1);
    return info;
  }

  async upsertCoupleInfo(info: InsertCoupleInfo): Promise<CoupleInfo> {
    const existing = await this.getCoupleInfo();
    if (existing) {
      const [updated] = await db
        .update(coupleInfo)
        .set({ ...info, updatedAt: new Date() })
        .where(eq(coupleInfo.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(coupleInfo).values(info).returning();
    return created;
  }

  // Schedule Events
  async getAllScheduleEvents(): Promise<ScheduleEvent[]> {
    return await db.select().from(scheduleEvents).orderBy(scheduleEvents.order);
  }

  async getScheduleEvent(id: string): Promise<ScheduleEvent | undefined> {
    const [event] = await db.select().from(scheduleEvents).where(eq(scheduleEvents.id, id));
    return event;
  }

  async createScheduleEvent(event: InsertScheduleEvent): Promise<ScheduleEvent> {
    const [created] = await db.insert(scheduleEvents).values(event).returning();
    return created;
  }

  async updateScheduleEvent(id: string, event: Partial<InsertScheduleEvent>): Promise<ScheduleEvent | undefined> {
    const [updated] = await db
      .update(scheduleEvents)
      .set({ ...event, updatedAt: new Date() })
      .where(eq(scheduleEvents.id, id))
      .returning();
    return updated;
  }

  async deleteScheduleEvent(id: string): Promise<void> {
    await db.delete(scheduleEvents).where(eq(scheduleEvents.id, id));
  }

  // Photos
  async getAllPhotos(): Promise<Photo[]> {
    return await db.select().from(photos).orderBy(photos.order);
  }

  async getPhoto(id: string): Promise<Photo | undefined> {
    const [photo] = await db.select().from(photos).where(eq(photos.id, id));
    return photo;
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const [created] = await db.insert(photos).values(photo).returning();
    return created;
  }

  async updatePhoto(id: string, photo: Partial<InsertPhoto>): Promise<Photo | undefined> {
    const [updated] = await db
      .update(photos)
      .set({ ...photo, updatedAt: new Date() })
      .where(eq(photos.id, id))
      .returning();
    return updated;
  }

  async deletePhoto(id: string): Promise<void> {
    await db.delete(photos).where(eq(photos.id, id));
  }

  // Guest Messages
  async getAllGuestMessages(approvedOnly: boolean = false): Promise<GuestMessage[]> {
    if (approvedOnly) {
      return await db.select().from(guestMessages).where(eq(guestMessages.approved, true)).orderBy(desc(guestMessages.createdAt));
    }
    return await db.select().from(guestMessages).orderBy(desc(guestMessages.createdAt));
  }

  async getGuestMessage(id: string): Promise<GuestMessage | undefined> {
    const [message] = await db.select().from(guestMessages).where(eq(guestMessages.id, id));
    return message;
  }

  async createGuestMessage(message: InsertGuestMessage): Promise<GuestMessage> {
    const [created] = await db.insert(guestMessages).values(message).returning();
    return created;
  }

  async approveGuestMessage(id: string, approved: boolean): Promise<GuestMessage | undefined> {
    const [updated] = await db
      .update(guestMessages)
      .set({ approved })
      .where(eq(guestMessages.id, id))
      .returning();
    return updated;
  }

  async deleteGuestMessage(id: string): Promise<void> {
    await db.delete(guestMessages).where(eq(guestMessages.id, id));
  }

  // RSVPs
  async getAllRsvps(): Promise<Rsvp[]> {
    return await db.select().from(rsvps).orderBy(desc(rsvps.createdAt));
  }

  async getRsvp(id: string): Promise<Rsvp | undefined> {
    const [rsvp] = await db.select().from(rsvps).where(eq(rsvps.id, id));
    return rsvp;
  }

  async createRsvp(rsvp: InsertRsvp): Promise<Rsvp> {
    const [created] = await db.insert(rsvps).values(rsvp).returning();
    return created;
  }

  async deleteRsvp(id: string): Promise<void> {
    await db.delete(rsvps).where(eq(rsvps.id, id));
  }

  // Registry Items
  async getAllRegistryItems(): Promise<RegistryItem[]> {
    return await db.select().from(registryItems).orderBy(registryItems.order);
  }

  async getRegistryItem(id: string): Promise<RegistryItem | undefined> {
    const [item] = await db.select().from(registryItems).where(eq(registryItems.id, id));
    return item;
  }

  async createRegistryItem(item: InsertRegistryItem): Promise<RegistryItem> {
    const [created] = await db.insert(registryItems).values(item).returning();
    return created;
  }

  async updateRegistryItem(id: string, item: Partial<InsertRegistryItem>): Promise<RegistryItem | undefined> {
    const [updated] = await db
      .update(registryItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(registryItems.id, id))
      .returning();
    return updated;
  }

  async deleteRegistryItem(id: string): Promise<void> {
    await db.delete(registryItems).where(eq(registryItems.id, id));
  }

  // Settings
  async getSettings(): Promise<Settings | undefined> {
    const [settingsRow] = await db.select().from(settings).limit(1);
    return settingsRow;
  }

  async upsertSettings(settingsData: InsertSettings): Promise<Settings> {
    const existing = await this.getSettings();
    if (existing) {
      const [updated] = await db
        .update(settings)
        .set({ ...settingsData, updatedAt: new Date() })
        .where(eq(settings.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(settings).values(settingsData).returning();
    return created;
  }

  // Wedding Party
  async getAllWeddingParty(): Promise<WeddingParty[]> {
    return await db.select().from(weddingParty).orderBy(weddingParty.order);
  }

  async getWeddingPartyMember(id: string): Promise<WeddingParty | undefined> {
    const [member] = await db.select().from(weddingParty).where(eq(weddingParty.id, id));
    return member;
  }

  async createWeddingPartyMember(member: InsertWeddingParty): Promise<WeddingParty> {
    const [created] = await db.insert(weddingParty).values(member).returning();
    return created;
  }

  async updateWeddingPartyMember(id: string, memberData: Partial<InsertWeddingParty>): Promise<WeddingParty | undefined> {
    const [updated] = await db
      .update(weddingParty)
      .set({ ...memberData, updatedAt: new Date() })
      .where(eq(weddingParty.id, id))
      .returning();
    return updated;
  }

  async deleteWeddingPartyMember(id: string): Promise<void> {
    await db.delete(weddingParty).where(eq(weddingParty.id, id));
  }

  // Popups
  async getAllPopups(): Promise<Popup[]> {
    return await db.select().from(popups);
  }

  async getPopup(id: string): Promise<Popup | undefined> {
    const [popup] = await db.select().from(popups).where(eq(popups.id, id));
    return popup;
  }

  async getPopupByType(type: string): Promise<Popup | undefined> {
    const [popup] = await db.select().from(popups).where(eq(popups.type, type));
    return popup;
  }

  async createPopup(popupData: InsertPopup): Promise<Popup> {
    const [created] = await db.insert(popups).values(popupData).returning();
    return created;
  }

  async updatePopup(id: string, popupData: Partial<InsertPopup>): Promise<Popup | undefined> {
    const [updated] = await db
      .update(popups)
      .set({ ...popupData, updatedAt: new Date() })
      .where(eq(popups.id, id))
      .returning();
    return updated;
  }

  async deletePopup(id: string): Promise<void> {
    await db.delete(popups).where(eq(popups.id, id));
  }
}

export const storage = new DatabaseStorage();
