import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE } from '../data/constants';
import { BOT_NAME, QUICK_PROMPTS, getBotResponse, getWelcomeMessage } from '../data/studentBotKnowledge';

function BotAction({ action, onPrompt }) {
  if (action.type === 'link') {
    if (action.external) {
      return (
        <a href={action.href} target="_blank" rel="noopener noreferrer" className="student-bot-action">
          {action.icon && <i className={action.icon} />}
          {action.label}
        </a>
      );
    }
    return (
      <Link to={action.href} className="student-bot-action">
        {action.icon && <i className={action.icon} />}
        {action.label}
      </Link>
    );
  }

  if (action.type === 'whatsapp') {
    const msg = encodeURIComponent(action.message || 'Hi Vidya Coachings!');
    return (
      <a
        href={`https://wa.me/${SITE.phoneRaw}?text=${msg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="student-bot-action student-bot-action--wa"
      >
        {action.icon && <i className={action.icon} />}
        {action.label}
      </a>
    );
  }

  if (action.type === 'call') {
    return (
      <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="student-bot-action">
        {action.icon && <i className={action.icon} />}
        {action.label}
      </a>
    );
  }

  if (action.type === 'prompt') {
    return (
      <button type="button" className="student-bot-action" onClick={() => onPrompt(action.text)}>
        {action.icon && <i className={action.icon} />}
        {action.label}
      </button>
    );
  }

  return null;
}

function MessageBubble({ message, onPrompt }) {
  const isBot = message.role === 'bot';

  return (
    <div className={`student-bot-msg ${isBot ? 'student-bot-msg--bot' : 'student-bot-msg--user'}`}>
      {isBot && (
        <div className="student-bot-msg-avatar" aria-hidden="true">
          <i className="fas fa-robot" />
        </div>
      )}
      <div className="student-bot-msg-body">
        <p>{message.text}</p>
        {isBot && message.actions?.length > 0 && (
          <div className="student-bot-actions">
            {message.actions.map((action) => (
              <BotAction key={`${action.label}-${action.type}`} action={action} onPrompt={onPrompt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentBot() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      const welcome = getWelcomeMessage();
      setMessages([{ id: 'welcome', role: 'bot', text: welcome.text, actions: welcome.actions }]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  useEffect(() => {
    if (open) {
      document.body.classList.add('student-bot-open');
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      document.body.classList.remove('student-bot-open');
    }
    return () => document.body.classList.remove('student-bot-open');
  }, [open]);

  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    window.setTimeout(() => {
      const reply = getBotResponse(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: `b-${Date.now()}`, role: 'bot', text: reply.text, actions: reply.actions },
      ]);
      setTyping(false);
    }, 450);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (location.pathname === '/admin') return null;

  return (
    <>
      <div className={`student-bot-panel ${open ? 'open' : ''}`} role="dialog" aria-label={`${BOT_NAME} chat`} aria-hidden={!open}>
        <div className="student-bot-header">
          <div className="student-bot-header-info">
            <div className="student-bot-header-avatar" aria-hidden="true">
              <i className="fas fa-robot" />
            </div>
            <div>
              <strong>{BOT_NAME}</strong>
              <span>Student helper • Online</span>
            </div>
          </div>
          <button type="button" className="student-bot-close" onClick={() => setOpen(false)} aria-label="Close chat">
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="student-bot-messages" ref={listRef}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onPrompt={sendMessage} />
          ))}
          {typing && (
            <div className="student-bot-msg student-bot-msg--bot">
              <div className="student-bot-msg-avatar" aria-hidden="true">
                <i className="fas fa-robot" />
              </div>
              <div className="student-bot-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>

        <div className="student-bot-quick">
          {QUICK_PROMPTS.map((p) => (
            <button key={p.id} type="button" className="student-bot-chip" onClick={() => sendMessage(p.text)}>
              {p.label}
            </button>
          ))}
        </div>

        <form className="student-bot-input-row" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Apna sawaal likho..."
            maxLength={500}
            autoComplete="off"
          />
          <button type="submit" className="student-bot-send" aria-label="Send message" disabled={!input.trim()}>
            <i className="fas fa-paper-plane" />
          </button>
        </form>
      </div>

      <button
        type="button"
        className={`student-bot-toggle ${open ? 'open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close student helper' : 'Open student helper'}
        aria-expanded={open}
      >
        <i className={`fas ${open ? 'fa-times' : 'fa-robot'}`} />
        {!open && <span className="student-bot-toggle-label">Ask</span>}
      </button>
    </>
  );
}
