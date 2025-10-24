# 💍 Hệ Thống Website Đám Cưới | Wedding Website Platform

> Nền tảng website đám cưới hiện đại, đầy đủ tính năng với giao diện lãng mạn và hệ thống quản lý toàn diện

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg)](https://www.postgresql.org/)

[English](#english-documentation) | [Tiếng Việt](#vietnamese-documentation)

---

<a name="vietnamese-documentation"></a>
## 🇻🇳 Tài Liệu Tiếng Việt

### 📖 Mục Lục
- [Giới Thiệu](#vn-intro)
- [Tính Năng](#vn-features)
- [Công Nghệ](#vn-tech)
- [Cài Đặt](#vn-installation)
- [Sử Dụng](#vn-usage)
- [Cấu Trúc Dự Án](#vn-structure)
- [API Documentation](#vn-api)
- [Database](#vn-database)
- [Deploy](#vn-deploy)
- [Bảo Mật](#vn-security)

<a name="vn-intro"></a>
### 🌟 Giới Thiệu

Hệ thống website đám cưới toàn diện giúp các cặp đôi tạo một trang web đẹp mắt để chia sẻ thông tin đám cưới, quản lý khách mời, nhận lời chúc và theo dõi RSVP. Được xây dựng với công nghệ hiện đại, giao diện responsive và các tính năng quản lý mạnh mẽ.

**✨ Điểm Nổi Bật:**
- 🎨 Giao diện lãng mạn, sang trọng với hiệu ứng động mượt mà
- 📱 Responsive hoàn toàn trên mọi thiết bị
- 🔐 Hệ thống xác thực an toàn với Passport.js
- 💾 Database PostgreSQL với backup tự động
- ⚡ Performance tối ưu với React Query và caching
- 🎯 SEO-friendly với meta tags đầy đủ

<a name="vn-features"></a>
### ✨ Tính Năng Chính

#### 🌐 Website Công Khai (Dành cho Khách Mời)

**1. Trang Chủ Hero**
- Banner lớn với ảnh cặp đôi
- Đếm ngược thời gian đến ngày cưới
- Call-to-action buttons (RSVP, Xem Lịch Trình)
- Animation mượt mà khi scroll

**2. Về Chúng Tôi**
- Câu chuyện tình yêu của cặp đôi
- Ảnh riêng của cô dâu và chú rể
- Typography thanh lịch với font chữ đẹp

**3. Lịch Trình Sự Kiện**
- Timeline hiển thị các sự kiện trong ngày cưới
- Thời gian, địa điểm, mô tả chi tiết
- Icon đặc trưng cho từng sự kiện
- Layout tối ưu cho mobile

**4. Album Ảnh**
- Grid layout với hiệu ứng masonry
- Click để phóng to ảnh
- Phân loại theo danh mục (Pre-wedding, Engagement, etc.)
- Lazy loading cho performance

**5. Lời Chúc**
- Form gửi lời chúc dễ dàng
- Chỉ hiển thị lời chúc đã được phê duyệt
- Validation form đầy đủ
- Animation cho message cards

**6. RSVP Form**
- Thu thập thông tin khách: tên, email, số điện thoại
- Xác nhận tham dự (Có/Không)
- Số lượng khách đi cùng
- Lựa chọn món ăn
- Yêu cầu đặc biệt (dị ứng, ăn chay, etc.)
- Validation với Zod schema

**7. Quà Mừng**
- Danh sách quà đăng ký
- Thông tin: tên, mô tả, giá, hình ảnh
- Link mua quà
- Đánh dấu quà đã được mua

**8. Địa Điểm**
- Tên và địa chỉ địa điểm tổ chức
- **NEW**: Thông tin liên hệ địa điểm (điện thoại, email)
- **NEW**: Thời gian bắt đầu và kết thúc sự kiện
- Tọa độ bản đồ
- Nút chỉ đường (Google Maps)
- Thông tin đỗ xe, giao thông

**9. Trình Phát Nhạc**
- Phát nhạc nền tự động
- **NEW**: Tích hợp với URL nhạc tùy chỉnh từ Admin Settings
- Controls: play/pause, volume, next/previous
- Có thể minimize/expand
- Animation đĩa nhạc quay
- Playlist mặc định + nhạc tùy chỉnh

**10. Navigation & Footer**
- Smooth scroll navigation
- Highlight section đang xem
- Mobile hamburger menu
- Links mạng xã hội

#### 🔐 Bảng Điều Khiển Admin

**1. Dashboard / Tổng Quan**
- Thống kê quan trọng: RSVPs, lời chúc, ảnh
- Hoạt động gần đây
- Nút hành động nhanh
- Đếm ngược đến ngày cưới
- Tỷ lệ phản hồi

**2. Quản Lý Thông Tin Cặp Đôi**
- Chỉnh sửa tên cô dâu, chú rể
- Thiết lập ngày cưới
- Viết/sửa câu chuyện tình yêu
- **NEW**: Thêm tiểu sử riêng cho cô dâu và chú rể
- Upload ảnh cô dâu, chú rể, hero image
- Preview realtime
- Validation form

**3. Quản Lý Lịch Trình**
- **CREATE**: Thêm sự kiện mới
- **READ**: Danh sách tất cả sự kiện
- **UPDATE**: Chỉnh sửa sự kiện
- **DELETE**: Xóa sự kiện
- Form fields: tiêu đề, mô tả, thời gian, địa điểm, icon, thứ tự

**4. Quản Lý Album Ảnh**
- **CREATE**: Thêm ảnh qua URL
- **READ**: Hiển thị grid tất cả ảnh
- **UPDATE**: Sửa caption, danh mục, thứ tự
- **DELETE**: Xóa ảnh
- Quản lý danh mục
- Sắp xếp thứ tự hiển thị

**5. Kiểm Duyệt Lời Chúc**
- **READ**: Xem tất cả lời chúc
- **UPDATE**: Phê duyệt/bỏ phê duyệt
- **DELETE**: Xóa lời chúc không phù hợp
- Filter theo trạng thái (tất cả, đã duyệt, chờ duyệt)
- Hành động hàng loạt

**6. Quản Lý RSVP**
- **READ**: Xem tất cả RSVP
- **DELETE**: Xóa RSVP (nếu cần)
- Filter theo trạng thái (tham dự, từ chối)
- Filter theo món ăn
- Tìm kiếm theo tên, email
- Thống kê: tổng số, tham dự, từ chối, số khách
- Tỷ lệ phản hồi
- Export CSV

**7. Quản Lý Quà Mừng**
- **CREATE**: Thêm món quà mới
- **READ**: Danh sách tất cả quà
- **UPDATE**: Sửa thông tin quà
- **DELETE**: Xóa quà
- Theo dõi trạng thái đã mua
- Hiển thị giá

**8. Cài Đặt**
- **READ**: Load cấu hình hiện tại
- **UPDATE**: Lưu cấu hình
- Tên địa điểm
- Địa chỉ
- **NEW**: Số điện thoại và email địa điểm
- **NEW**: Thời gian bắt đầu và kết thúc sự kiện
- Tọa độ (latitude, longitude)
- URL nhạc nền

**9. Sidebar Tối Ưu**
- Menu gọn gàng, dễ sử dụng
- Nút "Xem Trang Chủ" để preview
- Nút đăng xuất
- Không che nội dung
- Responsive trên mobile

<a name="vn-tech"></a>
### 🛠 Công Nghệ Sử Dụng

**Frontend**
```
React 18.3+          - UI Framework
TypeScript 5+        - Type Safety
Vite 5+              - Build Tool & Dev Server
Tailwind CSS 3.4+    - Styling Framework
shadcn/ui            - Component Library
Framer Motion 11+    - Animations
TanStack Query 5+    - Data Fetching & Caching
Wouter 3+            - Routing
React Hook Form 7+   - Form Management
Zod 3+               - Schema Validation
Lucide React         - Icons
```

**Backend**
```
Node.js 20+          - Runtime
Express 4+           - Web Framework
TypeScript 5+        - Type Safety
Drizzle ORM 0.36+    - Database ORM
PostgreSQL 15+       - Database (Neon)
Passport.js 0.7+     - Authentication
bcrypt 5+            - Password Hashing
connect-pg-simple    - Session Store
```

**Development Tools**
```
tsx                  - TypeScript Execution
esbuild             - Fast JavaScript bundler
Drizzle Kit         - Database Migrations
cross-env           - Environment Variables
dotenv              - .env File Support
```

<a name="vn-installation"></a>
### 🚀 Cài Đặt & Chạy Dự Án

#### Yêu Cầu Hệ Thống
- Node.js 20.x hoặc cao hơn
- PostgreSQL 15.x hoặc cao hơn (hoặc Neon Database)
- npm 10.x hoặc cao hơn

#### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd wedding-website
```

#### Bước 2: Cài Đặt Dependencies
```bash
npm install
```

#### Bước 3: Cấu Hình Biến Môi Trường

Tạo file `.env` trong thư mục gốc:

```env
# Database
DATABASE_URL=postgresql://username:password@host:5432/database

# Authentication
SESSION_SECRET=your-very-secure-session-secret-min-32-chars

# Server
PORT=5000
NODE_ENV=development

# Optional: Replit specific (if deploying on Replit)
REPL_ID=your-repl-id
REPLIT_DOMAINS=your-domain.replit.dev
```

**⚠️ Lưu Ý Bảo Mật:**
- Không commit file `.env` vào git
- Sử dụng session secret mạnh (ít nhất 32 ký tự ngẫu nhiên)
- Thay đổi credentials mặc định trong production

#### Bước 4: Setup Database

**4.1. Tạo Database Schema**
```bash
npm run db:push
```

**4.2. Import Dữ Liệu Demo (Tùy Chọn)**
```bash
# Nếu bạn có file backup
psql $DATABASE_URL < database_backup.sql

# Hoặc chạy seed script
npx tsx server/seed.ts
```

Dữ liệu demo bao gồm:
- 1 tài khoản admin (username: `admin`, password: `admin123`)
- Thông tin cặp đôi mẫu
- 5 sự kiện đám cưới
- 6 ảnh trong album
- 5 lời chúc (4 đã duyệt, 1 chờ duyệt)
- 4 RSVP mẫu
- 5 món quà
- Cài đặt địa điểm

#### Bước 5: Chạy Development Server
```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:5000`

- **Trang chủ công khai**: `http://localhost:5000/`
- **Trang đăng nhập**: `http://localhost:5000/login`
- **Admin dashboard**: `http://localhost:5000/admin` (yêu cầu đăng nhập)

<a name="vn-usage"></a>
### 📖 Hướng Dẫn Sử Dụng

#### Đăng Nhập Admin

1. Truy cập `/login`
2. Nhập thông tin:
   - Username: `admin`
   - Password: `admin123` (đổi sau khi đăng nhập lần đầu)
3. Click "Đăng Nhập"

#### Quản Lý Nội Dung

**Cập Nhật Thông Tin Cặp Đôi:**
1. Vào menu "Thông Tin Cô Dâu Chú Rể"
2. Điền thông tin: tên, ngày cưới, câu chuyện
3. Thêm URL ảnh cho cô dâu, chú rể và hero image
4. Click "Lưu Thay Đổi"

**Thêm Sự Kiện:**
1. Vào menu "Lịch Trình"
2. Click "Thêm Sự Kiện Mới"
3. Điền: tiêu đề, mô tả, thời gian, địa điểm
4. Chọn icon phù hợp
5. Thiết lập thứ tự hiển thị
6. Click "Tạo Sự Kiện"

**Quản Lý Ảnh:**
1. Vào menu "Album Ảnh"
2. Click "Thêm Ảnh Mới"
3. Nhập URL ảnh
4. Thêm caption và chọn danh mục
5. Click "Thêm Ảnh"

**Kiểm Duyệt Lời Chúc:**
1. Vào menu "Lời Chúc"
2. Xem danh sách lời chúc chờ duyệt
3. Click "Phê Duyệt" để hiển thị công khai
4. Click "Xóa" nếu nội dung không phù hợp

**Xem RSVP:**
1. Vào menu "Danh Sách Khách"
2. Xem thống kê tổng quan
3. Filter theo trạng thái hoặc món ăn
4. Search theo tên hoặc email
5. Export danh sách ra CSV nếu cần

<a name="vn-structure"></a>
### 📁 Cấu Trúc Dự Án

```
wedding-website/
├── client/                    # Frontend React Application
│   ├── src/
│   │   ├── components/        # React Components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── About.tsx     # About section
│   │   │   ├── Gallery.tsx   # Photo gallery
│   │   │   ├── Hero.tsx      # Hero section
│   │   │   ├── Messages.tsx  # Guest messages
│   │   │   ├── Navigation.tsx # Navigation bar
│   │   │   ├── RSVP.tsx      # RSVP form
│   │   │   └── ...
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useAuth.ts    # Authentication hook
│   │   │   └── use-toast.ts  # Toast notifications
│   │   ├── lib/              # Utilities & helpers
│   │   │   ├── queryClient.ts # React Query setup
│   │   │   └── utils.ts      # Utility functions
│   │   ├── pages/            # Page components
│   │   │   ├── AdminCouple.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminGallery.tsx
│   │   │   ├── AdminHome.tsx
│   │   │   ├── AdminMessages.tsx
│   │   │   ├── AdminRegistry.tsx
│   │   │   ├── AdminRSVPs.tsx
│   │   │   ├── AdminSchedule.tsx
│   │   │   ├── AdminSettings.tsx
│   │   │   ├── Landing.tsx   # Public homepage
│   │   │   ├── Login.tsx     # Login page
│   │   │   └── NotFound.tsx  # 404 page
│   │   ├── App.tsx           # Main app component
│   │   ├── index.css         # Global styles
│   │   └── main.tsx          # Entry point
│   └── index.html            # HTML template
├── server/                    # Backend Express Application
│   ├── auth.ts               # Authentication setup
│   ├── db.ts                 # Database connection
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API routes
│   ├── seed.ts               # Database seeding
│   ├── storage.ts            # Data access layer
│   └── vite.ts               # Vite integration
├── shared/                    # Shared code
│   └── schema.ts             # Database schema & types
├── scripts/                   # Utility scripts
│   └── create_backup.ts      # Database backup script
├── attached_assets/          # Static assets
│   └── generated_images/     # Generated/uploaded images
├── database_backup.sql       # Database backup file
├── .env                      # Environment variables (not in git)
├── .gitignore               # Git ignore rules
├── drizzle.config.ts        # Drizzle ORM config
├── package.json             # Dependencies & scripts
├── tailwind.config.ts       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
├── README.md                # This file
└── PROJECT_STATUS.md        # Project status & roadmap
```

<a name="vn-api"></a>
### 🔌 API Documentation

#### Authentication Endpoints

```
POST   /api/login           - Login with username/password
GET    /api/logout          - Logout (redirects to homepage)
GET    /api/auth/user       - Get current user info (protected)
```

#### Couple Info Endpoints

```
GET    /api/couple          - Get couple information (public)
POST   /api/couple          - Create/Update couple info (protected)
```

#### Schedule Events Endpoints

```
GET    /api/schedule        - List all events (public)
POST   /api/schedule        - Create event (protected)
PATCH  /api/schedule/:id    - Update event (protected)
DELETE /api/schedule/:id    - Delete event (protected)
```

#### Photos Endpoints

```
GET    /api/photos          - List all photos (public)
POST   /api/photos          - Add photo (protected)
PATCH  /api/photos/:id      - Update photo (protected)
DELETE /api/photos/:id      - Delete photo (protected)
```

#### Guest Messages Endpoints

```
GET    /api/messages        - Get messages (?approved=true for public)
POST   /api/messages        - Submit message (public)
PATCH  /api/messages/:id/approve - Approve/unapprove (protected)
DELETE /api/messages/:id    - Delete message (protected)
```

#### RSVPs Endpoints

```
GET    /api/rsvps           - List all RSVPs (protected)
POST   /api/rsvps           - Submit RSVP (public)
DELETE /api/rsvps/:id       - Delete RSVP (protected)
```

#### Registry Endpoints

```
GET    /api/registry        - List registry items (public)
POST   /api/registry        - Add item (protected)
PATCH  /api/registry/:id    - Update item (protected)
DELETE /api/registry/:id    - Delete item (protected)
```

#### Settings Endpoints

```
GET    /api/settings        - Get settings (public)
POST   /api/settings        - Update settings (protected)
```

<a name="vn-database"></a>
### 🗄 Database

#### Schema

**users** - Tài khoản admin
```sql
- id (varchar, PK, UUID)
- username (varchar, unique)
- password (varchar, hashed)
- email (varchar, unique, optional)
- firstName (varchar)
- lastName (varchar)
- createdAt (timestamp)
- updatedAt (timestamp)
```

**sessions** - Authentication sessions
```sql
- sid (varchar, PK)
- sess (json)
- expire (timestamp)
```

**couple_info** - Thông tin cặp đôi
```sql
- id (varchar, PK, UUID)
- brideName (varchar)
- groomName (varchar)
- bridePhoto (varchar, URL)
- groomPhoto (varchar, URL)
- brideDescription (text, optional)        # NEW: Tiểu sử cô dâu
- groomDescription (text, optional)        # NEW: Tiểu sử chú rể
- ourStory (text)
- weddingDate (timestamp)
- heroImage (varchar, URL)
- createdAt (timestamp)
- updatedAt (timestamp)
```

**schedule_events** - Lịch trình sự kiện
```sql
- id (varchar, PK, UUID)
- title (varchar)
- description (text)
- eventTime (timestamp)
- location (varchar)
- icon (varchar)
- order (integer)
- createdAt (timestamp)
- updatedAt (timestamp)
```

**photos** - Album ảnh
```sql
- id (varchar, PK, UUID)
- url (varchar)
- caption (text)
- category (varchar)
- order (integer)
- createdAt (timestamp)
- updatedAt (timestamp)
```

**guest_messages** - Lời chúc khách mời
```sql
- id (varchar, PK, UUID)
- guestName (varchar)
- message (text)
- approved (boolean, default false)
- createdAt (timestamp)
```

**rsvps** - RSVP responses
```sql
- id (varchar, PK, UUID)
- guestName (varchar)
- email (varchar)
- phone (varchar)
- attending (boolean)
- guestCount (integer)
- mealPreference (varchar)
- specialRequirements (text)
- createdAt (timestamp)
```

**registry_items** - Quà mừng
```sql
- id (varchar, PK, UUID)
- name (varchar)
- description (text)
- price (numeric)
- imageUrl (varchar)
- purchaseUrl (varchar)
- isPurchased (boolean, default false)
- order (integer)
- createdAt (timestamp)
- updatedAt (timestamp)
```

**settings** - Cài đặt website
```sql
- id (varchar, PK, UUID)
- venueName (varchar)
- venueAddress (text)
- venueMapLink (varchar)
- venuePhone (varchar, optional)           # NEW: Số điện thoại địa điểm
- venueEmail (varchar, optional)           # NEW: Email địa điểm
- eventStartTime (timestamp, optional)     # NEW: Thời gian bắt đầu sự kiện
- eventEndTime (timestamp, optional)       # NEW: Thời gian kết thúc sự kiện
- backgroundMusicUrl (varchar)
- backgroundMusicType (varchar)
- updatedAt (timestamp)
```

#### Backup & Restore

**Tạo Backup:**
```bash
# Sử dụng script tự động
npx tsx scripts/create_backup.ts

# Hoặc pg_dump (nếu có)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

**Restore từ Backup:**
```bash
psql $DATABASE_URL < database_backup.sql
```

**Migrate Schema:**
```bash
# Push schema changes
npm run db:push

# Force push (nếu cần)
npm run db:push --force
```

<a name="vn-deploy"></a>
### 🚀 Production Deployment

#### Build Production

```bash
# Build frontend & backend
npm run build

# Test production build locally
npm start
```

#### Environment Variables for Production

```env
DATABASE_URL=your_production_database_url
SESSION_SECRET=your_very_secure_production_secret
NODE_ENV=production
PORT=5000
```

#### Deployment Checklist

- [ ] Đổi password admin mặc định
- [ ] Set `NODE_ENV=production`
- [ ] Sử dụng HTTPS (SSL/TLS)
- [ ] Set session secret mạnh
- [ ] Enable CORS phù hợp
- [ ] Setup database backup tự động
- [ ] Configure logging & monitoring
- [ ] Test tất cả tính năng
- [ ] Performance optimization (CDN, caching)
- [ ] SEO optimization (meta tags, sitemap)

#### Recommended Platforms

- **Replit Autoscale** - Tự động scale, easy deployment
- **Vercel** - Frontend hosting với Edge Functions
- **Railway** - Full-stack với PostgreSQL
- **Render** - Web service + PostgreSQL
- **Heroku** - Classic PaaS platform

<a name="vn-security"></a>
### 🔒 Bảo Mật

**Implemented Security Measures:**

✅ **Authentication & Authorization**
- Session-based authentication với Passport.js
- Bcrypt password hashing (10 rounds)
- Secure session cookies (httpOnly, secure in production)
- Protected API routes với middleware

✅ **Database Security**
- SQL injection prevention qua Drizzle ORM
- Parameterized queries
- Input validation với Zod schemas

✅ **XSS Protection**
- React auto-escapes output
- CSP headers (Content Security Policy)
- Sanitized user inputs

✅ **CSRF Protection**
- Session-based CSRF tokens
- SameSite cookies

✅ **Environment Security**
- Secrets trong .env file (không commit)
- Environment-based configuration

**⚠️ Security Recommendations:**

1. **Change Default Credentials**
   ```bash
   # Sau khi deploy, đổi ngay password admin
   username: admin
   password: admin123 ← CHANGE THIS!
   ```

2. **Use Strong Session Secret**
   ```env
   # Generate strong random secret
   SESSION_SECRET=$(openssl rand -base64 32)
   ```

3. **Enable HTTPS in Production**
   - Force HTTPS redirect
   - Secure cookies only over HTTPS
   - HSTS headers

4. **Rate Limiting** (Recommended to add)
   ```bash
   npm install express-rate-limit
   ```

5. **Security Headers** (Recommended to add)
   ```bash
   npm install helmet
   ```

6. **Input Validation**
   - Always validate user inputs
   - Use Zod schemas consistently
   - Sanitize HTML content

7. **Regular Updates**
   ```bash
   # Check for vulnerabilities
   npm audit

   # Fix vulnerabilities
   npm audit fix
   ```

### 📝 Scripts

```json
{
  "dev": "Start development server",
  "build": "Build for production",
  "start": "Run production server",
  "db:push": "Push schema changes to database",
  "db:push --force": "Force push schema (use with caution)"
}
```

### 🐛 Troubleshooting

**Problem: Database connection failed**
```bash
# Check DATABASE_URL is correct
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

**Problem: Session secret error**
```bash
# Ensure SESSION_SECRET is set
echo $SESSION_SECRET

# Generate new secret if needed
openssl rand -base64 32
```

**Problem: Build fails**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem: Port already in use**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

### 🙏 Acknowledgments

- Built with ❤️ for couples celebrating their special day
- Thanks to all open source contributors
- Special thanks to the React, Express, and Drizzle communities

---

<a name="english-documentation"></a>
## 🇬🇧 English Documentation

### 📖 Table of Contents
- [Overview](#en-overview)
- [Features](#en-features)
- [Technology Stack](#en-tech)
- [Installation](#en-installation)
- [Usage](#en-usage)
- [Project Structure](#en-structure)
- [API Documentation](#en-api)
- [Database](#en-database)
- [Deployment](#en-deploy)
- [Security](#en-security)

<a name="en-overview"></a>
### 🌟 Overview

A comprehensive wedding website system that helps couples create a beautiful website to share wedding information, manage guests, receive wishes, and track RSVPs. Built with modern technology, responsive design, and powerful management features.

**✨ Highlights:**
- 🎨 Romantic, elegant interface with smooth animations
- 📱 Fully responsive on all devices
- 🔐 Secure authentication system with Passport.js
- 💾 PostgreSQL database with automatic backup
- ⚡ Optimized performance with React Query and caching
- 🎯 SEO-friendly with comprehensive meta tags

<a name="en-features"></a>
### ✨ Key Features

#### 🌐 Public Website (For Guests)

1. **Hero Section** - Large banner with couple's photo, countdown timer, CTA buttons
2. **About Us** - Love story, individual photos, elegant typography
3. **Event Schedule** - Timeline of wedding day events with details
4. **Photo Gallery** - Grid layout with categories and lightbox
5. **Guest Messages** - Submit and view approved wishes
6. **RSVP Form** - Collect attendance, meal preferences, special requirements
7. **Gift Registry** - Display registry items with purchase links
8. **Venue Location** - Address, map coordinates, directions
9. **Music Player** - Background music with controls
10. **Navigation & Footer** - Smooth scroll, mobile menu, social links

#### 🔐 Admin Dashboard

1. **Dashboard** - Statistics, recent activity, quick actions
2. **Couple Management** - Edit names, date, story, photos
3. **Schedule Management** - Full CRUD for events
4. **Gallery Management** - Add, edit, organize photos
5. **Message Moderation** - Approve/delete guest messages
6. **RSVP Tracking** - View RSVPs, statistics, export CSV
7. **Registry Management** - Manage gift items, track purchases
8. **Settings** - Configure venue, music, preferences
9. **Optimized Sidebar** - Compact menu, View Homepage button, responsive

<a name="en-tech"></a>
### 🛠 Technology Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, TanStack Query, Wouter

**Backend:** Node.js 20, Express, TypeScript, Drizzle ORM, PostgreSQL, Passport.js, bcrypt

**Tools:** tsx, esbuild, Drizzle Kit, cross-env, dotenv

<a name="en-installation"></a>
### 🚀 Installation

```bash
# Clone repository
git clone <repository-url>
cd wedding-website

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:push

# Seed demo data (optional)
npx tsx server/seed.ts

# Run development server
npm run dev
```

Access: `http://localhost:5000`

<a name="en-usage"></a>
### 📖 Usage

**Login:** `/login` (username: `admin`, password: `admin123`)

**Admin Dashboard:** `/admin` (requires login)

**Public Website:** `/` (open to all)

<a name="en-structure"></a>
### 📁 Project Structure

See Vietnamese section above for detailed structure.

<a name="en-api"></a>
### 🔌 API Documentation

See Vietnamese section above for complete API documentation.

<a name="en-database"></a>
### 🗄 Database

**Tables:** users, sessions, couple_info, schedule_events, photos, guest_messages, rsvps, registry_items, settings

**Backup:** `npx tsx scripts/create_backup.ts`

**Restore:** `psql $DATABASE_URL < database_backup.sql`

<a name="en-deploy"></a>
### 🚀 Deployment

```bash
# Build for production
npm run build

# Run production server
npm start
```

**Platforms:** Replit Autoscale, Vercel, Railway, Render, Heroku

<a name="en-security"></a>
### 🔒 Security

✅ Session-based authentication
✅ Bcrypt password hashing
✅ SQL injection prevention
✅ XSS protection
✅ CSRF protection
✅ Secure environment variables

⚠️ Change default admin password after deployment!

---

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Email: support@example.com
- Documentation: See PROJECT_STATUS.md

## 📊 Status

- **Version:** 1.0.0
- **Status:** Production Ready
- **Last Updated:** October 2025

**Made with 💝 for couples celebrating their special day**
