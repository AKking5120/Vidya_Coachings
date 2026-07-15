'use client';

import { useState, useEffect } from 'react';
import {
  Lock, LayoutDashboard, Bell, Images, Download,
  ClipboardList, LogOut, Eye, EyeOff, Shield,
} from 'lucide-react';
import NoticesTab   from './tabs/NoticesTab';
import GalleryTab   from './tabs/GalleryTab';
import DownloadsTab from './tabs/DownloadsTab';
import QueriesTab   from './tabs/QueriesTab';

// ── Simple client-side password guard ───────────────────────────────────────
// For a real deployment, replace with Supabase Auth or NextAuth.
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'vidya@admin2025';
const SESSION_KEY    = 'vc_admin_auth';

type Tab = 'notices' | 'gallery' | 'downloads' | 'queries';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'notices',   label: 'Notices',    icon: Bell          },
  { id: 'gallery',   label: 'Gallery',    icon: Images        },
  { id: 'downloads', label: 'Downloads',  icon: Download      },
  { id: 'queries',   label: 'Queries',    icon: ClipboardList },
];

// ── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw]       = useState('');
  const [show, setShow]   = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem(SESSION_KEY, '1'); onLogin(); }
    else { setError('Incorrect password. Please try again.'); setPw(''); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo / branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: '#1e3a5f' }}>
            <Shield size={30} className="text-amber-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Vidya Coachings</p>
        </div>

        <form onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 flex flex-col gap-4">
          <div>
            <label htmlFor="adminPw" className="block text-sm font-semibold text-slate-700 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <input
                id="adminPw"
                type={show ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={pw}
                onChange={e => { setPw(e.target.value); setError(''); }}
                className="input-field pr-11"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <button type="submit"
            className="btn-primary w-full justify-center py-3 text-base font-bold">
            <Lock size={16} /> Login
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Set password via <code>NEXT_PUBLIC_ADMIN_PASSWORD</code> env var
        </p>
      </div>
    </div>
  );
}

// ── Main admin shell ──────────────────────────────────────────────────────────
export default function AdminShell() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab]       = useState<Tab>('notices');
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setAuthed(true);
  }, []);

  function logout() { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const ActiveTab = TABS.find(t => t.id === tab)!;

  return (
    <div className="min-h-screen flex" style={{ background: '#f8fafc' }}>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300
          ${sideOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: '#1e3a5f' }}
      >
        {/* Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center">
              <Shield size={18} className="text-slate-900" />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm leading-tight">Vidya Coachings</p>
              <p className="text-white/50 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setSideOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left
                ${tab === id
                  ? 'bg-amber-400 text-slate-900'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            >
              <Icon size={18} />{label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all w-full mb-1">
            <LayoutDashboard size={18} /> View Site
          </a>
          <button onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-red-300 hover:bg-white/10 transition-all w-full">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sideOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSideOpen(false)} />
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-500 hover:text-slate-900 transition-colors"
              onClick={() => setSideOpen(s => !s)} aria-label="Toggle sidebar">
              <LayoutDashboard size={22} />
            </button>
            <div>
              <h1 className="font-extrabold text-slate-900 text-lg leading-tight">
                {ActiveTab.label}
              </h1>
              <p className="text-slate-400 text-xs">Manage {ActiveTab.label.toLowerCase()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-3 py-1 rounded-full">
              Admin
            </span>
          </div>
        </header>

        {/* Tab content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {tab === 'notices'   && <NoticesTab   />}
          {tab === 'gallery'   && <GalleryTab   />}
          {tab === 'downloads' && <DownloadsTab />}
          {tab === 'queries'   && <QueriesTab   />}
        </div>
      </div>
    </div>
  );
}
