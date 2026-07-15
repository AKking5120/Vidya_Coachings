'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Trash2, Loader2, Images, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

interface GalleryItem {
  id: number; src: string; alt: string;
  category: 'general' | 'students' | 'alumni' | 'achievements';
  created_at: string;
}

const CATS = ['general', 'students', 'alumni', 'achievements'] as const;
type Cat = typeof CATS[number];

// ── Supabase Storage upload ───────────────────────────────────────────────
async function uploadToStorage(file: File): Promise<string> {
  const supabase = getSupabaseClient();
  const ext      = file.name.split('.').pop() ?? 'jpg';
  const path     = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from('gallery').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('gallery').getPublicUrl(path);
  return data.publicUrl;
}

// ── Drag-and-drop file picker ─────────────────────────────────────────────
function FilePicker({
  onFiles,
  uploading,
}: {
  onFiles: (files: File[]) => void;
  uploading: boolean;
}) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDrag(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) onFiles(files);
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
        ${drag ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50'}
        ${uploading ? 'pointer-events-none opacity-60' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => { const f = Array.from(e.target.files ?? []); if (f.length) onFiles(f); e.target.value = ''; }}
      />
      {uploading ? (
        <div className="flex flex-col items-center gap-2 text-amber-600">
          <Loader2 size={36} className="animate-spin" />
          <p className="font-semibold text-sm">Uploading…</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <UploadCloud size={40} className={drag ? 'text-amber-500' : ''} />
          <p className="font-semibold text-sm text-slate-600">
            {drag ? 'Drop photos here!' : 'Click or drag & drop photos'}
          </p>
          <p className="text-xs">JPEG, PNG, WEBP — multiple allowed</p>
        </div>
      )}
    </div>
  );
}

// ── Upload progress item ──────────────────────────────────────────────────
interface UploadJob {
  name: string;
  status: 'uploading' | 'done' | 'error';
  message?: string;
}

export default function GalleryTab() {
  const [items,    setItems]   = useState<GalleryItem[]>([]);
  const [loading,  setLoading] = useState(true);
  const [filter,   setFilter]  = useState<'all' | Cat>('all');
  const [category, setCategory] = useState<Cat>('general');
  const [altText,  setAltText] = useState('');
  const [jobs,     setJobs]    = useState<UploadJob[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch('/api/admin/gallery').catch(() => null);
    const data = res ? await res.json().catch(() => []) : [];
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

// ── Handle file selection → upload → save to DB ───────────────────────
  async function handleFiles(files: File[]) {
    setUploading(true);
    const newJobs: UploadJob[] = files.map(f => ({ name: f.name, status: 'uploading' }));
    setJobs(newJobs);

    // Upload all files in parallel (batches of 5 to avoid overwhelming the API)
    const BATCH = 5;
    for (let b = 0; b < files.length; b += BATCH) {
      const batch = files.slice(b, b + BATCH);
      await Promise.all(batch.map(async (file, localIdx) => {
        const i = b + localIdx;
        try {
          const publicUrl = await uploadToStorage(file);
          const res = await fetch('/api/admin/gallery', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
              src:      publicUrl,
              alt:      altText.trim() || file.name.replace(/\.[^/.]+$/, ''),
              category,
            }),
          });
          if (!res.ok) throw new Error((await res.json()).error ?? 'DB error');
          setJobs(prev => prev.map((j, idx) => idx === i ? { ...j, status: 'done' } : j));
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Upload failed';
          setJobs(prev => prev.map((j, idx) => idx === i ? { ...j, status: 'error', message: msg } : j));
        }
      }));
    }

    setUploading(false);
    setAltText('');
    load();
  }

  async function remove(id: number, src: string) {
    if (!confirm('Delete this photo?')) return;
    // Delete from storage if it's a Supabase URL
    if (src.includes('supabase.co')) {
      const supabase = getSupabaseClient();
      const path = src.split('/gallery/')[1];
      if (path) await supabase.storage.from('gallery').remove([`gallery/${path}`]);
    }
    await fetch('/api/admin/gallery', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
    });
    load();
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

  return (
    <div className="flex flex-col gap-8 max-w-5xl">

      {/* Upload panel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
          <Images size={18} className="text-amber-500" /> Upload Photos
        </h2>

        {/* Options row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select className="input-field" value={category}
              onChange={e => setCategory(e.target.value as Cat)}>
              {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Caption / Alt text <span className="text-slate-400 font-normal">(optional — applies to all)</span>
            </label>
            <input type="text" maxLength={120} placeholder="e.g. Annual Day 2025"
              className="input-field" value={altText}
              onChange={e => setAltText(e.target.value)} />
          </div>
        </div>

        {/* Drag-drop area */}
        <FilePicker onFiles={handleFiles} uploading={uploading} />

        {/* Upload progress */}
        {jobs.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {/* Summary bar */}
            {jobs.length > 1 && (
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1 px-1">
                <span>{jobs.filter(j => j.status === 'done').length}/{jobs.length} uploaded</span>
                <span>{jobs.filter(j => j.status === 'error').length > 0
                  ? `${jobs.filter(j => j.status === 'error').length} failed`
                  : jobs.every(j => j.status === 'done') ? '✓ All done!' : 'Uploading…'
                }</span>
              </div>
            )}
            {/* Per-file rows — only show first 10, then a summary */}
            {jobs.slice(0, 10).map((job, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
                ${job.status === 'done'     ? 'bg-green-50 text-green-700'
                : job.status === 'error'   ? 'bg-red-50   text-red-700'
                :                            'bg-blue-50  text-blue-700'}`}>
                {job.status === 'uploading' && <Loader2 size={15} className="animate-spin flex-shrink-0" />}
                {job.status === 'done'      && <CheckCircle  size={15} className="flex-shrink-0" />}
                {job.status === 'error'     && <AlertCircle  size={15} className="flex-shrink-0" />}
                <span className="truncate flex-1">{job.name}</span>
                {job.status === 'uploading' && <span className="text-xs flex-shrink-0">Uploading…</span>}
                {job.status === 'done'      && <span className="text-xs flex-shrink-0">Done ✓</span>}
                {job.status === 'error'     && <span className="text-xs flex-shrink-0">{job.message}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter + grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="font-bold text-slate-900">Photos ({items.length})</h2>
          <div className="flex gap-2 flex-wrap">
            {(['all', ...CATS] as const).map(c => (
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
          <p className="text-slate-400 py-6 text-center">No photos in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map(item => (
              <div key={item.id}
                className="relative group rounded-xl overflow-hidden bg-slate-100 aspect-square">
                <Image
                  src={item.src} alt={item.alt || 'Gallery photo'}
                  fill className="object-cover"
                  sizes="(max-width:640px) 50vw, 20vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity
                  flex flex-col items-center justify-center gap-2 p-2">
                  <p className="text-white text-xs text-center line-clamp-2 leading-snug">
                    {item.alt || item.src.split('/').pop()}
                  </p>
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <button onClick={() => remove(item.id, item.src)}
                    className="mt-1 flex items-center gap-1 text-xs bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition-colors">
                    <Trash2 size={12} /> Delete
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
