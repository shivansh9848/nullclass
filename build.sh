#!/bin/bash

# Production Build Script for Stack Overflow Clone

echo "🚀 Starting production build process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install --production
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Build the React app
echo "🏗️ Building React application..."
cd client
npm run build

if [ $? -eq 0 ]; then
    echo "✅ React build completed successfully"
else
    echo "❌ React build failed"
    exit 1
fi

cd ..

echo "🎉 Production build completed successfully!"
echo "📁 Built files are in: client/build/"
echo "🚀 Ready for deployment!"

# Optional: Run tests
read -p "Do you want to run tests? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧪 Running tests..."
    cd client
    npm test -- --watchAll=false
    cd ..
fi

echo "✅ Build process completed!"
