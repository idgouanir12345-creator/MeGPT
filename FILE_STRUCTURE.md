# 📋 MeGPT - File Directory & Purposes

## Root Directory Files

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation with complete features list |
| `QUICK_START.md` | Fast setup guide (60 seconds) |
| `SETUP.md` | Detailed step-by-step setup instructions |
| `FEATURES.md` | Complete feature list with implementation status |
| `ARCHITECTURE.md` | System design, database schema, and technical details |
| `API.md` | Complete API endpoint documentation |
| `PROJECT_SUMMARY.md` | This project's overview |
| `FILE_STRUCTURE.md` | This file - directory structure reference |
| `package.json` | Root npm configuration |
| `.gitignore` | Git ignore patterns |
| `setup.sh` | Automated setup script for Linux/Mac |
| `setup.bat` | Automated setup script for Windows |

---

## Backend Directory (`backend/`)

### Main Files

| File | Lines | Purpose |
|------|-------|---------|
| `server.js` | ~60 | Express server entry point, middleware setup |
| `database.js` | ~200 | SQLite database initialization and query methods |
| `routes.js` | ~450 | All API endpoints (chat, images, projects, settings, search) |
| `utils.js` | ~40 | Utility functions (file sizing, formatting) |
| `package.json` | ~30 | Backend dependencies (Express, SQLite, Axios, etc.) |
| `.env.example` | ~15 | Environment variables template |

### Services Directory (`backend/services/`)

| File | Purpose |
|------|---------|
| `huggingFace.js` | HuggingFace API integration for chat, image generation, image analysis |
| `webSearch.js` | Web search service (optional integration) |

### Data Directory (`backend/data/`)
- `megpt.db` - SQLite database file (auto-created on first run)

---

## Frontend Directory (`frontend/`)

### Public Directory (`frontend/public/`)

| File | Purpose |
|------|---------|
| `index.html` | HTML entry point for React app |

### Source Directory (`frontend/src/`)

#### Main Files

| File | Lines | Purpose |
|------|-------|---------|
| `App.js` | ~80 | Main React component, state management |
| `index.js` | ~20 | React entry point |
| `index.css` | ~80 | Global styles and CSS variables |
| `App.css` | ~15 | App-level styles |
| `utils.js` | ~50 | Frontend utilities (formatting, clipboard, etc.) |
| `package.json` | ~35 | Frontend dependencies (React, Axios, React Icons) |
| `.env.example` | ~5 | Environment variables template |

### Components Directory (`frontend/src/components/`)

| Component | Files | Lines | Purpose |
|-----------|-------|-------|---------|
| **Sidebar** | `.js` + `.css` | 150 | Chat list, search, new chat, settings navigation |
| **ChatWindow** | `.js` + `.css` | 200 | Main chat interface, message display, input |
| **Message** | `.js` + `.css` | 150 | Individual message with markdown, code highlight, actions |
| **ImageGenerator** | `.js` + `.css` | 200 | Image generation UI with prompt and settings |
| **FileUpload** | `.js` + `.css` | 150 | File upload interface with drag-drop |
| **VoiceInput** | `.js` + `.css` | 80 | Voice input with Web Speech API |
| **Settings** | `.js` + `.css` | 200 | User settings, theme, preferences, custom instructions |

---

## File Statistics

### Backend
- **Total Files**: 8
- **Total Lines**: ~1,100
- **Main Logic**: `huggingFace.js`, `routes.js`, `database.js`

### Frontend
- **Total Files**: 14 (7 components × 2 files each + core files)
- **Total Lines**: ~2,000+
- **Main Components**: 7 components + 3 core files

### Documentation
- **Files**: 8 markdown files
- **Total Content**: ~5,000 lines of documentation

### Total Project
- **Total Files**: ~30+
- **Total Code**: ~3,100 lines
- **Total Documentation**: ~5,000 lines

---

## File Dependencies

### Backend Dependencies
```
server.js
  ├── Express
  ├── database.js
  ├── routes.js
  │   ├── huggingFace.js
  │   └── webSearch.js
  ├── CORS
  └── middleware
```

### Frontend Dependencies
```
App.js
  ├── Sidebar.js
  ├── ChatWindow.js
  │   ├── Message.js
  │   ├── ImageGenerator.js
  │   ├── FileUpload.js
  │   └── VoiceInput.js
  ├── Settings.js
  └── utils.js
```

---

## API Endpoints Reference

### Organized by Resource

#### 🗂️ Chats (`/api/chats`)
- `GET /chats` - List all chats
- `POST /chats` - Create chat
- `GET /chats/:id/messages` - Get messages
- `POST /chats/:id/messages` - Send message
- `PUT /chats/:id` - Update chat
- `DELETE /chats/:id` - Delete chat

#### 💬 Messages (`/api/messages`)
- `PUT /messages/:id` - Edit message

