import { useState, useEffect, useCallback } from 'react';
import { TEACHERS, TEACHERS_DAY_TRIBUTE, getTeacherGalleryPhotos } from '../data/teachersDayData';
import SectionTitle from '../components/SectionTitle';

function TeacherPhoto({ teacher, className = 'td-card-photo' }) {
  const photos = getTeacherGalleryPhotos(teacher);
  if (photos.length > 0) {
    return (
      <img
        src={photos[0].src}
        alt={teacher.name}
        className={className}
        loading="lazy"
      />
    );
  }

  return (
    <div className="td-card-avatar" aria-hidden="true">
      {teacher.avatar}
    </div>
  );
}

function TeacherGalleryModal({ teacher, startIndex, onClose }) {
  const photos = getTeacherGalleryPhotos(teacher);
  const [index, setIndex] = useState(startIndex);

  const navigate = useCallback((dir) => {
    if (!photos.length) return;
    setIndex((i) => (i + dir + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, navigate]);

  return (
    <div className="td-gallery-modal active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button type="button" className="td-gallery-close" onClick={onClose} aria-label="Close gallery">&times;</button>

      <div className="td-gallery-panel" onClick={(e) => e.stopPropagation()}>
        <div className="td-gallery-header">
          <div>
            <p className="td-gallery-role">{teacher.role}</p>
            <h2>{teacher.name}</h2>
            <p className="td-gallery-subject"><i className="fas fa-book-open" /> {teacher.subject}</p>
          </div>
          {photos.length > 0 && (
            <span className="td-gallery-count">{index + 1} / {photos.length}</span>
          )}
        </div>

        {photos.length > 0 ? (
          <>
            <div className="td-gallery-main">
              {photos.length > 1 && (
                <button type="button" className="td-gallery-nav td-gallery-prev" onClick={() => navigate(-1)} aria-label="Previous photo">
                  <i className="fas fa-chevron-left" />
                </button>
              )}
              <div className="td-gallery-image-wrap">
                <img src={photos[index].src} alt={photos[index].alt} />
              </div>
              {photos.length > 1 && (
                <button type="button" className="td-gallery-nav td-gallery-next" onClick={() => navigate(1)} aria-label="Next photo">
                  <i className="fas fa-chevron-right" />
                </button>
              )}
            </div>

            {photos.length > 1 && (
              <div className="td-gallery-thumbs">
                {photos.map((photo, i) => (
                  <button
                    key={photo.src}
                    type="button"
                    className={`td-gallery-thumb ${i === index ? 'active' : ''}`}
                    onClick={() => setIndex(i)}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <img src={photo.src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="td-gallery-empty">
            <div className="td-gallery-empty-avatar">{teacher.avatar}</div>
            <p><i className="fas fa-images" /> Is teacher ki photos jaldi add hongi.</p>
            <small>Admin: <code>public/teachers/</code> mein photo rakho aur <code>teachersDayData.js</code> mein <code>photos</code> array update karo.</small>
          </div>
        )}

        <blockquote className="td-gallery-tribute">
          <i className="fas fa-quote-left" /> {teacher.tributeLine}
        </blockquote>
      </div>
    </div>
  );
}

function TeacherCard({ teacher, onOpenGallery }) {
  const photoCount = getTeacherGalleryPhotos(teacher).length;

  return (
    <article
      className="td-card td-card-clickable"
      onClick={() => onOpenGallery(teacher)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpenGallery(teacher))}
      role="button"
      tabIndex={0}
      aria-label={`${teacher.name} — view photo gallery`}
    >
      <div className="td-card-image-wrap">
        <TeacherPhoto teacher={teacher} />
        <span className="td-card-badge"><i className="fas fa-chalkboard-teacher" /> {teacher.classes}</span>
        <span className="td-card-gallery-hint">
          <i className="fas fa-images" />
          {photoCount > 0 ? `${photoCount} Photo${photoCount > 1 ? 's' : ''}` : 'View Gallery'}
        </span>
      </div>
      <div className="td-card-body">
        <p className="td-card-role">{teacher.role}</p>
        <h3>{teacher.name}</h3>
        <div className="td-card-subject">
          <i className="fas fa-book-open" />
          <span>{teacher.subject}</span>
        </div>
        <div className="td-card-quality">
          <strong>Best Quality</strong>
          <p>{teacher.bestQuality}</p>
        </div>
        <blockquote className="td-card-tribute">
          <i className="fas fa-quote-left" />
          {teacher.tributeLine}
        </blockquote>
        <div className="td-card-meta">
          <span><i className="fas fa-star" /> {teacher.experience}</span>
          <span><i className="fas fa-map-marker-alt" /> {teacher.branch}</span>
        </div>
      </div>
    </article>
  );
}

export default function TeachersDay() {
  const [galleryTeacher, setGalleryTeacher] = useState(null);

  return (
    <>
      <section className="td-hero">
        <div className="td-hero-bg" aria-hidden="true">
          <i className="fas fa-apple-alt" />
          <i className="fas fa-chalkboard" />
          <i className="fas fa-graduation-cap" />
          <i className="fas fa-book" />
          <i className="fas fa-pencil-alt" />
          <i className="fas fa-heart" />
        </div>
        <div className="container td-hero-content">
          <span className="td-hero-date"><i className="fas fa-calendar-heart" /> 5 September — Teacher&apos;s Day</span>
          <h1>{TEACHERS_DAY_TRIBUTE.title}</h1>
          <p className="td-hero-sub">{TEACHERS_DAY_TRIBUTE.subtitle}</p>
          <div className="td-hero-message">
            <i className="fas fa-quote-left" />
            <p>{TEACHERS_DAY_TRIBUTE.message}</p>
          </div>
        </div>
      </section>

      <section className="section td-tribute-section">
        <div className="container">
          <SectionTitle
            title="Our Respected Teachers"
            subtitle="Card par click karo — teacher ki photo gallery khulegi"
          />
          <div className="td-grid">
            {TEACHERS.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onOpenGallery={setGalleryTeacher}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="td-closing">
        <div className="container">
          <div className="td-closing-box">
            <i className="fas fa-hands-helping" />
            <h2>Thank You, Teachers!</h2>
            <p>
              A teacher affects eternity — they can never tell where their influence stops.
              Vidya Coachings family aap sabhi teachers ko Teacher&apos;s Day par dil se dhanyavaad karti hai.
            </p>
          </div>
        </div>
      </section>

      {galleryTeacher && (
        <TeacherGalleryModal
          teacher={galleryTeacher}
          startIndex={0}
          onClose={() => setGalleryTeacher(null)}
        />
      )}
    </>
  );
}
