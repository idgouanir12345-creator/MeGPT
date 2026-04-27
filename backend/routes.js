import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { huggingFaceService } from './services/huggingFace.js';
import axios from 'axios';

export function setupRoutes(app) {
  const db = app.locals.db;

  // ============ Chat Routes ============
  
  // Get all chat sessions for user
  app.get('/api/chats', (req, res) => {
    try {
      const userId = req.query.userId;
      if (!userId) return res.status(400).json({ error: 'userId required' });

      db.all(
        `SELECT id, title, created_at, updated_at, mode FROM chat_sessions 
         WHERE user_id = ? ORDER BY updated_at DESC`,
        [userId],
        (err, rows) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(rows || []);
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create new chat session
  app.post('/api/chats', (req, res) => {
    try {
      const { userId, title = 'New Chat', mode = 'normal' } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId required' });

      const sessionId = uuidv4();
      db.run(
        `INSERT INTO chat_sessions (id, user_id, title, mode) VALUES (?, ?, ?, ?)`,
        [sessionId, userId, title, mode],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });

          db.get(
            `SELECT id, title, created_at, updated_at, mode
             FROM chat_sessions
             WHERE id = ?`,
            [sessionId],
            (fetchErr, row) => {
              if (fetchErr) return res.status(500).json({ error: fetchErr.message });
              res.status(201).json(row);
            }
          );
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get chat messages
  app.get('/api/chats/:sessionId/messages', (req, res) => {
    try {
      const { sessionId } = req.params;
      
      db.all(
        `SELECT id, role, content, files, created_at, edited_at FROM messages 
         WHERE session_id = ? ORDER BY created_at ASC`,
        [sessionId],
        (err, rows) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(rows || []);
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Send message and get AI response
  app.post('/api/chats/:sessionId/messages', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { userId, content, mode = 'normal' } = req.body;

      if (!content) return res.status(400).json({ error: 'content required' });

      // Get user's HuggingFace API key from settings
      db.get(
        `SELECT hugging_face_api_key FROM user_settings WHERE user_id = ?`,
        [userId],
        async (settingsErr, settings) => {
          if (settingsErr) return res.status(500).json({ error: settingsErr.message });

          // Set the user's API key for this request
          const userApiKey = settings?.hugging_face_api_key;
          if (userApiKey) {
            huggingFaceService.setUserApiKey(userApiKey);
          }

          // Save user message
          const userMessageId = uuidv4();
          db.run(
            `INSERT INTO messages (id, session_id, user_id, role, content) 
             VALUES (?, ?, ?, ?, ?)`,
            [userMessageId, sessionId, userId, 'user', content],
            async (err) => {
              if (err) return res.status(500).json({ error: err.message });

              // Get conversation history
              db.all(
                `SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at ASC`,
                [sessionId],
                async (err, messages) => {
                  if (err) return res.status(500).json({ error: err.message });

                  // Get AI response
                  let aiResponse;
                  if (mode === 'code') {
                    aiResponse = await huggingFaceService.codeGeneration(content);
                  } else {
                    aiResponse = await huggingFaceService.chatCompletion(messages);
                  }

                  if (!aiResponse.success) {
                    return res.status(500).json({ error: aiResponse.error });
                  }

                  // Save AI response
                  const aiMessageId = uuidv4();
                  db.run(
                    `INSERT INTO messages (id, session_id, role, content) 
                     VALUES (?, ?, ?, ?)`,
                    [aiMessageId, sessionId, 'assistant', aiResponse.text],
                    (err) => {
                      if (err) return res.status(500).json({ error: err.message });

                      // Update session
                      db.run(
                        `UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                        [sessionId],
                        () => {
                          res.json({
                            userMessageId,
                            aiMessageId,
                            response: aiResponse.text,
                            model: aiResponse.model
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update chat title
  app.put('/api/chats/:sessionId', (req, res) => {
    try {
      const { sessionId } = req.params;
      const { title } = req.body;

      db.run(
        `UPDATE chat_sessions SET title = ? WHERE id = ?`,
        [title, sessionId],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete chat
  app.delete('/api/chats/:sessionId', (req, res) => {
    try {
      const { sessionId } = req.params;

      db.run(`DELETE FROM messages WHERE session_id = ?`, [sessionId], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.run(`DELETE FROM chat_sessions WHERE id = ?`, [sessionId], function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true });
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Edit message
  app.put('/api/messages/:messageId', (req, res) => {
    try {
      const { messageId } = req.params;
      const { content } = req.body;

      db.run(
        `UPDATE messages SET content = ?, edited_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [content, messageId],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ Image Generation Routes ============

  app.post('/api/generate-image', async (req, res) => {
    try {
      const { userId, prompt, negativePrompt, width, height, steps, guidanceScale } = req.body;

      // Get user's HuggingFace API key from settings if userId provided
      if (userId) {
        db.get(
          `SELECT hugging_face_api_key FROM user_settings WHERE user_id = ?`,
          [userId],
          async (settingsErr, settings) => {
            if (!settingsErr && settings?.hugging_face_api_key) {
              huggingFaceService.setUserApiKey(settings.hugging_face_api_key);
            }

            const result = await huggingFaceService.generateImage(prompt, {
              negativePrompt,
              width,
              height,
              steps,
              guidanceScale
            });

            if (!result.success) {
              return res.status(500).json({ error: result.error });
            }

            res.json(result);
          }
        );
      } else {
        const result = await huggingFaceService.generateImage(prompt, {
          negativePrompt,
          width,
          height,
          steps,
          guidanceScale
        });

        if (!result.success) {
          return res.status(500).json({ error: result.error });
        }

        res.json(result);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ Image Analysis Routes ============

  app.post('/api/analyze-image', async (req, res) => {
    try {
      const { userId, image, question } = req.body;

      // Get user's HuggingFace API key from settings if userId provided
      if (userId) {
        db.get(
          `SELECT hugging_face_api_key FROM user_settings WHERE user_id = ?`,
          [userId],
          async (settingsErr, settings) => {
            if (!settingsErr && settings?.hugging_face_api_key) {
              huggingFaceService.setUserApiKey(settings.hugging_face_api_key);
            }

            const result = await huggingFaceService.analyzeImage(image, question);

            if (!result.success) {
              return res.status(500).json({ error: result.error });
            }

            res.json(result);
          }
        );
      } else {
        const result = await huggingFaceService.analyzeImage(image, question);

        if (!result.success) {
          return res.status(500).json({ error: result.error });
        }

        res.json(result);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ Image Editing Routes ============

  app.post('/api/edit-image', async (req, res) => {
    try {
      const { userId, image, prompt } = req.body;

      // Get user's HuggingFace API key from settings if userId provided
      if (userId) {
        db.get(
          `SELECT hugging_face_api_key FROM user_settings WHERE user_id = ?`,
          [userId],
          async (settingsErr, settings) => {
            if (!settingsErr && settings?.hugging_face_api_key) {
              huggingFaceService.setUserApiKey(settings.hugging_face_api_key);
            }

            const result = await huggingFaceService.editImage(image, prompt);

            if (!result.success) {
              return res.status(500).json({ error: result.error });
            }

            res.json(result);
          }
        );
      } else {
        const result = await huggingFaceService.editImage(image, prompt);

        if (!result.success) {
          return res.status(500).json({ error: result.error });
        }

        res.json(result);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ Projects Routes ============

  app.get('/api/projects', (req, res) => {
    try {
      const userId = req.query.userId;
      if (!userId) return res.status(400).json({ error: 'userId required' });

      db.all(
        `SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC`,
        [userId],
        (err, rows) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(rows || []);
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/projects', (req, res) => {
    try {
      const { userId, name, description } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId required' });

      const projectId = uuidv4();
      db.run(
        `INSERT INTO projects (id, user_id, name, description) VALUES (?, ?, ?, ?)`,
        [projectId, userId, name, description],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ id: projectId, name, description });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ Tasks Routes ============

  app.get('/api/tasks', (req, res) => {
    try {
      const userId = req.query.userId;
      if (!userId) return res.status(400).json({ error: 'userId required' });

      db.all(
        `SELECT * FROM tasks WHERE user_id = ? ORDER BY scheduled_at ASC`,
        [userId],
        (err, rows) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(rows || []);
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/tasks', (req, res) => {
    try {
      const { userId, title, description, scheduledAt } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId required' });

      const taskId = uuidv4();
      db.run(
        `INSERT INTO tasks (id, user_id, title, description, scheduled_at) 
         VALUES (?, ?, ?, ?, ?)`,
        [taskId, userId, title, description, scheduledAt],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ id: taskId, title, description, scheduledAt });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ Settings Routes ============

  app.get('/api/settings/:userId', (req, res) => {
    try {
      const { userId } = req.params;

      db.get(
        `SELECT * FROM user_settings WHERE user_id = ?`,
        [userId],
        (err, row) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(row || {});
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/settings/:userId', (req, res) => {
    try {
      const { userId } = req.params;
      const { theme, memoryEnabled, webSearchEnabled, customInstructions, huggingFaceApiKey } = req.body;

      db.run(
        `INSERT OR REPLACE INTO user_settings 
         (user_id, theme, memory_enabled, web_search_enabled, custom_instructions, hugging_face_api_key) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, theme, memoryEnabled ? 1 : 0, webSearchEnabled ? 1 : 0, customInstructions, huggingFaceApiKey],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ Search Routes ============

  app.get('/api/search', (req, res) => {
    try {
      const { userId, query } = req.query;
      if (!userId || !query) return res.status(400).json({ error: 'userId and query required' });

      const searchTerm = `%${query}%`;
      db.all(
        `SELECT 'chat' as type, id, title, created_at FROM chat_sessions 
         WHERE user_id = ? AND title LIKE ?
         UNION ALL
         SELECT 'message' as type, id, content as title, created_at FROM messages 
         WHERE user_id = ? AND content LIKE ?
         ORDER BY created_at DESC LIMIT 20`,
        [userId, searchTerm, userId, searchTerm],
        (err, rows) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(rows || []);
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ Models Info Route ============

  app.get('/api/models', (req, res) => {
    res.json(huggingFaceService.getAvailableModels());
  });
}
