import { useState, useEffect, useRef } from 'react';
import SectionTitle from '../components/SectionTitle';
import ReviewsSection from '../components/ReviewsSection';
import { SOCIAL, SITE } from '../data/constants';

const HERO_DOODLES = [
  'fa-smile', 'fa-book', 'fa-pencil-alt', 'fa-star', 'fa-graduation-cap',
  'fa-apple-alt', 'fa-calculator', 'fa-globe-asia', 'fa-lightbulb', 'fa-ruler-combined',
  'fa-chalkboard', 'fa-pen-fancy', 'fa-smile-beam', 'fa-book-open', 'fa-highlighter',
  'fa-award', 'fa-user-graduate', 'fa-school', 'fa-flask', 'fa-language',
];

const ABOUT_SLIDES = [
  '/aboutcontentphoto.jpeg',
  '/aboutcontentphoto1.jpeg',
  '/aboutcontentphoto2.jpeg',
  '/aboutcontentphoto3.jpeg',
];

const PROGRAMS = [
  { icon: 'fa-child', color: 'orange', title: 'Primary (1st - 8th)', desc: 'All foundational subjects with personal attention.' },
  { icon: 'fa-book-open', color: 'blue', title: 'Secondary (9th - 10th)', desc: 'Complete board preparation. Hindi & English medium.' },
  { icon: 'fa-user-graduate', color: 'indigo', title: 'Senior (11th - 12th)', desc: 'Arts/Humanities, Science & Commerce streams.' },
  { icon: 'fa-university', color: 'purple', title: 'CUET', desc: 'College Admissions Entrance Exam.' },
  { icon: 'fa-chalkboard-teacher', color: 'teal', title: 'CTET', desc: '(Paper- 1 & 2) CBSE' },
  { icon: 'fa-school', color: 'green', title: 'KVS | NVS | CM Shri School', desc: 'School Admission Entrance Exam.' },
  { icon: 'fa-book-reader', color: 'cyan', title: 'BA | MA', desc: 'IGNOU + DUSOL Classes' },
  { icon: 'fa-shield-alt', color: 'red', title: 'Army School', desc: 'Entrance Exam.' },
  { icon: 'fa-compass', color: 'rose', title: 'Counselling', desc: 'Education Counselling & Career Guidance.' },
];

const LOCATIONS = [
  {
    name: 'Vidya 1.0',
    address: 'House No. A-145/1, Gali No. 15, Harsh Vihar, Hari Nagar Part-3, Jaitpur, Badarpur, New Delhi',
    pin: 'Delhi 110044',
    map: 'https://www.google.com/maps/search/?api=1&query=House+A-145/1+Gali+15+Harsh+Vihar+Jaitpur+Badarpur+Delhi+110044',
  },
  {
    name: 'Vidya 2.0 (Main Branch)',
    address: 'T-Point, Tanki Road, Ekta Vihar, Jaitpur Extension, Badarpur, Delhi',
    pin: 'Delhi 110044',
    map: 'https://www.google.com/maps/search/?api=1&query=Vidya+Coachings+2.0+Badarpur+Delhi',
  },
  {
    name: 'Branch 3.0',
    address: 'Om Nagar, Near Narsingh Shah ki Kothi, Jaitpur-Badarpur area, New Delhi',
    pin: 'Delhi 110044',
    map: 'https://www.google.com/maps/search/?api=1&query=Om+Nagar+Jaitpur+Badarpur+Delhi+110044',
  },
];

function Counter({ target }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { setCount(target); clearInterval(timer); }
        else setCount(Math.floor(current));
      }, 33);
      observer.disconnect();
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}</span>;
}

