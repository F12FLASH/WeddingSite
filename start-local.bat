@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM Wedding Website - Local Development Setup
REM Automated setup for Windows users
REM ========================================

set "GREEN=[32m✓[0m"
set "RED=[31m✗[0m"
set "YELLOW=[33m![0m"
set "BLUE=[34mi[0m"
set "CYAN=[36m★[0m"

call :print_header
call :check_nodejs || exit /b 1
call :setup_env || exit /b 1
call :install_dependencies || exit /b 1
call :setup_database
call :start_server

exit /b 0

REM ========================================
REM Functions
REM ========================================

:print_header
echo.
echo ╔═══════════════════════════════════════╗
echo ║        WEDDING WEBSITE SETUP          ║
echo ║         Local Development             ║
echo ╚═══════════════════════════════════════╝
echo.
echo %CYAN% Chào mừng đến với Wedding Website Setup!
echo.
goto :eof

:check_nodejs
echo %BLUE% Đang kiểm tra Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED% LỖI: Node.js chưa được cài đặt hoặc không có trong PATH!
    echo.
    echo Vui lòng tải và cài đặt Node.js từ:
    echo https://nodejs.org (khuyến nghị phiên bản LTS)
    echo.
    pause
    exit /b 1
)

echo %GREEN% Node.js đã được cài đặt!
echo Phiên bản: 
node --version
npm --version
echo.
goto :eof

:setup_env
echo %BLUE% Đang kiểm tra cấu hình môi trường...

if not exist ".env" (
    echo %YELLOW% Không tìm thấy file .env, đang tạo từ template...
    
    if not exist ".env.example" (
        echo %RED% LỖI: Không tìm thấy file .env.example!
        echo %YELLOW% Tạo file .env cơ bản...
        (
            echo # Database Configuration
            echo DATABASE_URL=postgresql://user:password@localhost:5432/wedding_db
            echo.
            echo # Session Secret
            echo SESSION_SECRET=your-secret-key-here-change-this
            echo.
            echo # Environment
            echo NODE_ENV=development
            echo PORT=5000
        ) > .env
        echo %GREEN% Đã tạo file .env cơ bản
    ) else (
        copy ".env.example" ".env" >nul
        echo %GREEN% Đã tạo file .env từ template
    )
    
    echo.
    echo %YELLOW% QUAN TRỌNG: Vui lòng cấu hình thông tin database trong .env
    echo.
    echo Bạn có muốn mở file .env để chỉnh sửa ngay bây giờ không?
    choice /C YN /M "Chọn Y (có) hoặc N (không)"
    if !ERRORLEVEL! EQU 1 (
        notepad ".env"
        echo %GREEN% File .env đã được cập nhật
    )
) else (
    echo %GREEN% File .env đã tồn tại
)

echo.
goto :eof

:install_dependencies
echo %BLUE% Đang cài đặt các thư viện cần thiết...
echo %YELLOW% Quá trình này có thể mất vài phút, vui lòng chờ...
echo.

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo %RED% LỖI: Không thể cài đặt dependencies!
    echo %YELLOW% Vui lòng kiểm tra kết nối internet và thử lại
    pause
    exit /b 1
)

echo %GREEN% Đã cài đặt dependencies thành công!
echo.
goto :eof

:setup_database
echo %BLUE% Thiết Lập Database
echo.
echo Vui lòng chọn một tùy chọn:
echo   1. Chỉ tạo schema %YELLOW%(khuyến nghị cho lần đầu)%[0m
echo   2. Tạo schema + seed dữ liệu mẫu
echo   3. Bỏ qua thiết lập database
echo.

:db_choice_prompt
set /p "DB_CHOICE=Nhập lựa chọn của bạn (1-3): "

if "%DB_CHOICE%"=="1" (
    call :push_schema
) else if "%DB_CHOICE%"=="2" (
    call :push_schema
    if %ERRORLEVEL% EQU 0 (
        call :seed_database
    )
) else if "%DB_CHOICE%"=="3" (
    echo %YELLOW% Đã bỏ qua thiết lập database
) else (
    echo %RED% Lựa chọn không hợp lệ, vui lòng thử lại
    echo.
    goto :db_choice_prompt
)

echo.
goto :eof

:push_schema
echo %BLUE% Đang push database schema...
call npm run db:push
if %ERRORLEVEL% NEQ 0 (
    echo %RED% LỖI: Không thể push database schema!
    echo %YELLOW% Vui lòng kiểm tra DATABASE_URL trong file .env
    echo %YELLOW% Đảm bảo PostgreSQL đang chạy và thông tin kết nối chính xác
    echo.
    echo Bạn có muốn tiếp tục mà không thiết lập database không?
    choice /C YN /M "Chọn Y (có) hoặc N (không)"
    if !ERRORLEVEL! EQU 2 (
        pause
        exit /b 1
    )
    exit /b 1
)
echo %GREEN% Đã push database schema thành công!
goto :eof

:seed_database
echo %BLUE% Đang seed database với dữ liệu mẫu...
call npx tsx server/seed.ts
if %ERRORLEVEL% NEQ 0 (
    echo %RED% LỖI: Không thể seed database!
    echo %YELLOW% Database schema đã được tạo, nhưng dữ liệu mẫu không thể thêm vào
    pause
    exit /b 1
)
echo %GREEN% Đã seed database thành công!
goto :eof

:start_server
echo %BLUE% Đang khởi động development server...
echo.
echo ╔═══════════════════════════════════════╗
echo ║          SERVER ĐANG KHỞI ĐỘNG       ║
echo ╠═══════════════════════════════════════╣
echo ║  Local: http://localhost:5000        ║
echo ║                                       ║
echo ║  Nhấn Ctrl+C để dừng server          ║
echo ╚═══════════════════════════════════════╝
echo.
echo %GREEN% Truy cập http://localhost:5000 để xem website
echo %CYAN% Admin panel: http://localhost:5000/admin
echo.

call npm run dev
goto :eof
