@echo off
REM MeGPT Installation Script for Windows

echo 🚀 Welcome to MeGPT Setup!
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Backend setup
echo.
echo 🔧 Setting up backend...
cd backend
call npm install
copy .env.example .env
echo ⚠️  Please edit backend\.env and add your HuggingFace API key
cd ..

REM Frontend setup
echo.
echo 🎨 Setting up frontend...
cd frontend
call npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Edit backend\.env and add your HuggingFace API key
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo.
echo 🎉 Happy chatting with MeGPT!
pause
