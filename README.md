# 💍 Wedding Website Platform | Nền Tảng Website Đám Cưới

[English](#english) | [Tiếng Việt](#tieng-viet)

---

<a name="english"></a>
## 🇬🇧 English

### Overview

A modern, full-stack wedding website application that allows couples to share their wedding details, manage RSVPs, display photo galleries, and interact with guests. The platform features a romantic, photo-centric public-facing website for guests and a comprehensive admin dashboard for wedding management.

### ✨ Features

#### 🌐 Public Website
- **Hero Section**: Beautiful landing page with couple's hero image and countdown to wedding day
- **About Us**: Display couple's story, photos, and personal descriptions
- **Wedding Schedule**: Timeline of wedding day events with times and locations
- **Photo Gallery**: Elegant image gallery showcasing couple's photos
- **Guest Messages**: Guests can leave well-wishes (subject to approval)
- **RSVP Form**: Easy-to-use RSVP system with meal preferences and guest count
- **Gift Registry**: Display registry items with purchase links
- **Venue Location**: Interactive map and venue details
- **Music Player**: Background music player (optional)

#### 🔐 Admin Dashboard
- **Couple Info Management**: Edit couple names, wedding date, story, and photos
- **Schedule Management**: Full CRUD for wedding timeline events
- **Gallery Management**: Upload, edit, and organize photos
- **Message Moderation**: Approve, view, and delete guest messages
- **RSVP Tracking**: View all RSVPs with filtering and statistics
- **Registry Management**: Add, edit, and track registry items
- **Settings**: Configure venue details, music, and site preferences
- **Statistics Dashboard**: Overview of key metrics and recent activity

### 🛠 Tech Stack

**Frontend**
- React 18 with TypeScript
- Vite (build tool & dev server)
- Tailwind CSS for styling
- shadcn/ui component library
- Framer Motion for animations
- TanStack Query (React Query) for data management
- Wouter for routing

**Backend**
- Node.js with Express
- TypeScript
- Drizzle ORM
- PostgreSQL (Neon serverless)
- Passport.js with Replit Auth (OIDC)
- Session-based authentication

**Development Tools**
- tsx for TypeScript execution
- esbuild for production builds
- Drizzle Kit for database migrations

### 📋 Prerequisites

- Node.js 20 or higher
- PostgreSQL database
- Replit account (for authentication)

### 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd wedding-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_postgresql_connection_string
REPL_ID=your_replit_app_id
SESSION_SECRET=your_secure_session_secret
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=your-domain.replit.dev
PORT=5000
NODE_ENV=development
```

4. **Set up the database**

```bash
# Push database schema
npm run db:push

# (Optional) Restore demo data
psql $DATABASE_URL < database_backup.sql
```

5. **Run the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### 📦 Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### 🗄 Database Schema

The application uses the following main tables:

- `users` - User accounts (for admin access)
- `sessions` - Authentication sessions
- `couple_info` - Bride and groom information
- `schedule_events` - Wedding day timeline
- `photos` - Gallery images
- `guest_messages` - Guest well-wishes
- `rsvps` - Guest RSVP responses
- `registry_items` - Gift registry
- `settings` - Site configuration

### 🔑 Authentication

The application uses Replit Auth with OpenID Connect (OIDC) for secure authentication. Admin routes are protected and require login.

To access admin features:
1. Navigate to `/admin`
2. Click "Login" to authenticate via Replit
3. Manage your wedding details

### 📸 Demo Data

The repository includes a demo database backup (`database_backup.sql`) with sample data:
- Sample couple information
- 5 wedding events
- 6 gallery photos
- 5 guest messages
- 4 RSVPs
- 5 registry items
- Venue settings

To restore demo data:
```bash
psql $DATABASE_URL < database_backup.sql
```

### 🎨 Customization

**Colors and Theming**
- Edit `client/src/index.css` for custom color scheme
- Tailwind configuration in `tailwind.config.ts`

**Images**
- Generated images are stored in `attached_assets/generated_images/`
- Update image URLs in admin dashboard

**Fonts**
- Primary fonts: Poppins, Cormorant Garamond, Parisienne
- Configured in `client/index.html`

### 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

### 🔒 Security

- HTTPS enforced in production
- Session-based authentication with secure cookies
- CSRF protection
- SQL injection prevention via ORM
- XSS protection
- Environment-based secrets management

### 🐛 Known Issues

- React Hook warnings with framer-motion (non-critical, UI works fine)
- PostCSS plugin warnings (cosmetic, doesn't affect functionality)

### 📝 License

MIT License - Feel free to use this project for your wedding!

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<a name="tieng-viet"></a>
## 🇻🇳 Tiếng Việt

### Tổng Quan

Ứng dụng website đám cưới hiện đại, đầy đủ tính năng cho phép các cặp đôi chia sẻ thông tin đám cưới, quản lý khách mời, hiển thị album ảnh và tương tác với khách mời. Nền tảng có website công khai lãng mạn cho khách mời và bảng điều khiển admin toàn diện để quản lý đám cưới.

### ✨ Tính Năng

#### 🌐 Website Công Khai
- **Trang Chủ**: Landing page đẹp mắt với ảnh cặp đôi và đếm ngược đến ngày cưới
- **Về Chúng Tôi**: Hiển thị câu chuyện, ảnh và mô tả cá nhân của cặp đôi
- **Lịch Trình**: Timeline các sự kiện trong ngày cưới với thời gian và địa điểm
- **Album Ảnh**: Thư viện ảnh thanh lịch trưng bày ảnh của cặp đôi
- **Lời Chúc**: Khách mời có thể gửi lời chúc (cần phê duyệt)
- **RSVP**: Hệ thống RSVP dễ sử dụng với lựa chọn món ăn và số lượng khách
- **Quà Mừng**: Hiển thị danh sách quà với liên kết mua hàng
- **Địa Điểm**: Bản đồ tương tác và thông tin địa điểm tổ chức
- **Nhạc Nền**: Trình phát nhạc nền (tùy chọn)

#### 🔐 Bảng Điều Khiển Admin
- **Quản Lý Thông Tin Cặp Đôi**: Chỉnh sửa tên, ngày cưới, câu chuyện và ảnh
- **Quản Lý Lịch Trình**: Thêm, sửa, xóa các sự kiện trong lịch trình
- **Quản Lý Album**: Tải lên, chỉnh sửa và sắp xếp ảnh
- **Kiểm Duyệt Lời Chúc**: Phê duyệt, xem và xóa lời chúc của khách
- **Theo Dõi RSVP**: Xem tất cả RSVP với bộ lọc và thống kê
- **Quản Lý Quà Mừng**: Thêm, sửa và theo dõi món quà
- **Cài Đặt**: Cấu hình địa điểm, nhạc và tùy chọn trang web
- **Thống Kê**: Tổng quan các chỉ số quan trọng và hoạt động gần đây

### 🛠 Công Nghệ Sử Dụng

**Frontend**
- React 18 với TypeScript
- Vite (công cụ build & dev server)
- Tailwind CSS cho styling
- shadcn/ui component library
- Framer Motion cho animation
- TanStack Query (React Query) cho quản lý dữ liệu
- Wouter cho routing

**Backend**
- Node.js với Express
- TypeScript
- Drizzle ORM
- PostgreSQL (Neon serverless)
- Passport.js với Replit Auth (OIDC)
- Xác thực dựa trên session

**Công Cụ Phát Triển**
- tsx cho TypeScript execution
- esbuild cho production build
- Drizzle Kit cho database migration

### 📋 Yêu Cầu

- Node.js 20 trở lên
- PostgreSQL database
- Tài khoản Replit (cho xác thực)

### 🚀 Cài Đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd wedding-website
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Thiết lập biến môi trường**

Tạo file `.env` trong thư mục gốc:

```env
DATABASE_URL=chuoi_ket_noi_postgresql
REPL_ID=replit_app_id
SESSION_SECRET=session_secret_bao_mat
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=domain-cua-ban.replit.dev
PORT=5000
NODE_ENV=development
```

4. **Thiết lập database**

```bash
# Push database schema
npm run db:push

# (Tùy chọn) Khôi phục dữ liệu demo
psql $DATABASE_URL < database_backup.sql
```

5. **Chạy development server**
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5000`

### 📦 Build Production

```bash
# Build ứng dụng
npm run build

# Chạy production server
npm start
```

### 🗄 Database Schema

Ứng dụng sử dụng các bảng chính sau:

- `users` - Tài khoản người dùng (cho admin)
- `sessions` - Session xác thực
- `couple_info` - Thông tin cô dâu chú rể
- `schedule_events` - Lịch trình ngày cưới
- `photos` - Ảnh trong album
- `guest_messages` - Lời chúc của khách
- `rsvps` - Phản hồi RSVP của khách
- `registry_items` - Danh sách quà mừng
- `settings` - Cấu hình website

### 🔑 Xác Thực

Ứng dụng sử dụng Replit Auth với OpenID Connect (OIDC) để xác thực an toàn. Các route admin được bảo vệ và yêu cầu đăng nhập.

Để truy cập tính năng admin:
1. Điều hướng đến `/admin`
2. Click "Login" để xác thực qua Replit
3. Quản lý thông tin đám cưới của bạn

### 📸 Dữ Liệu Demo

Repository bao gồm file backup database demo (`database_backup.sql`) với dữ liệu mẫu:
- Thông tin cặp đôi mẫu
- 5 sự kiện đám cưới
- 6 ảnh trong album
- 5 lời chúc của khách
- 4 RSVP
- 5 món quà
- Cài đặt địa điểm

Để khôi phục dữ liệu demo:
```bash
psql $DATABASE_URL < database_backup.sql
```

### 🎨 Tùy Chỉnh

**Màu Sắc và Theme**
- Chỉnh sửa `client/src/index.css` cho bảng màu tùy chỉnh
- Cấu hình Tailwind trong `tailwind.config.ts`

**Hình Ảnh**
- Ảnh được tạo lưu trong `attached_assets/generated_images/`
- Cập nhật URL ảnh trong admin dashboard

**Font Chữ**
- Font chính: Poppins, Cormorant Garamond, Parisienne
- Cấu hình trong `client/index.html`

### 📱 Thiết Kế Responsive

Website hoàn toàn responsive và tối ưu cho:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

### 🔒 Bảo Mật

- HTTPS bắt buộc trong production
- Xác thực dựa trên session với secure cookies
- Bảo vệ CSRF
- Ngăn chặn SQL injection qua ORM
- Bảo vệ XSS
- Quản lý secrets dựa trên môi trường

### 🐛 Lỗi Đã Biết

- Cảnh báo React Hook với framer-motion (không nghiêm trọng, UI hoạt động tốt)
- Cảnh báo PostCSS plugin (chỉ thẩm mỹ, không ảnh hưởng chức năng)

### 📝 Giấy Phép

MIT License - Thoải mái sử dụng dự án này cho đám cưới của bạn!

### 🤝 Đóng Góp

Chào mừng mọi đóng góp! Vui lòng tạo Pull Request.

---

## 🙏 Acknowledgments

Built with ❤️ for couples celebrating their special day.

## 📞 Support

For questions or issues, please open an issue on GitHub.
