# 💍 Website Đám Cưới - Vietnamese Wedding Website

<div align="center">

![Version](https://img.shields.io/badge/version-1.3.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

**🎊 Nền tảng quản lý đám cưới chuyên nghiệp dành cho người Việt 🎊**

</div>

---

## 📋 Mục Lục

- [✨ Tính Năng Chính](#-tính-năng-chính)
- [🚀 Cài Đặt Nhanh](#-cài-đặt-nhanh)
- [🛠️ Công Nghệ](#%EF%B8%8F-công-nghệ)
- [📱 Deploy lên Production](#-deploy-lên-production)
- [📚 Version History](#-version-history)
- [🐛 Troubleshooting](#-troubleshooting)

---

## ✨ Tính Năng Chính

### 🎨 Giao Diện & Trải Nghiệm
- ✅ Thiết kế responsive hoàn hảo (Mobile, Tablet, Desktop)
- ✅ Animations mượt mà với Framer Motion
- ✅ Dark Mode tự động
- ✅ Loading screen với countdown
- ✅ Popup hệ thống (chào mừng, cuối trang)

### 🎵 Media & Gallery
- ✅ Music Player thông minh với autoplay (sau user interaction)
- ✅ Upload nhạc MP3/WAV từ thiết bị (max 10MB)
- ✅ Gallery 3D với lightbox
- ✅ Upload ảnh từ thiết bị hoặc Cloudinary
- ✅ Hiển thị ảnh với object-contain (giữ nguyên tỷ lệ, không crop)

### 💌 Tương Tác Khách Mời
- ✅ RSVP Form (Xác nhận tham dự) với deadline tự động
- ✅ Gửi lời chúc với hệ thống kiểm duyệt
- ✅ Upload ảnh từ khách mời (Guest Photo Upload)
- ✅ Gallery ảnh khách mời (Guest Photo Gallery)
- ✅ Nút xem livestream bên cạnh RSVP (khi có livestream active)

### 📺 Livestream
- ✅ Tích hợp YouTube & Facebook livestream
- ✅ Autoplay với muted (tuân thủ browser policies)
- ✅ Bật/tắt livestream từ admin panel
- ✅ Hiển thị trạng thái LIVE

### 💰 Gift Money Tracking
- ✅ Theo dõi mừng cưới (tiền mặt/chuyển khoản)
- ✅ QR Code mừng cưới (cô dâu & chú rể)
- ✅ Thống kê tổng số tiền nhận được
- ✅ Export danh sách mừng cưới

### ⚙️ Admin Panel
- ✅ Dashboard tổng quan với biểu đồ
- ✅ Quản lý toàn bộ nội dung website
- ✅ Upload ảnh/nhạc từ thiết bị (hỗ trợ multiple files)
- ✅ Phê duyệt tin nhắn, ảnh khách mời
- ✅ Export RSVP list sang CSV (UTF-8 BOM)
- ✅ Bảo mật với Passport.js + Bcrypt

---

## 🚀 Cài Đặt Nhanh

### 📦 Yêu Cầu
- Node.js 20.x+
- PostgreSQL (khuyên dùng Neon DB - miễn phí)
- Git

### ⚡ Quick Start

#### 🪟 **Windows Users** - Chạy file tự động:
```batch
setup.bat
```
File `setup.bat` sẽ tự động:
1. Kiểm tra Node.js
2. Cài đặt dependencies
3. Tạo file `.env`
4. Hướng dẫn setup database
5. Chạy website

Lần sau chỉ cần chạy:
```batch
start.bat
```

#### 🐧 **Linux/Mac Users** - Cài đặt thủ công:

```bash
# 1. Clone repository
git clone https://github.com/F12FLASH/WeddingSite.git
cd WeddingSite

# 2. Cài đặt dependencies
npm install

# 3. Tạo file .env
cp .env.example .env
# Chỉnh sửa .env với DATABASE_URL và SESSION_SECRET của bạn

# 4. Setup database
npm run db:push

# 5. Seed dữ liệu mẫu
npx tsx server/seed.ts

# 6. Chạy website
npm run dev
```

Website sẽ chạy tại: **http://localhost:5000**

**Admin Login**: 
- Username: `admin`
- Password: `admin123`

⚠️ **Nhớ đổi mật khẩu ngay sau lần đăng nhập đầu tiên!**

---

## 🛠️ Công Nghệ

### Frontend
- **React 18.3** - UI library
- **TypeScript 5.6** - Type safety
- **Vite 5.4** - Build tool
- **Tailwind CSS 3.4** - Utility-first CSS
- **Framer Motion 11.13** - Animations
- **Shadcn/UI** - Component library
- **TanStack Query 5.60** - Data fetching
- **Wouter 3.3** - Routing

### Backend
- **Node.js 20.x** - Runtime
- **Express.js 4.21** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM 0.39** - Type-safe ORM
- **Passport.js 0.7** - Authentication
- **Bcrypt 6.0** - Password hashing

---

## 📱 Deploy lên Production

### Vercel (Khuyên dùng - Miễn phí)

1. **Tạo Neon Database cho Production**
   - Truy cập [Neon Console](https://console.neon.tech/)
   - Tạo project mới
   - Copy connection string

2. **Push code lên GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/repo.git
   git push -u origin main
   ```

3. **Deploy trên Vercel**
   - Truy cập [Vercel](https://vercel.com/)
   - Import repository từ GitHub
   - Cấu hình Environment Variables:
     - `DATABASE_URL` - Connection string từ Neon
     - `SESSION_SECRET` - Random 64-char string
     - `NODE_ENV` - `production`
   - Click "Deploy"

4. **Run Database Migration**
   ```bash
   DATABASE_URL="your_prod_url" npm run db:push
   DATABASE_URL="your_prod_url" npx tsx server/seed.ts
   ```

5. **Test và đổi mật khẩu admin**

Chi tiết deployment: Xem phần "Deploy" trong file README cũ hoặc documentation folder.

---

## 📚 Version History

### 🎯 v1.3.0 - Latest (October 2025)
**🎨 UI/UX Improvements & Bug Fixes**

**New Features:**
- ✅ Thêm nút "Xem Livestream" bên cạnh nút RSVP (khi livestream active)
- ✅ Support multiple image uploads cho admin panels
- ✅ Autoplay cho livestream và music player (tuân thủ browser policies)

**Improvements:**
- ✅ Thu hẹp navigation menu spacing (px-5 → px-3, gap-1 → gap-0.5)
- ✅ Sửa lỗi hiển thị ảnh - dùng object-contain thay vì object-cover (giữ nguyên tỷ lệ)
- ✅ Di chuyển Guest Photo sections xuống dưới Gallery section
- ✅ Bỏ Registry section (sổ mừng cưới) khỏi landing page

**Technical:**
- ✅ Music player tự động phát sau user interaction (click/touch/scroll)
- ✅ Livestream autoplay với muted parameter
- ✅ Setup script cho Windows (.bat files)
- ✅ Comprehensive README với version history

**Files Changed:**
- `client/src/components/MusicPlayer.tsx` - Added auto-play logic
- `client/src/components/Livestream.tsx` - Added autoplay params
- `client/src/components/RSVP.tsx` - Added livestream button
- `client/src/components/Gallery.tsx` - Changed object-cover to object-contain
- `client/src/components/GuestPhotoGallery.tsx` - Changed object-cover to object-contain
- `client/src/components/Navigation.tsx` - Reduced spacing
- `client/src/pages/Landing.tsx` - Reorganized sections, removed Registry
- `client/src/pages/AdminGallery.tsx` - Added multiple file upload
- `README.md` - Complete rewrite with versioning
- `setup.bat`, `start.bat` - Windows automation scripts

---

### 🎁 v1.2.0 (Previous Version)
**Gift Money Tracking & Guest Photos**

**New Features:**
- ✅ Gift Money tracking system (tiền mừng cưới)
- ✅ Guest Photo upload with approval system
- ✅ Livestream management (YouTube & Facebook)
- ✅ Admin photo approval workflow

**Database Changes:**
- Added `gift_money` table
- Added `guest_photos` table
- Added `livestream_info` table

**Files Added:**
- `client/src/pages/AdminGiftMoney.tsx`
- `client/src/pages/AdminGuestPhotos.tsx`
- `client/src/pages/AdminLivestream.tsx`
- `client/src/components/GuestPhotoUpload.tsx`
- `client/src/components/GuestPhotoGallery.tsx`
- `client/src/components/Livestream.tsx`

---

### 🎨 v1.1.0
**Enhanced UI/UX & Media Features**

**New Features:**
- ✅ 3D Gallery với lightbox
- ✅ Music player với upload từ thiết bị
- ✅ Popup system (welcome & footer popups)
- ✅ Dark mode support
- ✅ Loading screen với countdown

**Improvements:**
- ✅ Improved animations với Framer Motion
- ✅ Better responsive design
- ✅ Enhanced admin dashboard
- ✅ Cloudinary integration cho upload ảnh

---

### 🎉 v1.0.0 - Initial Release
**Core Wedding Website Features**

**Features:**
- ✅ Landing page với hero section
- ✅ Couple information management
- ✅ RSVP system với deadline
- ✅ Guest message system với approval
- ✅ Photo gallery
- ✅ Schedule events
- ✅ Location với Google Maps
- ✅ Wedding party management
- ✅ Admin authentication
- ✅ Admin dashboard
- ✅ PostgreSQL database với Drizzle ORM
- ✅ Responsive design
- ✅ Session management

**Tech Stack:**
- React 18 + TypeScript
- Express.js backend
- PostgreSQL database
- Tailwind CSS
- Framer Motion
- Shadcn/UI components

---

## 🐛 Troubleshooting

### ❌ Lỗi: "Cannot load data"
**Nguyên nhân**: Database connection issue

**Giải pháp**:
1. Kiểm tra `DATABASE_URL` trong `.env`
2. Đảm bảo PostgreSQL đang chạy
3. Chạy lại `npm run db:push`

### ❌ Lỗi: Build Failed
**Nguyên nhân**: Dependency issues

**Giải pháp**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### ❌ Lỗi: Admin login không được
**Nguyên nhân**: Session issue

**Giải pháp**:
1. Kiểm tra `SESSION_SECRET` trong `.env`
2. Clear browser cache
3. Thử incognito mode
4. Check database sessions table:
   ```sql
   SELECT * FROM sessions;
   ```

### ❌ Lỗi: Nhạc/Livestream không tự động phát
**Nguyên nhân**: Browser autoplay policies

**Giải pháp**:
- Đây là hành vi bình thường của browsers hiện đại
- Nhạc/video sẽ tự động phát sau khi user có interaction đầu tiên (click/scroll)
- Để test: Click anywhere trên trang hoặc scroll

### 🪟 Windows Setup Issues

**Lỗi: "npm not found"**
- Cài đặt Node.js từ [nodejs.org](https://nodejs.org/)
- Restart terminal/command prompt

**Lỗi: "Permission denied"**
- Chạy Command Prompt với quyền Administrator
- Hoặc dùng PowerShell: `Set-ExecutionPolicy RemoteSigned`

---

## 📞 Support & Documentation

- **Full Documentation**: Xem folder `/docs` (nếu có)
- **Issues**: [GitHub Issues](https://github.com/F12FLASH/WeddingSite/issues)
- **Email**: support@example.com

---

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

---

## 💝 Credits

Developed with ❤️ for Vietnamese weddings.

**Special Thanks:**
- Shadcn/UI for beautiful components
- Vercel for free hosting
- Neon for serverless PostgreSQL
- All open-source contributors

---

<div align="center">

**🎊 Chúc bạn một đám cưới thật hoàn hảo! 🎊**

Made with 💕 in Vietnam

</div>