#### 🖼️ Images (`/api/`)
- `POST /generate-image` - Create image
- `POST /analyze-image` - Analyze image
- `POST /edit-image` - Edit image

#### 📁 Projects (`/api/projects`)
- `GET /projects` - List projects
- `POST /projects` - Create project

#### ✅ Tasks (`/api/tasks`)
- `GET /tasks` - List tasks
- `POST /tasks` - Create task

#### ⚙️ Settings (`/api/settings`)
- `GET /settings/:userId` - Get settings
- `PUT /settings/:userId` - Update settings

#### 🔍 Search (`/api/search`)
- `GET /search` - Search chats/messages

#### ℹ️ Info
- `GET /models` - List available models
- `GET /health` - Health check

---

## Database Tables

### Schema Overview

```
users
├── chat_sessions
│   └── messages
├── projects
└── tasks

user_settings
```

See `ARCHITECTURE.md` for complete SQL schema.

---

## Configuration Files

### Backend Configuration
- `backend/.env` - HuggingFace API key, port, database path
- `backend/.env.example` - Template with all options

### Frontend Configuration
- `frontend/.env` - API endpoint
- `frontend/.env.example` - Template

### NPM Configuration
- `backend/package.json` - Backend dependencies
- `frontend/package.json` - Frontend dependencies
- `package.json` (root) - Monorepo scripts

### Version Control
- `.gitignore` - Files to ignore in git

---

## Document Files Purpose

| Document | When to Read | Contains |
|----------|------------|----------|
| **README.md** | First time | Feature overview, quick links |
| **QUICK_START.md** | Setup | 60-second setup guide |
| **SETUP.md** | Installation | Detailed setup steps, troubleshooting |
| **FEATURES.md** | Understanding features | What's implemented, roadmap |
| **ARCHITECTURE.md** | Deep dive | System design, database schema, scaling |
| **API.md** | API integration | All endpoints documented |
| **PROJECT_SUMMARY.md** | Overview | Project status, what's included |
| **FILE_STRUCTURE.md** | This file | Navigation guide |

---

## Key File Locations

### Important Configs
- API Key: `backend/.env` ⚠️ Keep secret!
- Database: `backend/data/megpt.db` 💾 Don't delete!
- UI Components: `frontend/src/components/` 🎨

### Where to Make Changes
- **Add new UI feature**: `frontend/src/components/`
- **Add new API endpoint**: `backend/routes.js`
- **Add new AI feature**: `backend/services/huggingFace.js`
- **Change styling**: Component `.css` files

---

## File Naming Conventions

### Backend
- Files: `camelCase.js`
- Functions: `camelCase()`
- Classes: `PascalCase`
- Exports: `named exports`

### Frontend
- Files: `PascalCase.js` (components), `camelCase.js` (utils)
- Components: React FC
- Styles: `ComponentName.css`
- Props: camelCase

### Documentation
- Files: `UPPERCASE.md`
- Sections: `##` Headers

---

## Updating Files

### To Add a Feature
1. **Backend**: Add route to `routes.js`
2. **Backend**: Add logic to `services/` if needed
3. **Frontend**: Create component in `components/`
4. **Frontend**: Use component in `App.js` or other components
5. **Update**: Document in FEATURES.md

### To Add New Endpoint
1. Edit `backend/routes.js`
2. Add function to `backend/services/`
3. Update `API.md`
4. Update frontend to call endpoint

### To Add New Component
1. Create `frontend/src/components/ComponentName.js`
2. Create `frontend/src/components/ComponentName.css`
3. Import in `App.js`
4. Use in application

---

## File Sizes

- Backend code: ~50 KB
- Frontend code: ~70 KB
- Database (empty): ~4 KB
- Assets: Minimal (icons from library)
- Documentation: ~300 KB
- node_modules: ~300+ MB (expected)

---

## Backup Important Files

### Must Backup
- `backend/.env` - Contains API key
- `backend/data/megpt.db` - User data
- `frontend/.env` - Configuration

### Don't Backup
- `node_modules/` - Can reinstall
- `.git/` - Version control
- Build output

---

## File Access Speed

### Fast ✅
- `.env` files (used on startup)
- Static assets
- `package.json`

### Medium ⚡
- Database queries (optimized)
- React components (cached)
- API responses

### Slow ⚠️
- Initial npm install
- HuggingFace API calls (30-60s for images)
- Large database scans

---

## Version Control

### What to Commit
- `.js` / `.jsx` files
- `.css` files
- `.md` documentation
- `package.json`
- `.env.example` (not .env!)
- `.gitignore`

### What to Ignore
- `.env` (use .env.example)
- `node_modules/`
- `package-lock.json` (optional)
- `backend/data/` (optional)
- IDE files (`.vscode/`, `.idea/`)

---

For more information, see the main **README.md** file.
