'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Trash2, Loader2, Download, FileText, Megaphone,
  UploadCloud, CheckCircle, AlertCircle,
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

interface DownloadItem {
  id: number; title: string; category: 'notes' | 'circulars';
  class_label: string; file_url: string; file_type: string;
  published: boolean; created_at: string;
}

const CLASSES = [
  '', 'Class 1','Class 2','Class 3','Class 4','Class 5',
  'Class 6','Class 7','Class 8','Class 9','Class 10',
  'Class 11','Class 12','CUET','CTET','BA/MA','All Classes',
];

// ── Supabase Storage upload ───────────────────────────────────────────────
async function uploadPdf(file: File): Promise<string> {
  const supabase = getSupabaseClient();
  const safeName = file.name.replace(/\s+/g, '_');
  const path     = `downloads/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from('downloads').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'application/pdf',
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('downloads').getPublicUrl(path);
  return data.publicUrl;
}

type FormState = { title: string; category: 'notes' | 'circulars'; class_label: string; file_url: string };
const EMPTY: FormState = { title: '', category: 'notes', class_label: '', file_url: '' };

export default function DownloadsTab() {
  const [items,     setItems]    = useState<DownloadItem[]>([]);
  const [loading,   setLoading]  = useState(true);
  const [filter,    setFilter]   = useState<'all' | 'notes' | 'circulars'>('all');
  const [form,      setForm]     = useState<FormState>(EMPTY);
  const [saving,    setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadJob, setUploadJob] = useState<{ name: string; status: 'uploading' | 'done' | 'error'; message?: string } | null>(null);
  const [msg,       setMsg]      = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch('/api/admin/downloads').catch(() => null);
    const data = res ? await res.json().catch(() => []) : [];
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Upload file to Supabase Storage ──────────────────────────────────
  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setUploadJob({ name: file.name, status: 'uploading' });
    try {
      const url = await uploadPdf(file);
      setForm(f => ({ ...f, file_url: url }));
      setUploadJob({ name: file.name, status: 'done' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setUploadJob({ name: file.name, status: 'error', message });
    } finally {
      setUploading(false);
    }
  }

  // ── Save metadata to DB ───────────────────────────────────────────────
  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.file_url.trim()) return;
    setSaving(true); setMsg('');
    const res  = await fetch('/api/admin/downloads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, file_type: 'pdf' }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('File added successfully!');
      setForm(EMPTY);
      setUploadJob(null);
      load();
    } else setMsg(data.error ?? 'Error');
    setSaving(false);
  }

  async function remove(id: number, fileUrl: string) {
    if (!confirm('Delete this file entry?')) return;
    // Remove from Supabase Storage if it's stored there
    if (fileUrl.includes('supabase.co')) {
      const supabase = getSupabaseClient();
      const path = fileUrl.split('/downloads/')[1];
      if (path) await supabase.storage.from('downloads').remove([`downloads/${path}`]);
    }
    await fetch('/api/admin/downloads', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
    });
    load();
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

  return (
    <div className="flex flex-col gap-8 max-w-4xl">

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
          <Download size={18} className="text-amber-500" /> Add Document
        </h2>
        <form onSubmit={add} className="flex flex-col gap-4">

          {/* Step 1 — Upload file */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Step 1 — Upload PDF file
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
                ${uploading ? 'border-amber-300 bg-amber-50 pointer-events-none' : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50'}
                ${form.file_url && !uploading ? 'border-green-300 bg-green-50' : ''}`}
            >
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,application/pdf" className="hidden" onChange={handleFileSelect} />
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-amber-600">
                  <Loader2 size={32} className="animate-spin" />
                  <p className="text-sm font-medium">Uploading {uploadJob?.name}…</p>
                </div>
              ) : form.file_url ? (
                <div className="flex flex-col items-center gap-2 text-green-600">
                  <CheckCircle size={32} />
                  <p className="text-sm font-semibold">
                    {uploadJob?.name ?? 'File uploaded'} ✓
                  </p>
                  <p className="text-xs text-slate-400">Click to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <UploadCloud size={32} />
                  <p className="text-sm font-semibold text-slate-600">Click to select PDF</p>
                  <p className="text-xs">PDF, DOC, DOCX supported</p>
                </div>
              )}
            </div>

            {uploadJob?.status === 'error' && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">
                <AlertCircle size={15} /> {uploadJob.message}
              </div>
            )}
          </div>

          {/* Step 2 — Fill details */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Step 2 — Fill details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input type="text" required maxLength={200} placeholder="e.g. Maths Notes Chapter 3"
                  className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as 'notes' | 'circulars' })}>
                  <option value="notes">Notes</option>
                  <option value="circulars">Circular / Notice</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                <select className="input-field" value={form.class_label} onChange={e => setForm({ ...form, class_label: e.target.value })}>
                  {CLASSES.map(c => <option key={c} value={c}>{c || '— Select —'}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File URL</label>
                <input type="text" placeholder="Auto-filled after upload"
                  className="input-field bg-slate-50 text-slate-500" readOnly
                  value={form.file_url} />
              </div>
            </div>
          </div>

          {msg && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
              {msg}
            </p>
          )}

          <button type="submit" disabled={saving || !form.file_url}
            className="btn-primary self-start disabled:opacity-40 disabled:cursor-not-allowed">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            Save Document
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="font-bold text-slate-900">Files ({items.length})</h2>
          <div className="flex gap-2">
            {(['all', 'notes', 'circulars'] as const).map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all
                  ${filter === c ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 py-6">
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-slate-400 py-6 text-center">No files yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(item => (
              <div key={item.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                    ${item.category === 'notes' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                    {item.category === 'notes' ? <FileText size={16} /> : <Megaphone size={16} />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.class_label && <span className="text-xs text-slate-400">{item.class_label}</span>}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                        ${item.category === 'notes' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={item.file_url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline hidden sm:block">View</a>
                  <button onClick={() => remove(item.id, item.file_url)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
