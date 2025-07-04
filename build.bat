@echo off
REM Production Build Script for Stack Overflow Clone (Windows)

echo 🚀 Starting production build process...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
npm install --production
cd ..

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
npm install
cd ..

REM Build the React app
echo 🏗️ Building React application...
cd client
npm run build

if %errorlevel% equ 0 (
    echo ✅ React build completed successfully
) else (
    echo ❌ React build failed
    exit /b 1
)

cd ..

echo 🎉 Production build completed successfully!
echo 📁 Built files are in: client/build/
echo 🚀 Ready for deployment!

pause
