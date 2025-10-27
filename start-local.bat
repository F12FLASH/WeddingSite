@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM Wedding Website - Local Development Setup
REM ========================================

set "GREEN=[✓]"
set "RED=[✗]"
set "YELLOW=[!]"
set "BLUE=[i]"

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
echo ╔════════════════════════════╗
echo ║        WEDDING WEBSITE SETUP          ║
echo ║         Local Development             ║
echo ╚════════════════════════════╝
echo.
goto :eof

:check_nodejs
echo %BLUE% Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED% ERROR: Node.js is not installed or not in PATH!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo %GREEN% Node.js found!
node --version
echo.
goto :eof

:setup_env
echo %BLUE% Checking environment configuration...

if not exist ".env" (
    echo %YELLOW% .env file not found, creating from template...
    
    if not exist ".env.example" (
        echo %RED% ERROR: .env.example template not found!
        pause
        exit /b 1
    )
    
    copy ".env.example" ".env" >nul
    echo %GREEN% Created .env file from template
    
    echo.
    echo %YELLOW% IMPORTANT: Please configure your database credentials in .env
    echo.
    choice /C YN /M "Would you like to edit .env file now"
    if !ERRORLEVEL! EQU 1 (
        notepad ".env"
        echo %GREEN% .env file updated
    )
) else (
    echo %GREEN% .env file already exists
)

echo.
goto :eof

:install_dependencies
echo %BLUE% Installing project dependencies...
echo This may take a few minutes, please wait...
echo.

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo %RED% ERROR: Failed to install dependencies!
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

echo %GREEN% Dependencies installed successfully!
echo.
goto :eof

:setup_database
echo %BLUE% Database Setup
echo.
echo Please choose an option:
echo   1. Push schema only %YELLOW%(recommended for first time)%
echo   2. Push schema + seed with sample data
echo   3. Skip database setup
echo.

:db_choice_prompt
set /p "DB_CHOICE=Enter your choice (1-3): "

if "%DB_CHOICE%"=="1" (
    call :push_schema
) else if "%DB_CHOICE%"=="2" (
    call :push_schema
    if %ERRORLEVEL% EQU 0 (
        call :seed_database
    )
) else if "%DB_CHOICE%"=="3" (
    echo %YELLOW% Database setup skipped
) else (
    echo %RED% Invalid choice, please try again
    echo.
    goto :db_choice_prompt
)

echo.
goto :eof

:push_schema
echo %BLUE% Pushing database schema...
call npm run db:push
if %ERRORLEVEL% NEQ 0 (
    echo %RED% ERROR: Failed to push database schema!
    echo Please check your DATABASE_URL in .env file
    pause
    exit /b 1
)
echo %GREEN% Database schema pushed successfully!
goto :eof

:seed_database
echo %BLUE% Seeding database with sample data...
call npx tsx server/seed.ts
if %ERRORLEVEL% NEQ 0 (
    echo %RED% ERROR: Failed to seed database!
    pause
    exit /b 1
)
echo %GREEN% Database seeded successfully!
goto :eof

:start_server
echo %BLUE% Starting development server...
echo.
echo ╔═══════════════════════════════════════╗
echo ║           SERVER STARTING             ║
echo ╠═══════════════════════════════════════╣
echo ║  Local: http://localhost:5000        ║
echo ║                                       ║
echo ║  Press Ctrl+C to stop the server     ║
echo ╚═══════════════════════════════════════╝
echo.

call npm run dev
goto :eof