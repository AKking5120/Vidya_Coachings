'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, Loader2, ChevronDown, ChevronUp, Quote } from 'lucide-react';
import type { Review, ReviewSubmission } from '@/lib/types';

const API_URL =
  process.env.NEXT_PUBLIC_GAS_REVIEWS_URL ??
  'https://script.google.com/macros/s/AKfycbwmWQ5d_Jyr-WT1eQAEFtXoHBX6AFDrnUGjuBpC21xJrMxlMhpyhC2U4gmhLUQ8nW1jDQ/exec';

const INITIAL_VISIBLE = 6;

function loadReviewsJsonp(): Promise<Review[]> {
  return new Promise((resolve, reject) => {
    const cb = 'vcReviews_' + Date.now();
    const script = document.createElement('script');
    const timer = setTimeout(() => { cleanup(); reject(new Error('Timeout')); }, 15000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    function cleanup() {
      clearTimeout(timer);
      if (script.parentNode) script.parentNode.removeChild(script);
      try { delete win[cb]; } catch { win[cb] = undefined; }
    }
    win[cb] = (data: unknown) => { cleanup(); resolve(Array.isArray(data) ? (data as Review[]) : []); };
    script.onerror = () => { cleanup(); reject(new Error('Script load failed')); };
    script.src = `${API_URL}?callback=${cb}&t=${Date.now()}`;
    document.body.appendChild(script);
  });
}

async function loadReviewsFetch(): Promise<Review[]> {
  const res = await fetch(`${API_URL}?t=${Date.now()}`);
  return JSON.parse(await res.text()) as Review[];
}

function getInitials(name: string) {
  return (name || 'U').trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function StarRow({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
      ))}
    </div>
  );
}

const ROLES = [
  'Parent','Student','Parent — Class 1-8','Parent — Class 9-10','Parent — Class 11-12',
  'Class 9-10 Student','Class 11-12 Student','Alumni',
  'CTET / Competitive Aspirant','Community Stakeholders/Educators/Others',
];

const EMPTY: ReviewSubmission = { name: '', role: '', rating: 5, text: '' };

