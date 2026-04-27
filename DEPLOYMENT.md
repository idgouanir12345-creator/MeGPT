# MeGPT Deployment Guide

This guide explains how to deploy MeGPT to Render using the provided configuration.

## Prerequisites

1. **GitHub Account** - Your code is already pushed to GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **HuggingFace API Key** - Get one from [HuggingFace](https://huggingface.co/settings/tokens)

## Deployment Steps

### Step 1: Connect Render to GitHub

1. Log in to your [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** and select **"Blueprint"**
3. Connect your GitHub account if you haven't already
4. Select the repository: `idgouanir12345-creator/MeGPT`
5. Render will automatically detect the `render.yaml` file

### Step 2: Configure Environment Variables

During the Blueprint setup, Render will show the environment variables from `render.yaml`. You need to set the following:

#### Required Variables:
- **HUGGINGFACE_API_KEY**: Your HuggingFace API token (get from [HuggingFace settings](https://huggingface.co/settings/tokens))

#### Optional Variables:
- **WEB_SEARCH_API_KEY**: If you want web search functionality (e.g., Serper API key)

### Step 3: Deploy

1. Click **"Apply"** to start the deployment
2. Render will:
   - Deploy the backend as a Web Service
   - Deploy the frontend as a Static Site
   - Automatically connect them via environment variables
   - Create a persistent disk for the database

### Step 4: Verify Deployment

After deployment completes (usually 5-10 minutes):

1. **Backend URL**: You'll get a URL like `https://megpt-backend-xxxx.onrender.com`
2. **Frontend URL**: You'll get a URL like `https://megpt-frontend-xxxx.onrender.com`

Visit the frontend URL to access your application.

## Manual Deployment (Alternative)

If you prefer to deploy services separately:

### Backend Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your repository
3. Configure:
   - **Name**: `megpt-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free
4. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `HUGGINGFACE_API_KEY=your_key_here`
   - `TEXT_MODEL=meta-llama/Llama-3.1-8B-Instruct`
   - `CODE_MODEL=Qwen/Qwen2.5-Coder-7B-Instruct`
   - `IMAGE_MODEL=black-forest-labs/FLUX.1-schnell`
   - `IMAGE_EDIT_MODEL=black-forest-labs/FLUX.1-Kontext-dev`
   - `VISION_MODEL=HuggingFaceTB/SmolVLM-Instruct`
   - `DB_PATH=./data/megpt.db`
5. Add a disk:
   - **Name**: `megpt-data`
   - **Mount Path**: `backend/data`
   - **Size**: 1 GB
6. Click **"Create Web Service"**

### Frontend Service

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect your repository
3. Configure:
   - **Name**: `megpt-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Plan**: Free
4. Add environment variable:
   - `REACT_APP_API_URL=https://your-backend-url.onrender.com` (use your backend URL)
5. Click **"Create Static Site"**

## Post-Deployment Configuration

### Update CORS Settings (if needed)

The backend already has CORS enabled for all origins. If you want to restrict it:

1. Go to backend service in Render
2. Add environment variable: `ALLOWED_ORIGINS=https://your-frontend-url.onrender.com`
3. Update `backend/server.js` to use this variable

### Database Backup

The SQLite database is stored on a persistent disk. To backup:

1. SSH into your backend service (Render Pro feature)
2. Copy the database file from `backend/data/megpt.db`

Or use Render's automated backup features (Pro plan).

## Troubleshooting

### Backend Not Starting

Check logs in Render Dashboard → Backend Service → Logs

Common issues:
- Missing environment variables
- HuggingFace API key invalid
- Database path permissions

### Frontend Can't Connect to Backend

1. Verify `REACT_APP_API_URL` is set correctly
2. Check backend is running (visit backend URL)
3. Check CORS settings in backend

### Slow First Load

Render's free tier spins down services after inactivity. First request may take 30-60 seconds. This is normal.

## Cost Estimate

- **Backend**: Free (with limitations)
- **Frontend**: Free
- **Database Storage**: Free (1GB included)

**Total: $0/month** (Render free tier)

## Alternative Deployment Options

### Vercel (Frontend) + Render (Backend)

You can also deploy:
- Frontend to Vercel (optimized for React)
- Backend to Render

Just update the `REACT_APP_API_URL` in frontend to point to your Render backend.

### Railway.app

Railway is another option that supports monorepos well. You'd need to create a `railway.json` file.

### Heroku

Deploy backend and frontend as separate Heroku apps.

## Support

For issues:
1. Check Render logs
2. Review this project's documentation
3. Open an issue on GitHub

---

**Note**: This project uses the HuggingFace Inference API. Make sure your API key has access to the required models.