import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchActiveNotices, isSupabaseConfigured } from '../lib/supabase';

const DISMISSED_KEY = 'vidya_dismissed_notices';

function getDismissedIds() {
  try {
    return JSON.parse(sessionStorage.getItem(DISMISSED_KEY) || '[]');
  } catch {
    return [];
  }
}

function dismissNotice(id) {
  const ids = getDismissedIds();
  if (!ids.includes(id)) {
    sessionStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids, id]));
  }
}

export default function NoticeBanner() {
  const location = useLocation();
  const [notices, setNotices] = useState([]);
  const [dismissed, setDismissed] = useState(getDismissedIds);

  useEffect(() => {
    if (!isSupabaseConfigured || location.pathname === '/admin') return;
    fetchActiveNotices()
      .then(setNotices)
      .catch((err) => console.error('Failed to load notices:', err));
  }, [location.pathname]);

  if (location.pathname === '/admin') return null;

  const visible = notices.filter((n) => !dismissed.includes(n.id));
  if (visible.length === 0) return null;

  const handleDismiss = (id) => {
    dismissNotice(id);
    setDismissed(getDismissedIds());
  };

  return (
    <div className="notice-banner-stack" role="region" aria-label="Site alerts and notices">
      {visible.map((notice) => (
        <div
          key={notice.id}
          className={`notice-banner notice-banner--${notice.notice_type}`}
        >
          <div className="container notice-banner-inner">
            <div className="notice-banner-icon" aria-hidden="true">
              <i className={`fas ${notice.notice_type === 'alert' ? 'fa-exclamation-triangle' : 'fa-bullhorn'}`} />
            </div>
            <div className="notice-banner-body">
              <strong className="notice-banner-title">{notice.title}</strong>
              <p className="notice-banner-message">{notice.message}</p>
              {notice.link_url && (
                <a
                  href={notice.link_url}
                  className="notice-banner-link"
                  target={notice.link_url.startsWith('http') ? '_blank' : undefined}
                  rel={notice.link_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {notice.link_label || 'Learn more'}
                  <i className="fas fa-arrow-right" />
                </a>
              )}
            </div>
            <button
              type="button"
              className="notice-banner-close"
              aria-label="Dismiss notice"
              onClick={() => handleDismiss(notice.id)}
            >
              <i className="fas fa-times" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