export default function ReviewsSection() {
  const [reviews, setReviews]     = useState<Review[]>([]);
  const [loading, setLoading]     = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showAll, setShowAll]     = useState(false);
  const [form, setForm]           = useState<ReviewSubmission>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{type:'success'|'error';text:string}|null>(null);

  const loadReviews = useCallback(async () => {
    setLoading(true); setLoadError(false);
    try {
      let data: Review[];
      try { data = await loadReviewsJsonp(); }
      catch { data = await loadReviewsFetch(); }
      data = data.filter(r => {
        const n = String(r.name ?? '').trim().toLowerCase();
        return n && n !== 'name' && String(r.role ?? '').toLowerCase() !== 'role';
      });
      setReviews(data);
    } catch (e) { console.error(e); setLoadError(true); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.role || !form.text.trim()) return;
    setSubmitting(true); setSubmitMsg(null);
    let ip = '';
    try { const r = await fetch('https://api.ipify.org?format=json'); ip = ((await r.json()) as {ip?:string}).ip ?? ''; } catch { /**/ }
    try {
      const res = await fetch(API_URL, {
        method: 'POST', redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...form, name: form.name.trim(), text: form.text.trim(), ip }),
      });
      const result = await res.json() as { success?: boolean; error?: string };
      if (result.success) {
        setSubmitMsg({ type: 'success', text: 'Thank you! Your review is submitted and will appear after approval.' });
        setForm(EMPTY);
      } else {
        setSubmitMsg({ type: 'error', text: result.error ?? 'Could not submit. Please try again.' });
      }
    } catch { setSubmitMsg({ type: 'error', text: 'Network error. Please try again.' }); }
    finally { setSubmitting(false); }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const visible = showAll ? reviews : reviews.slice(0, INITIAL_VISIBLE);
  const hasMore = reviews.length > INITIAL_VISIBLE;

  return (
    <section id="reviews" className="py-24 section-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Centred heading */}
        <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="section-header">
          <div className="accent-bar" />
          <h2 className="section-heading">What Parents &amp; Students Say</h2>
          <p className="section-sub">Real experiences from our Vidya Coachings family</p>
        </motion.div>

        {/* Centred avg rating */}
        {avgRating && (
          <motion.div
            initial={{ opacity:0, scale:0.9 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
            className="flex flex-col items-center gap-2 mb-12"
          >
            <div className="text-6xl font-extrabold text-slate-900">{avgRating}</div>
            <StarRow rating={Math.round(Number(avgRating))} size={24} />
            <p className="text-sm text-slate-500 mt-1">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </motion.div>
        )}

        {/* Reviews grid */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-slate-400 py-12">
            <Loader2 size={22} className="animate-spin" /><span>Loading reviews…</span>
          </div>
        ) : loadError ? (
          <div className="text-center py-10 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-5 max-w-md mx-auto">
            Could not load reviews. Please refresh the page.
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-slate-400 py-10">No approved reviews yet. Be the first!</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              <AnimatePresence initial={false}>
                {visible.map((r, i) => (
                  <motion.article
                    key={`${r.name}-${i}`}
                    initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
                    transition={{ delay: i < INITIAL_VISIBLE ? i * 0.06 : 0 }}
                    className="card flex flex-col gap-3 relative overflow-hidden"
                  >
                    <Quote size={36} className="absolute top-3 right-3 text-amber-100" aria-hidden="true" />
                    <StarRow rating={r.rating} />
                    <p className="text-slate-600 text-sm leading-relaxed flex-1 italic">&ldquo;{r.text}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm"
                        style={{ background: 'linear-gradient(135deg,#1e3a5f,#2d5282)' }}
                      >
                        {getInitials(r.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm leading-tight">{r.name}</p>
                        <p className="text-xs text-slate-400">{r.role}</p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            {hasMore && (
              <div className="flex justify-center mb-10">
                <button
                  onClick={() => { if (showAll) { setShowAll(false); document.getElementById('reviews')?.scrollIntoView({behavior:'smooth'}); } else setShowAll(true); }}
                  className="btn-secondary"
                >
                  {showAll ? <><ChevronUp size={16}/>Show Less</> : <><ChevronDown size={16}/>Show {reviews.length - INITIAL_VISIBLE} More Reviews</>}
                </button>
              </div>
            )}
          </>
        )}

        {/* Centred review form */}
        <motion.div
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-100 p-8"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 mb-3">
              <Star size={22} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Write Your Review</h3>
            <p className="text-slate-500 text-sm mt-1">Share your experience — appears after approval</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reviewName" className="block text-sm font-medium text-slate-700 mb-1">Your Name *</label>
                <input id="reviewName" type="text" required maxLength={80} placeholder="e.g. Rakesh Kumar"
                  className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label htmlFor="reviewRole" className="block text-sm font-medium text-slate-700 mb-1">You are *</label>
                <select id="reviewRole" required className="input-field" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="">Select…</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Your Rating *</label>
              <div className="flex items-center gap-1 justify-center" role="group" aria-label="Star rating">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" aria-label={`${s} star${s>1?'s':''}`}
                    onClick={() => setForm({...form, rating: s})}
                    className="p-1 hover:scale-125 transition-transform">
                    <Star size={32} className={s <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-100'} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="reviewText" className="block text-sm font-medium text-slate-700 mb-1">Your Review *</label>
              <textarea id="reviewText" rows={4} required maxLength={500}
                placeholder="Teaching quality, results, environment…"
                className="input-field resize-none" value={form.text} onChange={e => setForm({...form, text: e.target.value})} />
            </div>

            <button type="submit" disabled={submitting}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>

            {submitMsg && (
              <p role="alert" className={`text-sm rounded-xl px-4 py-3 text-center ${submitMsg.type==='success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {submitMsg.text}
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
