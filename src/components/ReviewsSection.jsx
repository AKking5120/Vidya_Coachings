import { useState, useEffect, useMemo } from 'react';
import { fetchApprovedReviews, submitReview, isSupabaseConfigured } from '../lib/supabase';
import { REVIEW_ROLES } from '../data/constants';
import { LEGACY_REVIEWS } from '../data/legacyReviews';
import SectionTitle from './SectionTitle';

function Stars({ rating, interactive, value, onChange }) {
  if (interactive) {
    return (
      <div className="star-picker" role="group" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={n <= value ? 'active' : ''}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onClick={() => onChange(n)}
          >
            <i className={n <= value ? 'fas fa-star' : 'far fa-star'} />
          </button>
        ))}
      </div>
    );
  }

  const r = Math.min(5, Math.max(0, rating || 0));
  return (
    <div className="review-stars" aria-label={`${r} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= r ? 'fas fa-star' : 'far fa-star'} />
      ))}
    </div>
  );
}

function mergeReviews(supabaseReviews) {
  const seen = new Set();
  const merged = [];

  const add = (review) => {
    const key = `${(review.name || '').toLowerCase()}|${(review.text || '').slice(0, 80).toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(review);
  };

  LEGACY_REVIEWS.forEach(add);
  (supabaseReviews || []).forEach(add);
  return merged;
}

function getInitials(name) {
  return (name || 'U').trim().split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', text: '', rating: 5 });
  const [formMsg, setFormMsg] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      let supabaseReviews = [];
      if (isSupabaseConfigured) {
        supabaseReviews = await fetchApprovedReviews();
      }
      setReviews(mergeReviews(supabaseReviews));
      setError(null);
    } catch (err) {
      setReviews(mergeReviews([]));
      setError(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role || !form.text.trim()) {
      setFormMsg({ text: 'Please fill all required fields.', type: 'error' });
      return;
    }
    if (!isSupabaseConfigured) {
      setFormMsg({ text: 'Review system not configured yet.', type: 'error' });
      return;
    }
    setSubmitting(true);
    setFormMsg({ text: 'Submitting your review...', type: 'info' });
    try {
      await submitReview(form);
      setForm({ name: '', role: '', text: '', rating: 5 });
      setFormMsg({
        text: 'Thank you! Your review has been submitted and will appear after admin approval.',
        type: 'success',
      });
    } catch (err) {
      setFormMsg({ text: 'Could not submit review. Please try again.', type: 'error' });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const visible = expanded ? reviews : reviews.slice(0, 6);

  return (
    <section id="reviews" className="section reviews-section">
      <div className="container">
        <SectionTitle
          title="What Parents & Students Say"
          subtitle="Real reviews from our Vidya Coachings family"
        />

        <div className="reviews-summary">
          {loading ? (
            <div className="rating-badge">
              <div className="rating-stars"><i className="fas fa-spinner fa-spin" /></div>
              <strong>—</strong><span>Loading...</span>
            </div>
          ) : avg ? (
            <div className="rating-badge">
              <Stars rating={Math.floor(parseFloat(avg))} />
              <strong>{avg}</strong>
              <span>out of 5</span>
              <p className="review-count">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>
          ) : (
            <div className="rating-badge">
              <Stars rating={0} />
              <strong>—</strong>
              <span>No ratings yet</span>
              <p className="review-count">Be the first to share your experience!</p>
            </div>
          )}
        </div>

        <div className="reviews-grid">
          {loading && <div className="reviews-message"><i className="fas fa-spinner fa-spin" /> Loading reviews...</div>}
          {error && <div className="reviews-message reviews-error"><i className="fas fa-exclamation-triangle" /> {error}</div>}
          {!loading && !error && reviews.length === 0 && (
            <div className="reviews-message reviews-empty">
              <i className="fas fa-comment-dots" /> No approved reviews yet. Submit one below!
            </div>
          )}
          {visible.map((r) => (
            <article key={r.id} className="review-card">
              <Stars rating={r.rating} />
              <p className="review-text">&ldquo;{r.text}&rdquo;</p>
              <div className="review-author">
                <div className="review-avatar">{getInitials(r.name)}</div>
                <div>
                  <h4>{r.name}</h4>
                  <span>{r.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {reviews.length > 6 && (
          <div className="reviews-show-more">
            <button type="button" className="btn btn-outline" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Show Less Reviews' : 'Show More Reviews'}
              <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`} />
            </button>
          </div>
        )}

        <div className="review-form-box">
          <h3><i className="fas fa-pen" /> Write Your Review</h3>
          <p>Share your experience. Reviews appear on the website after approval.</p>
          <form className="review-form" onSubmit={handleSubmit} noValidate>
            <div className="review-form-row">
              <div className="form-group">
                <label htmlFor="reviewName">Your Name *</label>
                <input
                  id="reviewName"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Rakesh Kumar"
                  maxLength={80}
                />
              </div>
              <div className="form-group">
                <label htmlFor="reviewRole">You are *</label>
                <select
                  id="reviewRole"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                >
                  <option value="">Select...</option>
                  {REVIEW_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Your Rating *</label>
              <Stars interactive value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} />
            </div>
            <div className="form-group">
              <label htmlFor="reviewText">Your Review *</label>
              <textarea
                id="reviewText"
                rows={4}
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                required
                placeholder="Tell us about teaching quality, results, environment..."
                maxLength={500}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <i className="fas fa-paper-plane" /> {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            {formMsg.text && (
              <p className={`review-form-message ${formMsg.type}`}>{formMsg.text}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
