import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertCoupleInfoSchema,
  insertScheduleEventSchema,
  insertPhotoSchema,
  insertGuestMessageSchema,
  insertRsvpSchema,
  insertRegistryItemSchema,
  insertSettingsSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ===== Couple Info Routes =====
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
    } catch (error: any) {
      console.error("Error updating couple info:", error);
      res.status(400).json({ message: error.message || "Failed to update couple info" });
    }
  });

  // ===== Schedule Events Routes =====
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
    } catch (error: any) {
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
    } catch (error: any) {
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

  // ===== Photos Routes =====
  app.get("/api/photos", async (req, res) => {
    try {
      const photos = await storage.getAllPhotos();
      res.json(photos);
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
    } catch (error: any) {
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
    } catch (error: any) {
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

  // ===== Guest Messages Routes =====
  app.get("/api/messages", async (req, res) => {
    try {
      const approvedOnly = req.query.approved === 'true';
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
    } catch (error: any) {
      console.error("Error creating guest message:", error);
      res.status(400).json({ message: error.message || "Failed to create guest message" });
    }
  });

  app.patch("/api/messages/:id/approve", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const approvalSchema = z.object({ approved: z.boolean() });
      const { approved } = approvalSchema.parse(req.body);
      const message = await storage.approveGuestMessage(id, approved);
      if (!message) {
        return res.status(404).json({ message: "Guest message not found" });
      }
      res.json(message);
    } catch (error: any) {
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

  // ===== RSVPs Routes =====
  app.get("/api/rsvps", isAuthenticated, async (req, res) => {
    try {
      const rsvps = await storage.getAllRsvps();
      res.json(rsvps);
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
    } catch (error: any) {
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

  // ===== Registry Items Routes =====
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
    } catch (error: any) {
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
    } catch (error: any) {
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

  // ===== Settings Routes =====
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings || null);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", isAuthenticated, async (req, res) => {
    try {
      const validated = insertSettingsSchema.parse(req.body);
      const settings = await storage.upsertSettings(validated);
      res.json(settings);
    } catch (error: any) {
      console.error("Error updating settings:", error);
      res.status(400).json({ message: error.message || "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
