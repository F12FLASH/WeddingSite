# 🚀 Hướng Dẫn Deploy Lên Vercel - Chi Tiết

## ⚠️ LỖI BẠN ĐANG GẶP

Nếu bạn thấy lỗi này trên website:
```
500: A server error has occurred
FUNCTION_INVOCATION_FAILED
```

**Nguyên nhân**: Environment variables (DATABASE_URL, SESSION_SECRET, etc.) chưa được thiết lập trong Vercel Dashboard.

---

## 📋 Checklist Trước Khi Deploy

- [ ] Đã có Neon PostgreSQL database
- [ ] Đã chạy migrations: `npm run db:push` 
- [ ] Đã seed dữ liệu mẫu: `npx tsx server/seed.ts`
- [ ] Code đã được push lên GitHub
- [ ] Đã có tài khoản Vercel

---

## 🔧 BƯỚC 1: Chuẩn Bị Environment Variables

### 1.1. Lấy DATABASE_URL từ Neon

Bạn đã có connection string này:
```
postgresql://neondb_owner:npg_LyNricmhG15A@ep-lingering-grass-a4djzzir-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Quan trọng**: Xóa `&channel_binding=require` ở cuối (có thể gây lỗi):
```
postgresql://neondb_owner:npg_LyNricmhG15A@ep-lingering-grass-a4djzzir-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 1.2. Tạo SESSION_SECRET Mới

Chạy lệnh sau trong terminal để generate secret key an toàn:

**Windows PowerShell**:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Mac/Linux**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Kết quả** (ví dụ):
```
a8f5f167f44f4964e6c998dee827110c47f5f167f44f4964e6c998dee827110c
```

Copy kết quả này - bạn sẽ dùng nó làm SESSION_SECRET.

---

## 🌐 BƯỚC 2: Set Environment Variables Trong Vercel

### Cách 1: Qua Vercel Dashboard (Khuyến Nghị)

#### Bước 2.1: Vào Project Settings

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Click vào project **wedding-site-one-ruddy**
3. Click tab **"Settings"** (góc trên cùng)
4. Bên trái, click **"Environment Variables"**

![Vercel Settings](../attached_assets/stock_images/vercel_dashboard_set_d4dd2e18.jpg)

#### Bước 2.2: Thêm DATABASE_URL

1. Click nút **"Add New"** hoặc **"Add Environment Variable"**
2. Điền thông tin:
   - **Key (Tên biến)**: `DATABASE_URL`
   - **Value (Giá trị)**: 
     ```
     postgresql://neondb_owner:npg_LyNricmhG15A@ep-lingering-grass-a4djzzir-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
     ```
   - **Environments** (Môi trường): ✅ Chọn **ALL** (Production, Preview, Development)
3. Click **"Save"**

#### Bước 2.3: Thêm SESSION_SECRET

1. Click **"Add New"** lần nữa
2. Điền:
   - **Key**: `SESSION_SECRET`
   - **Value**: (Session secret bạn vừa generate ở Bước 1.2)
   - **Environments**: ✅ Chọn **ALL**
3. Click **"Save"**

#### Bước 2.4: Thêm NODE_ENV

1. Click **"Add New"**
2. Điền:
   - **Key**: `NODE_ENV`
   - **Value**: `production`
   - **Environments**: ✅ Chỉ chọn **Production**
3. Click **"Save"**

#### Bước 2.5: Thêm ALLOWED_ORIGINS

1. Click **"Add New"**
2. Điền:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `https://wedding-site-one-ruddy.vercel.app`
   - **Environments**: ✅ Chọn **ALL**
3. Click **"Save"**

**Lưu ý**: Nếu bạn có custom domain sau này, thêm domain đó vào với dấu phẩy:
```
https://wedding-site-one-ruddy.vercel.app,https://your-custom-domain.com
```

---

### Cách 2: Qua Vercel CLI (Nâng Cao)

Nếu bạn thích dùng terminal:

