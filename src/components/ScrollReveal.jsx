import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const REVEAL_SELECTORS = [
  '.page-section-head',
  '.section > .container > *',
  '.stat-box',
  '.feature-box',
  '.team-card',
  '.director-card',
  '.location-card',
  '.review-card',
  '.contact-card',
  '.contact-map-card',
  '.download-card',
  '.gallery-item',
  '.sg-subject-card',
  '.sg-level-block',
  '.lb-table-wrap',
  '.query-box',
  '.social-card',
  '.hero-content > *',
  '.page-hero .container > *',
].join(',');

export default function ScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const elements = document.querySelectorAll(REVEAL_SELECTORS);
    elements.forEach((el, i) => {
      el.classList.add('motion-reveal');
      el.style.setProperty('--motion-delay', `${Math.min(i % 8, 7) * 0.07}s`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('motion-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname]);

  return null;
}
