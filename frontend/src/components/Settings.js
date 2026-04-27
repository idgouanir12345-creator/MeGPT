import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import './Settings.css';

function Settings({ userId, onClose, onSettingsChange, theme, onThemeChange }) {
  const [settings, setSettings] = useState({
    theme: theme,
    memoryEnabled: true,
    webSearchEnabled: false,
    customInstructions: '',
    notifications: true,
    autoSave: true,
    huggingFaceApiKey: ''
  });

  useEffect(() => {
    loadSettings();
  }, [userId]);

  const loadSettings = async () => {
    try {
      const response = await fetch(`/api/settings/${userId}`);
      const data = await response.json();
      if (data && Object.keys(data).length > 0) {
        setSettings({
          ...settings,
          ...data,
          customInstructions: data.custom_instructions || ''
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await fetch(`/api/settings/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: settings.theme,
          memoryEnabled: settings.memoryEnabled,
          webSearchEnabled: settings.webSearchEnabled,
          customInstructions: settings.customInstructions,
          huggingFaceApiKey: settings.huggingFaceApiKey
        })
      });
      onThemeChange(settings.theme);
      onSettingsChange();
      alert('Settings saved!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
        <button onClick={onClose} className="close-btn">
          <FiX />
        </button>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h3>Display</h3>
          <div className="setting-item">
            <label>Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
            >
              <option value="dark">🌙 Dark Mode</option>
              <option value="light">☀️ Light Mode</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>Data & Privacy</h3>
          <div className="setting-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.memoryEnabled}
                onChange={(e) => setSettings({ ...settings, memoryEnabled: e.target.checked })}
              />
              <span>Enable Memory System</span>
            </label>
            <p className="help-text">Remember preferences and conversation context</p>
          </div>

          <div className="setting-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.webSearchEnabled}
                onChange={(e) => setSettings({ ...settings, webSearchEnabled: e.target.checked })}
              />
              <span>Enable Web Search</span>
            </label>
            <p className="help-text">Access real-time information from the internet</p>
          </div>

          <div className="setting-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
              />
              <span>Auto-save Conversations</span>
            </label>
          </div>

          <div className="setting-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
              />
              <span>Enable Notifications</span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>API Keys</h3>
          <div className="setting-item">
            <label>HuggingFace API Key</label>
            <input
              type="password"
              value={settings.huggingFaceApiKey}
              onChange={(e) => setSettings({ ...settings, huggingFaceApiKey: e.target.value })}
              placeholder="Enter your HuggingFace API key"
            />
            <p className="help-text">Get your API key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">huggingface.co</a></p>
          </div>
        </div>

        <div className="settings-section">
          <h3>Custom Instructions</h3>
          <p className="help-text">Tell the AI how to respond to you</p>
          <textarea
            value={settings.customInstructions}
            onChange={(e) => setSettings({ ...settings, customInstructions: e.target.value })}
            placeholder="E.g., 'Always provide code examples' or 'Use simple language'"
            rows={6}
          />
        </div>

        <div className="settings-section">
          <h3>Account & Data</h3>
          <button className="danger-btn">🗑️ Clear Chat History</button>
          <button className="danger-btn">📥 Export All Data</button>
          <button className="danger-btn">🔴 Delete Account</button>
        </div>
      </div>

      <div className="settings-footer">
        <button className="save-btn" onClick={saveSettings}>
          <FiSave /> Save Settings
        </button>
      </div>
    </div>
  );
}

export default Settings;