```bash
# Cài đặt Vercel CLI (nếu chưa có)
npm install -g vercel

# Login vào Vercel
vercel login

# Link project
vercel link

# Thêm environment variables
vercel env add DATABASE_URL production
# Paste connection string khi được hỏi

vercel env add SESSION_SECRET production
# Paste session secret khi được hỏi

vercel env add NODE_ENV production
# Type: production

vercel env add ALLOWED_ORIGINS production
# Type: https://wedding-site-one-ruddy.vercel.app
```

---

## 🔄 BƯỚC 3: Redeploy Website

**QUAN TRỌNG**: Environment variables chỉ có hiệu lực sau khi redeploy!

### Cách 1: Redeploy Qua Dashboard

1. Vào Vercel Dashboard → Project **wedding-site-one-ruddy**
2. Click tab **"Deployments"**
3. Tìm deployment mới nhất (ở đầu danh sách)
4. Click vào **3 chấm (⋮)** bên phải
5. Chọn **"Redeploy"**
6. Chọn **"Use existing Build Cache"** (để deploy nhanh hơn)
7. Click **"Redeploy"**

### Cách 2: Push Code Mới (Tự Động Deploy)

Nếu bạn muốn deploy code mới nhất từ Replit:

```bash
# Commit changes
git add .
git commit -m "fix: Optimize database connection for Vercel serverless"

# Push to GitHub
git push origin main
```

Vercel sẽ tự động deploy sau vài giây.

---

## ✅ BƯỚC 4: Kiểm Tra Website

### 4.1. Đợi Deploy Hoàn Thành

- Vào Vercel Dashboard → **Deployments**
- Đợi cho đến khi status là **"Ready"** (màu xanh)
- Thường mất khoảng 1-2 phút

### 4.2. Test Website

Mở các trang sau và kiểm tra:

1. **Homepage**: https://wedding-site-one-ruddy.vercel.app/
   - ✅ Có dữ liệu couple info
   - ✅ Có lịch trình sự kiện
   - ✅ Có ảnh trong gallery
   - ✅ Không còn lỗi 500

2. **Admin Login**: https://wedding-site-one-ruddy.vercel.app/login
   - ✅ Có thể đăng nhập với:
     - Username: `admin`
     - Password: `admin123`
   - ✅ Sau khi login, redirect về `/admin/dashboard`

3. **Admin Dashboard**: https://wedding-site-one-ruddy.vercel.app/admin/dashboard
   - ✅ Thấy statistics (số RSVPs, messages, photos, etc.)
   - ✅ Có thể navigate giữa các tab

### 4.3. Đổi Mật Khẩu Admin (BẮT BUỘC!)

**NGAY SAU KHI LOGIN THÀNH CÔNG**, đổi mật khẩu admin:

1. Vào Admin Dashboard
2. Click **"Cài Đặt"** hoặc **"Settings"**
3. Tìm phần **"Đổi Mật Khẩu"** hoặc **"Change Password"**
4. Đổi từ `admin123` sang mật khẩu mạnh của bạn
5. **LƯU NGAY** mật khẩu mới vào nơi an toàn!

---

## 🐛 Troubleshooting - Giải Quyết Lỗi

### ❌ Lỗi 1: Vẫn Thấy "500: FUNCTION_INVOCATION_FAILED"

**Nguyên nhân**: 
- Environment variables chưa được lưu đúng
- Hoặc chưa redeploy sau khi thêm env vars

**Giải pháp**:
1. Kiểm tra lại environment variables trong Vercel Settings
2. Đảm bảo đã chọn **Production** environment cho tất cả variables
3. **Redeploy** lại website (Bước 3)
4. Xóa cache trình duyệt (Ctrl+Shift+R hoặc Cmd+Shift+R)

### ❌ Lỗi 2: "Cannot read properties of undefined"

**Nguyên nhân**: Database connection thành công nhưng chưa có data

**Giải pháp**:
```bash
# Chạy seed script trên production database
DATABASE_URL="postgresql://neondb_owner:npg_LyNricmhG15A@ep-lingering-grass-a4djzzir-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" npx tsx server/seed.ts
```

