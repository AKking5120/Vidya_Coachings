'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, AlertTriangle, Info, CheckCircle, Megaphone, ChevronRight } from 'lucide-react';

interface Notice {
  id: number;
  title: string;
  body: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  created_at: string;
}

const TYPE_CONFIG = {
  info:    { icon: Info,          bg: 'bg-blue-50',   border: 'border-blue-200',  badge: 'bg-blue-100  text-blue-700',  dot: 'bg-blue-500'  },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50',  border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  success: { icon: CheckCircle,   bg: 'bg-green-50',  border: 'border-green-200', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  urgent:  { icon: Megaphone,     bg: 'bg-red-50',    border: 'border-red-200',   badge: 'bg-red-100   text-red-700',   dot: 'bg-red-500'   },
};

const STORAGE_KEY = 'vc_dismissed_notices';

function getDismissed(): number[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as number[]; }
  catch { return []; }
}
function addDismissed(id: number) {
  const list = getDismissed();
  if (!list.includes(id)) localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, id]));
}

// ── Bell button (exported so Navbar can use it) ──────────────────────────
export function NoticeBell({ onClick, count }: { onClick: () => void; count: number }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Notices ${count > 0 ? `(${count} new)` : ''}`}
      className="relative text-white/80 hover:text-amber-400 transition-colors p-1"
    >
      <Bell size={20} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────
export default function NoticeModal() {
  const [notices, setNotices]   = useState<Notice[]>([]);
  const [open, setOpen]         = useState(false);
  const [current, setCurrent]   = useState(0);
  const [newCount, setNewCount] = useState(0);

  const fetchNotices = useCallback(async () => {
    try {
      const res = await fetch('/api/notices');
      const data = await res.json() as Notice[];
      if (!Array.isArray(data) || data.length === 0) return;
      const dismissed = getDismissed();
      const fresh = data.filter(n => !dismissed.includes(n.id));
      setNotices(data);
      setNewCount(fresh.length);
      if (fresh.length > 0) { setCurrent(0); setOpen(true); }
    } catch { /* silently ignore */ }
  }, []);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  // Listen for bell click event from Navbar
  useEffect(() => {
    const handler = () => { setCurrent(0); setOpen(true); };
    window.addEventListener('vc:open-notices', handler);
    return () => window.removeEventListener('vc:open-notices', handler);
  }, []);

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  function dismissCurrent() {
    if (notices[current]) addDismissed(notices[current].id);
    if (current < notices.length - 1) { setCurrent(c => c + 1); }
    else { setOpen(false); setNewCount(0); }
  }

  function openModal() {
    setCurrent(0);
    setOpen(true);
  }

  if (notices.length === 0) return null;

  const notice = notices[current];
  const cfg = TYPE_CONFIG[notice?.type ?? 'info'];
  const Icon = cfg.icon;

  return (
    <>
      {/* Bell button — rendered into a portal-like slot via context; 
          exported separately so Navbar imports it */}
      <div id="notice-bell-slot" data-count={newCount} data-open-fn="true" className="hidden" />

      {/* Backdrop + modal */}
      <AnimatePresence>
        {open && notice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 30 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{   scale: 0.92,  opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className={`relative w-full max-w-md rounded-3xl shadow-2xl border-2 ${cfg.bg} ${cfg.border} overflow-hidden`}
              onClick={e => e.stopPropagation()}
            >
              {/* Top accent bar */}
              <div className={`h-1.5 w-full ${cfg.dot}`} />

              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${cfg.badge}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${cfg.badge} px-2 py-0.5 rounded-full`}>
                      {notice.type}
                    </span>
                    {notices.length > 1 && (
                      <p className="text-xs text-slate-400 mt-0.5">{current + 1} of {notices.length}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close notice"
                  className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 pb-6">
                <h2 className="text-lg font-extrabold text-slate-900 mb-2">{notice.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{notice.body}</p>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 flex items-center gap-3">
                <button
                  onClick={dismissCurrent}
                  className="flex-1 btn-primary justify-center py-3"
                >
                  {current < notices.length - 1 ? (
                    <><span>Next Notice</span><ChevronRight size={16} /></>
                  ) : 'Got it!'}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-2xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Dot indicators for multiple notices */}
              {notices.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 pb-5">
                  {notices.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-2 rounded-full transition-all ${i === current ? 'bg-slate-700 w-5' : 'bg-slate-300 w-2'}`}
                      aria-label={`Notice ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating bell to re-open */}
      <button
        onClick={openModal}
        aria-label="View notices"
        className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{ background: '#1e3a5f' }}
      >
        <Bell size={20} className="text-amber-400" />
        {newCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {newCount > 9 ? '9+' : newCount}
          </span>
        )}
      </button>
    </>
  );
}
