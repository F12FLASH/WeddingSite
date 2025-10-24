-- Wedding Website Database Backup - Version 2.0
-- Generated: 2025-01-15T14:30:45.123Z
-- Database: PostgreSQL (Neon)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Data for table couple_info
TRUNCATE TABLE couple_info CASCADE;
INSERT INTO couple_info (id, bride_name, groom_name, bride_photo, groom_photo, our_story, wedding_date, hero_image, created_at, updated_at) VALUES 
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Phạm Minh Anh', 'Lê Quang Huy', '/assets/images/bride-portrait-2025.jpg', '/assets/images/groom-portrait-2025.jpg', 'Chúng tôi gặp nhau trong chuyến du lịch Đà Lạt năm 2022. Trong sương mù và những đồi thông bất tận, tình yêu đã nảy nở từ những buổi sáng cùng nhau ngắm bình minh và những tối dạo bước dưới ánh đèn đường cổ kính. Sau 2 năm với vô vàn kỷ niệm đẹp, chúng tôi quyết định cùng nhau viết tiếp câu chuyện tình yêu này.', '2025-08-20T00:00:00.000Z', '/assets/images/hero-banner-2025.jpg', '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z');

-- Data for table schedule_events
TRUNCATE TABLE schedule_events CASCADE;
INSERT INTO schedule_events (id, title, description, event_time, location, icon, order, created_at, updated_at) VALUES 
('event-001', 'Lễ Rước Dâu', 'Lễ rước dâu truyền thống tại nhà cô dâu', '2025-08-20T07:00:00.000Z', 'Nhà cô dâu - 45 Nguyễn Du, Quận 1, TP.HCM', 'heart', 1, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('event-002', 'Lễ Thành Hôn', 'Lễ thành hôn trang trọng tại nhà thờ', '2025-08-20T09:30:00.000Z', 'Nhà thờ Tân Định - 289 Hai Bà Trưng, Quận 3, TP.HCM', 'church', 2, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('event-003', 'Chụp Ảnh Cưới', 'Chụp ảnh kỷ niệm với gia đình và bạn bè', '2025-08-20T11:00:00.000Z', 'Công viên Tao Đàn - 55B Nguyễn Thị Minh Khai, Quận 1', 'camera', 3, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('event-004', 'Tiệc Chiêu Đãi', 'Tiệc cưới chính thức và chúc mừng', '2025-08-20T18:00:00.000Z', 'Gem Center - 8 Nguyễn Bỉnh Khiêm, Quận 1, TP.HCM', 'glass', 4, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('event-005', 'Vũ Hội', 'Khiêu vũ và các tiết mục văn nghệ đặc sắc', '2025-08-20T20:30:00.000Z', 'Sảnh chính Gem Center', 'music', 5, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z');

-- Data for table photos
TRUNCATE TABLE photos CASCADE;
INSERT INTO photos (id, url, caption, category, order, created_at, updated_at) VALUES 
('photo-001', '/assets/gallery/pre-wedding-1.jpg', 'Pre-wedding tại Đà Lạt', 'pre-wedding', 1, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('photo-002', '/assets/gallery/pre-wedding-2.jpg', 'Dạo bước trong sương', 'pre-wedding', 2, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('photo-003', '/assets/gallery/engagement-1.jpg', 'Khoảnh khắc cầu hôn', 'engagement', 3, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('photo-004', '/assets/gallery/couple-1.jpg', 'Tình yêu và nụ cười', 'couple', 4, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('photo-005', '/assets/gallery/couple-2.jpg', 'Cùng nhau khám phá thế giới', 'couple', 5, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('photo-006', '/assets/gallery/bride-1.jpg', 'Cô dâu rạng rỡ', 'portrait', 6, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('photo-007', '/assets/gallery/groom-1.jpg', 'Chú rể lịch lãm', 'portrait', 7, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z');

-- Data for table guest_messages
TRUNCATE TABLE guest_messages CASCADE;
INSERT INTO guest_messages (id, guest_name, message, approved, created_at) VALUES 
('msg-001', 'Nguyễn Thị Thu Hà', 'Chúc hai em trăm năm hạnh phúc! Tình yêu của các em thật đẹp và xứng đáng được trân trọng.', true, '2025-01-15T14:25:30.000Z'),
('msg-002', 'Trần Văn Đức', 'Mình là bạn đại học của Huy. Thật vui khi thấy cậu tìm được người bạn đời tuyệt vời! Chúc mừng cậu!', true, '2025-01-15T14:25:30.000Z'),
('msg-003', 'Lê Thị Mai Anh', 'Chị gái yêu quý của em! Chúc em và anh Huy luôn hạnh phúc, yêu thương và cùng nhau vượt qua mọi thử thách.', true, '2025-01-15T14:25:30.000Z'),
('msg-004', 'Phạm Quang Minh', 'Chúc mừng đám cưới! Hy vọng các bạn sẽ có một cuộc sống hôn nhân viên mãn và tràn đầy tiếng cười.', true, '2025-01-15T14:25:30.000Z'),
('msg-005', 'Hoàng Thị Ngọc', 'Thật hạnh phúc khi được chứng kiến tình yêu của hai bạn! Chúc các bạn mãi mãi bên nhau.', true, '2025-01-15T14:25:30.000Z'),
('msg-006', 'Vũ Mạnh Cường', 'Chúc hai bạn có một khởi đầu mới thật hạnh phúc!', false, '2025-01-15T14:25:30.000Z');

-- Data for table rsvps
TRUNCATE TABLE rsvps CASCADE;
INSERT INTO rsvps (id, guest_name, email, phone, attending, guest_count, meal_preference, special_requirements, created_at) VALUES 
('rsvp-001', 'Nguyễn Văn Nam', 'nam.nguyen@email.com', '0912345678', true, 2, 'beef', 'Không có yêu cầu đặc biệt', '2025-01-15T14:25:30.000Z'),
('rsvp-002', 'Trần Thị Lan', 'lan.tran@email.com', '0987654321', true, 1, 'vegetarian', 'Ăn chay trường', '2025-01-15T14:25:30.000Z'),
('rsvp-003', 'Lê Văn Tùng', 'tung.le@email.com', '0923456789', true, 3, 'chicken', 'Có 1 trẻ em 5 tuổi', '2025-01-15T14:25:30.000Z'),
('rsvp-004', 'Phạm Thị Hương', 'huong.pham@email.com', '0934567890', false, 0, 'none', 'Xin lỗi không thể tham dự', '2025-01-15T14:25:30.000Z'),
('rsvp-005', 'Hoàng Văn Bình', 'binh.hoang@email.com', '0945678901', true, 2, 'fish', 'Dị ứng hải sản có vỏ', '2025-01-15T14:25:30.000Z');

-- Data for table registry_items
TRUNCATE TABLE registry_items CASCADE;
INSERT INTO registry_items (id, name, description, price, image_url, purchase_url, is_purchased, order, created_at, updated_at) VALUES 
('gift-001', 'Máy Lọc Không Khí', 'Máy lọc không khí thông minh Xiaomi', 3500000, '/assets/gifts/air-purifier.jpg', 'https://example.com/gift1', false, 1, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('gift-002', 'Bộ Nồi Inox Cao Cấp', 'Bộ nồi inox 7 món của Elmich', 2800000, '/assets/gifts/cookware-set.jpg', 'https://example.com/gift2', false, 2, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('gift-003', 'Máy Pha Cà Phê', 'Máy pha cà phê tự động Philips', 6500000, '/assets/gifts/coffee-maker.jpg', 'https://example.com/gift3', true, 3, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('gift-004', 'Bộ Khăn Tắm Cao Cấp', 'Bộ khăn tắm cotton 6 món', 1200000, '/assets/gifts/towel-set.jpg', 'https://example.com/gift4', false, 4, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('gift-005', 'Voucher Du Lịch', 'Voucher nghỉ dưỡng 3 ngày 2 đêm', 5000000, '/assets/gifts/travel-voucher.jpg', 'https://example.com/gift5', false, 5, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('gift-006', 'Máy Xay Sinh Tố', 'Máy xay sinh tố đa năng Panasonic', 1800000, '/assets/gifts/blender.jpg', 'https://example.com/gift6', false, 6, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z');

-- Data for table settings
TRUNCATE TABLE settings CASCADE;
INSERT INTO settings (id, venue_name, venue_address, venue_map_link, background_music_url, background_music_type, updated_at) VALUES 
('setting-001', 'Gem Center Conference', '8 Nguyễn Bỉnh Khiêm, Quận 1, TP.HCM', 'https://maps.google.com/?q=Gem+Center+Conference+Ho+Chi+Minh+City', 'https://example.com/background-music.mp3', 'mp3', '2025-01-15T14:25:30.000Z');

-- Data for table wedding_party (NEW TABLE)
TRUNCATE TABLE wedding_party CASCADE;
INSERT INTO wedding_party (id, name, role, description, photo_url, order, created_at, updated_at) VALUES 
('party-001', 'Nguyễn Thị Mai', 'Phù dâu chính', 'Em gái của cô dâu - Người bạn thân nhất', '/assets/wedding-party/maid-of-honor.jpg', 1, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('party-002', 'Trần Văn Bảo', 'Phù rể chính', 'Bạn thân từ thời đại học của chú rể', '/assets/wedding-party/best-man.jpg', 2, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('party-003', 'Lê Thị Hồng', 'Phù dâu', 'Đồng nghiệp thân thiết của cô dâu', '/assets/wedding-party/bridesmaid-1.jpg', 3, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('party-004', 'Phạm Quang Huy', 'Phù rể', 'An em họ của chú rể', '/assets/wedding-party/groomsman-1.jpg', 4, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z');

-- Data for table faqs (NEW TABLE)
TRUNCATE TABLE faqs CASCADE;
INSERT INTO faqs (id, question, answer, order, created_at, updated_at) VALUES 
('faq-001', 'Tôi nên mặc trang phục gì cho đám cưới?', 'Chúng tôi mong muốn khách mời mặc trang phục lịch sự. Màu chủ đạo của đám cưới là hồng pastel và trắng.', 1, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('faq-002', 'Có chỗ đậu xe cho khách mời không?', 'Có, khách sạn có bãi đậu xe miễn phí cho khách mời. Vui lòng báo trước nếu bạn cần đậu xe.', 2, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('faq-003', 'Tôi có thể mang theo trẻ em không?', 'Chắc chắn rồi! Trẻ em rất được chào đón. Vui lòng thông báo số lượng trẻ em khi RSVP.', 3, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z'),
('faq-004', 'Làm thế nào để gửi lời chúc mừng?', 'Bạn có thể gửi lời chúc mừng trực tiếp trên website này hoặc gửi qua email: wedding.minhanhquanghuy@email.com', 4, '2025-01-15T14:25:30.000Z', '2025-01-15T14:25:30.000Z');

-- Backup completed: 2025-01-15T14:30:45.123Z