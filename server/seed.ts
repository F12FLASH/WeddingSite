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

  // Create couple info with a beautiful, long love story
  await storage.upsertCoupleInfo({
    brideName: "Xuân Lâm",
    groomName: "Xuân Lợi",
    bridePhoto: "/attached_assets/wedding_images/avatar/codau.jpg",
    groomPhoto: "/attached_assets/wedding_images/avatar/chure.jpg",
    brideDescription: "Cô dâu Xuân Lâm - Người phụ nữ xinh đẹp, dịu dàng với nụ cười rạng rỡ luôn tỏa sáng. Lâm là một dược sĩ tận tâm với công việc, luôn quan tâm chăm sóc sức khỏe cộng đồng. Cô yêu thích đọc sách, yoga và nấu ăn. Trong mắt Lợi, Lâm là người phụ nữ hoàn hảo với trái tim nhân hậu và sự kiên nhẫn vô bờ bến.",
    groomDescription: "Chú rể Xuân Lợi - Chàng trai thông minh, trách nhiệm và luôn tươi cười. Lợi là một kiến trúc sư tài năng với niềm đam mê thiết kế không gian sống hiện đại, ấm cúng. Anh yêu thích nhiếp ảnh, du lịch và khám phá ẩm thực. Trong mắt Lâm, Lợi là người đàn ông đáng tin cậy, luôn biết cách khiến cô cảm thấy an toàn và được yêu thương.",
    ourStory: `Câu chuyện tình yêu của chúng tôi bắt đầu như một câu chuyện cổ tích hiện đại. 

Xuân năm 2022, Hà Nội đang trong những ngày đẹp nhất của năm với hoa ban nở trắng trời. Lợi, một kiến trúc sư trẻ đầy đam mê, đang tham dự triển lãm nghệ thuật "Không Gian Và Cảm Xúc" tại Trung tâm Văn hóa Hà Nội. Còn Lâm, một dược sĩ yêu nghệ thuật, cũng ghé thăm triển lãm này sau một ngày làm việc mệt mỏi, muốn tìm chút bình yên trong thế giới tranh ảnh.

Định mệnh đã sắp đặt cho hai người đứng cùng ngắm một bức tranh - "Ánh Sáng Cuối Ngày" của họa sĩ Bùi Xuân Phái. Lợi, người yêu thích góc nhìn kiến trúc, nhận xét về cách ánh sáng tạo nên chiều sâu cho không gian. Còn Lâm, với trái tim nhạy cảm, lại cảm nhận được sự cô đơn và khát khao trong bức tranh. Hai người bắt đầu trò chuyện, và cuộc nói chuyện kéo dài đến tận khi triển lãm đóng cửa.

Từ lần gặp gỡ định mệnh đó, chúng tôi bắt đầu những buổi hẹn hò lãng mạn. Lợi đưa Lâm đi khắp những con phố cổ kính của Hà Nội - từ phố sách cũ trên phố Đinh Lễ, đến những quán cà phê nhỏ ẩn mình trong ngõ nhỏ phố Hàng Bông. Mỗi cuối tuần, họ thường dạo bước quanh Hồ Gươm vào buổi sáng sớm, tay trong tay, chia sẻ những ước mơ về tương lai.

Mùa hè năm đó, Lợi đã lên kế hoạch cho chuyến du lịch đầu tiên của hai người - Đà Lạt, thành phố ngàn hoa. Tại đây, giữa sương mù và hoa dã quỳ nở rộ, bên bờ hồ Xuân Hương lung linh ánh đèn, Lợi đã quỳ gối cầu hôn Lâm với chiếc nhẫn đính hôn anh đã chuẩn bị từ tháng trước. Lâm đã rơi nước mắt hạnh phúc và gật đầu đồng ý, trong khi những du khách xung quanh vỗ tay chúc mừng.

Hai năm sau đó là khoảng thời gian chúng tôi cùng nhau vượt qua mọi thử thách. Từ những ngày làm việc bận rộn, áp lực công việc, đến những lúc ý kiến bất đồng, chúng tôi đã học cách lắng nghe, thấu hiểu và yêu thương nhau nhiều hơn mỗi ngày. Lợi đã thiết kế và xây dựng ngôi nhà nhỏ cho hai người - một không gian ấm cúng với khu vườn nhỏ mà Lâm luôn mơ ước. Còn Lâm đã luôn là chỗ dựa tinh thần vững chắc, động viên Lợi mỗi khi anh gặp khó khăn trong công việc.

Tết Nguyên Đán 2024, Lợi đã về xin phép gia đình Lâm, và gia đình hai bên đã vui vẻ chấp nhận. Từ đó, chúng tôi bắt đầu chuẩn bị cho ngày trọng đại nhất cuộc đời - ngày hai trái tim chính thức hòa làm một.

Hôm nay, ngày 01 tháng 01 năm 2026 - ngày đầu tiên của năm mới, chúng tôi sẽ chính thức là vợ chồng. Trước sự chứng kiến của gia đình, bạn bè và những người thân yêu, chúng tôi hứa sẽ luôn bên nhau, yêu thương, tôn trọng và chăm sóc lẫn nhau trọn đời. 

Cảm ơn tất cả những ai đã và đang đồng hành cùng chúng tôi trong hành trình tình yêu này. Chúng tôi rất vinh hạnh được chia sẻ niềm hạnh phúc này cùng quý vị!`,
    weddingDate: new Date("2026-01-01"),
    heroImage: "/attached_assets/wedding_images/background/anhnen.jpg",
  });
  console.log("✅ Created couple info with beautiful love story");

  // Create schedule events
  const events = [
    { title: "Lễ Đón Dâu", description: "Đón dâu tại nhà gái theo phong tục truyền thống", eventTime: new Date("2026-01-01T07:00:00"), location: "Nhà Gái - 88 Phố Huế, Hai Bà Trưng, Hà Nội", icon: "home", order: 1 },
    { title: "Lễ Vu Quy", description: "Lễ vu quy long trọng - Tạm biệt gia đình", eventTime: new Date("2026-01-01T08:30:00"), location: "Nhà Gái - 88 Phố Huế, Hai Bà Trưng, Hà Nội", icon: "heart", order: 2 },
    { title: "Rước Dâu Về Nhà Trai", description: "Đoàn rước dâu về nhà chú rể với xe hoa lộng lẫy", eventTime: new Date("2026-01-01T10:00:00"), location: "Từ nhà gái đến 156 Nguyễn Lương Bằng, Đống Đa, Hà Nội", icon: "car", order: 3 },
    { title: "Lễ Thành Hôn", description: "Lễ thành hôn trang trọng tại nhà trai", eventTime: new Date("2026-01-01T11:30:00"), location: "Nhà Trai - 156 Nguyễn Lương Bằng, Đống Đa, Hà Nội", icon: "church", order: 4 },
    { title: "Tiệc Cưới Chiều", description: "Tiệc cưới long trọng chiêu đãi khách mời", eventTime: new Date("2026-01-01T17:00:00"), location: "Rose Garden Estate - Cổ Nhuế, Bắc Từ Liêm, Hà Nội", icon: "glass", order: 5 },
    { title: "Văn Nghệ & Ca Nhạc", description: "Chương trình ca nhạc, văn nghệ và trò chơi vui nhộn", eventTime: new Date("2026-01-01T19:00:00"), location: "Rose Garden Estate", icon: "music", order: 6 },
  ];
  for (const event of events) {
    await storage.createScheduleEvent(event);
  }
  console.log(`✅ Created ${events.length} schedule events`);

  // Create photos
  const photos = [
    { url: "/attached_assets/wedding_images/album/1.jpg", caption: "Khoảnh khắc ngọt ngào của đôi uyên ương", category: "pre-wedding", order: 1 },
    { url: "/attached_assets/wedding_images/album/2.jpg", caption: "Nụ cười rạng rỡ trong ngày trọng đại", category: "engagement", order: 2 },
    { url: "/attached_assets/wedding_images/album/3.jpg", caption: "Tình yêu vượt thời gian", category: "ceremony", order: 3 },
    { url: "/attached_assets/wedding_images/album/4.jpg", caption: "Xuân Lâm & Xuân Lợi - Một tình yêu đẹp như mơ", category: "wedding", order: 4 },
    { url: "/attached_assets/wedding_images/album/5.jpg", caption: "Kỷ niệm khó quên bên nhau", category: "portrait", order: 5 },
    { url: "/attached_assets/wedding_images/album/6.jpg", caption: "Hạnh phúc tràn ngập trong từng khoảnh khắc", category: "portrait", order: 6 },
  ];
  for (const photo of photos) {
    await storage.createPhoto(photo);
  }
  console.log(`✅ Created ${photos.length} photos`);

  // Create guest messages
  const messages = [
    { guestName: "Trần Minh Tuấn", message: "Chúc hai bạn trăm năm hạnh phúc, sớm có tin vui! Mãi bên nhau nhé!", approved: true },
    { guestName: "Nguyễn Thu Hương", message: "Chúc mừng đám cưới Lâm và Lợi! Mãi bên nhau hạnh phúc, yêu thương nhau nhiều hơn mỗi ngày!", approved: true },
    { guestName: "Lê Văn Hải", message: "Chúc hai bạn luôn yêu thương, thấu hiểu và hỗ trợ nhau trong mọi hoàn cảnh!", approved: true },
    { guestName: "Phạm Thị Lan", message: "Chúc cho tình yêu của hai bạn mãi xanh tươi như thuở ban đầu, hạnh phúc trọn đời!", approved: true },
    { guestName: "Hoàng Minh Đức", message: "Hạnh phúc lắm nha! Chúc mừng Lâm và Lợi có một đám cưới thật ý nghĩa!", approved: true },
    { guestName: "Vũ Thị Mai", message: "Chúc hai bạn sớm có thiên thần nhỏ xinh đẹp, gia đình hạnh phúc!", approved: true },
    { guestName: "Đỗ Thanh Tùng", message: "Chúc mừng cặp đôi trai tài gái sắc! Mãi yêu và hạnh phúc!", approved: true },
  ];
  for (const message of messages) {
    await storage.createGuestMessage(message);
  }
  console.log(`✅ Created ${messages.length} guest messages`);

  // Create RSVPs
  const rsvps = [
    { guestName: "Nguyễn Văn Anh", email: "nva@example.com", phone: "0901234567", attending: true, guestCount: 3, mealPreference: "Thịt bò", specialRequirements: "Không ăn hành" },
    { guestName: "Trần Thị Bích", email: "ttb@example.com", phone: "0912345678", attending: true, guestCount: 2, mealPreference: "Gà", specialRequirements: "" },
    { guestName: "Lê Hoàng Cường", email: "lhc@example.com", phone: "0923456789", attending: false, guestCount: 1, mealPreference: "Chay", specialRequirements: "Ăn chay" },
    { guestName: "Phạm Minh Đức", email: "pmd@example.com", phone: "0934567890", attending: true, guestCount: 4, mealPreference: "Cá", specialRequirements: "Có trẻ em 2 tuổi" },
    { guestName: "Vũ Thu Hà", email: "vth@example.com", phone: "0945678901", attending: true, guestCount: 2, mealPreference: "Tôm", specialRequirements: "" },
  ];
  for (const rsvp of rsvps) {
    await storage.createRsvp(rsvp);
  }
  console.log(`✅ Created ${rsvps.length} RSVPs`);

  // Create registry items (Optional - Vietnamese style prefers bank transfer)
  const registryItems = [
    { name: "Máy Giặt Inverter", description: "Máy giặt cửa trước inverter tiết kiệm điện 10kg", price: 15000000, imageUrl: "https://placehold.co/400x300/4a90e2/white?text=Máy+Giặt", purchaseUrl: "https://example.com", order: 1, isPurchased: false },
    { name: "Tủ Lạnh Side By Side", description: "Tủ lạnh side by side 600L công nghệ inverter", price: 25000000, imageUrl: "https://placehold.co/400x300/50c878/white?text=Tủ+Lạnh", purchaseUrl: "https://example.com", order: 2, isPurchased: false },
    { name: "Bộ Bàn Ăn Gỗ Sồi", description: "Bộ bàn ăn gỗ sồi tự nhiên 6 ghế cao cấp", price: 18000000, imageUrl: "https://placehold.co/400x300/d2691e/white?text=Bàn+Ăn", purchaseUrl: "https://example.com", order: 3, isPurchased: true },
    { name: "Nồi Chiên Không Dầu", description: "Nồi chiên không dầu điện tử 7L cao cấp", price: 4500000, imageUrl: "https://placehold.co/400x300/ff6347/white?text=Nồi+Chiên", purchaseUrl: "https://example.com", order: 4, isPurchased: false },
    { name: "Máy Hút Bụi Robot", description: "Máy hút bụi robot thông minh tự động lau nhà", price: 12000000, imageUrl: "https://placehold.co/400x300/9370db/white?text=Robot+Hút+Bụi", purchaseUrl: "https://example.com", order: 5, isPurchased: false },
  ];
  for (const item of registryItems) {
    await storage.createRegistryItem(item);
  }
  console.log(`✅ Created ${registryItems.length} registry items`);

  // Create wedding party members
  const weddingParty = [
    { name: "Nguyễn Thanh Tâm", role: "Phù Dâu", description: "Bạn thân từ thời cấp 2 của cô dâu, luôn đồng hành trong mọi khoảnh khắc", photoUrl: "/attached_assets/wedding_images/bridesmaids/1.jpg", order: 1 },
    { name: "Trần Hồng Nhung", role: "Phù Dâu", description: "Chị em họ thân thiết của cô dâu, người chị luôn yêu thương", photoUrl: "/attached_assets/wedding_images/bridesmaids/2.jpg", order: 2 },
    { name: "Lê Thị Mai", role: "Phù Dâu", description: "Bạn học cùng lớp đại học, cùng chia sẻ bao kỷ niệm đẹp", photoUrl: "/attached_assets/wedding_images/bridesmaids/3.jpeg", order: 3 },
    { name: "Phạm Quốc Tuấn", role: "Phù Rể", description: "Bạn thân từ thuở nhỏ của chú rể, anh em tâm giao", photoUrl: "/attached_assets/wedding_images/groomsmen/1.jpg", order: 4 },
    { name: "Vũ Minh Quân", role: "Phù Rể", description: "Đồng nghiệp thân thiết của chú rể tại công ty kiến trúc", photoUrl: "/attached_assets/wedding_images/groomsmen/2.jpg", order: 5 },
    { name: "Hoàng Văn Nam", role: "Phù Rể", description: "Bạn cùng phòng thời đại học, cùng trải qua bao kỷ niệm", photoUrl: "/attached_assets/wedding_images/groomsmen/3.jpg", order: 6 },
  ];
  for (const member of weddingParty) {
    await storage.createWeddingPartyMember(member);
  }
  console.log(`✅ Created ${weddingParty.length} wedding party members`);

  // Create settings with bank transfer info
  await storage.upsertSettings({
    venueName: "Rose Garden Estate",
    venueAddress: "Khu đô thị Cổ Nhuế, Phường Cổ Nhuế 1, Quận Bắc Từ Liêm, Hà Nội",
    venueMapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.4803982916854!2d105.84117207503217!3d21.01332968063466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab953357c995%3A0x847d6c860524e5b7!2zSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1234567890",
    venuePhone: "024 3868 9999",
    venueEmail: "contact@rosegarden.vn",
    venueImage: "/attached_assets/wedding_images/venue/1.jpg",
    eventStartTime: new Date("2026-01-01T17:00:00"),
    eventEndTime: new Date("2026-01-01T21:00:00"),
    backgroundMusicUrl: "/attached_assets/wedding_music/Beautiful in white.mp3",
    backgroundMusicType: "upload",
    backgroundMusicUrls: [],
    backgroundMusicNames: [],
    // Bank transfer info (Vietnamese wedding tradition)
    brideQrCodeUrl: "/attached_assets/wedding_images/qr/mungtiencodau.jpg",
    groomQrCodeUrl: "/attached_assets/wedding_images/qr/mungtienchure.jpg",
    brideBankInfo: "Ngân hàng Vietcombank\nChi nhánh Hà Nội\nSTK: 0123456789\nChủ TK: Nguyễn Thị Xuân Lâm",
    groomBankInfo: "Ngân hàng Techcombank\nChi nhánh Đống Đa\nSTK: 9876543210\nChủ TK: Trần Xuân Lợi",
    // Footer info
    footerText: "Cảm ơn bạn đã đến chung vui cùng chúng tôi trong ngày trọng đại!",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    hashtag: "#XuânLâmXuânLợi2026",
  });
  console.log("✅ Created settings");

  // Create FAQs
  const faqs = [
    { question: "Đám cưới diễn ra vào lúc mấy giờ?", answer: "Tiệc cưới sẽ bắt đầu lúc 17:00 (5 giờ chiều) ngày 01/01/2026 tại Rose Garden Estate. Quý khách vui lòng có mặt trước 16:45 để tham gia lễ chào đón và checkin.", order: 1 },
    { question: "Trang phục nên mặc như thế nào?", answer: "Chúng tôi khuyến khích quý khách mặc trang phục lịch sự, trang trọng. Nam giới có thể mặc vest, áo sơ mi kết hợp quần tây. Nữ giới có thể mặc váy dạ hội, áo dài hoặc trang phục cocktail. Tránh mặc quá trắng hoặc quá đen.", order: 2 },
    { question: "Có chỗ đậu xe không?", answer: "Rose Garden Estate có bãi đậu xe rộng rãi, an toàn và hoàn toàn miễn phí cho tất cả khách mời. Ngoài ra còn có nhân viên bảo vệ và valet parking hỗ trợ 24/7.", order: 3 },
    { question: "Tôi có thể mang theo trẻ em được không?", answer: "Chúng tôi rất vui lòng đón tiếp các em nhỏ! Vui lòng ghi chính xác số lượng trẻ em trong form RSVP để chúng tôi chuẩn bị ghế ngồi, thức ăn và các hoạt động vui chơi phù hợp cho các bé.", order: 4 },
    { question: "Mừng cưới như thế nào?", answer: "Theo truyền thống Việt Nam, quý khách có thể gửi mừng cưới qua chuyển khoản ngân hàng (xem thông tin trong mục Mừng Cưới) hoặc trao trực tiếp tại tiệc cưới. Chúng tôi trân trọng mọi tấm lòng của quý khách dù nhiều hay ít!", order: 5 },
    { question: "Làm thế nào để xác nhận tham dự?", answer: "Quý khách vui lòng điền form RSVP trên website trước ngày 25/12/2025 để chúng tôi có thể chuẩn bị chu đáo. Nếu có thay đổi kế hoạch, vui lòng liên hệ với chúng tôi sớm nhất có thể qua số điện thoại hoặc email.", order: 6 },
    { question: "Tôi có cần mang theo thiệp mời không?", answer: "Không bắt buộc phải mang thiệp mời. Quý khách chỉ cần báo tên tại quầy lễ tân để được hướng dẫn vào sảnh tiệc. Tuy nhiên nếu quý khách muốn giữ thiệp làm kỷ niệm thì có thể mang theo.", order: 7 },
    { question: "Có phục vụ đồ uống có cồn không?", answer: "Có. Chúng tôi có phục vụ rượu vang, bia và các loại cocktail. Tuy nhiên, chúng tôi khuyến khích quý khách uống có trách nhiệm và không lái xe sau khi uống rượu. Có dịch vụ taxi sẵn sàng hỗ trợ.", order: 8 },
  ];
  for (const faq of faqs) {
    await storage.createFaq(faq);
  }
  console.log(`✅ Created ${faqs.length} FAQs`);

  // Create popups
  const popups = [
    {
      type: "welcome",
      imageUrl: "/attached_assets/wedding_images/popup/dautrang.gif",
      isActive: true,
      title: "Chào Mừng Đến Với Đám Cưới Của Chúng Tôi!",
      description: "Xuân Lâm & Xuân Lợi trân trọng kính mời quý khách",
    },
    {
      type: "scroll_end",
      imageUrl: "/attached_assets/wedding_images/popup/cuoitrang.gif",
      isActive: true,
      title: "Cảm Ơn Bạn Đã Ghé Thăm!",
      description: "Hẹn gặp bạn tại đám cưới của chúng tôi",
    },
  ];
  for (const popup of popups) {
    await storage.createPopup(popup);
  }
  console.log(`✅ Created ${popups.length} popups`);

  // Create music track for Beautiful in white
  await storage.createMusicTrack({
    title: "Beautiful in White",
    filename: "Beautiful in white.mp3",
    artist: "Shane Filan",
    duration: 240, // 4 minutes approx
    displayOrder: 1,
    isActive: true,
  });
  console.log("✅ Created music track: Beautiful in White");


  // Create guest photos (sample data - need actual photos uploaded by guests)
  const guestPhotoSamples = [
    { url: "https://placehold.co/800x600/ff6b9d/white?text=Guest+Photo+1", caption: "Khoảnh khắc đẹp trong tiệc!", guestName: "Nguyễn Anh", approved: true },
    { url: "https://placehold.co/800x600/c44569/white?text=Guest+Photo+2", caption: "Cô dâu chú rể xinh đẹp quá!", guestName: "Trần Bình", approved: true },
    { url: "https://placehold.co/800x600/6c5ce7/white?text=Guest+Photo+3", caption: "Ảnh chụp cùng cặp đôi", guestName: "Lê Cường", approved: false },
  ];
  for (const photo of guestPhotoSamples) {
    await storage.createGuestPhoto(photo);
  }
  console.log(`✅ Created ${guestPhotoSamples.length} guest photo samples`);

  // Create livestream info
  await storage.upsertLivestreamInfo({
    isActive: true,
    platform: "youtube",
    streamUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    streamTitle: "Trực Tiếp Đám Cưới Xuân Lâm & Xuân Lợi",
    streamDescription: "Theo dõi trực tiếp lễ cưới của chúng tôi! Buổi lễ sẽ bắt đầu lúc 17:00 ngày 01/01/2026.",
    startTime: new Date("2026-01-01T17:00:00"),
    endTime: new Date("2026-01-01T21:00:00"),
    thumbnailUrl: "/attached_assets/wedding_images/background/anhnen.jpg",
    chatEnabled: true,
  });
  console.log("✅ Created livestream info");

  console.log("🎉 Database seeding completed successfully!");
  console.log("📝 Summary:");
  console.log("   - Admin user created");
  console.log("   - Couple info with beautiful love story");
  console.log("   - 6 schedule events");
  console.log("   - 6 photos");
  console.log("   - 7 guest messages");
  console.log("   - 5 RSVPs");
  console.log("   - 5 registry items");
  console.log("   - 6 wedding party members");
  console.log("   - 8 FAQs");
  console.log("   - 2 popups");
  console.log("   - 1 music track");
  console.log("   - Settings configured");
  console.log("   - 3 guest photo samples");
  console.log("   - Livestream info configured");
}

seed().catch(console.error);
