'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trash2, Loader2, ClipboardList, Phone, Mail, User, BookOpen, MessageSquare, Calendar } from 'lucide-react';

interface Admission {
  id: number; student_name: string; class: string;
  parent_name: string; phone: string; email?: string;
  message?: string; read: boolean; created_at: string;
}

export default function QueriesTab() {
  const [items, setItems]     = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch('/api/admin/admissions').catch(() => null);
    const data = res ? await res.json().catch(() => []) : [];
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function remove(id: number) {
    if (!confirm('Delete this admission query?')) return;
    await fetch('/api/admin/admissions', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  }

  const unread = items.filter(i => !i.read).length;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-extrabold text-slate-900">{items.length}</p>
          <p className="text-sm text-slate-500 mt-1">Total Queries</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-extrabold text-amber-500">{unread}</p>
          <p className="text-sm text-slate-500 mt-1">New (Unread)</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-extrabold text-green-600">{items.length - unread}</p>
          <p className="text-sm text-slate-500 mt-1">Reviewed</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
          <ClipboardList size={18} className="text-amber-500" />
          Admission Queries
        </h2>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 py-6"><Loader2 size={18} className="animate-spin" /> Loading…</div>
        ) : items.length === 0 ? (
          <p className="text-slate-400 py-6 text-center">No queries yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map(item => (
              <div key={item.id}
                className={`rounded-xl border transition-colors ${item.read ? 'border-slate-100 bg-slate-50' : 'border-amber-200 bg-amber-50'}`}>

                {/* Summary row */}
                <button
                  className="w-full flex items-center justify-between gap-4 p-4 text-left"
                  onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0
                      ${item.read ? 'bg-slate-400' : 'bg-amber-500'}`}>
                      {item.student_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 text-sm truncate">{item.student_name}</p>
                        {!item.read && <span className="text-xs bg-amber-400 text-slate-900 font-bold px-1.5 py-0.5 rounded-full">New</span>}
                      </div>
                      <p className="text-xs text-slate-500">{item.class} · {item.parent_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-400 hidden sm:block">
                      {new Date(item.created_at).toLocaleDateString('en-IN')}
                    </span>
                    <button onClick={e => { e.stopPropagation(); remove(item.id); }}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </button>

                {/* Expanded details */}
                {expanded === item.id && (
                  <div className="px-4 pb-4 border-t border-slate-200/60 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: User,         label: 'Student',  value: item.student_name },
                      { icon: BookOpen,     label: 'Class',    value: item.class        },
                      { icon: User,         label: 'Parent',   value: item.parent_name  },
                      { icon: Phone,        label: 'Phone',    value: item.phone,       href: `tel:${item.phone}`       },
                      { icon: Mail,         label: 'Email',    value: item.email || '—', href: item.email ? `mailto:${item.email}` : undefined },
                      { icon: Calendar,     label: 'Date',     value: new Date(item.created_at).toLocaleString('en-IN') },
                    ].map(({ icon: Icon, label, value, href }) => (
                      <div key={label} className="flex items-start gap-2 text-sm">
                        <Icon size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-slate-400 text-xs block">{label}</span>
                          {href
                            ? <a href={href} className="font-medium text-blue-600 hover:underline">{value}</a>
                            : <span className="font-medium text-slate-800">{value}</span>
                          }
                        </div>
                      </div>
                    ))}
                    {item.message && (
                      <div className="sm:col-span-2 flex items-start gap-2 text-sm">
                        <MessageSquare size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-slate-400 text-xs block">Message</span>
                          <p className="font-medium text-slate-800">{item.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
