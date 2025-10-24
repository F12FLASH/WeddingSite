import { hashPassword } from "./auth";
import { storage } from "./storage";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  await storage.upsertUser({
    username: "admin",
    password: adminPassword,
    email: "admin@wedding.com",
    firstName: "Wedding",
    lastName: "Admin",
  });
  console.log("✅ Created admin user (username: admin, password: admin123)");

  // Create couple info
  await storage.upsertCoupleInfo({
    brideName: "Nguyễn Thu Hà",
    groomName: "Trần Minh Tuấn",
    bridePhoto: "/attached_assets/generated_images/Elegant_bride_portrait_photo_6abee8e2.png",
    groomPhoto: "/attached_assets/generated_images/Handsome_groom_portrait_photo_1678e40a.png",
    brideDescription: "Cô dâu Thu Hà - Người phụ nữ dịu dàng, xinh đẹp và tài năng. Cô là một giáo viên mầm non với tấm lòng nhân hậu và luôn yêu thương trẻ em.",
    groomDescription: "Chú rể Minh Tuấn - Chàng trai lịch lãm, tài giỏi và có trách nhiệm. Anh là kỹ sư phần mềm với niềm đam mê công nghệ và khát vọng xây dựng tương lai tươi sáng.",
    ourStory: "Chúng tôi gặp nhau vào một buổi chiều xuân ấm áp tại công viên Hồ Gươm. Từ ánh mắt đầu tiên, chúng tôi đã biết rằng đây là duyên phận trời định. Sau 3 năm bên nhau, chúng tôi quyết định bước vào hôn nhân để cùng nhau xây dựng một tổ ấm hạnh phúc.",
    weddingDate: new Date("2025-06-15"),
    heroImage: "/attached_assets/generated_images/Romantic_wedding_couple_hero_background_0afd25e7.png",
  });
  console.log("✅ Created couple info");

  // Create schedule events
  const events = [
    { title: "Lễ Vu Quy", description: "Lễ vu quy tại nhà gái", eventTime: new Date("2025-06-15T08:00:00"), location: "Nhà gái - 123 Trần Hưng Đạo, Hà Nội", icon: "home", order: 1 },
    { title: "Rước Dâu", description: "Rước dâu về nhà chú rể", eventTime: new Date("2025-06-15T10:30:00"), location: "Từ nhà gái đến nhà trai", icon: "car", order: 2 },
    { title: "Lễ Thành Hôn", description: "Lễ thành hôn tại nhà trai", eventTime: new Date("2025-06-15T12:00:00"), location: "Nhà trai - 456 Láng Hạ, Hà Nội", icon: "church", order: 3 },
    { title: "Tiệc Cưới", description: "Tiệc cưới chiêu đãi khách mời", eventTime: new Date("2025-06-15T18:00:00"), location: "Rose Garden Estate", icon: "glass", order: 4 },
    { title: "Múa Hát", description: "Chương trình văn nghệ", eventTime: new Date("2025-06-15T20:00:00"), location: "Rose Garden Estate", icon: "music", order: 5 },
  ];
  for (const event of events) {
    await storage.createScheduleEvent(event);
  }
  console.log(`✅ Created ${events.length} schedule events`);

  // Create photos
  const photos = [
    { url: "/attached_assets/generated_images/Pre-wedding_cherry_blossom_photo_87d19e2a.png", caption: "Ảnh cưới ở vườn anh đào", category: "pre-wedding", order: 1 },
    { url: "/attached_assets/generated_images/Couple_engagement_park_photo_8a5ab5d9.png", caption: "Kỷ niệm ngày đính hôn", category: "engagement", order: 2 },
    { url: "/attached_assets/generated_images/Wedding_venue_ceremony_setup_4b2b0b2c.png", caption: "Địa điểm tổ chức lễ cưới", category: "ceremony", order: 3 },
    { url: "/attached_assets/generated_images/Romantic_wedding_couple_hero_background_0afd25e7.png", caption: "Ảnh cưới lãng mạn", category: "wedding", order: 4 },
    { url: "/attached_assets/generated_images/Elegant_bride_portrait_photo_6abee8e2.png", caption: "Chân dung cô dâu", category: "portrait", order: 5 },
    { url: "/attached_assets/generated_images/Handsome_groom_portrait_photo_1678e40a.png", caption: "Chân dung chú rể", category: "portrait", order: 6 },
  ];
  for (const photo of photos) {
    await storage.createPhoto(photo);
  }
  console.log(`✅ Created ${photos.length} photos`);

  // Create guest messages
  const messages = [
    { guestName: "Nguyễn Văn An", message: "Chúc hai bạn trăm năm hạnh phúc!", approved: true },
    { guestName: "Trần Thị Bình", message: "Hạnh phúc mãi mãi bên nhau!", approved: true },
    { guestName: "Lê Hoàng Cường", message: "Chúc mừng đám cưới, hạnh phúc viên mãn!", approved: true },
    { guestName: "Phạm Thu Duyên", message: "Yêu nhau mãi mãi nhé!", approved: true },
    { guestName: "Vũ Minh Hiếu", message: "Xin chúc mừng!", approved: false },
  ];
  for (const message of messages) {
    await storage.createGuestMessage(message);
  }
  console.log(`✅ Created ${messages.length} guest messages`);

  // Create RSVPs
  const rsvps = [
    { guestName: "Nguyễn Thị Mai", email: "mai@example.com", phone: "0912345678", attending: true, guestCount: 2, mealPreference: "chicken", specialRequirements: "" },
    { guestName: "Trần Văn Nam", email: "nam@example.com", phone: "0987654321", attending: true, guestCount: 3, mealPreference: "beef", specialRequirements: "Dị ứng hải sản" },
    { guestName: "Lê Thị Oanh", email: "oanh@example.com", phone: "0923456789", attending: false, guestCount: 1, mealPreference: "vegetarian", specialRequirements: "" },
    { guestName: "Phạm Văn Phúc", email: "phuc@example.com", phone: "0934567890", attending: true, guestCount: 4, mealPreference: "fish", specialRequirements: "" },
  ];
  for (const rsvp of rsvps) {
    await storage.createRsvp(rsvp);
  }
  console.log(`✅ Created ${rsvps.length} RSVPs`);

  // Create registry items
  const registryItems = [
    { name: "Bộ Đồ Ăn Cao Cấp", description: "Bộ đồ ăn sứ cao cấp 24 món", price: 2500000, imageUrl: "https://placehold.co/400x300/pink/white?text=Bộ+Đồ+Ăn", purchaseUrl: "https://example.com", order: 1, isPurchased: false },
    { name: "Máy Hút Bụi Thông Minh", description: "Máy hút bụi tự động thông minh", price: 8000000, imageUrl: "https://placehold.co/400x300/blue/white?text=Máy+Hút+Bụi", purchaseUrl: "https://example.com", order: 2, isPurchased: false },
    { name: "Nồi Cơm Điện Cao Cấp", description: "Nồi cơm điện tử cao cấp 1.8L", price: 3500000, imageUrl: "https://placehold.co/400x300/green/white?text=Nồi+Cơm", purchaseUrl: "https://example.com", order: 3, isPurchased: true },
    { name: "Bàn Ăn Gỗ Tự Nhiên", description: "Bàn ăn gỗ tự nhiên 6 ghế", price: 15000000, imageUrl: "https://placehold.co/400x300/brown/white?text=Bàn+Ăn", purchaseUrl: "https://example.com", order: 4, isPurchased: false },
    { name: "Máy Giặt Cửa Trước", description: "Máy giặt cửa trước 9kg", price: 12000000, imageUrl: "https://placehold.co/400x300/purple/white?text=Máy+Giặt", purchaseUrl: "https://example.com", order: 5, isPurchased: false },
  ];
  for (const item of registryItems) {
    await storage.createRegistryItem(item);
  }
  console.log(`✅ Created ${registryItems.length} registry items`);

  // Create settings
  await storage.upsertSettings({
    venueName: "Rose Garden Estate",
    venueAddress: "123 Garden Lane, Spring Valley, CA 91977",
    venueMapLink: "https://www.google.com/maps/search/?api=1&query=Rose+Garden+Estate+Spring+Valley+CA",
    venuePhone: "0123 456 789",
    venueEmail: "contact@rosegarden.com",
    eventStartTime: new Date("2025-06-15T18:00:00"),
    eventEndTime: new Date("2025-06-15T22:00:00"),
    backgroundMusicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    backgroundMusicType: "mp3",
  });
  console.log("✅ Created settings");

  console.log("🎉 Database seeding completed!");
}

seed().catch(console.error);
