# MeGPT Setup Guide

## Quick Installation

### Option 1: Install Everything at Once (Recommended)
```bash
npm run install-all
```

### Option 2: Manual Installation

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your HuggingFace API key
npm run dev
```

#### Frontend (in new terminal)
```bash
cd frontend
npm install
npm start
```

### Option 3: Docker

Coming soon!

## Configuration

### HuggingFace API Key
1. Go to https://huggingface.co/settings/tokens
2. Create a new token with "Read" access
3. Copy it to `backend/.env` as `HUGGINGFACE_API_KEY`

### Available Models
Edit `backend/.env` to use different models:

**Text Models:**
- `meta-llama/Llama-2-7b-chat-hf` (recommended)
- `mistralai/Mistral-7B-Instruct-v0.1`
- `tiiuae/falcon-7b-instruct`

**Image Models:**
- `stabilityai/stable-diffusion-2` (recommended)
- `runwayml/stable-diffusion-v1-5`
- `prompthero/openjourney`

## Features Enabled

### ✅ Implemented
- Chat interface with AI
- Chat history & search
- Image generation
- Image analysis
- File uploads
- Voice input
- Dark/light theme
- Settings & customization
- Projects & tasks
- Message editing & regeneration
- Multiple chat modes (normal, code, research, analysis)
- Local storage of conversations

### 🔄 Can Be Added Later
- Web search integration (requires API key like Serper)
- Text-to-speech (browser native support)
- Real-time collaboration
- Plugin system
- Mobile app

## Troubleshooting

### Backend won't start
- Check Node.js version: `node --version` (should be 14+)
- Delete `node_modules` and run `npm install` again
- Check if port 5000 is free: `lsof -i :5000`

### Frontend shows blank page
- Check browser console for errors
- Make sure backend is running on port 5000
- Clear browser cache and refresh

### Image generation fails
- Check HuggingFace API key is valid
- Try a simpler prompt
- Some models have usage limits

### Database errors
- Delete `backend/data/megpt.db` and restart
- Check file permissions in the data folder

## Next Steps

1. ✅ Set up backend and frontend
2. ✅ Add your HuggingFace API key
3. ✅ Start both servers
4. ✅ Open http://localhost:3000
5. ✅ Create your first chat!

---

For more help, see the main README.md file.
