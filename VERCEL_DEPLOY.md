# Hướng dẫn Deploy lên Vercel

## Cách deploy từ GitHub

### Bước 1: Push code lên GitHub
```bash
git add .
git commit -m "Update for Vercel deployment"
git push origin main
```

### Bước 2: Tạo project trên Vercel
1. Vào https://vercel.com
2. Click "Add New..." → "Project"
3. Import repository từ GitHub
4. Chọn repository của bạn

### Bước 3: Cấu hình Environment Variables
Thêm các biến môi trường sau trong Vercel:

**Required:**
- `DATABASE_URL` - Connection string của Neon/PostgreSQL database
- `SESSION_SECRET` - Chuỗi bí mật tối thiểu 32 ký tự (để bảo mật session)

**Optional:**
- `NODE_ENV` - Để `production` (Vercel tự set)

### Bước 4: Deploy
1. Click "Deploy"
2. Chờ Vercel build và deploy (khoảng 2-3 phút)
3. Hoàn tất! 🎉

---

## Lỗi thường gặp và cách sửa

### ❌ Lỗi: "Cannot find package 'vite'"
**Nguyên nhân:** Build tools ở trong devDependencies, Vercel không cài

**✅ Đã sửa:** Di chuyển các build packages cần thiết sang dependencies:
- vite
- esbuild
- typescript
- tailwindcss
- postcss
- autoprefixer
- @vitejs/plugin-react
- @tailwindcss/vite

### ❌ Lỗi: "Two or more files have conflicting paths"
**Nguyên nhân:** Có cả `api/index.js` và `api/index.ts`

**✅ Đã sửa:** Xóa `api/index.ts`, chỉ giữ `api/index.js`

### ❌ Lỗi: Database connection
**Nguyên nhân:** Chưa cấu hình DATABASE_URL

**✅ Giải pháp:** 
1. Tạo database trên Neon (https://neon.tech) - MIỄN PHÍ
2. Copy connection string
3. Thêm vào Environment Variables trên Vercel
4. Redeploy

---

## Cấu trúc project cho Vercel

```
project/
├── api/
│   └── index.js          # Serverless function entry point
├── dist/
│   ├── public/           # Frontend build output
│   └── *.js              # Server build output  
├── server/               # Backend source
├── client/               # Frontend source
├── package.json
└── vercel.json           # Vercel config
```

---

## Kiểm tra build local

Trước khi deploy, bạn có thể test build:

```bash
npm run build
npm run start
```

Nếu chạy OK local, Vercel sẽ deploy thành công!

---

## Production Checklist

- [ ] DATABASE_URL đã được thêm vào Vercel Environment Variables
- [ ] SESSION_SECRET đã được thêm (tối thiểu 32 ký tự ngẫu nhiên)
- [ ] Database đã được migrate (`npm run db:push` trên local)
- [ ] Đã test build local: `npm run build`
- [ ] Đã đổi password admin mặc định (admin/admin123)
- [ ] Đã push code lên GitHub

---

## Domain custom

Sau khi deploy thành công, bạn có thể thêm domain tùy chỉnh:

1. Vào Vercel project → Settings → Domains
2. Add domain của bạn
3. Cấu hình DNS theo hướng dẫn Vercel
4. Chờ SSL certificate được tạo (tự động)

Xong! 🚀
