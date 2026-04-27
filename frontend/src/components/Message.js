import React from 'react';
import { FiCopy, FiRefreshCw } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import './Message.css';

function Message({ message, onCopy, onRegenerate }) {
  const isUser = message.role === 'user';

  const highlightCode = (code, language) => {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    }
    return hljs.highlightAuto(code).value;
  };

  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              if (!inline) {
                const codeContent = String(children).replace(/\n$/, '');

                return (
                  <div className="code-block">
                    <div className="code-block-header">
                      <span>{language || 'script'}</span>
                    </div>
                    <pre className="code-block-pre">
                      <code
                        className={`hljs${language ? ` language-${language}` : ''}`}
                        dangerouslySetInnerHTML={{
                          __html: highlightCode(codeContent, language)
                        }}
                        {...props}
                      />
                    </pre>
                  </div>
                );
              }

              return <code className="inline-code" {...props}>{children}</code>;
            },
            a({ href, children }) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              );
            },
            img({ src, alt }) {
              return <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: '8px' }} />;
            }
          }}
        >
          {message.content}
        </ReactMarkdown>

        {!isUser && (
          <div className="message-actions">
            <button onClick={() => onCopy(message.content)} title="Copy message">
              <FiCopy /> Copy
            </button>
            {onRegenerate && (
              <button onClick={onRegenerate} title="Regenerate response">
                <FiRefreshCw /> Regenerate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
