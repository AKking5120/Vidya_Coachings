import { Link, NavLink, useLocation } from 'react-router-dom';
import { SOCIAL, SITE } from '../data/constants';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/#about', label: 'About', hash: true },
  { to: '/#programs', label: 'Programs', hash: true },
  { to: '/gallery', label: 'Gallery' },
  { to: '/downloads', label: 'Downloads' },
  { to: '/study-game', label: 'Study Game' },
  { to: '/teachers-day', label: "Teacher's Day" },
  { to: '/#reviews', label: 'Reviews', hash: true },
  { to: '/#contact', label: 'Contact', hash: true },
];

function NavItem({ item, onClick }) {
  const location = useLocation();

  if (item.hash) {
    const hash = item.to.split('#')[1];
    const handleClick = (e) => {
      onClick?.();
      if (location.pathname !== '/') {
        return;
      }
      e.preventDefault();
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    };
    return (
      <li>
        <a href={item.to} onClick={handleClick}>{item.label}</a>
      </li>
    );
  }

  return (
    <li>
      <NavLink to={item.to} end={item.end} onClick={onClick}>{item.label}</NavLink>
    </li>
  );
}

export default function Header({ menuOpen, setMenuOpen }) {
  return (
    <>
      <header id="header" className={menuOpen ? 'menu-open' : ''}>
        <div className="container">
          <nav>
            <Link to="/" className="logo">
              <img src="/logo.png" alt={SITE.name} className="logo-img" />
              <span className="logo-text">Vidya <span>Coachings</span></span>
            </Link>
            <ul className="nav-links">
              {NAV.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
            </ul>
            <div className="header-social">
              {SOCIAL.slice(0, 4).map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}>
                  <i className={s.icon} />
                </a>
              ))}
            </div>
            <a href="/#contact" className="btn btn-primary nav-btn">Enroll Now</a>
            <button
              type="button"
              className="menu-toggle"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} />
            </button>
          </nav>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
        {NAV.map((item) =>
          item.hash ? (
            <a key={item.label} href={item.to} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ) : (
            <Link key={item.label} to={item.to} onClick={() => setMenuOpen(false)}>{item.label}</Link>
          )
        )}
        <a href="/#contact" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Enroll Now</a>
        <div className="mobile-social">
          {SOCIAL.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              <i className={s.icon} />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
