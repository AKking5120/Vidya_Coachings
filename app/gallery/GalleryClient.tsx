'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Images, GraduationCap, Medal, Trophy,
  X, ChevronLeft, ChevronRight, Loader2, Plus,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────
interface Photo {
  id: number;
  src: string;
  alt: string;
  category: 'general' | 'students' | 'alumni' | 'achievements';
}

type Category = 'all' | 'students' | 'alumni' | 'achievements';

const TABS: { id: Category; label: string; icon: React.ElementType }[] = [
  { id: 'all',          label: 'All Photos',   icon: Images        },
  { id: 'students',     label: 'Students',     icon: GraduationCap },
  { id: 'alumni',       label: 'Alumni',       icon: Medal         },
  { id: 'achievements', label: 'Achievements', icon: Trophy        },
];

// ── Hardcoded photo data ──────────────────────────────────────────────────

// 222 General photos
const GENERAL: Photo[] = Array.from({ length: 222 }, (_, i) => ({
  id: i + 1,
  src: `/photo/photo${i + 1}.jpeg`,
  alt: `Photo ${i + 1}`,
  category: 'general' as const,
}));

// 43 Student photos — exact filenames from public/students/
const STUDENT_FILES: [string, string][] = [
  ['student1.jpg','Student 1'],['student2.jpg','Student 2'],['student3.jpg','Student 3'],
  ['student4.jpg','Student 4'],['student5.jpg','Student 5'],['student6.png','Student 6'],
  ['student7.png','Student 7'],['student8.jpg','Student 8'],['student9.jpg','Student 9'],
  ['student10.jpg','Student 10'],['student11.jpg','Student 11'],['student12.jpg','Student 12'],
  ['student13.jpg','Student 13'],['student14.jpg','Student 14'],['student15.jpg','Student 15'],
  ['student16.jpg','Student 16'],['student17.jpg','Student 17'],['student18.jpg','Student 18'],
  ['student19.jpg','Student 19'],['student20.jpg','Student 20'],['student21.jpg','Student 21'],
  ['student22.jpg','Student 22'],['student23.jpg','Student 23'],['student24.jpg','Student 24'],
  ['student25.jpg','Student 25'],['student26.jpg','Student 26'],['student27.jpg','Student 27'],
  ['student28.jpg','Student 28'],['student29.jpg','Student 29'],['student30.jpg','Student 30'],
  ['student31.jpg','Student 31'],['student32.jpg','Student 32'],['student33.jpg','Student 33'],
  ['student34.jpg','Student 34'],['student35.jpg','Student 35'],['student36.jpg','Student 36'],
  ['student37.jpg','Student 37'],['student38.jpg','Student 38'],['student39.jpg','Student 39'],
  ['student40.jpg','Student 40'],['student41.jpg','Student 41'],['student42.jpg','Student 42'],
  ['student43.jpeg','Student 43'],
];
const STUDENTS: Photo[] = STUDENT_FILES.map(([file, alt], i) => ({
  id: 1000 + i,
  src: `/students/${file}`,
  alt,
  category: 'students' as const,
}));

// 36 Achievement photos — exact filenames from public/achiment/
const ACHIEVEMENT_FILES: [string, string][] = [
  ['achievement1.jpeg','Achievement 1'],['achievement2.jpeg','Achievement 2'],['achievement3.jpeg','Achievement 3'],
  ['achievement4.jpeg','Achievement 4'],['achievement5.jpeg','Achievement 5'],['achievement6.jpeg','Achievement 6'],
  ['achievement7.jpeg','Achievement 7'],['achievement8.jpeg','Achievement 8'],['achievement9.jpeg','Achievement 9'],
  ['achievement10.jpeg','Achievement 10'],['achievement11.jpeg','Achievement 11'],['achievement12.jpeg','Achievement 12'],
  ['achievement13.jpeg','Achievement 13'],['achievement14.jpeg','Achievement 14'],['achievement15.jpeg','Achievement 15'],
  ['achievement16.jpg','Achievement 16'],['achievement17.jpeg','Achievement 17'],['achievement18.jpeg','Achievement 18'],
  ['achievement19.jpeg','Achievement 19'],['achievement20.jpeg','Achievement 20'],['achievement21.jpeg','Achievement 21'],
  ['achievement22.jpeg','Achievement 22'],['achievement23.jpeg','Achievement 23'],['achievement24.jpeg','Achievement 24'],
  ['achievement25.jpeg','Achievement 25'],['achievement26.jpeg','Achievement 26'],['achievement27.jpeg','Achievement 27'],
  ['achievement28.jpeg','Achievement 28'],['achievement29.jpeg','Achievement 29'],['achievement30.jpeg','Achievement 30'],
  ['achievement31.jpeg','Achievement 31'],['achievement32.jpeg','Achievement 32'],['achievement33.jpeg','Achievement 33'],
  ['achievement34.jpeg','Achievement 34'],['achievement35.jpeg','Achievement 35'],['achievement36.jpeg','Achievement 36'],
];
const ACHIEVEMENTS: Photo[] = ACHIEVEMENT_FILES.map(([file, alt], i) => ({
  id: 2000 + i,
  src: `/achiment/${file}`,
  alt,
  category: 'achievements' as const,
}));

// All combined (general not included in "all" tab — has its own display)
const ALL_PHOTOS = [...GENERAL, ...STUDENTS, ...ACHIEVEMENTS];

const COUNTS = {
  all:          GENERAL.length,   // "All Photos" tab shows general only
  general:      GENERAL.length,
  students:     STUDENTS.length,
  alumni:       0,
  achievements: ACHIEVEMENTS.length,
};

