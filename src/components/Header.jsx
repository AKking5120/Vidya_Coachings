import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SOCIAL, SITE } from '../data/constants';

const NAV_MAIN = [
  { to: '/', label: 'Home', end: true, icon: 'fas fa-home' },
  { to: '/#about', label: 'About', hash: true, icon: 'fas fa-info-circle' },
  { to: '/#programs', label: 'Programs', hash: true, icon: 'fas fa-book' },
  { to: '/gallery', label: 'Gallery', icon: 'fas fa-images' },
  { to: '/downloads', label: 'Downloads', icon: 'fas fa-download' },
];

const NAV_MORE = [
  { to: '/study-game', label: 'Study Game', icon: 'fas fa-gamepad', desc: 'Play quiz' },
  { to: '/leaderboard', label: 'Leaderboard', icon: 'fas fa-trophy', desc: 'Top scores' },
  { to: '/teachers-day', label: "Teacher's Day", icon: 'fas fa-chalkboard-teacher', desc: 'Our teachers' },
  { to: '/#reviews', label: 'Reviews', hash: true, icon: 'fas fa-star', desc: 'Student feedback' },
];

const NAV_CONTACT = { to: '/#contact', label: 'Contact', hash: true, icon: 'fas fa-phone-alt' };

const MOBILE_SECTIONS = [
  { title: 'Main', items: [NAV_MAIN[0], NAV_MAIN[1], NAV_MAIN[2], NAV_CONTACT] },
  { title: 'Explore', items: [NAV_MAIN[3], NAV_MAIN[4]] },
  { title: 'Learn & Play', items: NAV_MORE },
];

function NavItem({ item, onClick, className = '' }) {
  const location = useLocation();

  if (item.hash) {
    const hash = item.to.split('#')[1];
    const handleClick = (e) => {
      onClick?.();
      if (location.pathname !== '/') return;
      e.preventDefault();
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    };
    return (
      <li className={className}>
        <a href={item.to} onClick={handleClick} className="nav-link">
          {item.icon && <i className={item.icon} aria-hidden="true" />}
          <span>{item.label}</span>
        </a>
      </li>
    );
  }

  return (
    <li className={className}>
      <NavLink to={item.to} end={item.end} onClick={onClick} className="nav-link">
        {item.icon && <i className={item.icon} aria-hidden="true" />}
        <span>{item.label}</span>
      </NavLink>
    </li>
  );
}

function MoreDropdown({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleHash = (item, e) => {
    onNavigate?.();
    setOpen(false);
    if (!item.hash) return;
    const hash = item.to.split('#')[1];
    if (location.pathname !== '/') return;
    e.preventDefault();
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <li className="nav-dropdown" ref={ref}>
      <button
        type="button"
        className={`nav-link nav-dropdown-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <i className="fas fa-th-large" aria-hidden="true" />
        <span>More</span>
        <i className={`fas fa-chevron-down nav-chevron ${open ? 'rotated' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="nav-dropdown-menu">
          {NAV_MORE.map((item) =>
            item.hash ? (
              <a key={item.label} href={item.to} className="nav-dropdown-item" onClick={(e) => handleHash(item, e)}>
                <i className={item.icon} />
                <div>
                  <strong>{item.label}</strong>
                  {item.desc && <small>{item.desc}</small>}
                </div>
              </a>
            ) : (
              <Link key={item.label} to={item.to} className="nav-dropdown-item" onClick={() => { setOpen(false); onNavigate?.(); }}>
                <i className={item.icon} />
                <div>
                  <strong>{item.label}</strong>
                  {item.desc && <small>{item.desc}</small>}
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </li>
  );
}

export default function Header({ menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header id="header" className={`site-header ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <div className="container">
          <nav className="site-nav">
            <Link to="/" className="logo" onClick={closeMenu}>
              <img src="/logo.png" alt={SITE.name} className="logo-img" />
              <span className="logo-text">Vidya <span>Coachings</span></span>
            </Link>

            <ul className="nav-links desktop-nav">
              {NAV_MAIN.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
              <MoreDropdown />
              <NavItem item={NAV_CONTACT} />
            </ul>

            <div className="nav-actions">
              <div className="header-social">
                {SOCIAL.slice(0, 3).map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}>
                    <i className={s.icon} />
                  </a>
                ))}
              </div>
              <a href="/#contact" className="btn btn-primary nav-btn">
                <i className="fas fa-user-plus" /> Enroll
              </a>
              <button
                type="button"
                className={`menu-toggle ${menuOpen ? 'active' : ''}`}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="menu-bar" />
                <span className="menu-bar" />
                <span className="menu-bar" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div
        className={`mobile-overlay ${menuOpen ? 'active' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside className={`mobile-menu ${menuOpen ? 'active' : ''}`} aria-label="Mobile navigation">
        <div className="mobile-menu-head">
          <span className="mobile-menu-title">Menu</span>
          <button type="button" className="mobile-close" onClick={closeMenu} aria-label="Close menu">
            <i className="fas fa-times" />
          </button>
        </div>

        {MOBILE_SECTIONS.map((section) => (
          <div key={section.title} className="mobile-menu-section">
            <p className="mobile-section-label">{section.title}</p>
            {section.items.map((item) =>
              item.hash ? (
                <a key={item.label} href={item.to} className="mobile-nav-link" onClick={closeMenu}>
                  {item.icon && <i className={item.icon} />}
                  <span>{item.label}</span>
                  <i className="fas fa-chevron-right mobile-arrow" />
                </a>
              ) : (
                <Link key={item.label} to={item.to} className="mobile-nav-link" onClick={closeMenu}>
                  {item.icon && <i className={item.icon} />}
                  <span>{item.label}</span>
                  <i className="fas fa-chevron-right mobile-arrow" />
                </Link>
              )
            )}
          </div>
        ))}

        <a href="/#contact" className="btn btn-primary mobile-enroll" onClick={closeMenu}>
          <i className="fas fa-user-plus" /> Enroll Now
        </a>

        <div className="mobile-social">
          {SOCIAL.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}>
              <i className={s.icon} />
            </a>
          ))}
        </div>
      </aside>
    </>
  );
}
