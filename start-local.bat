@echo off
chcp 65001 >nul
cls
setlocal enabledelayedexpansion

echo.
echo ============================================================
echo    💍 WEDDING WEBSITE - AUTO START (Windows)
echo ============================================================
echo.

REM Check if this is first run
set FIRST_RUN=0
if not exist node_modules set FIRST_RUN=1
if not exist .env set FIRST_RUN=1

if %FIRST_RUN%==1 (
    echo 🎯 Phát hiện lần chạy đầu tiên - Bắt đầu cài đặt tự động...
    echo.
    
    REM Check Node.js
    echo [1/7] Kiểm tra Node.js...
    node -v >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Node.js chưa được cài đặt!
        echo.
        echo Vui lòng tải và cài đặt Node.js từ: https://nodejs.org/
        echo Chọn phiên bản LTS ^(Recommended for Most Users^)
        echo.
        pause
        exit /b 1
    )
    echo ✅ Node.js đã cài đặt
    node -v
    echo.
    
    REM Install dependencies
    echo [2/7] Cài đặt dependencies...
    echo Đây có thể mất 2-3 phút, vui lòng đợi...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Lỗi khi cài đặt dependencies!
        pause
        exit /b 1
    )
    echo ✅ Dependencies đã được cài đặt!
    echo.
    
    REM Create .env file
    echo [3/7] Tạo file .env...
    (
        echo # Database Connection
        echo DATABASE_URL=postgresql://user:password@localhost:5432/wedding_db
        echo.
        echo # Session Secret
        echo SESSION_SECRET=change_this_to_a_random_64_character_string_for_security
        echo.
        echo # Environment
        echo NODE_ENV=development
    ) > .env
    echo ✅ File .env đã được tạo!
    echo.
    
    REM Generate SESSION_SECRET
    echo [4/7] Tạo SESSION_SECRET ngẫu nhiên...
    for /f %%i in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set SESSION_SECRET=%%i
    echo SESSION_SECRET=!SESSION_SECRET!
    
    REM Update .env with generated secret
    powershell -Command "(gc .env) -replace 'change_this_to_a_random_64_character_string_for_security', '!SESSION_SECRET!' | Out-File -encoding ASCII .env"
    echo ✅ SESSION_SECRET đã được tạo tự động!
    echo.
    
    REM Database setup instructions
    echo [5/7] Hướng dẫn setup Database...
    echo.
    echo ⚠️  Bạn cần setup PostgreSQL database. Có 2 lựa chọn:
    echo.
    echo 📌 OPTION 1: Neon DB ^(Khuyên dùng - Miễn phí, dễ dùng^)
    echo    1. Truy cập: https://console.neon.tech/
    echo    2. Đăng ký tài khoản miễn phí
    echo    3. Tạo project mới tên "WeddingSite"
    echo    4. Copy "Connection String"
    echo    5. Mở file .env và thay thế DATABASE_URL
    echo.
    echo 📌 OPTION 2: PostgreSQL Local
    echo    1. Cài PostgreSQL từ: https://www.postgresql.org/download/windows/
    echo    2. Tạo database: createdb wedding_db
    echo    3. Update DATABASE_URL trong .env
    echo.
    echo Nhấn phím bất kỳ sau khi đã cập nhật DATABASE_URL trong .env...
    pause >nul
    echo.
    
    REM Push database schema
    echo [6/7] Tạo database tables...
    call npm run db:push
    if %errorlevel% neq 0 (
        echo.
        echo ⚠️  Lỗi khi tạo database tables!
        echo Vui lòng kiểm tra lại DATABASE_URL trong file .env
        echo.
        pause
        exit /b 1
    )
    echo ✅ Database tables đã được tạo!
    echo.
    
    REM Seed database
    echo [7/7] Thêm dữ liệu mẫu vào database...
    call npx tsx server/seed.ts
    if %errorlevel% neq 0 (
        echo.
        echo ⚠️  Lỗi khi seed database!
        pause
        exit /b 1
    )
    echo ✅ Dữ liệu mẫu đã được thêm!
    echo.
    
    echo ============================================================
    echo    ✅ CÀI ĐẶT HOÀN TẤT!
    echo ============================================================
    echo.
    echo Thông tin quan trọng:
    echo   - Admin Username: admin
    echo   - Admin Password: admin123
    echo   - ^(Nhớ đổi mật khẩu sau khi login!^)
    echo.
    echo Khởi động server...
    echo.
) else (
    echo ✅ Đã được cài đặt trước đó - Bỏ qua setup
    echo.
    echo Khởi động server...
    echo.
)

REM Start the server
echo ============================================================
echo    🚀 WEDDING WEBSITE ĐANG CHẠY
echo ============================================================
echo.
echo Website chạy tại: http://localhost:5000
echo Admin Panel: http://localhost:5000/login
echo.
if %FIRST_RUN%==1 (
    echo Thông tin đăng nhập:
    echo   Username: admin
    echo   Password: admin123
    echo.
)
echo Nhấn Ctrl+C để dừng server
echo.
echo ============================================================
echo.

REM Start the development server
npm run dev

pause
