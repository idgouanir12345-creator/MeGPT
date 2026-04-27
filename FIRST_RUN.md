# 🎯 MeGPT - First Run Checklist

## ✅ Pre-Setup Requirements

- [ ] Windows, Mac, or Linux
- [ ] Node.js 14+ installed
- [ ] Internet connection
- [ ] HuggingFace account (free)
- [ ] ~10 minutes of time

## 🔑 Step 1: Get HuggingFace API Key (2 minutes)

1. Open https://huggingface.co/settings/tokens
2. Click "New token"
3. Fill in:
   - Name: "MeGPT"
   - Access type: "Read"
4. Click "Create"
5. Copy the token (starts with `hf_`)
6. Save it temporarily (you'll need it in Step 4)

## 📦 Step 2: Install Dependencies (3 minutes)

Open terminal/PowerShell and run:

```bash
# Navigate to MeGPT directory
cd c:\Users\DELL\Documents\MeGPT

# Install everything (backend + frontend)
npm run install-all
```

This installs:
- Node.js packages for backend
- Node.js packages for frontend
- SQLite database
- React and all dependencies

## 🔧 Step 3: Configure Backend (1 minute)

1. Open: `backend/.env`
2. Find the line: `HUGGINGFACE_API_KEY=your_key_here`
3. Replace with your API key from Step 1
4. Save the file

Example:
```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🚀 Step 4: Start the Servers (1 minute)

From the MeGPT root directory, run:

```bash
npm run dev
```

You should see:
```
✅ Database connected
✅ Database tables created/verified
🚀 MeGPT Backend running on http://localhost:5000

On another terminal:
> megpt-frontend@0.1.0 start
Compiled successfully!
Local: http://localhost:3000
```

## 🌐 Step 5: Open in Browser (30 seconds)

Click or paste: **http://localhost:3000**

You should see the MeGPT interface with:
- Logo in top left
- Sidebar on left
- Chat area in center
- "New Chat" button visible

## ✨ Step 6: Create Your First Chat (1 minute)

1. Click "New Chat" button
2. Type: "Hello! What can you do?"
3. Press Enter or click Send button
4. Wait for AI response (5-10 seconds on first try)
5. Continue chatting!

## 🎉 Success!

If you see:
- ✅ AI responses appearing
- ✅ Chat history saving
- ✅ Theme toggle working
- ✅ Settings opening

**Congratulations! MeGPT is working!** 🎊

---

## 🧪 Test Each Feature (Optional)

### Image Generation
1. Click 🖼️ icon in toolbar
2. Type: "A cat wearing sunglasses"
3. Click "Generate Image"
4. Wait 30-60 seconds
5. Image should appear!

### File Upload
1. Click 📁 icon
2. Choose or drag a PDF/image
3. Upload it
4. Ask about the file content

### Voice Input
1. Click 🎤 icon
2. Speak: "Hello world"
3. Should transcribe and respond

### Dark Mode
1. Click 🌙 icon in sidebar
2. Interface should turn light
3. Click again to go back to dark

---

## ⚡ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Enter | Send message |
| Shift+Enter | New line |
| Cmd/Ctrl+K | Focus search |
| Escape | Close modals |

---

## 🛑 If Something Goes Wrong

### "Backend won't start"
```bash
# Kill any process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Delete node_modules and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all

# Try again
npm run dev
```

### "API key error"
1. Check key is pasted correctly (starts with `hf_`)
2. Verify it's in `backend/.env` (not somewhere else)
3. Save the file
4. Restart backend (Ctrl+C then `npm run dev`)

### "Blank white page"
1. Open browser console (F12)
2. Check for red errors
3. Make sure backend is running on port 5000
4. Clear browser cache
5. Refresh page

### "Image generation fails"
1. Check internet connection
2. Try a simpler prompt
3. Wait longer (first time is slow)
4. Check HuggingFace API key is valid

### "Port already in use"
1. Edit `backend/.env`
2. Change `PORT=5000` to `PORT=5001`
3. Edit `frontend/package.json` proxy to `http://localhost:5001`
4. Restart

---

## 📚 Next: Learn More

After getting it working, explore:

| Document | Learn What |
|----------|-----------|
| **README.md** | All features available |
| **QUICK_START.md** | Keyboard tips & tricks |
| **FEATURES.md** | What's implemented |
| **API.md** | How to use endpoints |
| **ARCHITECTURE.md** | Technical details |

---

## 🎓 Common Questions

**Q: Why is image generation slow?**
A: First request loads the model (~2GB). Subsequent requests are faster.

**Q: Where is my chat history saved?**
A: In `backend/data/megpt.db` on your computer. It never leaves your machine!

**Q: Can I change the AI model?**
A: Yes! Edit `backend/.env` and change `TEXT_MODEL` to a different HuggingFace model.

**Q: How do I backup my chats?**
A: Copy `backend/data/megpt.db` to a safe location.

**Q: Can I run this on my phone?**
A: The web interface works on phones! Use http://localhost:3000 on your phone's browser connected to the same network.

---

## 🚀 You're Ready!

Everything is set up. Start chatting with MeGPT!

If you need help later:
1. Check SETUP.md
2. Review ARCHITECTURE.md
3. See API.md for technical details

**Happy chatting!** 🎉
