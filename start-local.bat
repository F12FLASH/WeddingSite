@echo off
REM ========================================
REM Wedding Website - Local Development Setup
REM ========================================
echo.
echo ========================================
echo   Wedding Website - Local Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/5] Checking Node.js version...
node --version
echo.

REM Check if .env file exists
if not exist .env (
    echo [2/5] Creating .env file from .env.example...
    copy .env.example .env
    echo.
    echo [WARNING] Please update .env file with your actual database credentials!
    echo Press any key to open .env file in notepad...
    pause >nul
    notepad .env
) else (
    echo [2/5] .env file already exists
)
echo.

REM Install dependencies
echo [3/5] Installing npm dependencies...
echo This may take a few minutes...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo.

REM Push database schema
echo [4/5] Setting up database...
echo.
echo Would you like to:
echo   1. Push schema only (recommended for first time)
echo   2. Push schema and seed database with sample data
echo   3. Skip database setup
echo.
set /p DB_CHOICE="Enter your choice (1/2/3): "

if "%DB_CHOICE%"=="1" (
    echo.
    echo Pushing database schema...
    call npm run db:push
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to push database schema!
        echo Make sure your DATABASE_URL in .env is correct
        pause
        exit /b 1
    )
) else if "%DB_CHOICE%"=="2" (
    echo.
    echo Pushing database schema...
    call npm run db:push
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to push database schema!
        pause
        exit /b 1
    )
    echo.
    echo Seeding database with sample data...
    call npx tsx server/seed.ts
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to seed database!
        pause
        exit /b 1
    )
) else (
    echo Skipping database setup...
)
echo.

REM Start development server
echo [5/5] Starting development server...
echo.
echo ========================================
echo   Server will start at http://localhost:5000
echo   Press Ctrl+C to stop the server
echo ========================================
echo.
call npm run dev
