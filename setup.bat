@echo off
chcp 65001 >nul
cls
echo.
echo ============================================================
echo    💍 WEDDING WEBSITE - SETUP SCRIPT (Windows)
echo ============================================================
echo.

REM Check if Node.js is installed
echo [1/6] Kiểm tra Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js chưa được cài đặt!
    echo.
    echo Vui lòng tải và cài đặt Node.js từ: https://nodejs.org/
    echo Chọn phiên bản LTS (Recommended for Most Users)
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js đã cài đặt
node -v
echo.

REM Check if npm is installed
echo [2/6] Kiểm tra npm...
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm không tìm thấy!
    pause
    exit /b 1
)
echo ✅ npm đã cài đặt
npm -v
echo.

REM Install dependencies
echo [3/6] Cài đặt dependencies...
echo Đây có thể mất 2-3 phút, vui lòng đợi...
echo.
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ❌ Lỗi khi cài đặt dependencies!
    echo.
    echo Thử chạy lệnh sau để xóa cache và cài lại:
    echo   rd /s /q node_modules
    echo   del package-lock.json
    echo   npm install
    echo.
    pause
    exit /b 1
)
echo.
echo ✅ Dependencies đã được cài đặt thành công!
echo.

REM Check if .env exists
echo [4/6] Kiểm tra file .env...
if exist .env (
    echo ⚠️  File .env đã tồn tại. Bỏ qua bước này.
    echo    Nếu muốn tạo lại, xóa file .env và chạy lại setup.bat
) else (
    echo Tạo file .env mới...
    (
        echo # Database Connection
        echo DATABASE_URL=postgresql://user:password@localhost:5432/wedding_db
        echo.
        echo # Session Secret (generate bằng: node -e "console.log(require('crypto'^).randomBytes(32^).toString('hex'^)^)"^)
        echo SESSION_SECRET=change_this_to_a_random_64_character_string_for_security
        echo.
        echo # Environment
        echo NODE_ENV=development
    ) > .env
    echo ✅ File .env đã được tạo!
    echo.
    echo ⚠️  QUAN TRỌNG: Vui lòng cập nhật file .env với thông tin thật:
    echo    1. DATABASE_URL - Connection string của PostgreSQL
    echo    2. SESSION_SECRET - Chuỗi ngẫu nhiên 64 ký tự
    echo.
)
echo.

REM Database setup instructions
echo [5/6] Hướng dẫn setup Database...
echo.
echo Bạn cần setup PostgreSQL database. Có 2 lựa chọn:
echo.
echo 📌 OPTION 1: Neon DB (Khuyên dùng - Miễn phí, dễ dùng)
echo    1. Truy cập: https://console.neon.tech/
echo    2. Đăng ký tài khoản miễn phí
echo    3. Tạo project mới tên "WeddingSite"
echo    4. Copy "Connection String"
echo    5. Paste vào .env file (thay thế DATABASE_URL)
echo.
echo 📌 OPTION 2: PostgreSQL Local
echo    1. Cài PostgreSQL từ: https://www.postgresql.org/download/windows/
echo    2. Tạo database: createdb wedding_db
echo    3. Update DATABASE_URL trong .env
echo.
echo Sau khi setup database, chạy các lệnh sau:
echo   npm run db:push           (tạo tables)
echo   npx tsx server/seed.ts    (thêm dữ liệu mẫu)
echo.
pause
echo.

REM Generate SESSION_SECRET
echo [6/6] Tạo SESSION_SECRET ngẫu nhiên...
echo.
echo Chạy lệnh sau để tạo SESSION_SECRET:
echo   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo.
echo Copy kết quả và paste vào file .env (thay thế SESSION_SECRET)
echo.
pause

echo.
echo ============================================================
echo    ✅ SETUP HOÀN TẤT!
echo ============================================================
echo.
echo BƯỚC TIẾP THEO:
echo   1. Mở file .env và cập nhật DATABASE_URL, SESSION_SECRET
echo   2. Chạy: npm run db:push
echo   3. Chạy: npx tsx server/seed.ts
echo   4. Chạy: npm run dev
echo.
echo HOẶC sử dụng file start.bat để chạy nhanh!
echo.
echo Admin Login:
echo   Username: admin
echo   Password: admin123
echo   (Nhớ đổi mật khẩu sau khi login!)
echo.
echo Website sẽ chạy tại: http://localhost:5000
echo.
pause
