/*
 * MeGPT - Complete AI Chat Application
 * Architecture & Implementation Guide
 */

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Sidebar      │    Chat Window    │  Settings Panel    │ │
│  │  • Chat list  │  • Messages       │  • Preferences     │ │
│  │  • Search     │  • Input box      │  • Theme           │ │
│  │  • Theme      │  • Tools          │  • Custom inst.    │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────┬───────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Express/Node.js)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Routes        Services              Database          │ │
│  │  • /api/chats  • HuggingFace API  • SQLite DB       │ │
│  │  • /api/tasks  • Image Gen/Edit    • User data       │ │
│  │  • /api/files  • File handling     • Chat history    │ │
│  │  • /api/models • Search            • Settings        │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────┬───────────────────────────────────────┘
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    ┌────────┐  ┌──────────┐  ┌────────┐
    │ Hugging│  │ Hugging  │  │ SQLite │
    │ Face   │  │ Face     │  │ Local  │
    │ Chat   │  │ Image    │  │ DB     │
    │ Models │  │ Models   │  │        │
    └────────┘  └──────────┘  └────────┘
```

## File Structure

```
MeGPT/
├── README.md                 # Main documentation
├── SETUP.md                  # Setup instructions
├── FEATURES.md              # Complete feature list
├── ARCHITECTURE.md          # This file
├── setup.sh / setup.bat     # Installation scripts
├── package.json             # Root package manager
│
├── backend/
│   ├── server.js            # Main Express server
│   ├── database.js          # SQLite database setup & queries
│   ├── routes.js            # API endpoint definitions
│   ├── package.json         # Backend dependencies
│   ├── .env.example         # Environment template
│   ├── services/
│   │   └── huggingFace.js   # HuggingFace API client
│   └── data/
│       └── megpt.db         # SQLite database (auto-created)
│
└── frontend/
    ├── public/
    │   └── index.html       # HTML entry point
    ├── src/
    │   ├── App.js           # Main React component
    │   ├── App.css          # Main styles
    │   ├── index.js         # React entry point
    │   ├── index.css        # Global styles
    │   └── components/
    │       ├── Sidebar.js           # Chat list & navigation
    │       ├── ChatWindow.js        # Main chat interface
    │       ├── Message.js           # Individual message
    │       ├── ImageGenerator.js    # Image creation tool
    │       ├── FileUpload.js        # File upload interface
    │       ├── VoiceInput.js        # Voice input handler
    │       ├── Settings.js          # User settings panel
    │       └── *.css                # Component styles
    ├── package.json         # Frontend dependencies
    └── .env.example         # Environment template
```

## Data Flow

### Sending a Message
```
User Input
    ↓
[ChatWindow Component]
    ↓ (fetches)
POST /api/chats/:sessionId/messages
    ↓
[routes.js - handles request]
    ↓
[huggingFace.js - calls AI API]
    ↓
[HuggingFace Model API]
    ↓ (response)
[Database - saves message pair]
    ↓ (returns)
Frontend Component
    ↓
[Displays message in chat]
```

### Image Generation
```
User Prompt + Settings
    ↓
[ImageGenerator Component]
    ↓ (POSTs)
/api/generate-image
    ↓
[routes.js]
    ↓
[huggingFace.js - image generation]
    ↓
[Stable Diffusion Model]
    ↓ (binary image)
[Convert to base64]
    ↓ (returns)
Frontend
    ↓
[Display image]
```

## Database Schema

### users table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,              -- UUID
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  password_hash TEXT,
  created_at DATETIME,
  preferences TEXT                  -- JSON string
);
```

### chat_sessions table
```sql
CREATE TABLE chat_sessions (
  id TEXT PRIMARY KEY,              -- UUID
  user_id TEXT,
  title TEXT,
  created_at DATETIME,
  updated_at DATETIME,
  mode TEXT DEFAULT 'normal',       -- normal, code, research, analysis
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### messages table
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,              -- UUID
  session_id TEXT,
  user_id TEXT,
  role TEXT,                        -- 'user' or 'assistant'
  content TEXT,
  files TEXT,                       -- JSON array of file paths
  created_at DATETIME,
  edited_at DATETIME,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
);
```

### projects table
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT,
  description TEXT,
  created_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### tasks table
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT,
  description TEXT,
  scheduled_at DATETIME,
  completed BOOLEAN DEFAULT 0,
  created_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### user_settings table
