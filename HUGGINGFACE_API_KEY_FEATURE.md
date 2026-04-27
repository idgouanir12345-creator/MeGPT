# HuggingFace API Key Feature Implementation

## Overview
Added a settings feature that allows users to input their own HuggingFace API key directly in the application. The website will then use this API key for all AI operations instead of relying solely on environment variables.

## Features Implemented

### 1. **Settings UI (Frontend)**
- **Location**: `frontend/src/components/Settings.js`
- **New Section**: "API Keys" section added to settings
- **Input Field**: Password-protected input field for HuggingFace API key
- **Help Text**: Link to HuggingFace token settings page (https://huggingface.co/settings/tokens)
- **Security**: Uses password input type to mask the key from plain view

### 2. **Database Schema Updates (Backend)**
- **Location**: `backend/database.js`
- **New Column**: `hugging_face_api_key` added to `user_settings` table
- **Auto-Migration**: Database automatically adds the column if it doesn't exist on startup
- **Storage**: User's API key is securely stored in the database

### 3. **Settings API Updates (Backend)**
- **Location**: `backend/routes.js`
- **Endpoint**: `PUT /api/settings/:userId`
- **Changes**: Now accepts and stores `huggingFaceApiKey` from the request
- **Storage**: Saves the API key to the user's settings in the database

### 4. **HuggingFace Service Updates (Backend)**
- **Location**: `backend/services/huggingFace.js`
- **New Method**: `setUserApiKey(apiKey)` - allows setting a user-specific API key
- **Modified Getter**: `apiKey` getter now prioritizes user's API key, falls back to environment variables
- **Behavior**: If user has set an API key, it will be used for all requests; otherwise, falls back to `HUGGINGFACE_API_KEY` or `HF_TOKEN` environment variables

### 5. **Message Handling (Backend)**
- **Location**: `backend/routes.js`
- **Endpoint**: `POST /api/chats/:sessionId/messages`
- **Changes**: 
  - Fetches user's HuggingFace API key from settings
  - Sets the user's API key on the HuggingFace service before making requests
  - Ensures all chat operations use the user's API key

### 6. **Image Generation Integration (Backend & Frontend)**
- **Frontend**: `frontend/src/components/ImageGenerator.js`, `frontend/src/components/ChatWindow.js`
- **Backend**: `backend/routes.js` endpoints for `/api/generate-image`, `/api/analyze-image`, `/api/edit-image`
- **Changes**:
  - Added `userId` parameter to image operations
  - Fetches and uses user's API key for image generation, analysis, and editing
  - Falls back to environment variables if user hasn't set an API key

### 7. **UI Styling (Frontend)**
- **Location**: `frontend/src/components/Settings.css`
- **Updates**:
  - Added styling for password input fields
  - Added link styling for help text
  - Maintained consistent design with existing settings

## How It Works

### User Perspective:
1. User opens Settings (⚙️ icon)
2. Scrolls to "API Keys" section
3. Enters their HuggingFace API key in the password field
4. Clicks "Save Settings"
5. API key is saved to their profile
6. All future AI operations use this API key

### Technical Flow:
1. **Settings Save**: 
   - Frontend sends API key to `PUT /api/settings/{userId}`
   - Backend stores it in `user_settings` table

2. **Chat Message Send**:
   - Frontend sends message to `POST /api/chats/{sessionId}/messages`
   - Backend fetches user's API key from database
   - Backend calls `huggingFaceService.setUserApiKey(apiKey)`
   - HuggingFace service uses the user's API key for all requests

3. **Image Operations**:
   - Similar to chat messages
   - User ID is passed in request body
   - User's API key is fetched and used

## API Endpoints Modified

| Endpoint | Method | Changes |
|----------|--------|---------|
| `/api/settings/:userId` | PUT | Now accepts `huggingFaceApiKey` parameter |
| `/api/chats/:sessionId/messages` | POST | Fetches and uses user's API key |
| `/api/generate-image` | POST | Now accepts `userId`, fetches and uses user's API key |
| `/api/analyze-image` | POST | Now accepts `userId`, fetches and uses user's API key |
| `/api/edit-image` | POST | Now accepts `userId`, fetches and uses user's API key |

## Database Schema

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
  hugging_face_api_key TEXT,  -- NEW COLUMN
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Benefits

1. **User-Specific API Keys**: Each user can use their own HuggingFace API key
2. **Rate Limiting**: Distributes API usage across multiple users' API keys
3. **Easy Setup**: Simple UI to input and save API key
4. **Fallback**: Still works with environment variables if user doesn't set an API key
5. **Secure**: Password-type input masks the key from plain view

## Testing

To test the feature:
1. Delete or reset the database if updating an existing installation
2. Start the backend server
3. Start the frontend application
4. Open Settings
5. Enter a valid HuggingFace API key in the "API Keys" section
6. Click "Save Settings"
7. Try generating an image or sending a message
8. The application should now use your API key

## Notes

- The old database will need to be deleted on first run to ensure the new schema is created
- If users don't set an API key, the application falls back to environment variables
- API key is stored in plain text in the database (consider encryption for production)
- The API key is masked in the UI using password input type

## Future Enhancements

- Encrypt API key in database before storing
- Add API key validation/verification
- Add option to test API key before saving
- Support for multiple API key providers
- Add API key usage statistics
