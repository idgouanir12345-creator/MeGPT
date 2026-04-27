# MeGPT - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, requests use `userId` as identifier. Future: JWT tokens.

---

## 🗂️ Chat Endpoints

### Get All Chats
```http
GET /chats?userId={userId}
```
**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Chat Title",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z",
    "mode": "normal"
  }
]
```

### Create New Chat
```http
POST /chats
Content-Type: application/json

{
  "userId": "user-uuid",
  "title": "New Chat",
  "mode": "normal"
}
```
**Response:**
```json
{
  "id": "chat-uuid",
  "title": "New Chat",
  "mode": "normal"
}
```

### Get Chat Messages
```http
GET /chats/{sessionId}/messages
```
**Response:**
```json
[
  {
    "id": "msg-uuid",
    "role": "user",
    "content": "Hello",
    "created_at": "2024-01-01T12:00:00Z"
  },
  {
    "id": "msg-uuid2",
    "role": "assistant",
    "content": "Hi there!",
    "created_at": "2024-01-01T12:00:01Z"
  }
]
```

### Send Message (Get AI Response)
```http
POST /chats/{sessionId}/messages
Content-Type: application/json

{
  "userId": "user-uuid",
  "content": "What is 2+2?",
  "mode": "normal"
}
```
**Response:**
```json
{
  "userMessageId": "msg-uuid",
  "aiMessageId": "msg-uuid2",
  "response": "2 + 2 = 4",
  "model": "meta-llama/Llama-2-7b-chat-hf"
}
```

### Update Chat Title
```http
PUT /chats/{sessionId}
Content-Type: application/json

{
  "title": "New Title"
}
```

### Delete Chat
```http
DELETE /chats/{sessionId}
```

### Edit Message
```http
PUT /messages/{messageId}
Content-Type: application/json

{
  "content": "Updated message content"
}
```

---

## 🖼️ Image Endpoints

### Generate Image
```http
POST /generate-image
Content-Type: application/json

{
  "prompt": "A beautiful sunset over mountains",
  "negativePrompt": "blurry, low quality",
  "width": 512,
  "height": 512,
  "steps": 50,
  "guidanceScale": 7.5
}
```
**Response:**
```json
{
  "success": true,
  "image": "data:image/png;base64,...",
  "model": "stabilityai/stable-diffusion-2"
}
```

### Analyze Image
```http
POST /analyze-image
Content-Type: application/json

{
  "image": "data:image/png;base64,...",
  "question": "What is in this image?"
}
```
**Response:**
```json
{
  "success": true,
  "analysis": [
    {"answer": "A sunset", "score": 0.95},
    {"answer": "Mountains", "score": 0.87}
  ],
  "model": "dandelin/vilt-b32-finetuned-vqa"
}
```

### Edit Image
```http
POST /edit-image
Content-Type: application/json

{
  "image": "data:image/png;base64,...",
  "prompt": "Add a boat on the water"
}
```

---

## 📁 Projects Endpoints

### Get All Projects
```http
GET /projects?userId={userId}
```

### Create Project
```http
POST /projects
Content-Type: application/json

{
  "userId": "user-uuid",
  "name": "My Project",
  "description": "Project description"
}
```

---

## ✅ Tasks Endpoints

### Get All Tasks
```http
GET /tasks?userId={userId}
```

### Create Task
```http
POST /tasks
Content-Type: application/json

{
  "userId": "user-uuid",
  "title": "Task Title",
  "description": "Task description",
  "scheduledAt": "2024-01-01T12:00:00Z"
}
```

---

## ⚙️ Settings Endpoints

### Get User Settings
```http
GET /settings/{userId}
```
**Response:**
```json
{
  "user_id": "user-uuid",
  "theme": "dark",
  "memory_enabled": true,
  "web_search_enabled": false,
  "custom_instructions": "Always provide examples"
}
```

### Update Settings
```http
PUT /settings/{userId}
Content-Type: application/json

{
  "theme": "dark",
  "memoryEnabled": true,
  "webSearchEnabled": false,
  "customInstructions": "Always provide examples"
}
```

---

## 🔍 Search Endpoints

### Search Chats & Messages
```http
GET /search?userId={userId}&query={searchTerm}
```
**Response:**
```json
[
  {
    "type": "chat",
    "id": "chat-uuid",
    "title": "Chat Title",
    "created_at": "2024-01-01T12:00:00Z"
  },
  {
    "type": "message",
    "id": "msg-uuid",
    "title": "Message content",
    "created_at": "2024-01-01T12:00:00Z"
  }
]
```

---

## ℹ️ Info Endpoints

### Get Available Models
```http
GET /models
```
**Response:**
```json
{
  "chat": "meta-llama/Llama-2-7b-chat-hf",
  "codeGeneration": "codellama/CodeLlama-7b-Instruct-hf",
  "imageGeneration": "stabilityai/stable-diffusion-2",
  "imageInpainting": "runwayml/stable-diffusion-inpainting",
  "imageToText": "Salesforce/blip-image-captioning-large",
  "visualQA": "dandelin/vilt-b32-finetuned-vqa"
}
```

### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "message": "MeGPT Backend is running"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "userId required"
}
```

### 404 Not Found
```json
{
  "error": "Route not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "details": "Error message (dev only)"
}
```

---

## Rate Limiting
Currently unlimited. Future: Implement rate limiting per user.

---

## CORS
Enabled for localhost:3000. Configure in server.js for production.

---

## Webhook Support
Not yet implemented. Planned for future versions.

---

For more information, see README.md and FEATURES.md