// How many to show before "Load More"
const PAGE_SIZE = 48;

// ── Component ─────────────────────────────────────────────────────────────
export default function GalleryClient() {
  const [tab, setTab]             = useState<Category>('all');
  const [visible, setVisible]     = useState<Photo[]>([]);
  const [page, setPage]           = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter based on tab
  // "all" = general photos only (students/achievements have their own tabs)
  const filtered: Photo[] =
    tab === 'all'          ? GENERAL      :
    tab === 'students'     ? STUDENTS     :
    tab === 'alumni'       ? []           :
    /* achievements */       ACHIEVEMENTS ;

  // Reset pagination whenever tab changes
  useEffect(() => {
    setPage(1);
    setVisible(filtered.slice(0, PAGE_SIZE));
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  function loadMore() {
    setLoadingMore(true);
    const next = page + 1;
    setTimeout(() => {
      setVisible(filtered.slice(0, next * PAGE_SIZE));
      setPage(next);
      setLoadingMore(false);
    }, 250);
  }

  const hasMore = visible.length < filtered.length;

  // ── Lightbox ────────────────────────────────────────────────────────
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevPhoto = useCallback(() =>
    setLightboxIdx(i => i !== null ? (i - 1 + visible.length) % visible.length : null),
    [visible.length]);
  const nextPhoto = useCallback(() =>
    setLightboxIdx(i => i !== null ? (i + 1) % visible.length : null),
    [visible.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, closeLightbox, prevPhoto, nextPhoto]);

  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIdx]);

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="py-16 text-white text-center"
        style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#152a45 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-5">
            <Images size={14} /> Our Gallery
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Photo Gallery</h1>
          <p className="text-white/70 text-lg mb-8">
            Memories, achievements and special moments at Vidya Coachings
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-extrabold">{ALL_PHOTOS.length}+</p>
              <p className="text-white/60 text-sm">Total Photos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold">{COUNTS.general}+</p>
              <p className="text-white/60 text-sm">General</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold">{COUNTS.students}+</p>
              <p className="text-white/60 text-sm">Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold">{COUNTS.achievements}+</p>
              <p className="text-white/60 text-sm">Achievements</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky Tabs ── */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 no-scrollbar">
            {TABS.map(({ id, label, icon: Icon }) => {
              const count =
                id === 'all'          ? COUNTS.general      :
                id === 'students'     ? COUNTS.students     :
                id === 'alumni'       ? COUNTS.alumni       :
                /* achievements */      COUNTS.achievements ;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all
                    ${tab === id
                      ? 'bg-amber-400 text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Icon size={15} />
                  {label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full
                    ${tab === id ? 'bg-slate-900/10' : 'bg-slate-100'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Photo Grid ── */}
      <section className="py-10 bg-slate-50 min-h-[60vh]" ref={gridRef}>
        <div className="max-w-7xl mx-auto px-4">

          {filtered.length === 0 ? (
            <div className="text-center py-24 text-slate-400">
              <Medal size={48} className="mx-auto mb-3 opacity-30" />
              <p>No photos in this category yet.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-400 text-right mb-4 pr-1">
                Showing {visible.length} of {filtered.length} photos
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 space-y-3"
                >
                  {visible.map((photo, i) => (
                    <div
                      key={photo.id}
                      className="break-inside-avoid cursor-pointer rounded-xl overflow-hidden
                        shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 bg-slate-200"
                      onClick={() => setLightboxIdx(i)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && setLightboxIdx(i)}
                      aria-label={`Open: ${photo.alt}`}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={400}
                        height={300}
                        className="w-full h-auto object-cover"
                        loading={i < 12 ? 'eager' : 'lazy'}
                        sizes="(max-width:640px) 50vw,(max-width:768px) 33vw,(max-width:1024px) 25vw,20vw"
                        unoptimized
                      />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="btn-secondary flex items-center gap-2 px-8 py-3 disabled:opacity-60"
                  >
                    {loadingMore
                      ? <><Loader2 size={16} className="animate-spin" />Loading…</>
                      : <><Plus size={16} />Load More ({filtered.length - visible.length} more)</>
                    }
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIdx !== null && visible[lightboxIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white z-10 bg-black/30 rounded-full p-2"
              onClick={closeLightbox} aria-label="Close"
            >
              <X size={28} />
            </button>

            <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm tabular-nums bg-black/30 px-3 py-1 rounded-full">
              {lightboxIdx + 1} / {visible.length}
            </p>

            <button
              className="absolute left-3 md:left-6 text-white/70 hover:text-white z-10 bg-black/40 rounded-full p-2.5"
              onClick={e => { e.stopPropagation(); prevPhoto(); }} aria-label="Previous"
            >
              <ChevronLeft size={28} />
            </button>

            <motion.div
              key={lightboxIdx}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{   scale: 0.92,  opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="max-w-5xl max-h-[85vh] flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={visible[lightboxIdx].src}
                alt={visible[lightboxIdx].alt}
                width={1200}
                height={900}
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                priority
                sizes="100vw"
                unoptimized
              />
            </motion.div>

            {visible[lightboxIdx].alt && (
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/80 text-sm
                bg-black/40 px-4 py-1.5 rounded-full max-w-xs text-center truncate">
                {visible[lightboxIdx].alt}
              </p>
            )}

            <button
              className="absolute right-3 md:right-6 text-white/70 hover:text-white z-10 bg-black/40 rounded-full p-2.5"
              onClick={e => { e.stopPropagation(); nextPhoto(); }} aria-label="Next"
            >
              <ChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}
        .no-scrollbar::-webkit-scrollbar{display:none;}
      `}</style>
    </>
  );
}
