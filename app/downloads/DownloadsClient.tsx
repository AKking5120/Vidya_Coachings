'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, FileText, Megaphone, FolderOpen,
  GraduationCap, Calendar, File, Eye, Loader2,
} from 'lucide-react';
import type { Download as DownloadItem } from '@/lib/types';

// Static fallback data (matches downloads-data.js)
const STATIC_DOWNLOADS: DownloadItem[] = [
  {
    id: 1, title: 'History Chapter 2', category: 'notes', class_label: 'Class 10',
    file_url: '/downloads/notes/class10-history-chapter2.pdf', file_type: 'pdf', published: true, created_at: '2026',
  },
  {
    id: 2, title: 'History Chapter: The Age of Industrialisation', category: 'notes', class_label: 'Class 10',
    file_url: '/downloads/notes/class10-sst-chapter-The_Age_of_Industrialisation.pdf', file_type: 'pdf', published: true, created_at: '2026',
  },
  {
    id: 3, title: 'History Chapter: Print Culture and the Modern World', category: 'notes', class_label: 'Class 10',
    file_url: '/downloads/notes/class10-sst-chapter-Print_Culture_and_the_Modern_World.pdf', file_type: 'pdf', published: true, created_at: '2026',
  },
];

type Tab = 'all' | 'notes' | 'circulars';

const TABS = [
  { id: 'all' as Tab,       label: 'All Files',  icon: FolderOpen },
  { id: 'notes' as Tab,     label: 'Notes',      icon: FileText },
  { id: 'circulars' as Tab, label: 'Circulars',  icon: Megaphone },
];

function DownloadCard({ item }: { item: DownloadItem }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-50">
          <FileText size={22} className="text-red-500" />
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          item.category === 'notes' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {item.category === 'notes' ? 'Notes' : 'Circular'}
        </span>
      </div>

      <h3 className="font-semibold text-slate-900 text-sm leading-snug">{item.title}</h3>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
        <span className="flex items-center gap-1"><GraduationCap size={12} />{item.class_label}</span>
        <span className="flex items-center gap-1"><Calendar size={12} />{item.created_at ? item.created_at.slice(0, 4) : '2026'}</span>
        <span className="flex items-center gap-1"><File size={12} />PDF</span>
      </div>

      <div className="flex gap-2 mt-auto pt-2">
        <a
          href={item.file_url}
          download
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
        >
          <Download size={13} />
          Download
        </a>
        <a
          href={item.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
        >
          <Eye size={13} />
          View
        </a>
      </div>
    </motion.article>
  );
}

export default function DownloadsClient() {
  const [tab, setTab] = useState<Tab>('all');
  const [items, setItems] = useState<DownloadItem[]>(STATIC_DOWNLOADS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/downloads')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setItems(data);
      })
      .catch(() => {/* keep static fallback */})
      .finally(() => setLoading(false));
  }, []);

  const filtered = tab === 'all' ? items : items.filter((i) => i.category === tab);
  const countNotes = items.filter((i) => i.category === 'notes').length;
  const countCirculars = items.filter((i) => i.category === 'circulars').length;

  return (
    <>
      {/* Hero */}
      <section className="py-16 text-white text-center" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #152a45 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-5">
            <Download size={14} />
            Study Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Downloads</h1>
          <p className="text-white/70 text-lg mb-8">Notes, circulars and important documents for students &amp; parents</p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="text-center"><p className="text-3xl font-extrabold">{items.length}</p><p className="text-white/60 text-sm">All Files</p></div>
            <div className="text-center"><p className="text-3xl font-extrabold">{countNotes}</p><p className="text-white/60 text-sm">Notes</p></div>
            <div className="text-center"><p className="text-3xl font-extrabold">{countCirculars}</p><p className="text-white/60 text-sm">Circulars</p></div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 no-scrollbar">
            {TABS.map(({ id, label, icon: Icon }) => {
              const count = id === 'all' ? items.length : id === 'notes' ? countNotes : countCirculars;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    tab === id ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === id ? 'bg-slate-900/10' : 'bg-slate-100'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-10 bg-slate-50 min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
              <Loader2 size={20} className="animate-spin" />
              <span>Loading files…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <FolderOpen size={48} className="mx-auto mb-3 opacity-30" />
              <p>No files in this category yet.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {filtered.map((item) => <DownloadCard key={item.id} item={item} />)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      <style>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
