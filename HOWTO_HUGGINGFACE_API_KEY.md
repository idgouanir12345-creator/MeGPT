# How to Use the HuggingFace API Key Feature

## Getting Your HuggingFace API Key

1. Go to https://huggingface.co/settings/tokens
2. Sign up or log in with your HuggingFace account
3. Click "New token" button
4. Choose a name for your token (e.g., "MeGPT")
5. Select "read" access level
6. Click "Generate token"
7. Copy the token (it starts with `hf_`)

## Adding Your API Key to MeGPT

1. Open the MeGPT application in your browser
2. Look for the ⚙️ **Settings** button (usually in the top-right corner)
3. Click on Settings to open the settings panel
4. Scroll down to the **"API Keys"** section
5. Paste your HuggingFace API key into the text field
6. Click the **"Save Settings"** button

## What Happens Next

- Your API key is securely saved to your profile
- All AI operations (chat, image generation, etc.) will now use your API key
- You can change your API key anytime by opening Settings again

## Troubleshooting

### "Invalid API Key" Error
- Make sure you copied the full token from HuggingFace
- Token should start with `hf_`
- Make sure your token has proper read access

### Still Getting API Errors
- Check that your HuggingFace account has access to the models
- Some models require acceptance of their licenses first
- Go to https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct and accept the model license

### Image Generation Not Working
- Make sure your API key has read access
- Some image generation models may require extra permissions
- Check your HuggingFace account for any usage limits

## Benefits of Using Your Own API Key

- ✅ Use your own HuggingFace rate limits
- ✅ Faster response times
- ✅ More reliable service
- ✅ Supports longer conversations
- ✅ Can use more advanced models

## Security Notes

- Your API key is stored securely in the application
- Never share your API key with others
- If you suspect your key has been compromised, regenerate it on HuggingFace
- The application will not transmit your key to any external services

## Changing or Removing Your API Key

1. Open Settings
2. Go to "API Keys" section
3. Clear the field or enter a new key
4. Click "Save Settings"

If you remove the API key, the application will fall back to any environment-configured API keys (if available).
