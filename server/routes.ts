import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import {
  insertCoupleInfoSchema,
  insertScheduleEventSchema,
  insertPhotoSchema,
  insertGuestMessageSchema,
  insertRsvpSchema,
  insertRegistryItemSchema,
  insertSettingsSchema,
  insertWeddingPartySchema,
  insertPopupSchema,
  insertFaqSchema,
  insertMusicTrackSchema,
  insertGiftMoneySchema,
  insertGuestPhotoSchema,
  insertLivestreamInfoSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);


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

  // ===== Wedding Party Routes =====
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
    } catch (error: any) {
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
    } catch (error: any) {
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

  // ===== Popups Routes =====
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
    } catch (error: any) {
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
    } catch (error: any) {
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

  // ===== FAQ Routes =====
  app.get("/api/faqs", async (req, res) => {
    try {
      const faqs = await storage.getAllFaqs();
      res.json(faqs);
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
    } catch (error: any) {
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
    } catch (error: any) {
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

  // ===== Music Tracks Routes =====
  app.get("/api/music-tracks", async (req, res) => {
    try {
      const activeOnly = req.query.activeOnly === 'true';
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
    } catch (error: any) {
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
    } catch (error: any) {
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

  // ===== Gift Money Routes =====
  app.get("/api/gift-money", isAuthenticated, async (req, res) => {
    try {
      const gifts = await storage.getAllGiftMoney();
      res.json(gifts);
    } catch (error) {
      console.error("Error fetching gift money:", error);
      res.status(500).json({ message: "Failed to fetch gift money" });
    }
  });

  app.get("/api/gift-money/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const gift = await storage.getGiftMoney(id);
      if (!gift) {
        return res.status(404).json({ message: "Gift money not found" });
      }
      res.json(gift);
    } catch (error) {
      console.error("Error fetching gift money:", error);
      res.status(500).json({ message: "Failed to fetch gift money" });
    }
  });

  app.post("/api/gift-money", isAuthenticated, async (req, res) => {
    try {
      const validated = insertGiftMoneySchema.parse(req.body);
      const gift = await storage.createGiftMoney(validated);
      res.json(gift);
    } catch (error: any) {
      console.error("Error creating gift money:", error);
      res.status(400).json({ message: error.message || "Failed to create gift money" });
    }
  });

  app.patch("/api/gift-money/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertGiftMoneySchema.partial().parse(req.body);
      const gift = await storage.updateGiftMoney(id, validated);
      if (!gift) {
        return res.status(404).json({ message: "Gift money not found" });
      }
      res.json(gift);
    } catch (error: any) {
      console.error("Error updating gift money:", error);
      res.status(400).json({ message: error.message || "Failed to update gift money" });
    }
  });

  app.delete("/api/gift-money/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGiftMoney(id);
      res.json({ message: "Gift money deleted" });
    } catch (error) {
      console.error("Error deleting gift money:", error);
      res.status(500).json({ message: "Failed to delete gift money" });
    }
  });

  // ===== Guest Photos Routes =====
  app.get("/api/guest-photos", async (req, res) => {
    try {
      const approvedOnly = req.query.approved === "true";
      const photos = await storage.getAllGuestPhotos(approvedOnly);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching guest photos:", error);
      res.status(500).json({ message: "Failed to fetch guest photos" });
    }
  });

  app.get("/api/guest-photos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const photo = await storage.getGuestPhoto(id);
      if (!photo) {
        return res.status(404).json({ message: "Guest photo not found" });
      }
      res.json(photo);
    } catch (error) {
      console.error("Error fetching guest photo:", error);
      res.status(500).json({ message: "Failed to fetch guest photo" });
    }
  });

  app.post("/api/guest-photos", async (req, res) => {
    try {
      const validated = insertGuestPhotoSchema.parse(req.body);
      const photo = await storage.createGuestPhoto(validated);
      res.json(photo);
    } catch (error: any) {
      console.error("Error creating guest photo:", error);
      res.status(400).json({ message: error.message || "Failed to create guest photo" });
    }
  });

  app.patch("/api/guest-photos/:id/approve", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { approved } = req.body;
      const photo = await storage.approveGuestPhoto(id, approved);
      if (!photo) {
        return res.status(404).json({ message: "Guest photo not found" });
      }
      res.json(photo);
    } catch (error: any) {
      console.error("Error approving guest photo:", error);
      res.status(400).json({ message: error.message || "Failed to approve guest photo" });
    }
  });

  app.delete("/api/guest-photos/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGuestPhoto(id);
      res.json({ message: "Guest photo deleted" });
    } catch (error) {
      console.error("Error deleting guest photo:", error);
      res.status(500).json({ message: "Failed to delete guest photo" });
    }
  });

  // ===== Livestream Info Routes =====
  app.get("/api/livestream", async (req, res) => {
    try {
      const info = await storage.getLivestreamInfo();
      res.json(info || null);
    } catch (error) {
      console.error("Error fetching livestream info:", error);
      res.status(500).json({ message: "Failed to fetch livestream info" });
    }
  });

  app.post("/api/livestream", isAuthenticated, async (req, res) => {
    try {
      const validated = insertLivestreamInfoSchema.parse(req.body);
      const info = await storage.upsertLivestreamInfo(validated);
      res.json(info);
    } catch (error: any) {
      console.error("Error updating livestream info:", error);
      res.status(400).json({ message: error.message || "Failed to update livestream info" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
