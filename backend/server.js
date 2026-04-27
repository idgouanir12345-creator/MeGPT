import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Database from './database.js';
import { setupRoutes } from './routes.js';
import { huggingFaceService } from './services/huggingFace.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Database
const db = new Database();
db.initialize();

// Store db instance globally for route handlers
app.locals.db = db;

// Setup Routes
setupRoutes(app);

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'MeGPT Backend is running',
    frontend: 'http://localhost:3000',
    health: '/api/health'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MeGPT Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 MeGPT Backend running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
