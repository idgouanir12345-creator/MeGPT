#!/bin/bash

# MeGPT Installation Script

echo "🚀 Welcome to MeGPT Setup!"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Backend setup
echo ""
echo "🔧 Setting up backend..."
cd backend
npm install
cp .env.example .env
echo "⚠️  Please edit backend/.env and add your HuggingFace API key"
cd ..

# Frontend setup
echo ""
echo "🎨 Setting up frontend..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env and add your HuggingFace API key"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "🎉 Happy chatting with MeGPT!"
