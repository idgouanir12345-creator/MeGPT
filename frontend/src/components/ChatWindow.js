import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiRefreshCw, FiEdit2, FiCopy, FiImage, FiUpload, FiMic, FiSettings, FiSearch, FiCode, FiDatabase } from 'react-icons/fi';
import Message from './Message';
import ImageGenerator from './ImageGenerator';
import FileUpload from './FileUpload';
import VoiceInput from './VoiceInput';
import './ChatWindow.css';
import { v4 as uuidv4 } from 'uuid';

function ChatWindow({ userId, chatId, chats, onChatsUpdate, theme }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState('normal');
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [chatId]);

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !chatId || loading) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          content: userMessage,
          mode: chatMode
        })
      });

      const data = await response.json();
      if (data.error) {
        alert('Error: ' + data.error);
      } else {
        loadMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Make sure your HuggingFace API key is set.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleRegenerateResponse = async () => {
    if (messages.length < 2) return;

    // Find the last user message
    let lastUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMessageIndex = i;
        break;
      }
    }

    if (lastUserMessageIndex === -1) return;

    // Remove messages after the last user message
    const messagesToKeep = messages.slice(0, lastUserMessageIndex + 1);
    setMessages(messagesToKeep);

    // Resend the last user message
    setInput(messagesToKeep[lastUserMessageIndex].content);
    setTimeout(() => {
      document.querySelector('.message-input')?.focus();
    }, 100);
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    alert('Message copied to clipboard!');
  };

  const currentChat = chats.find(c => c.id === chatId);

  if (!chatId) {
    return (
      <div className="chat-window empty-state">
        <div className="empty-state-content">
          <h1>👋 Welcome to MeGPT</h1>
          <p>Start a new conversation to begin chatting with AI</p>
          <div className="mode-buttons">
            <button className="mode-btn" onClick={() => {}}>
              💬 Normal Chat
            </button>
            <button className="mode-btn" onClick={() => {}}>
              🖼️ Image Generation
            </button>
            <button className="mode-btn" onClick={() => {}}>
              📊 Data Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {showImageGenerator ? (
        <ImageGenerator userId={userId} onClose={() => setShowImageGenerator(false)} />
      ) : showFileUpload ? (
        <FileUpload onClose={() => setShowFileUpload(false)} />
      ) : (
        <>
          <div className="chat-header">
            <div className="header-left">
              <h2>{currentChat?.title || 'Chat'}</h2>
            </div>
            <div className="header-right">
              <div className="mode-selector">
                <select value={chatMode} onChange={(e) => setChatMode(e.target.value)}>
                  <option value="normal">💬 Normal</option>
                  <option value="code">💻 Code</option>
                  <option value="research">🔬 Research</option>
                  <option value="analysis">📊 Analysis</option>
                </select>
              </div>
              <button
                className="header-btn"
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                title="Web Search"
              >
                <FiSearch style={{ color: webSearchEnabled ? 'var(--primary-color)' : 'inherit' }} />
              </button>
              <button className="header-btn" onClick={() => setShowSettings(!showSettings)} title="Chat Settings">
                <FiSettings />
              </button>
            </div>
          </div>

          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Start typing to begin!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <Message
                  key={msg.id || index}
                  message={msg}
                  onCopy={handleCopyMessage}
                  onRegenerate={index === messages.length - 1 ? handleRegenerateResponse : null}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-section">
            <div className="toolbar">
              <button
                className="tool-btn"
                onClick={() => setShowFileUpload(true)}
                title="Upload file (PDF, Image, Doc)"
              >
                <FiUpload />
              </button>
              <button
                className="tool-btn"
                onClick={() => setShowImageGenerator(true)}
                title="Generate image"
              >
                <FiImage />
              </button>
              <VoiceInput onTranscript={(text) => setInput(input + ' ' + text)} />
            </div>

            <div className="input-box">
              <textarea
                className="message-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message MeGPT..."
                disabled={loading}
              />
              <button
                className="send-btn"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                title="Send message (Ctrl+Enter)"
              >
                {loading ? <div className="spinner"></div> : <FiSend />}
              </button>
            </div>

            <div className="input-footer">
              <button onClick={handleRegenerateResponse} className="regenerate-btn" disabled={messages.length < 2}>
                <FiRefreshCw /> Regenerate
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatWindow;