```sql
CREATE TABLE user_settings (
  user_id TEXT PRIMARY KEY,
  theme TEXT DEFAULT 'dark',
  memory_enabled BOOLEAN DEFAULT 1,
  web_search_enabled BOOLEAN DEFAULT 0,
  auto_save BOOLEAN DEFAULT 1,
  notifications_enabled BOOLEAN DEFAULT 1,
  custom_instructions TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* ... */ },
  "model": "model-name"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional info (dev only)",
  "suggestion": "How to fix it"
}
```

## Key Dependencies

### Backend
- **express** - Web server framework
- **sqlite3** - Local database
- **axios** - HTTP client for HuggingFace API
- **cors** - Cross-origin request handling
- **uuid** - Unique ID generation
- **dotenv** - Environment variable loading

### Frontend
- **react** - UI framework
- **axios** - API client
- **react-icons** - Icon library
- **react-markdown** - Markdown rendering
- **highlight.js** - Code syntax highlighting
- **date-fns** - Date formatting

## Environment Configuration

### Backend (.env)
```env
PORT=5000                                     # Express server port
NODE_ENV=development                          # development or production
HUGGINGFACE_API_KEY=hf_xxxxx                 # Your API key
TEXT_MODEL=meta-llama/Llama-2-7b-chat-hf    # Text generation
IMAGE_MODEL=stabilityai/stable-diffusion-2   # Image generation
DB_PATH=./data/megpt.db                      # Database location
WEB_SEARCH_API_KEY=optional                  # For web search feature
```

## Performance Optimizations

1. **Frontend**
   - React.memo for message components
   - Lazy loading of images
   - Debounced search input
   - CSS-in-JS for dynamic theming

2. **Backend**
   - SQLite indexes on frequently queried fields
   - Response caching (optional)
   - Efficient JSON serialization
   - Connection pooling ready

3. **AI**
   - Model inference caching
   - Batch processing support
   - Rate limiting ready
   - Timeout handling

## Security Considerations

1. **API Keys**
   - Never commit .env files
   - Use environment variables
   - Rotate keys regularly
   - Use specific scopes for each key

2. **Database**
   - SQL injection prevention via parameterization
   - Data validation on input
   - Prepared statements
   - Regular backups

3. **Frontend**
   - XSS prevention with React's default escaping
   - CSRF token ready
   - Content Security Policy ready
   - Secure cookie handling

4. **Network**
   - HTTPS only in production
   - CORS properly configured
   - Rate limiting ready
   - Request validation

## Scaling Considerations

### Current (Monolithic)
- ✅ Good for small teams
- ✅ Easy deployment
- ✅ Single database

### Future (Microservices)
- [ ] Separate chat service
- [ ] Separate image service
- [ ] Separate auth service
- [ ] Redis caching layer
- [ ] Message queue (Kafka/RabbitMQ)
- [ ] Load balancer
- [ ] Database sharding

## Deployment Options

### Local
- Direct `npm start` on development machine

### VPS (Recommended)
- Deploy backend to Node.js server
- Deploy frontend to Nginx/Apache
- Use PM2 for process management

### Docker
- Containerize backend and frontend
- Docker Compose for easy setup

### Cloud Platforms
- **Heroku** - Easy free tier
- **Railway** - Node.js friendly
- **Vercel** - Frontend hosting
- **AWS** - Scalable option
- **Azure** - Enterprise option

## Monitoring & Logging

### Current
- Console logs for development
- Error responses with details

### Future
- ELK stack (Elasticsearch, Logstash, Kibana)
- Sentry for error tracking
- DataDog/New Relic APM
- CloudWatch/Azure Monitor
- Custom analytics dashboard

## Development Workflow

1. **Local Setup**
   ```bash
   npm run install-all
   npm run dev  # Runs both backend and frontend
   ```

2. **Code Changes**
   - Backend auto-reloads with nodemon
   - Frontend hot-reloads with React
   - Changes visible immediately

3. **Testing**
   - Manual testing in browser
   - API testing with Postman/Insomnia
   - Future: Jest/React Testing Library

4. **Deployment**
   ```bash
   npm run build  # Creates frontend build
   git push       # Deploy to hosting
   ```

## Troubleshooting Guide

### Common Issues & Solutions

**Backend won't start**
- Check Node.js version
- Delete node_modules, reinstall
- Check port 5000 availability
- Verify .env file exists

**Frontend blank page**
- Open browser console for errors
- Verify backend running on port 5000
- Clear browser cache
- Check network tab for failed requests

**API errors**
- Verify HuggingFace API key
- Check internet connection
- Review error messages in console
- Check browser DevTools Network tab

**Database errors**
- Delete megpt.db and restart
- Check file permissions
- Verify disk space available

## Contributing Guidelines

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Await review & merge

---

For more information, see README.md and FEATURES.md
