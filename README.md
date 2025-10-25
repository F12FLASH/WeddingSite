# 💍 Website Đám Cưới / Wedding Website

<div align="center">

![Wedding Website](https://img.shields.io/badge/Wedding-Website-ff69b4?style=for-the-badge&logo=heart&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

**Website đám cưới đẹp mắt, hiện đại với giao diện song ngữ Việt-Anh**

[✨ Tính Năng](#-tính-năng) •
[🚀 Cài Đặt](#-cài-đặt) •
[📖 Hướng Dẫn](#-hướng-dẫn-sử-dụng) •
[🛠️ Công Nghệ](#%EF%B8%8F-công-nghệ)

</div>

---

## 📋 Mục Lục / Table of Contents

- [🇻🇳 Tiếng Việt](#-phần-tiếng-việt)
- [🇺🇸 English](#-english-section)

---

# 🇻🇳 Phần Tiếng Việt

## ✨ Tính Năng

### 🎨 Giao Diện & Trải Nghiệm
- ✅ **Thiết kế hiện đại** với animations mượt mà sử dụng Framer Motion
- ✅ **Responsive** hoàn hảo trên mọi thiết bị (Mobile, Tablet, Desktop)
- ✅ **Font chữ nghệ thuật** hỗ trợ đầy đủ tiếng Việt (Dancing Script, Great Vibes, Tangerine)
- ✅ **Dark Mode** - Chế độ tối tự động theo hệ thống
- ✅ **Loading screen** độc đáo với hiệu ứng chuyển động
- ✅ **Popup quảng cáo** - 2 loại popup:
  - Popup chào mừng: Hiển thị sau 1 giây khi vào trang lần đầu
  - Popup cuối trang: Hiển thị khi lướt đến 95% chiều cao trang

### 🎵 Âm Thanh & Media
- ✅ **Nhạc nền tự động phát** - Upload file MP3/WAV từ thiết bị (tối đa 10MB)
- ✅ **Auto-play và loop** - Nhạc tự động phát khi vào trang và lặp lại khi hết
- ✅ **Music Player** - Điều khiển phát/dừng, tắt tiếng, chuyển bài
- ✅ **Playlist thông minh** - Tên bài hát tự động lấy từ tên file
- ✅ **Upload nhiều bài hát** - Thêm và quản lý nhiều bài trong playlist (tối đa 50MB/file)
- ✅ **Upload ảnh** - Tải lên ảnh địa điểm, cặp đôi, gallery (tối đa 5MB)
- ✅ **Thư viện ảnh 3D** - Gallery với hiệu ứng chuyển động nâng cao
- ✅ **Base64 upload** - Upload ảnh không cần Cloudinary API key

### 📅 Quản Lý Sự Kiện
- ✅ **Thông tin cặp đôi** - Tên, ảnh, tiểu sử riêng, câu chuyện tình yêu
- ✅ **Lịch trình sự kiện** - Danh sách các hoạt động trong ngày cưới
- ✅ **Địa điểm tổ chức** - Bản đồ Google Maps nhúng (iframe), thông tin liên hệ
- ✅ **Thời gian sự kiện** - Hiển thị thời gian bắt đầu và kết thúc
- ✅ **Wedding Party** - Giới thiệu phù dâu, phù rể
- ✅ **FAQ** - Câu hỏi thường gặp

### 💌 Tương Tác Khách Mời
- ✅ **RSVP Form** - Xác nhận tham dự với deadline tự động (7 ngày trước ngày cưới)
- ✅ **Gửi lời chúc** - Khách mời gửi lời chúc phúc
- ✅ **Kiểm duyệt tin nhắn** - Admin phê duyệt trước khi hiển thị
- ✅ **Thông báo realtime** - Chuông thông báo RSVPs và tin nhắn mới với mark-as-read

### 💰 Quà Cưới
- ✅ **Danh sách quà cưới** - Gợi ý quà tặng cho cặp đôi
- ✅ **Chuyển khoản ngân hàng** - QR Code cho cô dâu và chú rể
- ✅ **Thông tin tài khoản** - Hiển thị số tài khoản, tên ngân hàng

### ⚙️ Quản Trị (Admin Panel)
- ✅ **Dashboard** - Tổng quan số liệu RSVPs, tin nhắn, lượt xem
- ✅ **Quản lý nội dung** - Cập nhật thông tin cặp đôi, sự kiện, ảnh
- ✅ **Quản lý popup** - Upload và bật/tắt popup chào mừng, popup cuối trang
- ✅ **Cài đặt âm thanh** - Upload nhạc nền từ thiết bị (đã đơn giản hóa - chỉ upload)
- ✅ **Cài đặt địa điểm** - Google Maps (iframe), ảnh địa điểm, thông tin liên hệ
- ✅ **Export dữ liệu** - Xuất danh sách RSVP ra CSV với UTF-8 BOM (hỗ trợ Excel tiếng Việt)
- ✅ **Xác thực an toàn** - Đăng nhập bằng Replit Auth
- ✅ **Font riêng cho Admin** - Sử dụng Times New Roman với kích thước phù hợp

### 🔒 Bảo Mật & Hiệu Suất
- ✅ **Authentication** - Bảo vệ trang admin bằng Replit Auth
- ✅ **Database backup** - Sao lưu dữ liệu định kỳ
- ✅ **Session management** - Quản lý phiên đăng nhập an toàn
- ✅ **Rate limiting** - Bảo vệ API khỏi spam

---

## 🚀 Cài Đặt

### Yêu Cầu Hệ Thống
- Node.js 20.x trở lên
- PostgreSQL database (Neon DB được khuyên dùng)
- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)

### Các Bước Cài Đặt

#### 1️⃣ Clone Repository
```bash
git clone <repository-url>
cd wedding-website
```

#### 2️⃣ Cài Đặt Dependencies
```bash
npm install
```

#### 3️⃣ Cấu Hình Database
Tạo file `.env` trong thư mục gốc:
```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_random_secret_key
```

#### 4️⃣ Tạo Database Schema
```bash
npm run db:push
```

#### 5️⃣ Seed Dữ Liệu Mẫu (Tùy chọn)
```bash
npm run seed
```

Thông tin đăng nhập admin mặc định:
- **Username:** `admin`
- **Password:** `admin123`
- ⚠️ **Lưu ý:** Đổi mật khẩu ngay sau khi đăng nhập lần đầu!

#### 6️⃣ Chạy Development Server
```bash
npm run dev
```

Website sẽ chạy tại: `http://localhost:5000`

#### 7️⃣ Deploy lên Production
```bash
npm run build
npm run start
```

Hoặc sử dụng nút **"Deploy"** trên Replit để publish website.

---

## 📖 Hướng Dẫn Sử Dụng

### 🔐 Đăng Nhập Admin
1. Truy cập `/login` hoặc click nút "Admin" trên trang chủ
2. Đăng nhập bằng tài khoản admin
3. Bạn sẽ được chuyển đến trang Dashboard

### ⚙️ Cài Đặt Website

#### Thông Tin Địa Điểm
1. Vào **Admin → Cài Đặt → Tổng Quan**
2. Nhập thông tin địa điểm tổ chức
3. Upload ảnh địa điểm (tối đa 5MB)
4. Nhập link Google Maps (nhúng iframe):
   - Vào Google Maps → Tìm địa điểm → Chia sẻ → **Nhúng bản đồ**
   - Copy toàn bộ URL trong thuộc tính `src` của thẻ `<iframe>`
   - Dán vào trường "Link Google Maps"
   - Ví dụ: `https://www.google.com/maps/embed?pb=...`

#### Cài Đặt Popup (MỚI!)
1. Vào **Admin → Cài Đặt → Popup Quảng Cáo**
2. **Popup Chào Mừng:**
   - Click "Tải Ảnh Popup Lên" để upload ảnh (tối đa 5MB)
   - Bật/tắt hiển thị bằng nút toggle
   - Popup sẽ hiện sau 1 giây khi khách vào trang lần đầu
   - Lưu trữ localStorage để không hiện lại cho cùng một người
3. **Popup Cuối Trang:**
   - Upload ảnh popup tương tự
   - Bật/tắt hiển thị
   - Popup sẽ hiện khi khách lướt đến 95% chiều cao trang web

#### Cài Đặt Âm Thanh (CẢI TIẾN MỚI!)
1. Vào **Admin → Cài Đặt → Tính Năng**
2. Click **"Thêm Bài Hát"** để upload nhiều bài
3. Chọn file MP3/WAV từ thiết bị (tối đa 10MB/bài, tối đa 50MB tổng)
4. Tên bài hát tự động lấy từ tên file (vd: "Bai_Hat_Cuoi.mp3" → "Bai Hat Cuoi")
5. File sẽ tự động upload và phát trên trang chủ
6. Nhạc tự động phát khi vào trang và lặp lại khi hết
7. Xóa bài hát bằng icon thùng rác bên cạnh mỗi bài
8. ⚠️ **Chỉ upload từ thiết bị** - không hỗ trợ nhập URL

#### Quản Lý Nội Dung
- **Thông tin cặp đôi**: Admin → Cặp Đôi (bao gồm tiểu sử riêng)
- **Lịch trình**: Admin → Lịch Trình
- **Thư viện ảnh**: Admin → Thư Viện (hiệu ứng 3D nâng cao)
- **Tin nhắn**: Admin → Tin Nhắn (phê duyệt/xóa)
- **RSVP**: Admin → Xác Nhận Tham Dự (deadline tự động 7 ngày trước)

### 📊 Export Dữ Liệu
1. Vào **Admin → Xác Nhận Tham Dự**
2. Click **"Export CSV"**
3. File CSV sẽ tải xuống với UTF-8 BOM (mở trực tiếp trong Excel không bị lỗi font)

---

## 🛠️ Công Nghệ

### Frontend
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library (hiệu ứng 3D cho Gallery)
- **Shadcn/UI** - Component library
- **TanStack Query** - Data fetching & caching
- **Wouter** - Lightweight routing
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Express.js** - Web framework
- **Node.js 20** - Runtime
- **PostgreSQL (Neon)** - Database
- **Drizzle ORM** - Type-safe ORM
- **Passport.js** - Authentication
- **Express Session** - Session management

### DevOps & Tools
- **Vite** - Build tool & dev server
- **TypeScript** - Type checking
- **Drizzle Kit** - Database migrations
- **Cross-env** - Environment variables

---

## 📂 Cấu Trúc Thư Mục

```
wedding-website/
├── client/                # Frontend code
│   ├── src/
│   │   ├── components/    # React components (Hero, Gallery, RSVP, PopupManager, etc.)
│   │   ├── pages/         # Page components (Landing, Admin pages)
│   │   ├── lib/           # Utilities (queryClient, imageUpload, authUtils)
│   │   └── index.css      # Global styles (Font definitions, theme colors)
├── server/                # Backend code
│   ├── routes.ts          # API routes (popups, settings, couple, etc.)
│   ├── storage.ts         # Database operations
│   ├── auth.ts            # Authentication (Replit Auth)
│   └── index.ts           # Server entry
├── shared/                # Shared code
│   └── schema.ts          # Database schema & types (includes popups table)
├── attached_assets/       # Static assets & uploaded files
├── package.json
└── README.md
```

---

## 🎨 Customization

### Thay Đổi Màu Sắc
Chỉnh sửa file `client/src/index.css`:
```css
:root {
  --primary: 340 82% 52%;  /* Màu chính (hồng) */
  --secondary: 340 25% 88%; /* Màu phụ */
}
```

### Thay Đổi Font Chữ
```css
:root {
  --font-cursive: 'Dancing Script', cursive; /* Font nghệ thuật (Trang chủ) */
  --font-serif: 'Playfair Display', serif;   /* Font tiêu đề */
  --font-admin: 'Times New Roman', serif;     /* Font admin panel */
}
```

---

## 🆕 Tính Năng Mới (Phiên Bản Hiện Tại)

### 1. Popup Quảng Cáo (NEW!)
- ✅ Popup chào mừng hiển thị khi vào trang lần đầu
- ✅ Popup cuối trang hiển thị khi lướt đến 95%
- ✅ Quản lý upload và bật/tắt trong Admin Settings
- ✅ LocalStorage để không hiện lại cho cùng người dùng

### 2. Upload Âm Thanh Đơn Giản (IMPROVED!)
- ✅ Chỉ hỗ trợ upload từ thiết bị (đã xóa option nhập URL)
- ✅ Upload file MP3/WAV lên server (tối đa 10MB)
- ✅ Tự động phát nhạc nền trên trang chủ

### 3. Bản Đồ Google Maps (FIXED!)
- ✅ Sử dụng iframe nhúng thay vì lat/lng
- ✅ Hiển thị đầy đủ bản đồ tương tác trên trang chủ
- ✅ Hướng dẫn rõ ràng cách lấy link nhúng từ Google Maps

### 4. RSVP Deadline Tự Động (VERIFIED!)
- ✅ Tự động tính deadline = ngày cưới - 7 ngày
- ✅ Hiển thị tiếng Việt đầy đủ

### 5. Font Chữ Tiếng Việt (ENHANCED!)
- ✅ Trang chủ: Dancing Script, Great Vibes, Tangerine (font nghệ thuật)
- ✅ Admin: Times New Roman với kích thước phù hợp
- ✅ Hỗ trợ đầy đủ dấu tiếng Việt

### 6. Thông Báo Đánh Dấu Đã Đọc (IMPROVED!)
- ✅ Chuông thông báo với đếm số lượng chưa đọc
- ✅ Nút "Đọc hết" để đánh dấu tất cả
- ✅ LocalStorage lưu trạng thái đã xem

### 7. Gallery 3D (ENHANCED!)
- ✅ Hiệu ứng 3D với perspective transforms
- ✅ Hover effects với rotateY, rotateX, rotateZ
- ✅ Shimmer và sparkle effects
- ✅ Spring-based animations

---

## 📝 License

Copyright © 2025. All rights reserved.

---

## 🆘 Hỗ Trợ

Nếu gặp vấn đề hoặc có câu hỏi:
1. Kiểm tra [Documentation](#-hướng-dẫn-sử-dụng)
2. Đọc lại hướng dẫn upload và cài đặt
3. Liên hệ support team

---

<div align="center">

### Được Phát Triển Với ❤️

**Chúc bạn có một đám cưới tuyệt vời! 💐🎉**

</div>

---

# 🇺🇸 English Section

## ✨ Features

### 🎨 Design & Experience
- ✅ **Modern design** with smooth animations using Framer Motion
- ✅ **Fully responsive** on all devices (Mobile, Tablet, Desktop)
- ✅ **Artistic fonts** with full Vietnamese support (Dancing Script, Great Vibes, Tangerine)
- ✅ **Dark Mode** - Automatic theme switching
- ✅ **Unique loading screen** with motion effects
- ✅ **Advertisement popups** - 2 types:
  - Welcome popup: Shows after 1 second on first visit
  - Scroll-end popup: Shows when scrolling to 95% of page height

### 🎵 Audio & Media
- ✅ **Auto-playing background music** - Upload MP3/WAV files from device (max 10MB)
- ✅ **Auto-play and loop** - Music plays automatically on page load and loops when finished
- ✅ **Music Player** - Play/pause, mute, skip tracks
- ✅ **Smart playlist** - Song names automatically extracted from file names
- ✅ **Multiple song upload** - Add and manage multiple songs in playlist (max 50MB/file)
- ✅ **Image upload** - Upload venue, couple, and gallery images (max 5MB)
- ✅ **3D Photo gallery** - Gallery with advanced motion effects
- ✅ **Base64 upload** - Upload images without Cloudinary API key

### 📅 Event Management
- ✅ **Couple information** - Names, photos, individual bios, love story
- ✅ **Event schedule** - List of wedding day activities
- ✅ **Venue location** - Embedded Google Maps (iframe), contact info
- ✅ **Event timing** - Display start and end times
- ✅ **Wedding Party** - Introduce bridesmaids and groomsmen
- ✅ **FAQ** - Frequently asked questions

### 💌 Guest Interactions
- ✅ **RSVP Form** - Attendance confirmation with automatic deadline (7 days before wedding)
- ✅ **Send wishes** - Guests send congratulation messages
- ✅ **Message moderation** - Admin approval before display
- ✅ **Real-time notifications** - Bell notifications for new RSVPs and messages with mark-as-read

### 💰 Wedding Gifts
- ✅ **Gift registry** - Suggested gifts for the couple
- ✅ **Bank transfer** - QR Codes for bride and groom
- ✅ **Account information** - Display account number, bank name

### ⚙️ Administration (Admin Panel)
- ✅ **Dashboard** - Overview of RSVPs, messages, views
- ✅ **Content management** - Update couple info, events, photos
- ✅ **Popup management** - Upload and enable/disable welcome and scroll-end popups
- ✅ **Audio settings** - Upload background music from device (simplified - upload only)
- ✅ **Venue settings** - Google Maps (iframe), venue image, contact information
- ✅ **Data export** - Export RSVP list to CSV with UTF-8 BOM (Excel Vietnamese support)
- ✅ **Secure authentication** - Login with Replit Auth
- ✅ **Separate admin font** - Uses Times New Roman with appropriate sizes

### 🔒 Security & Performance
- ✅ **Authentication** - Protect admin pages with Replit Auth
- ✅ **Database backup** - Periodic data backup
- ✅ **Session management** - Secure session handling
- ✅ **Rate limiting** - Protect API from spam

---

## 🚀 Installation

### System Requirements
- Node.js 20.x or higher
- PostgreSQL database (Neon DB recommended)
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation Steps

#### 1️⃣ Clone Repository
```bash
git clone <repository-url>
cd wedding-website
```

#### 2️⃣ Install Dependencies
```bash
npm install
```

#### 3️⃣ Configure Database
Create `.env` file in root directory:
```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_random_secret_key
```

#### 4️⃣ Create Database Schema
```bash
npm run db:push
```

#### 5️⃣ Seed Sample Data (Optional)
```bash
npm run seed
```

Default admin credentials:
- **Username:** `admin`
- **Password:** `admin123`
- ⚠️ **Note:** Change password immediately after first login!

#### 6️⃣ Run Development Server
```bash
npm run dev
```

Website will run at: `http://localhost:5000`

#### 7️⃣ Deploy to Production
```bash
npm run build
npm run start
```

Or use the **"Deploy"** button on Replit to publish the website.

---

## 📖 User Guide

### 🔐 Admin Login
1. Go to `/login` or click "Admin" button on homepage
2. Login with admin account
3. You'll be redirected to Dashboard

### ⚙️ Website Settings

#### Venue Information
1. Go to **Admin → Settings → General**
2. Enter venue information
3. Upload venue image (max 5MB)
4. Enter Google Maps link (embed iframe):
   - Go to Google Maps → Find location → Share → **Embed a map**
   - Copy entire URL from iframe's `src` attribute
   - Paste into "Google Maps Link" field
   - Example: `https://www.google.com/maps/embed?pb=...`

#### Popup Settings (NEW!)
1. Go to **Admin → Settings → Advertisement Popups**
2. **Welcome Popup:**
   - Click "Upload Popup Image" to upload image (max 5MB)
   - Enable/disable display with toggle switch
   - Popup shows after 1 second on first visit
   - Uses localStorage to not show again to same user
3. **Scroll-End Popup:**
   - Upload popup image similarly
   - Enable/disable display
   - Popup shows when scrolling to 95% of page height

#### Audio Settings (NEW IMPROVEMENTS!)
1. Go to **Admin → Settings → Features**
2. Click **"Add Song"** to upload multiple songs
3. Select MP3/WAV file from device (max 10MB/song, max 50MB total)
4. Song name automatically extracted from filename (e.g., "Wedding_Song.mp3" → "Wedding Song")
5. File will automatically upload and play on homepage
6. Music auto-plays on page load and loops when finished
7. Remove songs with trash icon next to each song
8. ⚠️ **Device upload only** - URL input not supported

#### Content Management
- **Couple info**: Admin → Couple (includes individual bios)
- **Schedule**: Admin → Schedule
- **Photo gallery**: Admin → Gallery (enhanced 3D effects)
- **Messages**: Admin → Messages (approve/delete)
- **RSVP**: Admin → RSVPs (automatic deadline 7 days before)

### 📊 Export Data
1. Go to **Admin → RSVPs**
2. Click **"Export CSV"**
3. CSV file downloads with UTF-8 BOM (opens directly in Excel without font issues)

---

## 🛠️ Technology Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library (3D effects for Gallery)
- **Shadcn/UI** - Component library
- **TanStack Query** - Data fetching & caching
- **Wouter** - Lightweight routing
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Express.js** - Web framework
- **Node.js 20** - Runtime
- **PostgreSQL (Neon)** - Database
- **Drizzle ORM** - Type-safe ORM
- **Passport.js** - Authentication
- **Express Session** - Session management

### DevOps & Tools
- **Vite** - Build tool & dev server
- **TypeScript** - Type checking
- **Drizzle Kit** - Database migrations
- **Cross-env** - Environment variables

---

## 🆕 New Features (Current Version)

### 1. Advertisement Popups (NEW!)
- ✅ Welcome popup shows on first page visit
- ✅ Scroll-end popup shows at 95% scroll
- ✅ Upload and toggle management in Admin Settings
- ✅ LocalStorage to prevent showing again to same user

### 2. Simplified Audio Upload (IMPROVED!)
- ✅ Device upload only (URL input removed)
- ✅ Upload MP3/WAV files to server (max 10MB)
- ✅ Auto-play background music on homepage

### 3. Google Maps Display (FIXED!)
- ✅ Uses embed iframe instead of lat/lng
- ✅ Displays full interactive map on homepage
- ✅ Clear instructions for getting embed link from Google Maps

### 4. Auto RSVP Deadline (VERIFIED!)
- ✅ Auto-calculates deadline = wedding date - 7 days
- ✅ Full Vietnamese language display

### 5. Vietnamese Fonts (ENHANCED!)
- ✅ Homepage: Dancing Script, Great Vibes, Tangerine (artistic fonts)
- ✅ Admin: Times New Roman with appropriate sizes
- ✅ Full Vietnamese diacritics support

### 6. Mark-as-Read Notifications (IMPROVED!)
- ✅ Notification bell with unread count
- ✅ "Mark all as read" button
- ✅ LocalStorage saves viewed status

### 7. 3D Gallery (ENHANCED!)
- ✅ 3D effects with perspective transforms
- ✅ Hover effects with rotateY, rotateX, rotateZ
- ✅ Shimmer and sparkle effects
- ✅ Spring-based animations

---

## 🎨 Customization

### Change Colors
Edit `client/src/index.css`:
```css
:root {
  --primary: 340 82% 52%;  /* Primary color (pink) */
  --secondary: 340 25% 88%; /* Secondary color */
}
```

### Change Fonts
```css
:root {
  --font-cursive: 'Dancing Script', cursive; /* Decorative font (Homepage) */
  --font-serif: 'Playfair Display', serif;   /* Heading font */
  --font-admin: 'Times New Roman', serif;     /* Admin panel font */
}
```

---

## 📝 License

Copyright © 2025. All rights reserved.

---

## 🆘 Support

If you encounter issues or have questions:
1. Check [Documentation](#-user-guide)
2. Re-read upload and settings instructions
3. Contact support team

---

<div align="center">

### Built With ❤️

**Wishing you a wonderful wedding! 💐🎉**

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)](https://github.com/yourusername)

</div>
