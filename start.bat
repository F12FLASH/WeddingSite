@echo off
chcp 65001 >nul
cls
echo.
echo ============================================================
echo    💍 WEDDING WEBSITE - QUICK START (Windows)
echo ============================================================
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo ⚠️  Dependencies chưa được cài đặt!
    echo Chạy setup.bat trước, hoặc chạy: npm install
    echo.
    pause
    exit /b 1
)

REM Check if .env exists
if not exist .env (
    echo ⚠️  File .env không tồn tại!
    echo Chạy setup.bat trước để tạo file .env
    echo.
    pause
    exit /b 1
)

echo ✅ Đang khởi động website...
echo.
echo Website sẽ chạy tại: http://localhost:5000
echo.
echo Admin Panel: http://localhost:5000/login
echo   Username: admin
echo   Password: admin123
echo.
echo Nhấn Ctrl+C để dừng server
echo.
echo ============================================================
echo.

REM Start the development server
npm run dev

pause
