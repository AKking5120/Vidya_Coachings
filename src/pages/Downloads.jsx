import { useMemo, useState } from 'react';
import { HARDCODED_DOWNLOADS } from '../data/downloadsData';

const TABS = [
  { id: 'all', label: 'All Files', icon: 'fas fa-folder-open' },
  { id: 'notes', label: 'Notes', icon: 'fas fa-book' },
  { id: 'circulars', label: 'Circulars', icon: 'fas fa-bullhorn' },
];

export default function Downloads() {
  const [activeTab, setActiveTab] = useState('all');

  const files = useMemo(() => HARDCODED_DOWNLOADS, []);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return files;
    return files.filter((f) => f.category === activeTab);
  }, [files, activeTab]);

  const counts = {
    all: files.length,
    notes: files.filter((f) => f.category === 'notes').length,
    circulars: files.filter((f) => f.category === 'circulars').length,
  };

  return (
    <>
      <section className="page-hero downloads-hero">
        <div className="container">
          <div className="page-hero-badge"><i className="fas fa-download" /> Study Resources</div>
          <h1>Downloads</h1>
          <p>Notes, circulars and important documents for students & parents</p>
          <div className="gallery-stats">
            {TABS.map((t) => (
              <div key={t.id} className="gallery-stat">
                <strong>{counts[t.id]}</strong>
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gallery-tabs-bar">
        <div className="container">
          <div className="gallery-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <i className={t.icon} /> {t.label}
                <span className="tab-count">{counts[t.id]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="downloads-section">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="downloads-empty">
              <i className="fas fa-file-alt" />
              <p>No files in this category yet.</p>
            </div>
          ) : (
            <div className="downloads-grid">
              {filtered.map((file, i) => (
                <a
                  key={`${file.file}-${i}`}
                  href={`/${file.file.replace(/^\//, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-card"
                >
                  <div className="download-icon">
                    <i className={`fas ${file.type === 'pdf' ? 'fa-file-pdf' : 'fa-file'}`} />
                  </div>
                  <div className="download-info">
                    <h3>{file.title}</h3>
                    <div className="download-meta">
                      <span><i className="fas fa-graduation-cap" /> {file.classLabel}</span>
                      <span><i className="fas fa-calendar" /> {file.date}</span>
                      <span className={`badge badge-${file.category}`}>{file.category}</span>
                    </div>
                  </div>
                  <div className="download-action">
                    <i className="fas fa-download" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
