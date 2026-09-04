import { Link } from 'react-router-dom';
import { SITE } from '../data/constants';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">Vidya <span>Coachings</span></Link>
            <p>Quality tuition for Class 1 to 12 in Badarpur & Jaitpur, Delhi. Trusted since {SITE.established}.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/#about">About Us</Link>
            <Link to="/#programs">Programs</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/downloads">Downloads</Link>
            <Link to="/study-game">Study Game</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/teachers-day">Teacher&apos;s Day</Link>
            <Link to="/#reviews">Reviews</Link>
            <Link to="/#contact">Contact</Link>
            <Link to="/#query">Admission Form</Link>
          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}><i className="fas fa-phone" /> {SITE.phone}</a>
            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${SITE.email}`} target="_blank" rel="noopener noreferrer">
              <i className="fas fa-envelope" /> {SITE.email}
            </a>
            <p><i className="fas fa-clock" /> Mon - Sat: 8 AM - 8 PM</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Vidya Coachings. All Rights Reserved.</p>
          <p className="tagline">Established {SITE.established} | Celebrating 10+ Years of Excellence</p>
          <div className="website-credit">
            <p>Designed & Developed by <a href="https://wa.me/919540347869" target="_blank" rel="noopener noreferrer">MR. PRINCE KUMAR DAS</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
