import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Settings from './components/Settings';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [userId] = useState(() => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('userId', id);
    }
    return id;
  });

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState([]);
  const [settings, setSettings] = useState({
    theme: 'dark',
    memoryEnabled: true,
    webSearchEnabled: false
  });

  useEffect(() => {
    document.body.className = `${theme}-mode`;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    loadChats();
    loadSettings();
  }, [userId]);

  const loadChats = async () => {
    try {
      const response = await fetch(`/api/chats?userId=${userId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load chats');
      }

      const nextChats = Array.isArray(data) ? data : [];
      setChats(nextChats);
      setCurrentChatId(prevChatId =>
        nextChats.some(chat => chat.id === prevChatId) ? prevChatId : (nextChats[0]?.id || null)
      );
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch(`/api/settings/${userId}`);
      const data = await response.json();
      setSettings(data || settings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title: 'New Chat' })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create chat');
      }

      const now = new Date().toISOString();
      const newChat = {
        ...data,
        created_at: data.created_at || now,
        updated_at: data.updated_at || data.created_at || now
      };

      setChats(prevChats => [newChat, ...prevChats]);
      setCurrentChatId(newChat.id);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`app ${theme}-mode`}>
      <Sidebar
        userId={userId}
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={createNewChat}
        onRefresh={loadChats}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onSettings={() => setShowSettings(true)}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      {showSettings ? (
        <Settings
          userId={userId}
          onClose={() => setShowSettings(false)}
          onSettingsChange={loadSettings}
          theme={theme}
          onThemeChange={setTheme}
        />
      ) : (
        <ChatWindow
          userId={userId}
          chatId={currentChatId}
          chats={chats}
          onChatsUpdate={loadChats}
          theme={theme}
        />
      )}
    </div>
  );
}

export default App;