### ❌ Lỗi 3: "too many connections for role"

**Nguyên nhân**: Quá nhiều connections đến database

**Giải pháp**: 
- ✅ Đã được fix trong code mới (max: 1 connection)
- Nếu vẫn gặp, vào Neon Console và terminate idle connections
- Hoặc upgrade Neon plan để tăng connection limit

### ❌ Lỗi 4: Admin Login Không Hoạt Động

**Nguyên nhân**: SESSION_SECRET chưa được set

**Giải pháp**:
1. Kiểm tra SESSION_SECRET trong Vercel Environment Variables
2. Phải có độ dài tối thiểu 32 ký tự
3. Redeploy sau khi thêm/sửa

### ❌ Lỗi 5: CORS Error Khi Gọi API

**Nguyên nhân**: ALLOWED_ORIGINS không đúng

**Giải pháp**:
```
ALLOWED_ORIGINS=https://wedding-site-one-ruddy.vercel.app
```
Không được có trailing slash `/` ở cuối!

---

## 📊 Kiểm Tra Deployment Logs

Nếu gặp lỗi khó hiểu, check logs:

### Vercel Dashboard:
1. Vào Project → **Deployments**
2. Click vào deployment có lỗi
3. Click tab **"Functions"**
4. Click vào `api/index.js`
5. Xem **"Logs"** để tìm error message chi tiết

### Real-time Logs:
```bash
# Cài Vercel CLI nếu chưa có
npm install -g vercel

# Xem logs real-time
vercel logs wedding-site-one-ruddy --follow
```

---

## 🎯 Checklist Sau Deploy Thành Công

- [ ] Homepage load được dữ liệu (couple info, events, photos)
- [ ] Admin login hoạt động (username: admin, password: admin123)
- [ ] Dashboard hiển thị statistics
- [ ] Đã đổi mật khẩu admin thành mật khẩu mạnh
- [ ] RSVP form hoạt động (thử submit test RSVP)
- [ ] Guest messages hoạt động (thử gửi test message)
- [ ] Photo gallery load được ảnh
- [ ] Music player hoạt động (nếu có upload nhạc)
- [ ] Responsive trên mobile (test bằng điện thoại)

---

## 🔐 Bảo Mật

### ⚠️ Các Lưu Ý Quan Trọng:

1. **ĐỔI MẬT KHẨU ADMIN NGAY** sau khi deploy thành công
2. **KHÔNG CHIA SẺ** SESSION_SECRET với ai
3. **KHÔNG COMMIT** `.env` file lên GitHub
4. **BACKUP DATABASE** thường xuyên qua Neon Console
5. **SỬ DỤNG HTTPS** cho mọi request (Vercel tự động)

### Tạo Backup Database:

```bash
# Cài pg_dump (PostgreSQL client)
# Windows: Download từ https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt install postgresql-client

# Backup database
pg_dump "postgresql://neondb_owner:npg_LyNricmhG15A@ep-lingering-grass-a4djzzir-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" > backup_$(date +%Y%m%d).sql
```

---

## 📞 Hỗ Trợ

Nếu vẫn gặp vấn đề:

1. **Check logs** trong Vercel Dashboard
2. **Check network tab** trong Chrome DevTools (F12)
3. **Thử lại** từ đầu với checklist ở trên
4. **Liên hệ** support nếu cần help

---

## 🎉 Chúc Mừng!

Nếu tất cả đều hoạt động, website đám cưới của bạn đã sẵn sàng!

**Next Steps**:
1. Upload ảnh thật của bạn thay ảnh mẫu
2. Cập nhật thông tin couple (tên, ngày cưới, địa điểm)
3. Thêm wedding party members
4. Upload nhạc yêu thích
5. Tùy chỉnh theme và colors
6. Chia sẻ link với gia đình và bạn bè! 🎊

---

**Website của bạn**: https://wedding-site-one-ruddy.vercel.app  
**Admin panel**: https://wedding-site-one-ruddy.vercel.app/login

Good luck và chúc bạn có một đám cưới thật tuyệt vời! 💕
