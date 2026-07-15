'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Loader2, Bell, AlertTriangle, CheckCircle, Megaphone, Info } from 'lucide-react';

interface Notice {
  id: number; title: string; body: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  active: boolean; created_at: string;
}

const TYPE_OPTS = [
  { value: 'info',    label: 'Info',    icon: Info,          color: 'bg-blue-100  text-blue-700'   },
  { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'bg-amber-100 text-amber-700'  },
  { value: 'success', label: 'Success', icon: CheckCircle,   color: 'bg-green-100 text-green-700'  },
  { value: 'urgent',  label: 'Urgent',  icon: Megaphone,     color: 'bg-red-100   text-red-700'    },
];

const EMPTY = { title: '', body: '', type: 'info' as const };

export default function NoticesTab() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
const [form, setForm] = useState<{ title: string; body: string; type: Notice['type'] }>(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    // admin fetch — get ALL (including inactive) by using service role via admin route
    const res  = await fetch('/api/admin/notices-all').catch(() => null);
    const data = res ? await res.json().catch(() => []) : [];
    setNotices(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setSaving(true); setMsg('');
    const res  = await fetch('/api/notices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setMsg('Notice published!'); setForm(EMPTY); load(); }
    else setMsg(data.error ?? 'Error');
    setSaving(false);
  }

  async function remove(id: number) {
    if (!confirm('Deactivate this notice?')) return;
    await fetch('/api/notices', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl">

      {/* Add notice form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><Bell size={18} className="text-amber-500" /> Add New Notice</h2>
        <form onSubmit={create} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input type="text" required maxLength={120} placeholder="e.g. Admissions Open 2025-26"
              className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
            <textarea rows={3} required maxLength={500} placeholder="Notice details…"
              className="input-field resize-none" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTS.map(({ value, label, icon: Icon, color }) => (
                <button key={value} type="button"
                  onClick={() => setForm({ ...form, type: value as Notice['type'] })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all
                    ${form.type === value ? `${color} border-current` : 'bg-slate-50 text-slate-500 border-transparent hover:border-slate-200'}`}>
                  <Icon size={14} />{label}
                </button>
              ))}
            </div>
          </div>
          {msg && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2">{msg}</p>}
          <button type="submit" disabled={saving}
            className="btn-primary self-start disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Publish Notice
          </button>
        </form>
      </div>

      {/* Existing notices */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 mb-5">Active Notices</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 py-6"><Loader2 size={18} className="animate-spin" /> Loading…</div>
        ) : notices.length === 0 ? (
          <p className="text-slate-400 py-6 text-center">No notices yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {notices.map(n => {
              const cfg = TYPE_OPTS.find(t => t.value === n.type)!;
              const Icon = cfg?.icon ?? Info;
              return (
                <div key={n.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white transition-colors">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${cfg?.color ?? ''}`}>
                      <Icon size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{n.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{n.body}</p>
                      <p className="text-slate-400 text-xs mt-1">{new Date(n.created_at).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <button onClick={() => remove(n.id)}
                    className="flex-shrink-0 text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
