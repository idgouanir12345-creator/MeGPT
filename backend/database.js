import fs from 'fs';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Database {
  constructor() {
    // Use environment variable for DB path, or default to data directory
    this.dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'megpt.db');
    this.db = null;
  }

  initialize() {
    return new Promise((resolve, reject) => {
      // Ensure data directory exists
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Database connection error:', err);
          reject(err);
        } else {
          console.log('✅ Database connected');
          this.createTables();
          setTimeout(() => resolve(), 500); // Wait for tables to be created
        }
      });
    });
  }

  createTables() {
    this.db.serialize(() => {
      // Users table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE,
          username TEXT UNIQUE,
          password_hash TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          preferences TEXT
        )
      `);

      // Chat Sessions table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS chat_sessions (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          title TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          mode TEXT DEFAULT 'normal',
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Chat Messages table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          session_id TEXT NOT NULL,
          user_id TEXT,
          role TEXT,
          content TEXT,
          files TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          edited_at DATETIME,
          FOREIGN KEY (session_id) REFERENCES chat_sessions(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Projects table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          name TEXT,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Tasks table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          title TEXT,
          description TEXT,
          scheduled_at DATETIME,
          completed BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // User Settings table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS user_settings (
          user_id TEXT PRIMARY KEY,
          theme TEXT DEFAULT 'dark',
          memory_enabled BOOLEAN DEFAULT 1,
          web_search_enabled BOOLEAN DEFAULT 0,
          auto_save BOOLEAN DEFAULT 1,
          notifications_enabled BOOLEAN DEFAULT 1,
          custom_instructions TEXT,
          hugging_face_api_key TEXT,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Migration: Add hugging_face_api_key column if it doesn't exist
      this.db.all("PRAGMA table_info(user_settings)", (err, rows) => {
        if (rows && !rows.some(row => row.name === 'hugging_face_api_key')) {
          this.db.run(`ALTER TABLE user_settings ADD COLUMN hugging_face_api_key TEXT`);
        }
      });

      console.log('✅ Database tables created/verified');
    });
  }

  run(sql, params = [], callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }

    if (callback) {
      return this.db.run(sql, params, function(err) {
        callback.call(this, err);
      });
    }

    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  // Generic query method
  query(sql, params = []) {
    return this.run(sql, params);
  }

  // Get single row
  get(sql, params = [], callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }

    if (callback) {
      return this.db.get(sql, params, callback);
    }

    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Get all rows
  all(sql, params = [], callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }

    if (callback) {
      return this.db.all(sql, params, callback);
    }

    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }
}

export default Database;