function AboutSlider() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % ABOUT_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="about-image">
      <div className="image-slider">
        {ABOUT_SLIDES.map((src, i) => (
          <img key={src} src={src} alt={`Founder ${i + 1}`} className={`slider-img ${i === index ? 'active' : ''}`} loading="lazy" />
        ))}
      </div>
      <div className="slider-dots">
        {ABOUT_SLIDES.map((_, i) => (
          <button key={i} type="button" className={`dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

function TeamCard({ avatar, name, subject, experience, phone, branch }) {
  return (
    <div className="team-card">
      <div className="team-avatar">{avatar}</div>
      <h4>{name}</h4>
      <p className="subject">{subject}</p>
      <div className="experience-badge"><i className="fas fa-star" /> {experience}</div>
      <a href={`tel:${phone}`} className="contact-link"><i className="fas fa-phone" /> {phone.replace('+91', '').trim()}</a>
      <span className="branch-tag">{branch}</span>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-doodles" aria-hidden="true">
            {HERO_DOODLES.map((icon) => <i key={icon} className={`fas ${icon}`} />)}
          </div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge"><i className="fas fa-calendar-check" /> Established {SITE.established}</div>
            <h1>Expert Tuition for <span className="highlight">Class 1 to 12</span></h1>
            <p className="hero-tagline">&ldquo;A Name of Trust for Quality Education & Lifelong Learning&rdquo;</p>
            <div className="hero-features">
              <span><i className="fas fa-language" /> Hindi & English Medium</span>
              <span><i className="fas fa-book" /> All Subjects</span>
              <span><i className="fas fa-chalkboard" /> Offline & Online</span>
              <span><i className="fas fa-map-marker-alt" /> Badarpur & Jaitpur</span>
            </div>
            <div className="hero-cta-group">
              <a href="#contact" className="btn btn-primary"><i className="fas fa-user-plus" /> Join Now</a>
              <a href={`https://wa.me/${SITE.phoneRaw}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <i className="fab fa-whatsapp" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-box"><h2><Counter target={1000} />+</h2><p>Students Taught</p></div>
            <div className="stat-box"><h2><Counter target={10} />+</h2><p>Years Experience</p></div>
            <div className="stat-box"><h2><Counter target={3} /></h2><p>Branches</p></div>
            <div className="stat-box"><h2><Counter target={100} />%</h2><p>Results</p></div>
          </div>
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="container">
          <SectionTitle title="About the Founder" subtitle="Learn more about the vision behind Vidya Coachings" />
          <div className="about-content">
            <AboutSlider />
            <div className="about-text">
              <h3>Welcome to Vidya Coachings</h3>
              <p>A well-established academic coaching institute located in Badarpur & Jaitpur, South New Delhi. Founded in April 2015, dedicated to providing quality education and nurturing young minds.</p>
              <div className="founder-card">
                <h4><i className="fas fa-user-tie" /> Founder & Director: Amarpal Saini</h4>
                <p>Passionate educator with 10+ years experience. Runs Vidya Coachings as core Humanities specialist. Committed to youth mentorship and community education.</p>
                <div className="qualifications">
                  <span><i className="fas fa-graduation-cap" /> MA Political Science</span>
                  <span><i className="fas fa-graduation-cap" /> MA Hindi</span>
                  <span><i className="fas fa-certificate" /> PGDSLM</span>
                  <span><i className="fas fa-check-circle" /> CTET Qualified (Paper 1 and 2)</span>
                  <span><i className="fas fa-check-circle" /> B.Ed</span>
                  <span><i className="fas fa-check-circle" /> D.EL.ED</span>
                  <span><i className="fas fa-heart" /> NCC A, B and C Certificate Holder</span>
                  <span><i className="fas fa-heart" /> Academic Educator in Magic Bus India Foundation 7+ years Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section team-section">
        <div className="container">
          <SectionTitle title="Our Expert Faculty" subtitle="Meet our dedicated team of educators" />
          <div className="faculty-director">
            <div className="director-card">
              <h4>Director & Coordinator</h4>
              <h3>Amarpal Saini Sir (AP Saini Sir)</h3>
              <p className="subject">11th & 12th Arts Subjects</p>
              <div className="experience-badge"><i className="fas fa-star" /> 12+ Years Experience</div>
              <a href="tel:+919871749012"><i className="fas fa-phone" /> +91 98717 49012</a>
              <span className="branch-tag">Branch 1, 2 & 3</span>
            </div>
            <div className="director-card">
              <h4>Manager & Add. Director</h4>
              <h3>Mohit Singh Sir</h3>
              <p className="subject">1st to 8th All Subjects</p>
              <div className="experience-badge"><i className="fas fa-star" /> 5+ Years Experience</div>
              <a href="tel:+917827945038"><i className="fas fa-phone" /> +91 78279 45038</a>
              <span className="branch-tag">Branch 1, 2 & 3</span>
            </div>
          </div>

          <h3 className="faculty-heading">Senior Faculty (11th & 12th)</h3>
          <div className="team-grid">
            <TeamCard avatar="AS" name="Amarpal Saini Sir" subject="11th & 12th History, Economics, Sociology" experience="12+ Years Experience" phone="+919871749012" branch="Branch 1, 2 and 3" />
            <TeamCard avatar="UG" name="Usman Ghani Sir" subject="11th & 12th Mathematics" experience="14+ Years Experience" phone="+919871029057" branch="Branch 2" />
            <TeamCard avatar="GC" name="Gopal Chaudhary Sir" subject="11th & 12th Accountancy" experience="10+ Years Experience" phone="+919873558407" branch="Branch 2" />
            <TeamCard avatar="AU" name="Aman Upadhyay Sir" subject="11th & 12th Physics & Chemistry" experience="6+ Years Experience" phone="+918130150058" branch="Branch 2" />
            <TeamCard avatar="VJ" name="Vivek Kr. Jha Sir" subject="11th & 12th Political Science" experience="3+ Years Experience" phone="+919911382175" branch="Branch 2" />
            <TeamCard avatar="MS" name="Mohit Singh Sir" subject="11th & 12th Geography" experience="5+ Years Experience" phone="+917827945038" branch="Branch 1, 2 & 3" />
            <TeamCard avatar="FM" name="Fatma Mam" subject="9th & 10th Natural Science (11th & 12th Biology)" experience="5+ Years Experience" phone="+918448162535" branch="Branch 1 & 2" />
          </div>

          <h3 className="faculty-heading">Class 9th & 10th Faculty</h3>
          <div className="team-grid">
            <TeamCard avatar="AS" name="Amarpal Saini Sir" subject="9th & 10th Social Studies" experience="12+ Years Experience" phone="+919871749012" branch="Branch 1, 2 and 3" />
            <TeamCard avatar="GS" name="Gaurav Singh Sir" subject="9th & 10th Mathematics" experience="5+ Years Experience" phone="+918851338396" branch="Branch 1 & 2" />
            <TeamCard avatar="FM" name="Fatma Mam" subject="9th & 10th Natural Science" experience="5+ Years Experience" phone="+918448162535" branch="Branch 1 & 2" />
          </div>

          <h3 className="faculty-heading">Class 1st to 8th Faculty</h3>
          <div className="team-grid">
            <TeamCard avatar="PG" name="Pooja Gupta Mam" subject="1st to 8th (All Subjects)" experience="5+ Years Experience" phone="+917982531323" branch="Branch 1 & 3" />
            <TeamCard avatar="GM" name="Gulnaz Mam" subject="1st to 8th (All Subjects)" experience="3+ Years Experience" phone="+919718377598" branch="Branch 2" />
            <TeamCard avatar="NK" name="Neetu Kumari Mam" subject="1st to 5th (All Subjects)" experience="5+ Years Experience" phone="+918595916376" branch="Branch 1 & 3" />
            <TeamCard avatar="RG" name="Riya Gupta Mam" subject="1st to 5th (All Subjects)" experience="2+ Years Experience" phone="+917042916714" branch="Branch 1 & 3" />
            <TeamCard avatar="BM" name="Bhawna Mam" subject="1st to 5th (All Subjects)" experience="2+ Years Experience" phone="+918810298147" branch="Branch 1 & 3" />
            <TeamCard avatar="MS" name="Mohit Singh Sir" subject="1st to 8th (All Subjects)" experience="5+ Years Experience" phone="+917827945038" branch="Branch 1, 2 & 3" />
          </div>
        </div>
      </section>

      <section id="programs" className="section programs-section">
        <div className="container">
          <SectionTitle title="Academic Programs" subtitle="Comprehensive coaching for all classes" />
          <div className="features-grid">
            {PROGRAMS.map((p) => (
              <div key={p.title} className="feature-box">
                <div className={`feature-icon icon-${p.color}`}><i className={`fas ${p.icon}`} /></div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="locations" className="section locations-section">
        <div className="container">
          <SectionTitle title="Our Branches" subtitle="Visit us at any of our convenient locations" />
          <div className="location-grid">
            {LOCATIONS.map((loc) => (
              <div key={loc.name} className="location-card">
                <h3><i className="fas fa-map-marker-alt" /> {loc.name}</h3>
                <p>{loc.address}<br /><strong>{loc.pin}</strong></p>
                <a href={loc.map} target="_blank" rel="noopener noreferrer" className="directions-btn">
                  <i className="fas fa-directions" /> Get Directions
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />

      <section id="contact" className="section contact-section">
        <div className="container">
          <SectionTitle title="Contact & Location" subtitle="Get in touch with us for admissions" />
          <div className="contact-container">
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-phone-alt" />
                <div><h4>Call Us</h4><a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="phone">{SITE.phone}</a></div>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope" />
                <div><h4>Email</h4><a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${SITE.email}`} target="_blank" rel="noopener noreferrer" className="phone">{SITE.email}</a></div>
              </div>
              <div className="contact-item">
                <i className="fas fa-user" />
                <div><h4>Founder</h4><p>{SITE.founder}</p></div>
              </div>
              <div className="contact-item">
                <i className="fas fa-clock" />
                <div><h4>Working Hours</h4><p>Mon - Sat: 8:00 AM - 8:00 PM</p></div>
              </div>
            </div>
            <div className="map-container">
              <iframe
                title="Vidya Coachings Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1047.8901432744397!2d77.33197387925534!3d28.500863450614204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce7568fc4654d%3A0xb946b5623192dfc1!2sVidya%20Coachings%202.0!5e1!3m2!1sen!2sin!4v1779817310499!5m2!1sen!2sin"
                width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="query" className="section query-section">
        <div className="container">
          <SectionTitle title="Admission Query" subtitle="Fill the form to enroll or ask any question" />
          <div className="query-box">
            <h3>Ready to Join Vidya Coachings?</h3>
            <p>Submit your admission query online and our team will get back to you shortly.</p>
            <div className="query-actions">
              <a href="https://forms.gle/J7kSgvwpFc1261At5" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <i className="fas fa-file-alt" /> Fill Admission Form
              </a>
              <a href={`https://wa.me/${SITE.phoneRaw}?text=Hi%2C%20I%20want%20to%20know%20about%20admission%20at%20Vidya%20Coachings`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <i className="fab fa-whatsapp" /> Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section social-section">
        <div className="container">
          <SectionTitle title="Follow Us" subtitle="Stay connected with Vidya Coachings" />
          <div className="social-links">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={`social-card ${s.className}`}>
                <i className={s.icon} /><span>{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
