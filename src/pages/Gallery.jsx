import { useState, useEffect, useMemo, useCallback } from 'react';
import { HARDCODED_GALLERY } from '../data/galleryData';
import { STUDENT_PHOTOS, ALUMNI_PHOTOS, ACHIEVEMENT_PHOTOS } from '../data/galleryHardcoded';
import { fetchGalleryPhotos } from '../lib/supabase';
import { getLocalImageUrl, getGithubImageUrl } from '../lib/githubImages';
import { GALLERY_CATEGORIES } from '../data/constants';

function buildPhoto(item, isGithub = false) {
  return {
    src: isGithub ? getGithubImageUrl(item.github_path || item.src) : getLocalImageUrl(item.src),
    alt: item.alt || '',
    cat: item.cat || item.category || 'general',
  };
}

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('all-photos');
  const [lightbox, setLightbox] = useState(null);
  const [dynamicPhotos, setDynamicPhotos] = useState([]);

  useEffect(() => {
    fetchGalleryPhotos()
      .then((data) => setDynamicPhotos(data.map((p) => buildPhoto(p, true))))
      .catch(() => setDynamicPhotos([]));
  }, []);

  const sections = useMemo(() => ({
    'all-photos': [
      ...dynamicPhotos.filter((p) => p.cat === 'general'),
      ...HARDCODED_GALLERY.map((p) => buildPhoto(p)),
    ],
    students: [
      ...dynamicPhotos.filter((p) => p.cat === 'students'),
      ...STUDENT_PHOTOS.map((p) => buildPhoto(p)),
    ],
    alumni: [
      ...dynamicPhotos.filter((p) => p.cat === 'alumni'),
      ...ALUMNI_PHOTOS.map((p) => buildPhoto(p)),
    ],
    achievements: [
      ...dynamicPhotos.filter((p) => p.cat === 'achievements'),
      ...ACHIEVEMENT_PHOTOS.map((p) => buildPhoto(p)),
    ],
  }), [dynamicPhotos]);

  const currentPhotos = sections[activeTab] || [];

  const openLightbox = useCallback((index) => {
    setLightbox({ index, photos: currentPhotos });
  }, [currentPhotos]);

  const closeLightbox = () => setLightbox(null);

  const navigate = (dir) => {
    if (!lightbox) return;
    const next = (lightbox.index + dir + lightbox.photos.length) % lightbox.photos.length;
    setLightbox({ ...lightbox, index: next });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!lightbox) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const counts = {
    'all-photos': sections['all-photos'].length,
    students: sections.students.length,
    alumni: sections.alumni.length,
    achievements: sections.achievements.length,
  };

  return (
    <>
      <section className="page-hero gallery-hero">
        <div className="container">
          <div className="page-hero-badge"><i className="fas fa-images" /> Our Gallery</div>
          <h1>Photo Gallery</h1>
          <p>Memories, achievements and special moments at Vidya Coachings</p>
          <div className="gallery-stats">
            {GALLERY_CATEGORIES.map((c) => (
              <div key={c.id} className="gallery-stat">
                <strong>{counts[c.id]}+</strong>
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gallery-tabs-bar">
        <div className="container">
          <div className="gallery-tabs">
            {GALLERY_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`tab-btn ${activeTab === c.id ? 'active' : ''}`}
                onClick={() => setActiveTab(c.id)}
              >
                <i className={c.icon} /> {c.label}
                <span className="tab-count">{counts[c.id]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="gallery-section">
        <div className="container">
          <h2 className="gallery-section-title">
            {GALLERY_CATEGORIES.find((c) => c.id === activeTab)?.label}
          </h2>
          <div className="photo-grid">
            {currentPhotos.map((photo, i) => (
              <button key={`${photo.src}-${i}`} type="button" className="photo-item" onClick={() => openLightbox(i)}>
                <img src={photo.src} alt={photo.alt} loading="lazy" />
                <div className="photo-overlay"><i className="fas fa-search-plus" /></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div className="lightbox active" onClick={(e) => e.target === e.currentTarget && closeLightbox()}>
          <button type="button" className="lightbox-close" onClick={closeLightbox}>&times;</button>
          <button type="button" className="lightbox-nav lightbox-prev" onClick={() => navigate(-1)}>
            <i className="fas fa-chevron-left" />
          </button>
          <div className="lightbox-img-container">
            <img src={lightbox.photos[lightbox.index].src} alt={lightbox.photos[lightbox.index].alt} />
          </div>
          <button type="button" className="lightbox-nav lightbox-next" onClick={() => navigate(1)}>
            <i className="fas fa-chevron-right" />
          </button>
          <div className="lightbox-counter">
            {lightbox.index + 1} / {lightbox.photos.length}
          </div>
        </div>
      )}
    </>
  );
}
