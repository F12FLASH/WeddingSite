# 💍 Website Đám Cưới Chuyên Nghiệp

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

**🎊 Hệ thống quản lý đám cưới toàn diện - Trao trọn yêu thương, ghi trọn khoảnh khắc 🎊**

[🌟 Tính Năng](#-tính-năng-nổi-bật) • [🚀 Cài Đặt](#-cài-đặt-nhanh) • [📱 Sử Dụng](#-hướng-dẫn-sử-dụng) • [🌐 Triển Khai](#-triển-khai-production)

</div>

---

## ✨ Lời Mở Đầu

Trong hành trình hạnh phúc của đời mình, mỗi khoảnh khắc đều xứng đáng được lưu giữ trọn vẹn. **Website Đám Cưới** ra đời như một người bạn đồng hành tin cậy, giúp bạn:

- 📧 **Gửi đi những lời mời đặc biệt** - Thiệp mời sống động, chuyên nghiệp
- 👥 **Kết nối mọi người thân yêu** - Dù ở xa hay gần
- 📸 **Lưu giữ trọn vẹn kỷ niệm** - Ảnh, lời chúc, khoảnh khắc
- 🎥 **Chia sẻ hạnh phúc trực tiếp** - Livestream cho người không thể đến

> "Tình yêu không cần phô trương, nhưng xứng đáng được ghi nhớ theo cách đẹp nhất"

---

## 🎨 Tính Năng Nổi Bật

### 💫 Trải Nghiệm Người Dùng
| Tính Năng | Mô Tả | Lợi Ích |
|-----------|--------|----------|
| **🎭 Loading 3D** | Hiệu ứng particles sống động | Ấn tượng ngay từ giây đầu |
| **🌓 Dark Mode** | Tự động điều chỉnh theo ánh sáng | Bảo vệ mắt, tiết kiệm pin |
| **📱 Responsive** | Tối ưu mọi thiết bị | Trải nghiệm hoàn hảo mọi lúc |
| **🎬 Animation** | Chuyển động mượt mà | Thu hút và sang trọng |

### 👨‍👩‍👧‍👦 Quản Lý Khách Mời
```typescript
// RSVP System - Thông minh & Tiện lợi
- ✅ Xác nhận tham dự online
- 📊 Thống kê real-time
- 📤 Export danh sách CSV
- ⏰ Tự động đóng RSVP
```

### 🎵 Âm Nhạc & Giải Trí
| Tính Năng | Đặc Điểm | Hỗ Trợ |
|-----------|----------|---------|
| **🎶 Music Player** | Playlist cá nhân hóa | MP3, WAV (<10MB) |
| **📺 Livestream** | YouTube & Facebook | Auto-play thông minh |
| **🎬 Gallery 3D** | Hiệu ứng lightbox | Upload nhiều ảnh |

### 💰 Quà Tặng & Tri Ân
- **QR Code chuyển khoản** - Tiện lợi, nhanh chóng
- **Theo dõi quà mừng** - Ghi nhận đầy đủ
- **Lời cảm ơn chân thành** - Gửi đến mọi người

### 👑 Bảng Điều Khiển Admin
```typescript
// Dashboard Toàn Diện
- 📈 Thống kê trực quan (charts, stats)
- 🔔 Thông báo real-time
- 👥 Quản lý khách mời, ảnh, lời chúc
- ⚡ Xử lý nhanh, giao diện thân thiện
```

---

## 🚀 Cài Đặt Nhanh

### 📋 Điều Kiện Tiên Quyết
- **Node.js** 18.x hoặc cao hơn
- **PostgreSQL** hoặc **Neon DB** (khuyên dùng)
- **npm** hoặc **yarn**

### 🛠 5 Bước Triển Khai

```bash
# 1. Clone dự án
git clone https://github.com/F12FLASH/WeddingSite.git
cd WeddingSite

# 2. Cài đặt dependencies
npm install

# 3. Thiết lập môi trường
cp .env.example .env
# Chỉnh sửa file .env với thông tin của bạn

# 4. Khởi tạo database
npm run db:push
npx tsx server/seed.ts

# 5. Chạy ứng dụng
npm run dev
```

🎉 **Truy cập:** http://localhost:5173

---

## ⚙️ Cấu Hình Database

### 🌟 Neon DB (Miễn Phí & Khuyên Dùng)
1. **Đăng ký** tại [neon.tech](https://neon.tech)
2. **Tạo project** mới
3. **Copy Connection String**
4. **Cập nhật** `.env`:

```env
DATABASE_URL="postgresql://user:pass@ep-cool-sound-123456.us-east-2.aws.neon.tech/db?sslmode=require"
SESSION_SECRET="your-32-character-super-secret-key-here"
NODE_ENV="development"
```

### 💻 PostgreSQL Local
```bash
# Khởi tạo database
sudo -u postgres createdb wedding_db

# Cấu hình .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/wedding_db"
```

---

## 📱 Hướng Dẫn Sử Dụng

### 👑 Cho Cô Dâu & Chú Rể

#### 🎯 Thiết Lập Cơ Bản
1. **Đăng nhập Admin**: `/login` (admin/admin123)
2. **Đổi mật khẩu** ngay lập tức
3. **Cập nhật thông tin** cá nhân

#### 📝 Quản Lý Nội Dung
| Mục | Hướng Dẫn | Mẹo |
|-----|-----------|------|
| **👰‍♀️ Thông tin** | Upload ảnh, viết câu chuyện tình yêu | Dùng ảnh chất lượng cao |
| **📅 Lịch trình** | Thêm sự kiện, địa điểm, thời gian | Chi tiết rõ ràng |
| **🖼 Album ảnh** | Upload nhiều ảnh cùng lúc | Thêm caption ý nghĩa |
| **🎥 Livestream** | Paste URL YouTube/Facebook | Test trước khi event |

#### 👥 Quản Lý Khách Mời
```bash
# Quy trình RSVP thông minh
1. Khách xác nhận online
2. Hệ thống tự động thống kê
3. Export CSV để in ấn
4. Theo dõi real-time
```

### 👨‍👩‍👧‍👦 Cho Khách Mời

#### 💌 Xác Nhận Tham Dự
1. Truy cập **trang chủ**
2. Click **"Xác Nhận Tham Dự"**
3. Điền thông tin:
   - 👤 Họ tên
   - 📞 Số điện thoại  
   - 👥 Số lượng khách
   - ✅ Xác nhận tham dự

#### 🎁 Tương Tác & Chia Sẻ
| Tính Năng | Cách Dùng | Lưu ý |
|-----------|-----------|--------|
| **💝 Lời chúc** | Viết lời chúc ý nghĩa | Admin sẽ duyệt |
| **📸 Ảnh kỷ niệm** | Upload nhiều ảnh | Ảnh rõ nét |
| **🎥 Livestream** | Click "Xem trực tiếp" | Có internet |
| **🎵 Nhạc nền** | Tự động phát | Click để kích hoạt |

---

## 🌐 Triển Khai Production

### 🚀 Vercel (Dễ Dàng & Miễn Phí)

#### 📦 Chuẩn Bị
```bash
# 1. Push code lên GitHub
git init
git add .
git commit -m "✨ Khởi tạo website đám cưới"
git branch -M main
git remote add origin https://github.com/yourname/wedding.git
git push -u origin main
```

#### 🎯 Triển Khai
1. **Truy cập** [vercel.com](https://vercel.com)
2. **Đăng nhập** bằng GitHub
3. **Import Project** từ repository
4. **Thêm Environment Variables**:
   ```env
   DATABASE_URL="neon_connection_string"
   SESSION_SECRET="super-secret-production-key"
   NODE_ENV="production"
   ```
5. **Click Deploy** 🎉

#### 🗄 Database Production
```bash
# Chạy migration trên production
DATABASE_URL="your_prod_url" npm run db:push
DATABASE_URL="your_prod_url" npx tsx server/seed.ts
```

### 🖥 VPS (Cho Yêu Cầu Cao)

#### 📋 Yêu Cầu Hệ Thống
- **OS**: Ubuntu 20.04+
- **Runtime**: Node.js 18.x
- **Database**: PostgreSQL 14+
- **Web Server**: Nginx
- **Process Manager**: PM2

#### 🛠 Cài Đặt
```bash
# 1. Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# 2. Cài đặt dependencies
sudo apt install -y nodejs npm postgresql nginx

# 3. Clone project
git clone https://github.com/yourname/wedding.git
cd wedding

# 4. Build ứng dụng
npm install
npm run build

# 5. Cấu hình database
sudo -u postgres createdb wedding_prod

# 6. Khởi chạy với PM2
npm install -g pm2
pm2 start npm --name "wedding" -- start
pm2 startup
pm2 save
```

#### 🌐 Cấu Hình Nginx
```nginx
server {
    listen 80;
    server_name domain-cua-ban.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 🔒 SSL Miễn Phí
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d domain-cua-ban.com
```

---

## 🐛 Xử Lý Sự Cố

### 🔍 Các Vấn Đề Thường Gặp

| Vấn Đề | Nguyên Nhân | Giải Pháp |
|--------|-------------|-----------|
| **❌ Không kết nối database** | URL sai hoặc DB chưa chạy | Kiểm tra `.env`, khởi động PostgreSQL |
| **❌ Lỗi npm install** | Cache lỗi hoặc network | `rm -rf node_modules && npm cache clean --force` |
| **❌ Đăng nhập admin thất bại** | Session hoặc seed | Chạy lại `npx tsx server/seed.ts` |
| **❌ Nhạc không tự phát** | Browser policy | Click/scroll trang để kích hoạt |

### 🛠 Sửa Lỗi Chi Tiết

<details>
<summary><b>🖥 Windows: 'npm' không được nhận diện</b></summary>

1. Tải [Node.js](https://nodejs.org/)
2. Cài đặt với "Add to PATH"
3. Khởi động lại Command Prompt
4. Kiểm tra: `node --version`
</details>

<details>
<summary><b>📱 Mobile: Giao diện hiển thị lỗi</b></summary>

1. Clear cache trình duyệt
2. Kiểm tra responsive với Chrome DevTools
3. Đảm bảo meta viewport được thiết lập
</details>

---

## 🎨 Tùy Biến Giao Diện

### 🎨 Chủ Đề Lãng Mạn (Frontend)
```css
/* Màu sắc chủ đạo - Romantic Theme */
--primary: hsl(340 75% 58%);    /* Hồng nhẹ */
--secondary: hsl(30 85% 75%);   /* Peach ấm áp */
--accent: hsl(50 95% 70%);     /* Vàng kim loại */
--background: hsl(340 45% 98%); /* Nền hồng nhạt */
```

### 💼 Chủ Đề Chuyên Nghiệp (Admin)
```css
/* Màu sắc chuyên nghiệp */
--primary: hsl(217 91% 60%);   /* Xanh mạnh mẽ */
--sidebar: hsl(220 18% 10%);   /* Thanh điều hướng tối */
--accent: hsl(142 76% 36%);    /* Xanh lá chuyên nghiệp */
```

---

## 📊 Tối Ưu Hiệu Suất

### 🚀 Best Practices Đã Áp Dụng
- ✅ **Code Splitting** - Tải nhanh hơn
- ✅ **Lazy Loading** - Ảnh tải khi cần
- ✅ **Caching** - TanStack Query thông minh
- ✅ **Compression** - Ảnh được nén tự động
- ✅ **CDN Ready** - Sẵn sàng cho production

### 💡 Khuyến Nghị
- 🖼 **Nén ảnh** trước khi upload (dùng TinyPNG)
- 🎵 **Nhạc nhẹ** (<5MB) để tải nhanh
- 🌍 **Database gần user** (Neon auto-scaling)
- 💾 **Backup định kỳ** database

---

## 🔄 Changelog

### 🎨 **v2.1.0 - Romantic Redesign** *(08/11/2025)*
```markdown
✨ Giao Diện Lãng Mạn
- Màu sắc pastel: hồng nhẹ, peach ấm áp
- Tối ưu contrast cho accessibility
- Dark mode chuyển đổi mượt mà

🎯 Admin Chuyên Nghiệp  
- Theme xanh mạnh mẽ, sidebar tối
- Dashboard thống kê trực quan
- Data-admin-page attribute
```

### 🚀 **v2.0.0 - Major Overhaul** *(07/11/2025)*
```markdown
🎉 Navigation Redesign
- Menu căn giữa, bỏ logo
- Mobile menu tối ưu
- Active indicator mượt mà

📱 Responsive Hoàn Hảo
- Tối ưu mọi breakpoints
- Typography thông minh
- Spacing linh hoạt

🖼 Quản Lý Ảnh Nâng Cao
- Upload nhiều ảnh cùng lúc
- Bulk actions cho admin
- Pagination thông minh
```

---

## 🤝 Đóng Góp

Chúng tôi chào đón mọi đóng góp từ cộng đồng!

### 📝 Quy Trình Đóng Góp
1. **Fork** repository
2. **Tạo branch**: `git checkout -b feature/tinh-nang-moi`
3. **Commit**: `git commit -m "✨ Thêm: tính năng tuyệt vời"`
4. **Push**: `git push origin feature/tinh-nang-moi`
5. **Tạo Pull Request**

### 📋 Nguyên Tắc
- Code có **TypeScript types**
- Tuân thủ **code style** hiện tại
- **Test kỹ** trước khi PR
- **Commit message** rõ ràng

---

## 📄 Giấy Phép

**MIT License** - Tự do sử dụng cho mục đích cá nhân và thương mại.

Chi tiết xem tại [LICENSE](LICENSE).

---

## 💌 Liên Hệ & Hỗ Trợ

| Kênh | Liên hệ | Thời gian phản hồi |
|------|---------|-------------------|
| 📧 Email | loideveloper.37@gmail.com | 24-48h |
| 🐛 GitHub | [Tạo issue](https://github.com/F12FLASH/WeddingSite/issues) | 12-24h |
| 📖 Docs | Folder `/docs` (coming soon) | - |

---

## 💝 Lời Kết

Trong hành trình yêu thương của bạn, chúng tôi hân hạnh được trở thành một phần nhỏ bé - giúp lưu giữ những khoảnh khắc đẹp nhất, kết nối những trái tim gần nhau.

**Website Đám Cưới** không chỉ là công cụ, mà là người bạn đồng hành trong ngày trọng đại của bạn.

> "Hạnh phúc là khi có nhau, và kỷ niệm đẹp là khi được chia sẻ"

---

<div align="center">

**💞 Made with Love in Vietnam 💞**

[⬆ Lên đầu trang](#-website-đám-cưới-chuyên-nghiệp)

*Chúc bạn có một đám cưới thật hạnh phúc và tràn ngập yêu thương!*

</div>