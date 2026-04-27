# 🚀 MeGPT - Quick Start Guide

## 60-Second Setup

### 1️⃣ Get HuggingFace API Key
- Go to https://huggingface.co/settings/tokens
- Create a new token (select "Read")
- Copy the token

### 2️⃣ Install & Configure
```bash
# Run from MeGPT root directory
npm run install-all
```

### 3️⃣ Add Your API Key
```bash
# Edit: backend/.env
HUGGINGFACE_API_KEY=paste_your_token_here
```

### 4️⃣ Start the App
```bash
npm run dev
```

### 5️⃣ Open in Browser
```
http://localhost:3000
```

---

## ✨ What You Can Do

| Feature | What It Does | Example |
|---------|-------------|---------|
| 💬 Chat | Talk to AI | "Write a Python script" |
| 🖼️ Image Gen | Create images | "A sunset over mountains" |
| 📁 Upload | Analyze files | Upload a PDF or image |
| 🎤 Voice | Talk instead of typing | Click mic and speak |
| 📊 Search | Find past chats | Search your conversations |
| 🌙 Dark Mode | Eye-friendly interface | Toggle in settings |
| 💾 Save | All chats auto-saved | Access anytime |

---

## 🎮 How to Use

### Start Chatting
1. Click "New Chat" in sidebar
2. Type your question
3. Press Enter or click Send
4. AI responds instantly

### Generate Images
1. Click 🖼️ icon in toolbar
2. Describe what you want
3. Adjust settings (optional)
4. Click "Generate Image"
5. Download if you like it

### Upload Files
1. Click 📁 icon in toolbar
2. Drag files or browse
3. Click "Upload"
4. Ask questions about them

### Use Voice
1. Click 🎤 icon
2. Speak your question
3. AI understands and responds

### Change Mode
- Select mode from header dropdown:
  - **Normal** - Regular chatting
  - **Code** - Programming help
  - **Research** - Deep analysis
  - **Analysis** - Data analysis

---

## ⚙️ Settings

### Theme
- **Dark Mode** (default) - Easy on eyes
- **Light Mode** - Bright interface

### Memory
- Toggle "Enable Memory System" to remember your preferences
- Disable for private browsing

### Custom Instructions
- Tell AI how to respond
- Example: "Always provide code examples"

### Web Search
- Enable for real-time information
- Requires web search API key (optional)

---

## 🐛 Troubleshooting

### "Can't connect to server"
```bash
# Make sure backend is running
cd backend
npm run dev
```

### "Invalid API key"
1. Check your HuggingFace token is correct
2. Make sure it's in `backend/.env`
3. Restart the backend server

### "Model not available"
- Some models may need approval
- Try a different model in `.env`
- Visit https://huggingface.co/models

### "Image generation too slow"
- First generation is slower (model loading)
- Subsequent images are faster
- Complex prompts take longer

---

## 📚 File Locations

| File | Location | Purpose |
|------|----------|---------|
| API Key | `backend/.env` | HuggingFace access |
| Database | `backend/data/megpt.db` | Chat history |
| Frontend | `frontend/src/` | React app |
| Backend | `backend/` | Express server |

---

## 🔗 Useful Links

| Resource | URL |
|----------|-----|
| HuggingFace | https://huggingface.co |
| API Key | https://huggingface.co/settings/tokens |
| Models | https://huggingface.co/models |
| Docs | See README.md in root |
| Features | See FEATURES.md |

---

## 💡 Tips & Tricks

### Better Chat Responses
- Be specific in your prompts
- Provide context
- Ask follow-up questions
- Use the regenerate button

### Image Generation
- Use descriptive adjectives
- Specify art style
- Include lighting details
- Use negative prompts to exclude unwanted elements

### Organizing Chats
- Create projects in settings
- Search for specific topics
- Rename important chats
- Delete old conversations

### Performance
- Disable memory if not needed
- Close unused browser tabs
- Restart if app slows down
- Check internet connection

---

## 🚀 Next Steps

1. **Explore**: Try different chat modes
2. **Create**: Generate some images
3. **Organize**: Create projects for your chats
4. **Customize**: Set up custom instructions
5. **Share**: Export and share conversations

---

## ❓ FAQ

**Q: Is my data private?**
A: Yes! Everything is stored locally. No data goes to third parties except HuggingFace for AI processing.

**Q: Can I delete my chat history?**
A: Yes! Go to Settings > Account & Data > Clear Chat History

**Q: How long do conversations last?**
A: Forever! They're saved in the local database until you delete them.

**Q: Can I use this without internet?**
A: No, you need internet for HuggingFace API calls.

**Q: Is there a mobile app?**
A: The web app is mobile-friendly! Use it on your phone browser.

**Q: Can I self-host this?**
A: Yes! See ARCHITECTURE.md for deployment options.

---

## 🎉 Enjoy MeGPT!

You're all set! Start chatting with AI. If you encounter any issues, check SETUP.md or ARCHITECTURE.md for detailed information.

Happy chatting! 🚀
