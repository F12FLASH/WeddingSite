
@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM File đánh dấu đã setup
set SETUP_FLAG=.setup_complete

echo 🚀 Wedding Site - Auto Setup ^& Run Script
echo ==========================================

REM Kiểm tra xem đã setup chưa
if not exist "%SETUP_FLAG%" (
    echo 📦 Lần chạy đầu tiên - Đang setup môi trường...
    
    REM 1. Cài đặt dependencies
    echo 📥 Đang cài đặt dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Lỗi khi cài đặt dependencies!
        pause
        exit /b 1
    )
    
    REM 2. Kiểm tra file .env
    if not exist ".env" (
        echo ⚠️  Chưa có file .env!
        echo 📝 Đang tạo file .env từ .env.example...
        copy .env.example .env
        echo.
        echo ⚠️  QUAN TRỌNG: Vui lòng cập nhật các giá trị trong file .env:
        echo    - DATABASE_URL: Connection string PostgreSQL
        echo    - SESSION_SECRET: Random secret key
        echo.
        pause
    )
    
    REM 3. Push database schema
    echo 🗄️  Đang tạo database schema...
    call npm run db:push
    if errorlevel 1 (
        echo ❌ Lỗi khi tạo database schema!
        pause
        exit /b 1
    )
    
    REM 4. Seed database
    echo 🌱 Đang nạp dữ liệu mẫu vào database...
    call npx tsx server/seed.ts
    if errorlevel 1 (
        echo ❌ Lỗi khi nạp dữ liệu!
        pause
        exit /b 1
    )
    
    REM Đánh dấu đã setup xong
    echo ✅ Setup hoàn tất! > "%SETUP_FLAG%"
    echo.
    echo 🎉 Setup thành công!
    echo 📋 Thông tin đăng nhập admin:
    echo    Username: admin
    echo    Password: admin123
    echo.
) else (
    echo ✅ Đã setup trước đó - Bỏ qua bước setup
)

REM Chạy development server
echo 🌐 Đang khởi động web server...
echo 📍 Web sẽ chạy tại: http://localhost:5000
echo 🔑 Đăng nhập admin tại: http://localhost:5000/admin/login
echo.
echo Nhấn Ctrl+C để dừng server
echo ==========================================

call npm run dev
