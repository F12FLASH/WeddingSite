# 💍 Website Đám Cưới - Xuân Lâm & Xuân Lợi
### Modern Wedding Website / Trang Web Đám Cưới Hiện Đại

<div align="center">

![Wedding Website](https://img.shields.io/badge/Wedding-Website-ff69b4?style=for-the-badge&logo=heart&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**🎊 Nền tảng quản lý đám cưới chuyên nghiệp dành cho người Việt 🎊**

*Từ thiệp mời điện tử đến quản lý khách mời - Tất cả trong một hệ thống hoàn chỉnh*

[✨ Tính Năng](#-tính-năng) •
[🚀 Cài Đặt](#-cài-đặt) •
[📱 Deploy](#-deploy-lên-vercel) •
[🛠️ Công Nghệ](#%EF%B8%8F-công-nghệ) •
[📖 Hướng Dẫn](#-hướng-dẫn-sử-dụng) •
[🐛 Troubleshooting](#-troubleshooting)

</div>

---

## 📋 Mục Lục / Table of Contents

- [🇻🇳 Tiếng Việt](#-phần-tiếng-việt)
- [🇺🇸 English](#-english-section)

---

# 🇻🇳 Phần Tiếng Việt

## 🌟 Giới Thiệu

Website đám cưới được thiết kế dành riêng cho **Xuân Lâm & Xuân Lợi** - một nền tảng hoàn chỉnh để quản lý và chia sẻ thông tin đám cưới với gia đình và bạn bè. Website bao gồm hệ thống quản trị viên mạnh mẽ, cho phép tùy chỉnh toàn bộ nội dung, quản lý khách mời, và theo dõi xác nhận tham dự.

### ⚡ Điểm Nổi Bật

- ✅ **100% tiếng Việt** - Giao diện và nội dung hoàn toàn bằng tiếng Việt
- ✅ **Phong cách truyền thống Việt Nam** - Mừng cưới qua QR Code chuyển khoản
- ✅ **Quản lý dễ dàng** - Admin panel trực quan, không cần kỹ thuật
- ✅ **Tự động hóa** - RSVP deadline, notifications, music player
- ✅ **Responsive** - Hoạt động mượt mà trên mọi thiết bị
- ✅ **Deploy miễn phí** - Hỗ trợ Vercel deployment

---

## ✨ Tính Năng

### 🎨 Giao Diện & Trải Nghiệm
- ✅ **Thiết kế hiện đại** với animations mượt mà sử dụng Framer Motion
- ✅ **Responsive hoàn hảo** trên mọi thiết bị (Mobile, Tablet, Desktop)
- ✅ **Font chữ nghệ thuật** hỗ trợ đầy đủ tiếng Việt:
  - Trang chủ: Dancing Script, Great Vibes, Tangerine, Parisienne
  - Admin: Times New Roman với kích thước tối ưu
- ✅ **Dark Mode** - Tự động theo hệ thống hoặc chuyển đổi thủ công
- ✅ **Loading screen** độc đáo với countdown và hiệu ứng chuyển động
- ✅ **Popup hệ thống** - 2 loại popup tùy chỉnh:
  - Popup chào mừng: Hiển thị sau 1 giây khi vào trang lần đầu
  - Popup cuối trang: Hiển thị khi lướt đến 95% chiều cao

### 🎵 Âm Thanh & Media
- ✅ **Nhạc nền tự động** - Upload file MP3/WAV từ thiết bị (tối đa 10MB/file)
- ✅ **Music Player thông minh**:
  - Tự động phát khi vào trang và lặp lại vô hạn
  - Điều khiển phát/dừng, tắt tiếng, chuyển bài
  - Tên bài hát tự động lấy từ tên file
  - Lưu trạng thái phát nhạc (localStorage)
  - Debouncing để tránh lưu quá nhiều
- ✅ **Upload ảnh** - Tải lên từ thiết bị (tối đa 5MB):
  - Ảnh địa điểm tổ chức
  - Ảnh cặp đôi (avatar)
  - Thư viện ảnh (album)
- ✅ **Gallery 3D nâng cao**:
  - Hiệu ứng 3D với perspective transforms
  - Hover effects với rotateY, rotateX, rotateZ
  - Shimmer và sparkle effects
  - Spring-based animations
  - Lightbox xem ảnh toàn màn hình
- ✅ **Base64 upload** - Upload ảnh không cần Cloudinary API key

### 📅 Quản Lý Sự Kiện
- ✅ **Thông tin cặp đôi**:
  - Tên cô dâu & chú rể
  - Ảnh đại diện riêng biệt
  - Tiểu sử cá nhân (brideDescription, groomDescription)
  - Câu chuyện tình yêu dài và chi tiết
  - Ảnh nền hero hiển thị trên trang chủ
- ✅ **Lịch trình đám cưới**:
  - 6 sự kiện mẫu: Đón dâu, Vu quy, Rước dâu, Thành hôn, Tiệc cưới, Văn nghệ
  - Thời gian, địa điểm, mô tả chi tiết
  - Icons đại diện cho từng sự kiện
  - Sắp xếp theo thứ tự
- ✅ **Địa điểm tổ chức**:
  - Google Maps nhúng (iframe) - Hiển thị bản đồ tương tác
  - Thông tin liên hệ: Điện thoại, email
  - Địa chỉ đầy đủ
  - Ảnh địa điểm
  - Thời gian bắt đầu & kết thúc
- ✅ **Wedding Party** - Giới thiệu phù dâu & phù rể với ảnh và mô tả
- ✅ **FAQ** - 8 câu hỏi thường gặp về đám cưới

### 💌 Tương Tác Khách Mời
- ✅ **RSVP Form (Xác nhận tham dự)**:
  - Tự động tính deadline = ngày cưới - 7 ngày
  - Thông tin: Tên, email, số điện thoại
  - Số lượng khách tham dự
  - Sở thích món ăn
  - Yêu cầu đặc biệt
  - Hiển thị tiếng Việt đầy đủ
  - Animation form mượt mà với Framer Motion
- ✅ **Gửi lời chúc**:
  - Khách mời gửi lời chúc phúc
  - Hệ thống kiểm duyệt (chờ admin phê duyệt)
  - Hiển thị công khai sau khi được duyệt
- ✅ **Thông báo real-time**:
  - Chuông thông báo RSVPs và tin nhắn mới
  - Đếm số lượng chưa đọc
  - Mark-as-read với localStorage
  - Nút "Đọc hết" để đánh dấu tất cả

### 💰 Mừng Cưới (Phong Cách Việt Nam)
- ✅ **Danh sách quà cưới** - Gợi ý quà tặng cho cặp đôi (tùy chọn)
- ✅ **Chuyển khoản ngân hàng**:
  - QR Code riêng cho cô dâu
  - QR Code riêng cho chú rể
  - Thông tin tài khoản đầy đủ (Ngân hàng, STK, Tên chủ tài khoản)
  - Upload QR code từ thiết bị
  - Hiển thị đẹp mắt, dễ quét

### ⚙️ Admin Panel (Trang Quản Trị)
- ✅ **Dashboard tổng quan**:
  - Thống kê RSVPs (tham dự/không tham dự)
  - Số lượng tin nhắn (đã duyệt/chờ duyệt)
  - Tổng số khách mời
  - Biểu đồ trực quan
- ✅ **Quản lý nội dung**:
  - **Thông tin cặp đôi**: Tên, ảnh, tiểu sử, câu chuyện, ngày cưới
  - **Lịch trình**: Thêm/sửa/xóa sự kiện
  - **Thư viện ảnh**: Upload, sắp xếp, thêm caption
  - **Tin nhắn**: Phê duyệt, từ chối, xóa
  - **RSVP**: Xem danh sách, export CSV
  - **Wedding Party**: Quản lý phù dâu & phù rể
  - **FAQ**: Thêm/sửa/xóa câu hỏi
- ✅ **Cài đặt địa điểm**:
  - Nhập link Google Maps embed (iframe)
  - Preview bản đồ trực tiếp trong admin
  - Upload ảnh địa điểm
  - Thông tin liên hệ (phone, email)
  - Thời gian sự kiện (datetime picker)
- ✅ **Cài đặt âm thanh**:
  - Upload nhạc nền từ thiết bị (MP3/WAV, max 10MB)
  - Quản lý playlist
  - Tên bài hát tự động từ filename
  - Xóa bài hát
- ✅ **Quản lý popup**:
  - Upload ảnh popup chào mừng
  - Upload ảnh popup cuối trang
  - Bật/tắt từng loại popup
  - Xem trước popup
- ✅ **Export dữ liệu**:
  - Export RSVP list sang CSV
  - UTF-8 BOM (mở trực tiếp trong Excel không bị lỗi font)
  - Bao gồm tất cả thông tin khách mời
- ✅ **Bảo mật**:
  - Đăng nhập với username & password (bcrypt hashing)
  - Session management an toàn
  - Chỉ admin mới truy cập được admin panel

### 🔒 Bảo Mật & Hiệu Suất
- ✅ **Authentication** - Passport.js với Local Strategy
- ✅ **Password hashing** - Bcrypt với salt rounds = 10
- ✅ **Session storage** - PostgreSQL với express-session
- ✅ **Database backup** - Script tự động sao lưu
- ✅ **Input validation** - Zod schema validation
- ✅ **SQL injection prevention** - Drizzle ORM parameterized queries
- ✅ **Rate limiting** - Bảo vệ API (có thể thêm nếu cần)

---

## 🛠️ Công Nghệ

### Frontend Stack
| Công nghệ | Phiên bản | Mục đích |
|-----------|----------|----------|
| **React** | 18.3 | UI library - Xây dựng giao diện |
| **TypeScript** | 5.6 | Type safety - An toàn kiểu dữ liệu |
| **Vite** | 5.4 | Build tool - Công cụ build nhanh |
| **Tailwind CSS** | 3.4 | Utility-first CSS framework |
| **Framer Motion** | 11.13 | Animation library - Hiệu ứng chuyển động |
| **Shadcn/UI** | Latest | Component library - Thư viện component |
| **TanStack Query** | 5.60 | Data fetching & caching |
| **Wouter** | 3.3 | Lightweight routing - Định tuyến nhẹ |
| **React Hook Form** | 7.55 | Form management - Quản lý form |
| **Zod** | 3.24 | Schema validation - Validate dữ liệu |

### Backend Stack
| Công nghệ | Phiên bản | Mục đích |
|-----------|----------|----------|
| **Node.js** | 20.x | Runtime environment |
| **Express.js** | 4.21 | Web framework - API server |
| **TypeScript** | 5.6 | Type safety cho backend |
| **PostgreSQL** | Latest | Relational database |
| **Neon** | Latest | Serverless Postgres hosting |
| **Drizzle ORM** | 0.39 | Type-safe ORM |
| **Passport.js** | 0.7 | Authentication middleware |
| **Bcrypt** | 6.0 | Password hashing |
| **Express Session** | 1.18 | Session management |

### DevOps & Tools
- **Drizzle Kit** - Database migrations & push
- **Cross-env** - Cross-platform environment variables
- **ESBuild** - Fast bundler cho production
- **Vercel** - Deployment platform (recommended)
- **GitHub** - Version control

---

## 🚀 Cài Đặt

### Yêu Cầu Hệ Thống
- ✅ Node.js 20.x hoặc cao hơn
- ✅ PostgreSQL database (Neon DB được khuyên dùng - miễn phí)
- ✅ Git (để clone repository)
- ✅ Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)

### Các Bước Cài Đặt

#### 1️⃣ Clone Repository từ GitHub
```bash
git clone https://github.com/your-username/wedding-website.git
cd wedding-website
```

#### 2️⃣ Cài Đặt Dependencies
```bash
npm install
```

⏱️ *Thời gian: 2-3 phút tùy tốc độ mạng*

#### 3️⃣ Tạo PostgreSQL Database

**Option A: Sử dụng Neon (Khuyên dùng - Miễn phí)**
1. Truy cập [Neon Console](https://console.neon.tech/)
2. Đăng ký tài khoản miễn phí
3. Tạo project mới: "Wedding Website"
4. Copy **Connection String** (dạng: `postgresql://user:pass@host/db?sslmode=require`)

**Option B: Sử dụng PostgreSQL local**
```bash
# Tạo database
createdb wedding_db

# Connection string
postgresql://localhost:5432/wedding_db
```

#### 4️⃣ Cấu Hình Environment Variables

Tạo file `.env` trong thư mục gốc:

```env
# Database
DATABASE_URL=your_postgresql_connection_string_here

# Session Secret (generate random string)
SESSION_SECRET=your_very_long_random_secret_key_at_least_32_chars

# Node Environment
NODE_ENV=development
```

💡 **Cách tạo SESSION_SECRET ngẫu nhiên:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 5️⃣ Tạo Database Schema
```bash
npm run db:push
```

✅ Lệnh này sẽ tạo tất cả 12 bảng trong database:
- `users` - Tài khoản admin
- `couple_info` - Thông tin cặp đôi
- `schedule_events` - Lịch trình sự kiện
- `photos` - Thư viện ảnh
- `guest_messages` - Lời chúc từ khách
- `rsvps` - Xác nhận tham dự
- `registry_items` - Danh sách quà cưới
- `wedding_party` - Phù dâu & phù rể
- `settings` - Cài đặt website
- `faqs` - Câu hỏi thường gặp
- `popups` - Popup quảng cáo
- `music_tracks` - Danh sách nhạc nền
- `sessions` - Session authentication

#### 6️⃣ Seed Dữ Liệu Mẫu
```bash
npx tsx server/seed.ts
```

✅ Script sẽ tạo:
- **Admin account**: `username: admin` / `password: admin123`
- Thông tin cặp đôi: Xuân Lâm & Xuân Lợi
- 6 sự kiện đám cưới mẫu
- 6 ảnh từ `attached_assets/wedding_images/album/`
- 7 tin nhắn chúc mừng
- 5 RSVPs mẫu
- 5 món quà gợi ý
- 6 thành viên wedding party
- 8 FAQs
- Cài đặt đầy đủ (địa điểm, nhạc nền, QR codes)

⚠️ **LƯU Ý**: Thay thế ảnh mẫu bằng ảnh thật của bạn trong `attached_assets/wedding_images/`

#### 7️⃣ Chạy Development Server
```bash
npm run dev
```

🌐 Website sẽ chạy tại: **http://localhost:5000**

#### 8️⃣ Build cho Production (Tùy chọn)
```bash
npm run build
npm run start
```

---

## 📱 Deploy lên Vercel

### Tại Sao Chọn Vercel?
- ✅ **Miễn phí** cho personal projects
- ✅ **Deploy tự động** từ GitHub
- ✅ **HTTPS** miễn phí
- ✅ **Custom domain** support
- ✅ **Global CDN** - Tốc độ nhanh toàn cầu
- ✅ **Serverless Functions** - Hỗ trợ Express.js

### Bước 1: Chuẩn Bị Repository trên GitHub

#### A. Tạo Repository mới trên GitHub
1. Truy cập [GitHub](https://github.com/) và đăng nhập
2. Click **"New repository"**
3. Đặt tên: `wedding-website` hoặc `xuanlam-xuanloi-wedding`
4. Chọn **Private** (để bảo mật)
5. Click **"Create repository"**

#### B. Push Code lên GitHub
```bash
# Initialize git (nếu chưa có)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Wedding website"

# Add remote
git remote add origin https://github.com/your-username/wedding-website.git

# Push to GitHub
git push -u origin main
```

### Bước 2: Kết Nối Neon Database cho Production

1. Truy cập [Neon Console](https://console.neon.tech/)
2. Tạo **production branch** mới (hoặc dùng main branch)
3. Copy **Connection String** cho production
4. Lưu lại để cấu hình trên Vercel

### Bước 3: Deploy lên Vercel

#### A. Import Project
1. Truy cập [Vercel](https://vercel.com/) và đăng nhập bằng GitHub
2. Click **"Add New Project"**
3. Chọn repository `wedding-website` từ GitHub
4. Click **"Import"**

#### B. Cấu hình Project Settings

**Framework Preset**: Other (để default)

**Root Directory**: `./` (để trống hoặc để default)

**Build & Output Settings**:
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

#### C. Environment Variables (Quan trọng!)

Click **"Environment Variables"** và thêm:

```
DATABASE_URL=your_neon_production_connection_string
SESSION_SECRET=your_production_secret_key_different_from_dev
NODE_ENV=production
```

⚠️ **LƯU Ý**: 
- Sử dụng **production connection string** từ Neon
- `SESSION_SECRET` production phải **khác** với development
- Không commit `.env` lên GitHub!

#### D. Deploy

1. Click **"Deploy"**
2. Chờ 2-3 phút để Vercel build và deploy
3. Sau khi hoàn thành, bạn sẽ có URL dạng: `https://your-site.vercel.app`

### Bước 4: Chạy Database Migration trên Production

Sau khi deploy lần đầu:

1. Vào **Vercel Dashboard** → Project → **Settings** → **Functions**
2. Hoặc chạy từ local với production DATABASE_URL:

```bash
# Tạm thời set production DATABASE_URL
DATABASE_URL="your_production_db_url" npm run db:push

# Seed production database
DATABASE_URL="your_production_db_url" npx tsx server/seed.ts
```

✅ Bây giờ production database đã có đầy đủ tables và dữ liệu mẫu!

### Bước 5: Thay Thế Dữ Liệu Mẫu

1. Truy cập `https://your-site.vercel.app/login`
2. Đăng nhập với `admin` / `admin123`
3. Vào **Admin Panel** và cập nhật:
   - Thông tin cặp đôi (tên, ảnh, câu chuyện)
   - Upload ảnh thật từ `attached_assets/wedding_images/`
   - Cập nhật lịch trình sự kiện
   - Thêm QR codes chuyển khoản
   - Đổi mật khẩu admin (Settings → Change Password)

### Bước 6: Custom Domain (Tùy chọn)

1. Mua domain (VD: `xuanlam-xuanloi.com`)
2. Vào **Vercel Dashboard** → **Domains**
3. Add domain và follow hướng dẫn DNS setup

---

## 📖 Hướng Dẫn Sử Dụng

### 🔐 Đăng Nhập Admin

1. Truy cập `/login` hoặc click nút **"Admin"** ở góc trên phải
2. Nhập username: `admin` / password: `admin123`
3. Click **"Đăng Nhập"**

⚠️ **BẮT BUỘC**: Đổi mật khẩu ngay sau lần đăng nhập đầu!

### ⚙️ Cập Nhật Thông Tin Cặp Đôi

1. **Admin** → **Cặp Đôi**
2. Cập nhật:
   - Tên cô dâu & chú rể
   - Upload ảnh đại diện (click vào ảnh placeholder)
   - Viết tiểu sử riêng cho từng người
   - Viết câu chuyện tình yêu (hỗ trợ nhiều đoạn văn)
   - Chọn ngày cưới (date picker)
   - Upload ảnh nền hero
3. Click **"Lưu Thay Đổi"**

💡 **Mẹo**: Câu chuyện tình yêu hỗ trợ line breaks - mỗi đoạn văn mới sẽ tự động xuống dòng

### 📅 Quản Lý Lịch Trình

1. **Admin** → **Lịch Trình**
2. **Thêm sự kiện mới**:
   - Click **"Thêm Sự Kiện"**
   - Nhập tiêu đề (VD: "Lễ Thành Hôn")
   - Mô tả chi tiết
   - Chọn thời gian (datetime picker)
   - Nhập địa điểm
   - Chọn icon (home, heart, car, church, glass, music)
   - Số thứ tự (để sắp xếp)
3. **Chỉnh sửa**: Click icon bút chì
4. **Xóa**: Click icon thùng rác

### 🖼️ Quản Lý Thư Viện Ảnh

1. **Admin** → **Thư Viện**
2. **Upload ảnh mới**:
   - Click **"Thêm Ảnh"**
   - Chọn file từ thiết bị (max 5MB, jpg/png/webp)
   - Nhập caption (mô tả ảnh)
   - Chọn category (pre-wedding, engagement, ceremony, wedding, portrait)
   - Số thứ tự
3. **Chỉnh sửa caption**: Click vào ảnh
4. **Xóa**: Click icon X

💡 **Mẹo**: Upload ảnh chất lượng cao nhưng đã được optimize (dưới 2MB) để trang load nhanh

### 💌 Quản Lý Tin Nhắn Chúc Mừng

1. **Admin** → **Tin Nhắn**
2. Xem danh sách tin nhắn:
   - **Chưa duyệt** (Pending): Màu vàng
   - **Đã duyệt** (Approved): Màu xanh
3. **Phê duyệt**: Click **"Duyệt"**
4. **Từ chối/Xóa**: Click **"Xóa"**

✅ Chỉ tin nhắn đã duyệt mới hiển thị công khai trên trang chủ

### 📊 Quản Lý RSVP

1. **Admin** → **Xác Nhận Tham Dự**
2. Xem danh sách khách mời:
   - **Tham dự**: Tích xanh ✅
   - **Không tham dự**: X đỏ ❌
   - Số lượng khách
   - Sở thích món ăn
   - Yêu cầu đặc biệt
3. **Export CSV**: Click **"Export CSV"** để tải xuống Excel
4. **Thống kê**: Xem biểu đồ tổng quan trên Dashboard

💾 **File CSV**: Sử dụng UTF-8 BOM, mở trực tiếp trong Excel không bị lỗi tiếng Việt

### 🎵 Cài Đặt Nhạc Nền

1. **Admin** → **Cài Đặt** → **Tính Năng**
2. Kéo xuống mục **"Nhạc Nền"**
3. **Thêm bài hát**:
   - Click **"Thêm Bài Hát"**
   - Chọn file MP3/WAV từ thiết bị (max 10MB)
   - Tên bài hát tự động lấy từ filename
   - Click **"Upload"**
4. **Xóa bài**: Click icon thùng rác
5. **Playlist**: Nhạc tự động phát theo thứ tự và loop vô hạn

💡 **Mẹo**:
- Đổi tên file trước khi upload: `Beautiful_In_White.mp3` → "Beautiful In White"
- Chỉ upload nhạc bản quyền hoặc free-to-use
- Nên upload 2-3 bài để tạo playlist

### 🗺️ Cài Đặt Google Maps

1. **Admin** → **Cài Đặt** → **Tổng Quan**
2. Kéo xuống mục **"Thông Tin Địa Điểm"**
3. **Lấy link Google Maps**:
   
   **Bước 1**: Vào [Google Maps](https://www.google.com/maps/)
   
   **Bước 2**: Tìm địa điểm tổ chức (VD: "Rose Garden Estate, Hà Nội")
   
   **Bước 3**: Click **"Chia sẻ"** → **"Nhúng bản đồ"**
   
   **Bước 4**: Click **"Sao chép HTML"**
   
   **Bước 5**: Paste vào Notepad, tìm đoạn `src="https://www.google.com/maps/embed?pb=..."`
   
   **Bước 6**: Copy TOÀN BỘ URL (bắt đầu từ https://)
   
   **Bước 7**: Paste vào trường **"Link Google Maps"** trong Admin

4. **Preview**: Bản đồ sẽ hiển thị ngay bên dưới để bạn kiểm tra
5. Click **"Lưu"**

✅ Bản đồ tương tác sẽ hiển thị trên trang chủ!

### 💰 Cài Đặt QR Code Mừng Cưới

1. **Admin** → **Quà Cưới** → **Chuyển Khoản**
2. **QR Code Cô Dâu**:
   - Click **"Tải QR Code Lên"**
   - Chọn file ảnh QR (từ app ngân hàng)
   - Nhập thông tin tài khoản:
     ```
     Ngân hàng Vietcombank
     Chi nhánh Hà Nội
     STK: 0123456789
     Chủ TK: Nguyễn Thị Xuân Lâm
     ```
3. **QR Code Chú Rể**: Tương tự
4. Click **"Lưu"**

💡 **Mẹo**: Chụp ảnh QR code trực tiếp từ app ngân hàng để đảm bảo rõ nét

### 🎨 Cài Đặt Popup

1. **Admin** → **Cài Đặt** → **Popup Quảng Cáo**
2. **Popup Chào Mừng**:
   - Upload ảnh thiệp cưới (max 5MB)
   - Bật/tắt bằng toggle
   - Popup hiện sau 1 giây khi vào trang lần đầu
3. **Popup Cuối Trang**:
   - Upload ảnh khác (có thể là lời cảm ơn)
   - Popup hiện khi lướt đến 95% trang

✅ LocalStorage đảm bảo không hiện lại cho cùng người dùng!

---

## 🎨 Customization (Tùy Chỉnh)

### Thay Đổi Màu Sắc

Chỉnh sửa file `client/src/index.css`:

```css
:root {
  /* Màu chính (Primary) - Hồng cưới */
  --primary: 340 82% 52%;
  --primary-foreground: 0 0% 100%;
  
  /* Màu phụ (Secondary) - Hồng nhạt */
  --secondary: 340 25% 88%;
  --secondary-foreground: 340 82% 25%;
  
  /* Màu nền */
  --background: 0 0% 100%;
  --foreground: 340 10% 10%;
  
  /* Accent color */
  --accent: 340 60% 60%;
}

/* Dark mode */
.dark {
  --primary: 340 82% 60%;
  --background: 340 10% 10%;
  --foreground: 0 0% 95%;
}
```

### Thay Đổi Font Chữ

```css
:root {
  /* Trang chủ - Font nghệ thuật */
  --font-cursive: 'Dancing Script', 'Great Vibes', cursive;
  --font-serif: 'Playfair Display', serif;
  
  /* Admin - Font chuyên nghiệp */
  --font-admin: 'Times New Roman', serif;
  
  /* Font body */
  --font-body: 'Cormorant Garamond', 'Noto Serif', Georgia, serif;
}
```

### Thay Đổi Animations

Chỉnh sửa animations trong các component `client/src/components/*.tsx`:

```typescript
// Tốc độ animation
const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8, // Tăng/giảm số này
      ease: "easeOut"
    }
  }
};
```

---

## 📂 Cấu Trúc Thư Mục

```
wedding-website/
├── client/                      # Frontend code
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Hero.tsx        # Trang chủ hero section
│   │   │   ├── About.tsx       # Câu chuyện cặp đôi
│   │   │   ├── Gallery.tsx     # Thư viện ảnh 3D
│   │   │   ├── RSVP.tsx        # Form xác nhận tham dự
│   │   │   ├── Registry.tsx    # Mừng cưới & QR codes
│   │   │   ├── Navigation.tsx  # Menu điều hướng
│   │   │   ├── MusicPlayer.tsx # Music player
│   │   │   └── ...
│   │   ├── pages/              # Page components
│   │   │   ├── Landing.tsx     # Trang chủ
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminCouple.tsx
│   │   │   ├── AdminGallery.tsx
│   │   │   ├── AdminSettings.tsx
│   │   │   └── ...
│   │   ├── lib/                # Utilities
│   │   │   ├── queryClient.ts  # TanStack Query config
│   │   │   ├── imageUpload.ts  # Base64 image upload
│   │   │   └── authUtils.ts    # Auth helpers
│   │   ├── index.css           # Global styles
│   │   └── App.tsx             # Root component
│   └── index.html              # HTML entry
│
├── server/                      # Backend code
│   ├── index.ts                # Server entry point
│   ├── routes.ts               # API routes
│   ├── storage.ts              # Database operations
│   ├── auth.ts                 # Authentication
│   ├── db.ts                   # Database connection
│   ├── seed.ts                 # Seed script
│   └── vite.ts                 # Vite dev server
│
├── shared/                      # Shared code
│   └── schema.ts               # Database schema & types
│
├── attached_assets/             # Static assets
│   ├── wedding_images/         # Ảnh đám cưới
│   │   ├── album/              # 6 ảnh gallery (1-6.jpg)
│   │   ├── avatar/             # Ảnh cặp đôi (codau.jpg, chure.jpg)
│   │   ├── background/         # Ảnh hero (anhnen.jpg)
│   │   ├── bridesmaids/        # Ảnh phù dâu (1-3)
│   │   ├── groomsmen/          # Ảnh phù rể (1-3)
│   │   ├── qr/                 # QR codes (mungtiencodau.jpg, mungtienchure.jpg)
│   │   └── venue/              # Ảnh địa điểm (1.jpg)
│   └── wedding_music/          # Nhạc nền
│       └── Beautiful in white.mp3
│
├── .env                         # Environment variables (KHÔNG commit)
├── .gitignore                   # Git ignore file
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind config
├── vite.config.ts               # Vite config
├── vercel.json                  # Vercel deployment config
├── drizzle.config.ts            # Drizzle ORM config
└── README.md                    # Documentation này
```

---

## 🐛 Troubleshooting (Xử Lý Lỗi)

### Lỗi: "cross-env: not found"

**Nguyên nhân**: Package `cross-env` chưa được cài đặt

**Giải pháp**:
```bash
npm install --save-dev cross-env
npm run dev
```

### Lỗi: Database connection failed

**Nguyên nhân**: DATABASE_URL không đúng hoặc database chưa tồn tại

**Giải pháp**:
1. Kiểm tra file `.env` có chứa `DATABASE_URL` đúng format
2. Test connection: `npx tsx -e "import {pool} from './server/db'; pool.query('SELECT NOW()').then(console.log).catch(console.error)"`
3. Nếu Neon database: Kiểm tra IP allowlist

### Lỗi: Ảnh không hiển thị sau khi seed

**Nguyên nhân**: Đường dẫn ảnh không đúng hoặc file không tồn tại

**Giải pháp**:
1. Kiểm tra files trong `attached_assets/wedding_images/` tồn tại
2. Kiểm tra đường dẫn trong `server/seed.ts` khớp với tên file
3. Restart server: `Ctrl+C` → `npm run dev`

### Lỗi: "Session store not found"

**Nguyên nhân**: Bảng `sessions` chưa được tạo

**Giải pháp**:
```bash
npm run db:push
```

### Lỗi: Vercel build failed

**Nguyên nhân**: Environment variables chưa được set hoặc build command sai

**Giải pháp**:
1. Kiểm tra **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Đảm bảo có: `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production`
3. Redeploy: **Deployments** → **...** → **Redeploy**

### Lỗi: LSP/TypeScript errors

**Giải pháp**:
```bash
npm run check
```

Nếu có lỗi, sửa theo hướng dẫn hoặc restart VS Code

---

## 🔒 Bảo Mật Production

### Checklist trước khi deploy

- [ ] Đổi mật khẩu admin mặc định
- [ ] Sử dụng `SESSION_SECRET` dài ít nhất 32 ký tự
- [ ] Set `NODE_ENV=production` trên Vercel
- [ ] Không commit file `.env` lên GitHub
- [ ] Sử dụng connection string production riêng biệt
- [ ] Bật HTTPS (Vercel tự động)
- [ ] Review logs định kỳ
- [ ] Backup database thường xuyên

### Backup Database

**Tự động với Neon**:
- Neon tự động backup mỗi 24h
- Lưu trữ 7 ngày
- Restore qua Neon Console

**Manual backup**:
```bash
# Export toàn bộ database sang JSON
DATABASE_URL="your_db_url" npx tsx server/backup.ts

# File sẽ được lưu tại backups/wedding-db-backup-YYYY-MM-DD.json
```

---

## 📝 License

Copyright © 2025 Xuân Lâm & Xuân Lợi. All rights reserved.

Dự án này chỉ dành cho mục đích cá nhân và giáo dục. Không được sao chép, phân phối, hoặc sử dụng cho mục đích thương mại mà không có sự cho phép.

---

## 🆘 Hỗ Trợ

### Liên hệ

- 📧 **Email**: support@example.com
- 💬 **GitHub Issues**: [Create an issue](https://github.com/your-username/wedding-website/issues)
- 📚 **Documentation**: README này

### Tài liệu tham khảo

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

<div align="center">

## 💖 Được Phát Triển Với Tình Yêu

**Chúc Xuân Lâm & Xuân Lợi có một đám cưới tuyệt vời!**

**Trăm năm hạnh phúc! 💐🎉**

---

### ⭐ Nếu thích dự án này, hãy cho một star trên GitHub!

[![GitHub Stars](https://img.shields.io/github/stars/your-username/wedding-website?style=social)](https://github.com/your-username/wedding-website)

</div>

---
---
---

# 🇺🇸 English Section

## 🌟 Overview

A comprehensive wedding website built specifically for **Xuân Lâm & Xuân Lợi**, featuring a powerful admin panel for content management, guest management, and RSVP tracking. This modern, responsive website includes everything needed to create an unforgettable online wedding experience.

### ⚡ Key Highlights

- ✅ **100% Vietnamese** - Fully localized interface and content
- ✅ **Vietnamese Wedding Traditions** - Bank transfer with QR codes for wedding gifts
- ✅ **Easy Management** - Intuitive admin panel, no technical skills required
- ✅ **Automation** - Auto RSVP deadline, notifications, music player
- ✅ **Responsive** - Seamless experience across all devices
- ✅ **Free Deployment** - Vercel deployment support

---

## ✨ Features

### 🎨 Design & Experience
- ✅ **Modern design** with smooth animations using Framer Motion
- ✅ **Fully responsive** across all devices (Mobile, Tablet, Desktop)
- ✅ **Artistic fonts** with full Vietnamese support:
  - Homepage: Dancing Script, Great Vibes, Tangerine, Parisienne
  - Admin: Times New Roman optimized sizing
- ✅ **Dark Mode** - System-based or manual toggle
- ✅ **Unique loading screen** with countdown and motion effects
- ✅ **Popup system** - 2 customizable popup types:
  - Welcome popup: Shows after 1 second on first visit
  - Scroll-end popup: Shows at 95% page scroll

### 🎵 Audio & Media
- ✅ **Auto-playing background music** - Upload MP3/WAV files from device (max 10MB/file)
- ✅ **Smart Music Player**:
  - Auto-play on page load with infinite loop
  - Play/pause, mute, skip track controls
  - Song names automatically extracted from filenames
  - Playback state persistence (localStorage)
  - Debouncing to prevent excessive saves
- ✅ **Image uploads** - Upload from device (max 5MB):
  - Venue photos
  - Couple avatars
  - Photo gallery (album)
- ✅ **Advanced 3D Gallery**:
  - 3D effects with perspective transforms
  - Hover effects with rotateY, rotateX, rotateZ
  - Shimmer and sparkle effects
  - Spring-based animations
  - Full-screen lightbox viewer
- ✅ **Base64 upload** - Image upload without Cloudinary API key

### 📅 Event Management
- ✅ **Couple information**:
  - Bride & groom names
  - Individual profile photos
  - Personal biographies (brideDescription, groomDescription)
  - Detailed love story
  - Hero background image for homepage
- ✅ **Wedding schedule**:
  - 6 sample events: Reception, Ceremony, Procession, Vows, Banquet, Entertainment
  - Time, location, detailed descriptions
  - Icons for each event
  - Ordered display
- ✅ **Venue location**:
  - Google Maps embed (iframe) - Interactive map display
  - Contact info: Phone, email
  - Full address
  - Venue photo
  - Start & end times
- ✅ **Wedding Party** - Introduce bridesmaids & groomsmen with photos and descriptions
- ✅ **FAQ** - 8 frequently asked questions about the wedding

### 💌 Guest Interactions
- ✅ **RSVP Form (Attendance Confirmation)**:
  - Auto-calculated deadline = wedding date - 7 days
  - Information: Name, email, phone
  - Number of guests attending
  - Meal preferences
  - Special requirements
  - Full Vietnamese display
  - Smooth form animations with Framer Motion
- ✅ **Send wishes**:
  - Guests send congratulatory messages
  - Moderation system (admin approval required)
  - Public display after approval
- ✅ **Real-time notifications**:
  - Notification bell for new RSVPs and messages
  - Unread count
  - Mark-as-read with localStorage
  - "Mark all as read" button

### 💰 Wedding Gifts (Vietnamese Style)
- ✅ **Gift registry** - Suggested gifts for the couple (optional)
- ✅ **Bank transfer**:
  - Separate QR code for bride
  - Separate QR code for groom
  - Full account information (Bank name, Account number, Account holder)
  - Upload QR codes from device
  - Beautiful, easy-to-scan display

### ⚙️ Admin Panel
- ✅ **Dashboard overview**:
  - RSVP statistics (attending/not attending)
  - Message count (approved/pending)
  - Total guest count
  - Visual charts
- ✅ **Content management**:
  - **Couple info**: Names, photos, bios, story, wedding date
  - **Schedule**: Add/edit/delete events
  - **Photo gallery**: Upload, organize, add captions
  - **Messages**: Approve, reject, delete
  - **RSVP**: View list, export CSV
  - **Wedding Party**: Manage bridesmaids & groomsmen
  - **FAQ**: Add/edit/delete questions
- ✅ **Venue settings**:
  - Enter Google Maps embed link (iframe)
  - Live map preview in admin
  - Upload venue photo
  - Contact information (phone, email)
  - Event times (datetime picker)
- ✅ **Audio settings**:
  - Upload background music from device (MP3/WAV, max 10MB)
  - Manage playlist
  - Song names auto-extracted from filename
  - Delete songs
- ✅ **Popup management**:
  - Upload welcome popup image
  - Upload scroll-end popup image
  - Enable/disable each popup type
  - Preview popups
- ✅ **Data export**:
  - Export RSVP list to CSV
  - UTF-8 BOM (opens directly in Excel without font issues)
  - Includes all guest information
- ✅ **Security**:
  - Login with username & password (bcrypt hashing)
  - Secure session management
  - Admin-only panel access

### 🔒 Security & Performance
- ✅ **Authentication** - Passport.js with Local Strategy
- ✅ **Password hashing** - Bcrypt with salt rounds = 10
- ✅ **Session storage** - PostgreSQL with express-session
- ✅ **Database backup** - Automated backup script
- ✅ **Input validation** - Zod schema validation
- ✅ **SQL injection prevention** - Drizzle ORM parameterized queries

---

## 🛠️ Technology Stack

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | UI library |
| **TypeScript** | 5.6 | Type safety |
| **Vite** | 5.4 | Fast build tool |
| **Tailwind CSS** | 3.4 | Utility-first CSS |
| **Framer Motion** | 11.13 | Animation library |
| **Shadcn/UI** | Latest | Component library |
| **TanStack Query** | 5.60 | Data fetching & caching |
| **Wouter** | 3.3 | Lightweight routing |
| **React Hook Form** | 7.55 | Form management |
| **Zod** | 3.24 | Schema validation |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | Runtime environment |
| **Express.js** | 4.21 | Web framework |
| **TypeScript** | 5.6 | Type safety |
| **PostgreSQL** | Latest | Relational database |
| **Neon** | Latest | Serverless Postgres hosting |
| **Drizzle ORM** | 0.39 | Type-safe ORM |
| **Passport.js** | 0.7 | Authentication |
| **Bcrypt** | 6.0 | Password hashing |
| **Express Session** | 1.18 | Session management |

### DevOps & Tools
- **Drizzle Kit** - Database migrations & push
- **Cross-env** - Cross-platform environment variables
- **ESBuild** - Fast production bundler
- **Vercel** - Deployment platform (recommended)
- **GitHub** - Version control

---

## 🚀 Installation

### System Requirements
- ✅ Node.js 20.x or higher
- ✅ PostgreSQL database (Neon DB recommended - free tier)
- ✅ Git (to clone repository)
- ✅ Modern browser (Chrome, Firefox, Safari, Edge)

### Installation Steps

#### 1️⃣ Clone Repository from GitHub
```bash
git clone https://github.com/your-username/wedding-website.git
cd wedding-website
```

#### 2️⃣ Install Dependencies
```bash
npm install
```

⏱️ *Takes 2-3 minutes depending on network speed*

#### 3️⃣ Create PostgreSQL Database

**Option A: Use Neon (Recommended - Free)**
1. Visit [Neon Console](https://console.neon.tech/)
2. Sign up for free account
3. Create new project: "Wedding Website"
4. Copy **Connection String** (format: `postgresql://user:pass@host/db?sslmode=require`)

**Option B: Use Local PostgreSQL**
```bash
# Create database
createdb wedding_db

# Connection string
postgresql://localhost:5432/wedding_db
```

#### 4️⃣ Configure Environment Variables

Create `.env` file in root directory:

```env
# Database
DATABASE_URL=your_postgresql_connection_string_here

# Session Secret (generate random string)
SESSION_SECRET=your_very_long_random_secret_key_at_least_32_chars

# Node Environment
NODE_ENV=development
```

💡 **Generate random SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 5️⃣ Create Database Schema
```bash
npm run db:push
```

✅ This creates all 12 tables in database:
- `users` - Admin accounts
- `couple_info` - Couple information
- `schedule_events` - Event schedule
- `photos` - Photo gallery
- `guest_messages` - Guest wishes
- `rsvps` - Attendance confirmations
- `registry_items` - Gift registry
- `wedding_party` - Bridesmaids & groomsmen
- `settings` - Website settings
- `faqs` - Frequently asked questions
- `popups` - Advertisement popups
- `music_tracks` - Background music playlist
- `sessions` - Session authentication

#### 6️⃣ Seed Sample Data
```bash
npx tsx server/seed.ts
```

✅ Script creates:
- **Admin account**: `username: admin` / `password: admin123`
- Couple info: Xuân Lâm & Xuân Lợi
- 6 sample wedding events
- 6 photos from `attached_assets/wedding_images/album/`
- 7 congratulatory messages
- 5 sample RSVPs
- 5 suggested gifts
- 6 wedding party members
- 8 FAQs
- Complete settings (venue, background music, QR codes)

⚠️ **NOTE**: Replace sample images with your real photos in `attached_assets/wedding_images/`

#### 7️⃣ Run Development Server
```bash
npm run dev
```

🌐 Website runs at: **http://localhost:5000**

#### 8️⃣ Build for Production (Optional)
```bash
npm run build
npm run start
```

---

## 📱 Deploy to Vercel

### Why Choose Vercel?
- ✅ **Free** for personal projects
- ✅ **Auto-deploy** from GitHub
- ✅ **Free HTTPS**
- ✅ **Custom domain** support
- ✅ **Global CDN** - Fast worldwide
- ✅ **Serverless Functions** - Express.js support

### Step 1: Prepare GitHub Repository

#### A. Create New Repository on GitHub
1. Visit [GitHub](https://github.com/) and login
2. Click **"New repository"**
3. Name it: `wedding-website` or `xuanlam-xuanloi-wedding`
4. Choose **Private** (for privacy)
5. Click **"Create repository"**

#### B. Push Code to GitHub
```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Wedding website"

# Add remote
git remote add origin https://github.com/your-username/wedding-website.git

# Push to GitHub
git push -u origin main
```

### Step 2: Connect Neon Database for Production

1. Visit [Neon Console](https://console.neon.tech/)
2. Create **production branch** (or use main branch)
3. Copy **Connection String** for production
4. Save it for Vercel configuration

### Step 3: Deploy to Vercel

#### A. Import Project
1. Visit [Vercel](https://vercel.com/) and login with GitHub
2. Click **"Add New Project"**
3. Select `wedding-website` repository from GitHub
4. Click **"Import"**

#### B. Configure Project Settings

**Framework Preset**: Other (keep default)

**Root Directory**: `./` (leave empty or default)

**Build & Output Settings**:
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

#### C. Environment Variables (Important!)

Click **"Environment Variables"** and add:

```
DATABASE_URL=your_neon_production_connection_string
SESSION_SECRET=your_production_secret_key_different_from_dev
NODE_ENV=production
```

⚠️ **IMPORTANT**: 
- Use **production connection string** from Neon
- `SESSION_SECRET` production must be **different** from development
- Never commit `.env` to GitHub!

#### D. Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for Vercel to build and deploy
3. After completion, you'll have URL like: `https://your-site.vercel.app`

### Step 4: Run Database Migration on Production

After first deployment:

1. Go to **Vercel Dashboard** → Project → **Settings** → **Functions**
2. Or run from local with production DATABASE_URL:

```bash
# Temporarily set production DATABASE_URL
DATABASE_URL="your_production_db_url" npm run db:push

# Seed production database
DATABASE_URL="your_production_db_url" npx tsx server/seed.ts
```

✅ Now production database has all tables and sample data!

### Step 5: Replace Sample Data

1. Visit `https://your-site.vercel.app/login`
2. Login with `admin` / `admin123`
3. Go to **Admin Panel** and update:
   - Couple information (names, photos, story)
   - Upload real photos from `attached_assets/wedding_images/`
   - Update event schedule
   - Add bank transfer QR codes
   - Change admin password (Settings → Change Password)

### Step 6: Custom Domain (Optional)

1. Buy domain (e.g., `xuanlam-xuanloi.com`)
2. Go to **Vercel Dashboard** → **Domains**
3. Add domain and follow DNS setup instructions

---

## 📖 User Guide

### 🔐 Admin Login

1. Visit `/login` or click **"Admin"** button in top right
2. Enter username: `admin` / password: `admin123`
3. Click **"Login"**

⚠️ **REQUIRED**: Change password immediately after first login!

### ⚙️ Update Couple Information

1. **Admin** → **Couple**
2. Update:
   - Bride & groom names
   - Upload profile photos (click on placeholder image)
   - Write individual biographies
   - Write love story (supports multiple paragraphs)
   - Select wedding date (date picker)
   - Upload hero background image
3. Click **"Save Changes"**

💡 **Tip**: Love story supports line breaks - each new paragraph automatically creates new line

### 📅 Manage Schedule

1. **Admin** → **Schedule**
2. **Add new event**:
   - Click **"Add Event"**
   - Enter title (e.g., "Ceremony")
   - Detailed description
   - Select time (datetime picker)
   - Enter location
   - Choose icon (home, heart, car, church, glass, music)
   - Order number (for sorting)
3. **Edit**: Click pencil icon
4. **Delete**: Click trash icon

### 🖼️ Manage Photo Gallery

1. **Admin** → **Gallery**
2. **Upload new photo**:
   - Click **"Add Photo"**
   - Select file from device (max 5MB, jpg/png/webp)
   - Enter caption (photo description)
   - Select category (pre-wedding, engagement, ceremony, wedding, portrait)
   - Order number
3. **Edit caption**: Click on photo
4. **Delete**: Click X icon

💡 **Tip**: Upload high-quality but optimized images (under 2MB) for fast loading

---

## 🐛 Troubleshooting

### Error: "cross-env: not found"

**Cause**: `cross-env` package not installed

**Solution**:
```bash
npm install --save-dev cross-env
npm run dev
```

### Error: Database connection failed

**Cause**: DATABASE_URL incorrect or database doesn't exist

**Solution**:
1. Check `.env` file contains correct `DATABASE_URL` format
2. Test connection: `npx tsx -e "import {pool} from './server/db'; pool.query('SELECT NOW()').then(console.log).catch(console.error)"`
3. If Neon database: Check IP allowlist

### Error: Images not showing after seed

**Cause**: Image paths incorrect or files don't exist

**Solution**:
1. Check files exist in `attached_assets/wedding_images/`
2. Check paths in `server/seed.ts` match filenames
3. Restart server: `Ctrl+C` → `npm run dev`

### Error: "Session store not found"

**Cause**: `sessions` table not created

**Solution**:
```bash
npm run db:push
```

### Error: Vercel build failed

**Cause**: Environment variables not set or build command wrong

**Solution**:
1. Check **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Ensure: `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production`
3. Redeploy: **Deployments** → **...** → **Redeploy**

---

## 🔒 Production Security

### Checklist before deployment

- [ ] Change default admin password
- [ ] Use `SESSION_SECRET` at least 32 characters long
- [ ] Set `NODE_ENV=production` on Vercel
- [ ] Never commit `.env` to GitHub
- [ ] Use separate production connection string
- [ ] Enable HTTPS (Vercel automatic)
- [ ] Review logs periodically
- [ ] Backup database regularly

### Database Backup

**Automatic with Neon**:
- Neon auto-backups every 24h
- 7-day retention
- Restore via Neon Console

**Manual backup**:
```bash
# Export entire database to JSON
DATABASE_URL="your_db_url" npx tsx server/backup.ts

# File saved at backups/wedding-db-backup-YYYY-MM-DD.json
```

---

## 📝 License

Copyright © 2025 Xuân Lâm & Xuân Lợi. All rights reserved.

This project is for personal and educational purposes only. Not for commercial use, reproduction, or distribution without permission.

---

## 🆘 Support

### Contact

- 📧 **Email**: support@example.com
- 💬 **GitHub Issues**: [Create an issue](https://github.com/your-username/wedding-website/issues)
- 📚 **Documentation**: This README

### References

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

<div align="center">

## 💖 Built With Love

**Wishing Xuân Lâm & Xuân Lợi a wonderful wedding!**

**Happily ever after! 💐🎉**

---

### ⭐ If you like this project, give it a star on GitHub!

[![GitHub Stars](https://img.shields.io/github/stars/your-username/wedding-website?style=social)](https://github.com/your-username/wedding-website)

</div>
