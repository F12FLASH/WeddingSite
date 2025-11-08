import { hashPassword } from "./utils/password";
import { storage } from "./storage";
import { db } from "./db";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");
  console.log("============START============");

  // Clear existing data using raw SQL
  console.log("🧹 Clearing existing data...");
  await db.execute(sql`TRUNCATE TABLE guest_photos CASCADE`);
  await db.execute(sql`TRUNCATE TABLE livestream_info CASCADE`);
  await db.execute(sql`TRUNCATE TABLE music_tracks CASCADE`);
  await db.execute(sql`TRUNCATE TABLE popups CASCADE`);
  await db.execute(sql`TRUNCATE TABLE wedding_party CASCADE`);
  await db.execute(sql`TRUNCATE TABLE settings CASCADE`);
  await db.execute(sql`TRUNCATE TABLE rsvps CASCADE`);
  await db.execute(sql`TRUNCATE TABLE guest_messages CASCADE`);
  await db.execute(sql`TRUNCATE TABLE photos CASCADE`);
  await db.execute(sql`TRUNCATE TABLE schedule_events CASCADE`);
  await db.execute(sql`TRUNCATE TABLE couple_info CASCADE`);
  await db.execute(sql`TRUNCATE TABLE users CASCADE`);
  console.log("✅ Cleared all existing data");

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  await storage.upsertUser({
    username: "admin",
    password: adminPassword,
    email: "loideveloper.37@gmail.com",
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
    brideDescription:
      "Xuân Lâm - đóa hoa xuân dịu dàng tỏa hương giữa đời. Với nụ cười rạng rỡ như nắng mai và đôi mắt biết nói, Lâm không chỉ là dược sĩ tận tâm mà còn là người giữ gìn sức khỏe cho bao trái tim. Cô mang trong mình vẻ đẹp của sự tinh tế - từ những trang sách đầy tri thức, những tư thế yoga uyển chuyển đến bàn tay khéo léo nấu nên những bữa ăn ấm áp tình thương. Trong trái tim Lợi, Lâm là mùa xuân vĩnh cửu - người phụ nữ dịu dàng nhưng mạnh mẽ, ấm áp và luôn biết cách chạm đến những góc khuất đẹp đẽ nhất trong tâm hồn.",
    groomDescription:
      "Xuân Lợi - chàng kiến trúc sư của những ước mơ và hạnh phúc. Với đôi bàn tay kiến tạo nên không gian sống và trái tim ấm áp xây nên tổ ấm, Lợi mang trong mình sự sáng tạo của nghệ thuật và sự vững chãi của tình yêu. Anh không chỉ nhìn thấy vẻ đẹp qua ống kính máy ảnh mà còn cảm nhận được vẻ đẹp trong từng khoảnh khắc đời thường. Trong mắt Lâm, Lợi là bến bờ an yên - người đàn ông luôn biết lắng nghe bằng cả trái tim, che chở bằng cả tâm hồn và yêu thương bằng cả cuộc đời.",
    ourStory: `Giữa dòng đời hối hả, có những cuộc gặp gỡ được sắp đặt bởi số phận...

Mùa xuân năm 2022, tại triển lãm "Không Gian Và Cảm Xúc", bức tranh "Ánh Sáng Cuối Ngày" đã trở thành nhịp cầu đưa hai tâm hồn đồng điệu đến với nhau. Một kiến trúc sư trẻ đam mê cái đẹp và một dược sĩ yêu nghệ thuật - họ tìm thấy nhau qua những chia sẻ về ánh sáng, về những xúc cảm tinh khôi nhất.

Hà Nội những ngày tháng tư với hoa ban trắng tinh khôi chứng kiến bước chân đầu tiên của tình yêu. Những buổi chiều dạo bước qua phố cổ, những sớm mai bên hồ Gươm trong làn sương mỏng, những câu chuyện khuya bên tách cà phê ấm - tất cả đã viết nên bản tình ca nhẹ nhàng mà sâu lắng.

Rồi Đà Lạt - thành phố sương mù - trở thành chứng nhân cho lời hứa trọn đời. Dưới ánh trăng vàng lãng mạn bên hồ Xuân Hương, giữa tiếng thông reo và hương hoa dạ lý tỏa ngát, lời cầu hôn được thốt lên trong sự run rẩy hạnh phúc...

Hai năm - 730 ngày yêu thương - là hành trình chúng tôi cùng nhau vun đắp, thấu hiểu và trân trọng từng khoảnh khắc bên nhau. Mỗi ngày qua đi, tình yêu lại thêm đong đầy, như mùa xuân cứ thế nảy lộc đâm chồi.

Và hôm nay, ngày đầu tiên của năm 2026 - khi đất trời giao mùa, khi xuân về mang theo bao hi vọng - chúng tôi nắm chặt tay nhau, bước vào hành trình mới với tình yêu được nâng niu như bảo vật và hạnh phúc được vun đắp bằng cả trái tim.

Cảm ơn cuộc đời đã cho chúng tôi tìm thấy nhau. Cảm ơn tất cả những người thân yêu đã trở thành những ngôi sao sáng trên hành trình yêu thương của chúng tôi!`,
    weddingDate: new Date("2026-01-01"),
    heroImage: "/attached_assets/wedding_images/background/anhnen.jpg",
  });
  console.log("✅ Created couple info with beautiful love story");

  // Create schedule events
  const events = [
    {
      title: "Lễ Ăn Hỏi",
      description: "Nghi thức quan trọng đánh dấu sự hứa hôn chính thức giữa hai gia đình. Nhà trai mang tráp lễ đến nhà gái trong không khí ấm cúng, trang trọng với sự chứng kiến của hai họ.",
      eventTime: new Date("2025-12-28T09:00:00"),
      location: "Nhà Gái - 88 Phố Huế, Hai Bà Trưng, Hà Nội",
      icon: "gift",
      order: 1
    },
    {
      title: "Lễ Xin Dâu",
      description: "Đoàn đại diện nhà trai do mẹ chú rể dẫn đầu mang lễ vật sang nhà gái xin phép được rước dâu về. Nghi thức thể hiện sự tôn trọng và thiện chí của nhà trai.",
      eventTime: new Date("2026-01-01T07:00:00"),
      location: "Nhà Gái - 88 Phố Huế, Hai Bà Trưng, Hà Nội", 
      icon: "heart",
      order: 2
    },
    {
      title: "Lễ Rước Dâu & Vu Quy",
      description: "Đoàn rước dâu trang trọng đến nhà gái đón cô dâu. Cô dâu chú rể làm lễ gia tiên, tạ ơn tổ tiên và xin phép ông bà, cha mẹ trước khi về nhà chồng - khoảnh khắc thiêng liêng đánh dấu sự chuyển giao.",
      eventTime: new Date("2026-01-01T08:30:00"),
      location: "Nhà Gái - 88 Phố Huế, Hai Bà Trưng, Hà Nội",
      icon: "users",
      order: 3
    },
    {
      title: "Rước Dâu Về Nhà Trai",
      description: "Đoàn xe hoa rước dâu từ nhà gái về nhà trai trong niềm hân hoan và những lời chúc phúc. Hành trình bắt đầu cho cuộc sống mới của cô dâu.",
      eventTime: new Date("2026-01-01T10:00:00"),
      location: "Từ nhà gái đến 156 Nguyễn Lương Bằng, Đống Đa, Hà Nội",
      icon: "car",
      order: 4
    },
    {
      title: "Lễ Thành Hôn & Gia Tiên",
      description: "Nghi thức trọng thể tại nhà trai - cô dâu chú rể làm lễ ra mắt tổ tiên, chính thức trở thành thành viên của gia đình nhà chồng. Khoảnh khắc thiêng liêng đánh dấu sự kết nối giữa hai dòng họ.",
      eventTime: new Date("2026-01-01T11:00:00"),
      location: "Nhà Trai - 156 Nguyễn Lương Bằng, Đống Đa, Hà Nội",
      icon: "home",
      order: 5
    },
    {
      title: "Tiệc Cưới Chung Vui",
      description: "Buổi tiệc trọng thể chiêu đãi các vị khách quý, bạn bè và người thân đến chung vui cùng gia đình. Không khí ấm cúng với những lời chúc phúc, những ly rượu mừng và những tiết mục văn nghệ đặc sắc.",
      eventTime: new Date("2026-01-01T17:00:00"),
      location: "Khách Sạn Đào Hùng - 10 Nguyễn Huệ, TT. Lao Bảo, Hướng Hóa, Quảng Trị",
      icon: "glass",
      order: 6
    },
    {
      title: "Văn Nghệ & Giao Lưu",
      description: "Đêm hội của những tiếng cười và niềm vui với các tiết mục văn nghệ đặc sắc, trò chơi giao lưu hấp dẫn và những điều bất ngờ thú vị dành cho các vị khách mời.",
      eventTime: new Date("2026-01-01T19:00:00"),
      location: "Khách Sạn Đào Hùng - 10 Nguyễn Huệ, TT. Lao Bảo, Hướng Hóa, Quảng Trị",
      icon: "music",
      order: 7
    }
  ];
  for (const event of events) {
    await storage.createScheduleEvent(event);
  }
  console.log(`✅ Created ${events.length} schedule events`);

  // Create photos
  const photos = [
    {
      url: "/attached_assets/wedding_images/album/1.jpg",
      caption: "Khoảnh khắc ngọt ngào của đôi uyên ương",
      category: "pre-wedding",
      order: 1,
    },
    {
      url: "/attached_assets/wedding_images/album/2.jpg",
      caption: "Nụ cười rạng rỡ trong ngày trọng đại",
      category: "engagement",
      order: 2,
    },
    {
      url: "/attached_assets/wedding_images/album/3.jpg",
      caption: "Tình yêu vượt thời gian",
      category: "ceremony",
      order: 3,
    },
    {
      url: "/attached_assets/wedding_images/album/4.jpg",
      caption: "Xuân Lâm & Xuân Lợi - Một tình yêu đẹp như mơ",
      category: "wedding",
      order: 4,
    },
    {
      url: "/attached_assets/wedding_images/album/5.jpg",
      caption: "Kỷ niệm khó quên bên nhau",
      category: "portrait",
      order: 5,
    },
    {
      url: "/attached_assets/wedding_images/album/6.jpg",
      caption: "Hạnh phúc tràn ngập trong từng khoảnh khắc",
      category: "portrait",
      order: 6,
    },
  ];
  for (const photo of photos) {
    await storage.createPhoto(photo);
  }
  console.log(`✅ Created ${photos.length} photos`);

  // Create guest messages
  const messages = [
    {
      guestName: "Trần Minh Tuấn",
      message:
        "Chúc hai bạn trăm năm hạnh phúc, sớm có tin vui! Mãi bên nhau nhé!",
      approved: true,
    },
    {
      guestName: "Nguyễn Thu Hương",
      message:
        "Chúc mừng đám cưới Lâm và Lợi! Mãi bên nhau hạnh phúc, yêu thương nhau nhiều hơn mỗi ngày!",
      approved: true,
    },
    {
      guestName: "Lê Văn Hải",
      message:
        "Chúc hai bạn luôn yêu thương, thấu hiểu và hỗ trợ nhau trong mọi hoàn cảnh!",
      approved: true,
    },
    {
      guestName: "Phạm Thị Lan",
      message:
        "Chúc cho tình yêu của hai bạn mãi xanh tươi như thuở ban đầu, hạnh phúc trọn đời!",
      approved: true,
    },
    {
      guestName: "Hoàng Minh Đức",
      message:
        "Hạnh phúc lắm nha! Chúc mừng Lâm và Lợi có một đám cưới thật ý nghĩa!",
      approved: true,
    },
    {
      guestName: "Vũ Thị Mai",
      message:
        "Chúc hai bạn sớm có thiên thần nhỏ xinh đẹp, gia đình hạnh phúc!",
      approved: true,
    },
    {
      guestName: "Đỗ Thanh Tùng",
      message: "Chúc mừng cặp đôi trai tài gái sắc! Mãi yêu và hạnh phúc!",
      approved: true,
    },
    {
      guestName: "Trần Thị Kim Anh",
      message:
        "Chúc hai bạn sống trong hạnh phúc trọn vẹn, cùng nhau xây dựng tổ ấm đong đầy yêu thương!",
      approved: true,
    },
    {
      guestName: "Nguyễn Văn Phong",
      message:
        "Thay mặt gia đình, chúc hai con luôn đồng lòng, sẻ chia và hạnh phúc bên nhau suốt đời!",
      approved: true,
    },
    {
      guestName: "Lý Thị Bích",
      message:
        "Chúc mừng hôn lễ! Mong rằng tình yêu của hai bạn sẽ ngày càng thắm thiết, gắn bó keo sơn!",
      approved: true,
    },
    {
      guestName: "Vương Quốc Bảo",
      message:
        "Hôm nay là ngày trọng đại nhất của hai bạn! Chúc các bạn mãi mãi hạnh phúc và thành công trong cuộc sống!",
      approved: true,
    },
    {
      guestName: "Đinh Thùy Linh",
      message:
        "Chúc hai bạn có một cuộc sống hôn nhân ngập tràn tiếng cười và những khoảnh khắc đáng nhớ!",
      approved: true,
    },
    {
      guestName: "Mai Phương Thảo",
      message:
        "Từ nay đã có nhau, chúc hai bạn cùng nhau vượt qua mọi thử thách và viết nên câu chuyện tình yêu đẹp nhất!",
      approved: true,
    },
    {
      guestName: "Bùi Đức Mạnh",
      message:
        "Chúc mừng đám cưới! Mong rằng mái ấm của hai bạn luôn ấm áp, hạnh phúc và tràn ngập yêu thương!",
      approved: true,
    },
    {
      guestName: "Cao Thanh Nhàn",
      message:
        "Chúc hai bạn luôn giữ được ngọn lửa tình yêu như thuở ban đầu, cùng nhau đi đến hết cuộc đời!",
      approved: true,
    },
    {
      guestName: "Phan Đình Tuấn",
      message:
        "Thật hạnh phúc khi chứng kiến ngày trọng đại của hai bạn! Chúc các bạn mãi mãi bên nhau!",
      approved: true,
    },
    {
      guestName: "Lâm Thị Ngọc",
      message:
        "Chúc mừng cô dâu chú rể! Mong rằng cuộc sống hôn nhân của hai bạn sẽ là chuỗi ngày hạnh phúc nhất!",
      approved: true,
    },
    {
      guestName: "Trịnh Gia Huy",
      message:
        "Hạnh phúc không phải là đích đến mà là hành trình. Chúc hai bạn có hành trình thật tuyệt vời bên nhau!",
      approved: true,
    },
    {
      guestName: "Ngô Hoàng Nam",
      message:
        "Chúc hai bạn luôn là điểm tựa vững chắc cho nhau, cùng nhau xây đắp tổ ấm hạnh phúc!",
      approved: true,
    },
    {
      guestName: "Đặng Thị Quỳnh",
      message:
        "Ngày hôm nay thật ý nghĩa! Chúc tình yêu của hai bạn mãi mãi bền chặt, cuộc sống hôn nhân viên mãn!",
      approved: true,
    },
    {
      guestName: "Hồ Sỹ Kiên",
      message:
        "Chúc mừng lễ thành hôn! Mong rằng hai bạn sẽ luôn đồng hành cùng nhau trên mọi nẻo đường đời!",
      approved: true,
    },
    {
      guestName: "Dương Minh Trí",
      message:
        "Chúc hai bạn có một cuộc sống hôn nhân ngọt ngào, luôn thấu hiểu và tôn trọng lẫn nhau!",
      approved: true,
    },
    {
      guestName: "Tô Thị Hồng",
      message:
        "Thật vui khi thấy hai bạn tìm được bến đỗ của cuộc đời! Chúc các bạn trăm năm hạnh phúc!",
      approved: true,
    },
    {
      guestName: "Lưu Đức Thành",
      message:
        "Chúc mừng đám cưới! Mong rằng tình yêu của hai bạn sẽ là bài học đẹp về sự chung thủy và sẻ chia!",
      approved: true,
    },
    {
      guestName: "Võ Thị Hà",
      message:
        "Chúc hai bạn luôn giữ được nụ cười trên môi, hạnh phúc trong tim và thành công trong sự nghiệp!",
      approved: true,
    },
    {
      guestName: "Chu Văn Đạt",
      message:
        "Hôm nay trời trong nắng đẹp, chúc cho tình yêu của hai bạn cũng tươi sáng và bền vững như thế!",
      approved: true,
    },
    {
      guestName: "Triệu Thị Nga",
      message:
        "Chúc mừng cặp đôi hoàn hảo! Mong rằng cuộc sống hôn nhân sẽ mang đến cho hai bạn nhiều điều kỳ diệu!",
      approved: true,
    },
    {
      guestName: "Huỳnh Văn Tài",
      message:
        "Chúc hai bạn luôn biết lắng nghe, thấu hiểu và yêu thương nhau nhiều hơn mỗi ngày!",
      approved: true,
    },
    {
      guestName: "Phùng Thị Thu",
      message:
        "Thay mặt bạn bè, chúc hai bạn có một cuộc sống hôn nhân viên mãn, luôn đồng lòng vun đắp hạnh phúc!",
      approved: true,
    },
    {
      guestName: "Nguyễn Đức Anh",
      message:
        "Chúc mừng ngày trọng đại! Mong rằng tình yêu của hai bạn sẽ mãi mãi là nguồn động lực lớn lao!",
      approved: true,
    },
  ];
  for (const message of messages) {
    await storage.createGuestMessage(message);
  }
  console.log(`✅ Created ${messages.length} guest messages`);

  // Create RSVPs
  const rsvps = [
    {
      guestName: "Nguyễn Văn Anh",
      email: "nva@example.com",
      phone: "0901234567",
      attending: true,
      guestCount: 3,
      mealPreference: "Thuần Chay",
      specialRequirements: "Không ăn hành",
    },
    {
      guestName: "Trần Thị Bích",
      email: "ttb@example.com",
      phone: "0912345678",
      attending: true,
      guestCount: 2,
      mealPreference: "Món Mặn",
      specialRequirements: "",
    },
    {
      guestName: "Lê Hoàng Cường",
      email: "lhc@example.com",
      phone: "0923456789",
      attending: false,
      guestCount: 1,
      mealPreference: "Tùy Chọn",
      specialRequirements: "Ăn chay",
    },
    {
      guestName: "Phạm Minh Đức",
      email: "pmd@example.com",
      phone: "0934567890",
      attending: true,
      guestCount: 4,
      mealPreference: "Hải Vị",
      specialRequirements: "Có trẻ em 2 tuổi",
    },
    {
      guestName: "Vũ Thu Hà",
      email: "vth@example.com",
      phone: "0945678901",
      attending: true,
      guestCount: 2,
      mealPreference: "Sơn Hào",
      specialRequirements: "",
    },
    {
      guestName: "Hoàng Thị Kim",
      email: "htk@example.com",
      phone: "0956789012",
      attending: true,
      guestCount: 1,
      mealPreference: "Món Mặn",
      specialRequirements: "Dị ứng hải sản",
    },
    {
      guestName: "Đỗ Văn Long",
      email: "dvl@example.com",
      phone: "0967890123",
      attending: false,
      guestCount: 2,
      mealPreference: "Tùy Chọn",
      specialRequirements: "Đi công tác nước ngoài",
    },
    {
      guestName: "Bùi Thị Mai",
      email: "btm@example.com",
      phone: "0978901234",
      attending: true,
      guestCount: 3,
      mealPreference: "Thuần Chay",
      specialRequirements: "Không đường, không muối",
    },
    {
      guestName: "Nguyễn Quang Minh",
      email: "nqm@example.com",
      phone: "0989012345",
      attending: true,
      guestCount: 2,
      mealPreference: "Hải Vị",
      specialRequirements: "",
    },
    {
      guestName: "Trần Văn Nam",
      email: "tvn@example.com",
      phone: "0990123456",
      attending: true,
      guestCount: 5,
      mealPreference: "Sơn Hào",
      specialRequirements: "Có người già, cần chỗ ngồi thoải mái",
    },
    {
      guestName: "Lê Thị Oanh",
      email: "lto@example.com",
      phone: "0901123456",
      attending: false,
      guestCount: 1,
      mealPreference: "Món Mặn",
      specialRequirements: "Bận đám cưới con gái",
    },
    {
      guestName: "Phạm Văn Phúc",
      email: "pvp@example.com",
      phone: "0902234567",
      attending: true,
      guestCount: 2,
      mealPreference: "Thuần Chay",
      specialRequirements: "Dị ứng đậu phộng",
    },
    {
      guestName: "Vũ Thị Quỳnh",
      email: "vtq@example.com",
      phone: "0903345678",
      attending: true,
      guestCount: 1,
      mealPreference: "Món Mặn",
      specialRequirements: "Ăn kiêng low-carb",
    },
    {
      guestName: "Hoàng Văn Sơn",
      email: "hvs@example.com",
      phone: "0904456789",
      attending: true,
      guestCount: 4,
      mealPreference: "Hải Vị",
      specialRequirements: "Có 2 trẻ em 5 và 7 tuổi",
    },
    {
      guestName: "Đặng Thị Tuyết",
      email: "dtt@example.com",
      phone: "0905567890",
      attending: false,
      guestCount: 2,
      mealPreference: "Tùy Chọn",
      specialRequirements: "Đi du lịch từ trước",
    },
    {
      guestName: "Bùi Văn Hải",
      email: "bvh@example.com",
      phone: "0906678901",
      attending: true,
      guestCount: 2,
      mealPreference: "Sơn Hào",
      specialRequirements: "Ngồi gần cửa ra vào",
    },
    {
      guestName: "Nguyễn Thị Uyên",
      email: "ntu@example.com",
      phone: "0907789012",
      attending: true,
      guestCount: 3,
      mealPreference: "Thuần Chay",
      specialRequirements: "Không sữa, không trứng",
    },
    {
      guestName: "Trần Văn Việt",
      email: "tvv@example.com",
      phone: "0908890123",
      attending: true,
      guestCount: 1,
      mealPreference: "Món Mặn",
      specialRequirements: "Wheelchair access",
    },
    {
      guestName: "Lê Thị Xuân",
      email: "ltx@example.com",
      phone: "0909901234",
      attending: false,
      guestCount: 2,
      mealPreference: "Hải Vị",
      specialRequirements: "Ốm đột xuất",
    },
    {
      guestName: "Phạm Văn Yên",
      email: "pvy@example.com",
      phone: "0900012345",
      attending: true,
      guestCount: 2,
      mealPreference: "Sơn Hào",
      specialRequirements: "Đến muộn 30 phút",
    },
    {
      guestName: "Vũ Thị Ánh",
      email: "vta@example.com",
      phone: "0901112345",
      attending: true,
      guestCount: 3,
      mealPreference: "Món Mặn",
      specialRequirements: "Có mang theo quà đặc biệt",
    },
    {
      guestName: "Hoàng Văn Bình",
      email: "hvb@example.com",
      phone: "0902223456",
      attending: true,
      guestCount: 1,
      mealPreference: "Thuần Chay",
      specialRequirements: "Không ăn nấm",
    },
    {
      guestName: "Đỗ Thị Cẩm",
      email: "dtc@example.com",
      phone: "0903334567",
      attending: false,
      guestCount: 2,
      mealPreference: "Tùy Chọn",
      specialRequirements: "Chuyển nhà đúng ngày",
    },
    {
      guestName: "Nguyễn Văn Dũng",
      email: "nvd@example.com",
      phone: "0904445678",
      attending: true,
      guestCount: 4,
      mealPreference: "Hải Vị",
      specialRequirements: "Ngồi cùng bàn với gia đình Nguyễn Văn Anh",
    },
    {
      guestName: "Trần Thị E-mail",
      email: "tte@example.com",
      phone: "0905556789",
      attending: true,
      guestCount: 2,
      mealPreference: "Sơn Hào",
      specialRequirements: "Chụp ảnh cùng cô dâu chú rể",
    },
    {
      guestName: "Lê Văn Phong",
      email: "lvp@example.com",
      phone: "0906667890",
      attending: true,
      guestCount: 1,
      mealPreference: "Món Mặn",
      specialRequirements: "Dị ứng gluten",
    },
    {
      guestName: "Phạm Thị Gia",
      email: "ptg@example.com",
      phone: "0907778901",
      attending: false,
      guestCount: 3,
      mealPreference: "Thuần Chay",
      specialRequirements: "Đi thăm người thân ở xa",
    },
    {
      guestName: "Vũ Văn Hùng",
      email: "vvh@example.com",
      phone: "0908889012",
      attending: true,
      guestCount: 2,
      mealPreference: "Hải Vị",
      specialRequirements: "Cần chỗ đậu xe ô tô",
    },
    {
      guestName: "Hoàng Thị I-ren",
      email: "hti@example.com",
      phone: "0909990123",
      attending: true,
      guestCount: 5,
      mealPreference: "Sơn Hào",
      specialRequirements: "Có tổ chức tiết mục văn nghệ",
    },
    {
      guestName: "Đặng Văn Khoa",
      email: "dvk@example.com",
      phone: "0900001234",
      attending: true,
      guestCount: 2,
      mealPreference: "Món Mặn",
      specialRequirements: "Đến sớm giúp trang trí",
    },
  ];
  for (const rsvp of rsvps) {
    await storage.createRsvp(rsvp);
  }
  console.log(`✅ Created ${rsvps.length} RSVPs`);

  // Create wedding party members
  const weddingParty = [
    {
      name: "Nguyễn Thanh Tâm",
      role: "Phù Dâu",
      description:
        "Bạn thân từ thời cấp 2 của cô dâu, luôn đồng hành trong mọi khoảnh khắc",
      photoUrl: "/attached_assets/wedding_images/bridesmaids/1.jpg",
      order: 1,
    },
    {
      name: "Trần Hồng Nhung",
      role: "Phù Dâu",
      description: "Chị em họ thân thiết của cô dâu, người chị luôn yêu thương",
      photoUrl: "/attached_assets/wedding_images/bridesmaids/2.jpg",
      order: 2,
    },
    {
      name: "Lê Thị Mai",
      role: "Phù Dâu",
      description: "Bạn học cùng lớp đại học, cùng chia sẻ bao kỷ niệm đẹp",
      photoUrl: "/attached_assets/wedding_images/bridesmaids/3.jpeg",
      order: 3,
    },
    {
      name: "Phạm Quốc Tuấn",
      role: "Phù Rể",
      description: "Bạn thân từ thuở nhỏ của chú rể, anh em tâm giao",
      photoUrl: "/attached_assets/wedding_images/groomsmen/1.jpg",
      order: 4,
    },
    {
      name: "Vũ Minh Quân",
      role: "Phù Rể",
      description: "Đồng nghiệp thân thiết của chú rể tại công ty kiến trúc",
      photoUrl: "/attached_assets/wedding_images/groomsmen/2.jpg",
      order: 5,
    },
    {
      name: "Hoàng Văn Nam",
      role: "Phù Rể",
      description: "Bạn cùng phòng thời đại học, cùng trải qua bao kỷ niệm",
      photoUrl: "/attached_assets/wedding_images/groomsmen/3.jpg",
      order: 6,
    },
  ];
  for (const member of weddingParty) {
    await storage.createWeddingPartyMember(member);
  }
  console.log(`✅ Created ${weddingParty.length} wedding party members`);

  // Create settings with bank transfer info
  await storage.upsertSettings({
    venueName: "Khách Sạn Đào Hùng",
    venueAddress:
      "10 Nguyễn Huệ, TT. Lao Bảo, Hướng Hóa, Quảng Trị, Việt Nam",
    venueMapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.1553600197303!2d106.59625407412312!3d16.616592524554324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3140809bf05443b1%3A0xe86ee0a4240bc9c4!2zS2jDoWNoIHPhuqFuIMSQw6BvIEjDuW5n!5e1!3m2!1sen!2s!4v1762556366374!5m2!1sen!2s",
    venuePhone: "+84 (02) 333 877 777",
    venueEmail: "khachsandaohung@gmail.com",
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
    brideBankInfo:
      "Ngân hàng Vietcombank\nChi nhánh Hà Nội\nSTK: 0123456789\nChủ TK: Nguyễn Xuân Lâm",
    groomBankInfo:
      "Ngân hàng Techcombank\nChi nhánh Đống Đa\nSTK: 9876543210\nChủ TK: Trần Xuân Lợi",
    // Footer info
    footerText:
      "Cảm ơn bạn đã đến chung vui cùng chúng tôi trong ngày trọng đại!",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    hashtag: "#XuânLâmXuânLợi2026",
  });
  console.log("✅ Created settings");

  // Create popups
  const popups = [
    {
      type: "welcome",
      imageUrl: "/attached_assets/wedding_images/popup/dautrang.gif",
      isActive: true,
      title: "",
      description: "",
    },
    {
      type: "scroll_end",
      imageUrl: "/attached_assets/wedding_images/popup/cuoitrang.gif",
      isActive: true,
      title: "",
      description: "",
    },
  ];
  for (const popup of popups) {
    await storage.createPopup(popup);
  }
  console.log(`✅ Created ${popups.length} popups`);

  // Create music track for Beautiful in white
  await storage.createMusicTrack({
    title: "Beautiful in White",
    filename: "/attached_assets/wedding_music/Beautiful in white.mp3",
    artist: "Shane Filan",
    duration: 240, // 4 minutes approx
    displayOrder: 1,
    isActive: true,
  });
  console.log("✅ Created music track: Beautiful in White");

  // Create guest photos (sample data - need actual photos uploaded by guests)
  const guestPhotoSamples = [
    {
      url: "https://congstudio.vn/wp-content/uploads/2022/04/chup-anh-phong-su-an-hoi-ngay-cuoi-15-scaled.jpg",
      caption: "Khoảnh khắc đẹp trong tiệc!",
      guestName: "Nguyễn Anh",
      approved: true,
    },
    {
      url: "https://7799wedding.vn/data/media/2458/images/trang-tri-backdrop-chup-hinh-dam-cuoi%20(1).jpg",
      caption: "Cô dâu chú rể xinh đẹp quá!",
      guestName: "Trần Bình",
      approved: true,
    },
    {
      url: "https://7799wedding.vn/data/media/2458/images/trang-tri-backdrop-chup-hinh-dam-cuoi%20(1).jpg",
      caption: "Cô dâu chú rể xinh đẹp quá!",
      guestName: "Trần Bình",
      approved: true,
    },
    {
      url: "https://7799wedding.vn/data/media/2458/images/trang-tri-backdrop-chup-hinh-dam-cuoi%20(1).jpg",
      caption: "Cô dâu chú rể xinh đẹp quá!",
      guestName: "Trần Bình",
      approved: true,
    },
    {
      url: "https://7799wedding.vn/data/media/2458/images/trang-tri-backdrop-chup-hinh-dam-cuoi%20(1).jpg",
      caption: "Cô dâu chú rể xinh đẹp quá!",
      guestName: "Trần Bình",
      approved: true,
    },
    {
      url: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/10/21/1107804/Phuong-Nga.jpg",
      caption: "Ảnh chụp cùng cặp đôi",
      guestName: "Lê Cường",
      approved: true,
    },
  ];
  for (const photo of guestPhotoSamples) {
    await storage.createGuestPhoto(photo);
  }
  console.log(`✅ Created ${guestPhotoSamples.length} guest photo samples`);

  // Create livestream info
  await storage.upsertLivestreamInfo({
    isActive: true,
    platform: "youtube",
    streamUrl: "https://www.youtube.com/watch?v=cHM6gNx32NM",
    streamTitle: "Trực Tiếp Đám Cưới",
    streamDescription:
      "Theo dõi trực tiếp lễ cưới của chúng tôi! Buổi lễ sẽ bắt đầu lúc 17:00 ngày 01/01/2026.",
    startTime: new Date("2025-01-01T17:00:00"),
    endTime: new Date("2027-01-01T21:00:00"),
    thumbnailUrl: "/attached_assets/wedding_images/background/anhnen.jpg",
    chatEnabled: true,
  });
  console.log("✅ Created livestream info");

  console.log("🎉 Database seeding completed successfully!");
  console.log("========THANK YOU========");
}

seed().catch(console.error);
