import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  verifyAdminKey,
  adminFetchPendingReviews,
  adminApproveReview,
  adminDeleteReview,
  adminListGalleryPhotos,
  adminAddGalleryPhoto,
  adminDeleteGalleryPhoto,
  adminListNotices,
  adminAddNotice,
  adminUpdateNotice,
  adminDeleteNotice,
  adminToggleNotice,
  isSupabaseConfigured,
} from '../lib/supabase';
import { getGithubImageUrl } from '../lib/githubImages';

const ADMIN_KEY_STORAGE = 'vidya_admin_key';

const CATEGORIES = [
  { value: 'general', label: 'All Photos' },
  { value: 'students', label: 'Students' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'achievements', label: 'Achievements' },
];

const EMPTY_NOTICE = {
  title: '',
  message: '',
  notice_type: 'notice',
  priority: 0,
  link_url: '',
  link_label: '',
  expires_at: '',
};

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(ADMIN_KEY_STORAGE) || '');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState('reviews');
  const [pendingReviews, setPendingReviews] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [notices, setNotices] = useState([]);
  const [noticeForm, setNoticeForm] = useState(EMPTY_NOTICE);
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [photoForm, setPhotoForm] = useState({ github_path: '', alt: '', category: 'general' });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setLoginError('Supabase not configured. Add environment variables first.');
      return;
    }
    setLoading(true);
    setLoginError('');
    const ok = await verifyAdminKey(adminKey);
    if (ok) {
      sessionStorage.setItem(ADMIN_KEY_STORAGE, adminKey);
      setLoggedIn(true);
    } else {
      setLoginError('Invalid admin password.');
    }
    setLoading(false);
  };

  const loadData = async () => {
    if (!loggedIn || !adminKey) return;
    setLoading(true);
    try {
      const [reviews, photos, noticeList] = await Promise.all([
        adminFetchPendingReviews(adminKey),
        adminListGalleryPhotos(adminKey),
        adminListNotices(adminKey),
      ]);
      setPendingReviews(reviews);
      setGalleryPhotos(photos);
      setNotices(noticeList);
    } catch (err) {
      setMessage('Failed to load data. Check admin key and Supabase setup.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored && isSupabaseConfigured) {
      verifyAdminKey(stored).then((ok) => {
        if (ok) {
          setAdminKey(stored);
          setLoggedIn(true);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (loggedIn) loadData();
  }, [loggedIn]);

  const logout = () => {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    setLoggedIn(false);
    setAdminKey('');
  };

  const approve = async (id) => {
    try {
      await adminApproveReview(id, adminKey);
      setMessage('Review approved!');
      loadData();
    } catch (err) {
      setMessage('Failed to approve review.');
    }
  };

  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await adminDeleteReview(id, adminKey);
      loadData();
    } catch (err) {
      setMessage('Failed to delete review.');
    }
  };

  const addPhoto = async (e) => {
    e.preventDefault();
    if (!photoForm.github_path.trim()) {
      setMessage('GitHub path is required.');
      return;
    }
    try {
      await adminAddGalleryPhoto(photoForm, adminKey);
      setPhotoForm({ github_path: '', alt: '', category: 'general' });
      setMessage('Photo added! Make sure the image file exists in your GitHub repo at that path.');
      loadData();
    } catch (err) {
      setMessage('Failed to add photo. Check path and admin key.');
      console.error(err);
    }
  };

  const deletePhoto = async (id) => {
    if (!confirm('Remove this photo from gallery?')) return;
    try {
      await adminDeleteGalleryPhoto(id, adminKey);
      loadData();
    } catch (err) {
      setMessage('Failed to delete photo.');
    }
  };

  const resetNoticeForm = () => {
    setNoticeForm(EMPTY_NOTICE);
    setEditingNoticeId(null);
  };

  const startEditNotice = (notice) => {
    setEditingNoticeId(notice.id);
    setNoticeForm({
      title: notice.title,
      message: notice.message,
      notice_type: notice.notice_type,
      priority: notice.priority,
      link_url: notice.link_url || '',
      link_label: notice.link_label || '',
      expires_at: notice.expires_at ? notice.expires_at.slice(0, 16) : '',
      active: notice.active,
    });
    setTab('add-notice');
  };

  const saveNotice = async (e) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.message.trim()) {
      setMessage('Title and message are required.');
      return;
    }
    const payload = {
      ...noticeForm,
      expires_at: noticeForm.expires_at ? new Date(noticeForm.expires_at).toISOString() : null,
    };
    try {
      if (editingNoticeId) {
        await adminUpdateNotice({ ...payload, id: editingNoticeId }, adminKey);
        setMessage('Notice updated!');
      } else {
        await adminAddNotice(payload, adminKey);
        setMessage('Notice published!');
      }
      resetNoticeForm();
      loadData();
    } catch (err) {
      setMessage('Failed to save notice. Run latest schema.sql in Supabase if notices table is missing.');
      console.error(err);
    }
  };

  const toggleNotice = async (id) => {
    try {
      await adminToggleNotice(id, adminKey);
      loadData();
    } catch (err) {
      setMessage('Failed to toggle notice.');
    }
  };

  const deleteNotice = async (id) => {
    if (!confirm('Delete this notice permanently?')) return;
    try {
      await adminDeleteNotice(id, adminKey);
      if (editingNoticeId === id) resetNoticeForm();
      loadData();
    } catch (err) {
      setMessage('Failed to delete notice.');
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <h1><i className="fas fa-cog" /> Admin Panel</h1>
          <p className="admin-notice">
            Supabase is not configured. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file, then run the SQL schema from <code>supabase/schema.sql</code>.
          </p>
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <h1><i className="fas fa-lock" /> Admin Login</h1>
          <p>Enter admin password to manage reviews and gallery photos.</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="adminKey">Admin Password</label>
              <input
                id="adminKey"
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            {loginError && <p className="review-form-message error">{loginError}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Checking...' : 'Login'}
            </button>
          </form>
          <Link to="/" className="admin-back"><i className="fas fa-arrow-left" /> Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container admin-header-inner">
          <h1><i className="fas fa-shield-alt" /> Admin Panel</h1>
          <div className="admin-header-actions">
            <Link to="/gallery" className="btn btn-outline btn-sm">View Gallery</Link>
            <button type="button" className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container admin-content">
        {message && <div className="admin-toast">{message} <button type="button" onClick={() => setMessage('')}>×</button></div>}

        <div className="admin-tabs">
          <button type="button" className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}>
            <i className="fas fa-star" /> Pending Reviews ({pendingReviews.length})
          </button>
          <button type="button" className={tab === 'photos' ? 'active' : ''} onClick={() => setTab('photos')}>
            <i className="fas fa-images" /> Gallery Photos ({galleryPhotos.length})
          </button>
          <button type="button" className={tab === 'add-photo' ? 'active' : ''} onClick={() => setTab('add-photo')}>
            <i className="fas fa-plus" /> Add Photo
          </button>
          <button type="button" className={tab === 'notices' ? 'active' : ''} onClick={() => setTab('notices')}>
            <i className="fas fa-bullhorn" /> Notices ({notices.length})
          </button>
          <button type="button" className={tab === 'add-notice' ? 'active' : ''} onClick={() => { setTab('add-notice'); if (!editingNoticeId) resetNoticeForm(); }}>
            <i className="fas fa-plus-circle" /> {editingNoticeId ? 'Edit Notice' : 'Add Notice'}
          </button>
        </div>

        {loading && <p className="admin-loading"><i className="fas fa-spinner fa-spin" /> Loading...</p>}

        {tab === 'reviews' && (
          <div className="admin-panel">
            <h2>Pending Reviews</h2>
            {pendingReviews.length === 0 ? (
              <p className="admin-empty">No pending reviews.</p>
            ) : (
              <div className="admin-list">
                {pendingReviews.map((r) => (
                  <div key={r.id} className="admin-item">
                    <div className="admin-item-content">
                      <strong>{r.name}</strong> — {r.role}
                      <div className="admin-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                      <p>&ldquo;{r.text}&rdquo;</p>
                      <small>{new Date(r.created_at).toLocaleString()}</small>
                    </div>
                    <div className="admin-item-actions">
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => approve(r.id)}>Approve</button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => deleteReview(r.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'photos' && (
          <div className="admin-panel">
            <h2>Dynamic Gallery Photos (from GitHub)</h2>
            <p className="admin-hint">These photos are loaded from your GitHub repo. Upload the image file to the repo first, then add the path here.</p>
            {galleryPhotos.length === 0 ? (
              <p className="admin-empty">No dynamic photos yet. Add one using the Add Photo tab.</p>
            ) : (
              <div className="admin-photo-grid">
                {galleryPhotos.map((p) => (
                  <div key={p.id} className="admin-photo-card">
                    <img src={getGithubImageUrl(p.github_path)} alt={p.alt} loading="lazy" />
                    <div className="admin-photo-info">
                      <strong>{p.alt || 'No title'}</strong>
                      <code>{p.github_path}</code>
                      <span className="badge">{p.category}</span>
                    </div>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => deletePhoto(p.id)}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'add-photo' && (
          <div className="admin-panel">
            <h2>Add New Photo</h2>
            <div className="admin-steps">
              <div className="admin-step"><span>1</span> Upload image to GitHub repo (e.g. <code>photo/photo226.jpeg</code>)</div>
              <div className="admin-step"><span>2</span> Enter the path below — image will load from GitHub</div>
              <div className="admin-step"><span>3</span> Photo appears in gallery automatically</div>
            </div>
            <form className="admin-form" onSubmit={addPhoto}>
              <div className="form-group">
                <label htmlFor="github_path">GitHub Image Path *</label>
                <input
                  id="github_path"
                  value={photoForm.github_path}
                  onChange={(e) => setPhotoForm({ ...photoForm, github_path: e.target.value })}
                  placeholder="photo/photo226.jpeg"
                  required
                />
                <small>Path relative to repo root, e.g. <code>photo/photo226.jpeg</code></small>
              </div>
              {photoForm.github_path && (
                <div className="admin-preview">
                  <label>Preview (from GitHub)</label>
                  <img src={getGithubImageUrl(photoForm.github_path)} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="alt">Title / Alt Text</label>
                <input
                  id="alt"
                  value={photoForm.alt}
                  onChange={(e) => setPhotoForm({ ...photoForm, alt: e.target.value })}
                  placeholder="Annual Day 2026"
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={photoForm.category}
                  onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary"><i className="fas fa-plus" /> Add Photo</button>
            </form>
          </div>
        )}

        {tab === 'notices' && (
          <div className="admin-panel">
            <h2>Alerts &amp; Notices</h2>
            <p className="admin-hint">
              <strong>Alert</strong> = urgent (red banner). <strong>Notice</strong> = general info (blue banner). Active notices show at the top of every page.
            </p>
            {notices.length === 0 ? (
              <p className="admin-empty">No notices yet. Add one using the Add Notice tab.</p>
            ) : (
              <div className="admin-list">
                {notices.map((n) => (
                  <div key={n.id} className={`admin-item admin-notice-item ${n.active ? '' : 'inactive'}`}>
                    <div className="admin-item-content">
                      <div className="admin-notice-meta">
                        <span className={`notice-type-badge notice-type-badge--${n.notice_type}`}>
                          {n.notice_type}
                        </span>
                        <span className={`notice-status-badge ${n.active ? 'active' : 'inactive'}`}>
                          {n.active ? 'Active' : 'Hidden'}
                        </span>
                        {n.priority > 0 && <span className="badge">Priority {n.priority}</span>}
                      </div>
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                      {n.link_url && <small>Link: {n.link_label || n.link_url}</small>}
                      <small>
                        {new Date(n.created_at).toLocaleString()}
                        {n.expires_at && ` · Expires ${new Date(n.expires_at).toLocaleString()}`}
                      </small>
                    </div>
                    <div className="admin-item-actions">
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => startEditNotice(n)}>Edit</button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => toggleNotice(n.id)}>
                        {n.active ? 'Hide' : 'Show'}
                      </button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => deleteNotice(n.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'add-notice' && (
          <div className="admin-panel">
            <h2>{editingNoticeId ? 'Edit Notice' : 'Add New Notice'}</h2>
            <form className="admin-form" onSubmit={saveNotice}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="notice_type">Type *</label>
                  <select
                    id="notice_type"
                    value={noticeForm.notice_type}
                    onChange={(e) => setNoticeForm({ ...noticeForm, notice_type: e.target.value })}
                  >
                    <option value="notice">Notice (info)</option>
                    <option value="alert">Alert (urgent)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <input
                    id="priority"
                    type="number"
                    min="0"
                    max="100"
                    value={noticeForm.priority}
                    onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                  />
                  <small>Higher number shows first</small>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="notice_title">Title *</label>
                <input
                  id="notice_title"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  placeholder="e.g. New Batch Starting Monday"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="notice_message">Message *</label>
                <textarea
                  id="notice_message"
                  rows={3}
                  value={noticeForm.message}
                  onChange={(e) => setNoticeForm({ ...noticeForm, message: e.target.value })}
                  placeholder="Full notice text shown on the banner..."
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="link_url">Link URL (optional)</label>
                  <input
                    id="link_url"
                    value={noticeForm.link_url}
                    onChange={(e) => setNoticeForm({ ...noticeForm, link_url: e.target.value })}
                    placeholder="/downloads or https://..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="link_label">Link Label</label>
                  <input
                    id="link_label"
                    value={noticeForm.link_label}
                    onChange={(e) => setNoticeForm({ ...noticeForm, link_label: e.target.value })}
                    placeholder="View details"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="expires_at">Expires At (optional)</label>
                <input
                  id="expires_at"
                  type="datetime-local"
                  value={noticeForm.expires_at}
                  onChange={(e) => setNoticeForm({ ...noticeForm, expires_at: e.target.value })}
                />
                <small>Leave empty to show until manually hidden</small>
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="btn btn-primary">
                  <i className={`fas ${editingNoticeId ? 'fa-save' : 'fa-bullhorn'}`} />
                  {editingNoticeId ? 'Update Notice' : 'Publish Notice'}
                </button>
                {editingNoticeId && (
                  <button type="button" className="btn btn-outline" onClick={resetNoticeForm}>Cancel Edit</button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
