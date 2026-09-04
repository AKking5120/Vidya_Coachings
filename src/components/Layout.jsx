import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';
import ScrollTop from './ScrollTop';
import NoticeBanner from './NoticeBanner';
import ScrollReveal from './ScrollReveal';
import StudentBot from './StudentBot';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <NoticeBanner />
      <ScrollReveal />
      <main>
        <Outlet />
      </main>
      <Footer />
      <StudentBot />
      <WhatsAppFloat />
      <ScrollTop />
    </>
  );
}
