import { storage } from "../server/storage";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function refreshDatabase() {
  console.log("🔄 Làm mới database với ảnh thực...\n");

  // Load image data
  const imagePath = join(__dirname, 'image_data.json');
  const imageData = JSON.parse(readFileSync(imagePath, "utf-8"));
  
  console.log("📸 Đã tải dữ liệu ảnh:");
  console.log(`  - ${Object.keys(imageData.album || {}).length} ảnh album`);
  console.log(`  - ${Object.keys(imageData.avatar || {}).length} ảnh avatar`);
  console.log(`  - ${Object.keys(imageData.background || {}).length} ảnh nền`);
  console.log(`  - ${Object.keys(imageData.venue || {}).length} ảnh nhà hàng`);
  console.log(`  - ${Object.keys(imageData.bridesmaids || {}).length} ảnh phù dâu`);
  console.log(`  - ${Object.keys(imageData.groomsmen || {}).length} ảnh phù rể`);
  console.log(`  - ${Object.keys(imageData.qr || {}).length} ảnh QR code\n`);

  // Update couple info with real photos
  await storage.upsertCoupleInfo({
    brideName: "Xuân Lâm",
    groomName: "Xuân Lợi",
    bridePhoto: imageData.avatar["codau.jpg"],
    groomPhoto: imageData.avatar["chure.jpg"],
    brideDescription: "Cô dâu Xuân Lâm - Người phụ nữ xinh đẹp, dịu dàng và tràn đầy năng lượng.",
    groomDescription: "Chú rể Xuân Lợi - Chàng trai thông minh, trách nhiệm và luôn tươi cười.",
    ourStory: "Chúng tôi gặp nhau lần đầu vào mùa xuân năm 2022. Từ cái nhìn đầu tiên, chúng tôi đã cảm nhận được sự kết nối đặc biệt. Sau những buổi hẹn hò lãng mạn, chúng tôi nhận ra rằng mình là người tri kỷ của nhau.",
    weddingDate: new Date("2026-01-01"),
    heroImage: imageData.background["anhnen.jpg"],
  });
  console.log("✅ Cập nhật thông tin cô dâu chú rể");

  // Update settings with real venue image and QR codes
  await storage.upsertSettings({
    venueName: "Rose Garden Estate",
    venueAddress: "Khu đô thị Cổ Nhuế, Phường Cổ Nhuế 1, Quận Bắc Từ Liêm, Hà Nội",
    venueMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.4803982916854!2d105.84117207503217!3d21.01332968063466",
    venuePhone: "024 3868 9999",
    venueEmail: "contact@rosegarden.vn",
    venueImage: imageData.venue["1.jpg"],
    eventStartTime: new Date("2026-01-01T17:00:00"),
    eventEndTime: new Date("2026-01-01T21:00:00"),
    backgroundMusicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    backgroundMusicType: "upload",
    brideQrCodeUrl: imageData.qr["mungtiencodau.jpg"],
    groomQrCodeUrl: imageData.qr["mungtienchure.jpg"],
    brideBankInfo: "Ngân hàng: Vietcombank\nSố tài khoản: 1234567890\nChủ tài khoản: Xuân Lâm",
    groomBankInfo: "Ngân hàng: Techcombank\nSố tài khoản: 0987654321\nChủ tài khoản: Xuân Lợi",
  });
  console.log("✅ Cập nhật thông tin địa điểm và QR code");

  // Clear existing photos and add real album photos
  const existingPhotos = await storage.getAllPhotos();
  for (const photo of existingPhotos) {
    await storage.deletePhoto(photo.id);
  }
  
  let order = 1;
  for (const [filename, url] of Object.entries(imageData.album)) {
    await storage.createPhoto({
      url,
      caption: `Ảnh cưới ${order}`,
      category: "wedding",
      order: order++,
    });
  }
  console.log(`✅ Thêm ${Object.keys(imageData.album).length} ảnh album`);

  // Update wedding party with real photos
  const existingMembers = await storage.getAllWeddingParty();
  for (const member of existingMembers) {
    await storage.deleteWeddingPartyMember(member.id);
  }

  const bridesmaidsPhotos = Object.values(imageData.bridesmaids);
  const groomsmenPhotos = Object.values(imageData.groomsmen);

  const bridesmaids = [
    { name: "Nguyễn Thanh Tâm", role: "Phù Dâu", description: "Bạn thân từ thời cấp 2", order: 1 },
    { name: "Trần Hồng Nhung", role: "Phù Dâu", description: "Chị em họ thân thiết", order: 2 },
    { name: "Lê Thị Mai", role: "Phù Dâu", description: "Bạn học cùng lớp đại học", order: 3 },
  ];

  const groomsmen = [
    { name: "Phạm Quốc Tuấn", role: "Phù Rể", description: "Bạn thân từ thuở nhỏ", order: 4 },
    { name: "Vũ Minh Quân", role: "Phù Rể", description: "Đồng nghiệp thân thiết", order: 5 },
    { name: "Hoàng Văn Nam", role: "Phù Rể", description: "Bạn cùng phòng đại học", order: 6 },
  ];

  for (let i = 0; i < bridesmaids.length; i++) {
    await storage.createWeddingPartyMember({
      ...bridesmaids[i],
      photoUrl: bridesmaidsPhotos[i] || bridesmaidsPhotos[0],
    });
  }

  for (let i = 0; i < groomsmen.length; i++) {
    await storage.createWeddingPartyMember({
      ...groomsmen[i],
      photoUrl: groomsmenPhotos[i] || groomsmenPhotos[0],
    });
  }
  
  console.log(`✅ Cập nhật ${bridesmaids.length + groomsmen.length} thành viên đoàn rước dâu`);

  console.log("\n🎉 Hoàn thành làm mới database với ảnh thực!");
}

refreshDatabase().catch(console.error);
