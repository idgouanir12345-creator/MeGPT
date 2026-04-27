import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiPlus, FiSearch, FiSettings, FiMoon, FiSun, FiTrash2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import './Sidebar.css';

function getRelativeChatDate(chat) {
  const timestamp = chat.updated_at || chat.created_at;

  if (!timestamp) {
    return 'just now';
  }

  const parsedDate = new Date(timestamp);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'just now';
  }

  return formatDistanceToNow(parsedDate, { addSuffix: true });
}

function Sidebar({ userId, chats, currentChatId, onSelectChat, onNewChat, onRefresh, onToggle, onSettings, theme, onThemeToggle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState(chats);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = chats.filter(chat =>
        (chat.title || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    } else {
      setFilteredChats(chats);
    }
  }, [searchQuery, chats]);

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (window.confirm('Delete this chat?')) {
      try {
        await fetch(`/api/chats/${chatId}`, { method: 'DELETE' });
        onRefresh();
      } catch (error) {
        console.error('Failed to delete chat:', error);
      }
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h1>MeGPT</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen && (
        <>
          <button className="new-chat-btn" onClick={onNewChat}>
            <FiPlus /> New Chat
          </button>

          <div className="search-container">
            <FiSearch />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="chats-list">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
                onClick={() => onSelectChat(chat.id)}
              >
                <span className="chat-title">{chat.title}</span>
                <span className="chat-date">
                  {getRelativeChatDate(chat)}
                </span>
                <button
                  className="delete-btn"
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  title="Delete chat"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <button onClick={onThemeToggle} className="theme-toggle" title="Toggle theme">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <button onClick={onSettings} className="settings-btn" title="Settings">
              <FiSettings />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;
