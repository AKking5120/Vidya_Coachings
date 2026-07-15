'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Facebook, Instagram, Youtube, Twitter, Bell } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',      href: '/'          },
  { label: 'About',     href: '/#about'    },
  { label: 'Programs',  href: '/#programs' },
  { label: 'Gallery',   href: '/gallery'   },
  { label: 'Downloads', href: '/downloads' },
  { label: 'Reviews',   href: '/#reviews'  },
  { label: 'Contact',   href: '/#contact'  },
];

const SOCIAL = [
  { icon: Facebook,  href: 'https://www.facebook.com/share/1BQUxhnAGN/',                                    label: 'Facebook'  },
  { icon: Instagram, href: 'https://www.instagram.com/vidya_coachings',                                     label: 'Instagram' },
  { icon: Youtube,   href: 'https://www.youtube.com/@vidyacoachings',                                       label: 'YouTube'   },
  { icon: Twitter,   href: 'https://x.com/vidyacoachings',                                                  label: 'X/Twitter' },
];

const NOTICE_STORAGE = 'vc_dismissed_notices';
function getDismissedIds(): number[] {
  try { return JSON.parse(localStorage.getItem(NOTICE_STORAGE) ?? '[]') as number[]; }
  catch { return []; }
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [noticeCount, setNoticeCount] = useState(0);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  // Fetch notice count for bell badge
  useEffect(() => {
    fetch('/api/notices')
      .then(r => r.json())
      .then((data: { id: number }[]) => {
        if (!Array.isArray(data)) return;
        const dismissed = getDismissedIds();
        setNoticeCount(data.filter(n => !dismissed.includes(n.id)).length);
      })
      .catch(() => {});
  }, []);

  function openNotices() {
    // Trigger NoticeModal by dispatching a custom event it listens to
    window.dispatchEvent(new CustomEvent('vc:open-notices'));
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''}`}
        style={{ background: '#1e3a5f' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between py-3 gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <Image src="/logo.png" alt="Vidya Coachings" width={48} height={48} className="rounded-full" priority />
              <span className="text-xl font-extrabold text-white leading-tight">
                Vidya <span className="text-amber-400">Coachings</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden lg:flex items-center gap-6 list-none">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive(href) ? 'text-amber-400' : 'text-white/90 hover:text-amber-400'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop right side */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Notification bell */}
              <button
                onClick={openNotices}
                aria-label={`Notices${noticeCount > 0 ? ` (${noticeCount} new)` : ''}`}
                className="relative text-white/80 hover:text-amber-400 transition-colors p-1.5"
              >
                <Bell size={20} />
                {noticeCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none px-0.5">
                    {noticeCount > 9 ? '9+' : noticeCount}
                  </span>
                )}
              </button>

              {/* Social icons */}
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="text-white/70 hover:text-amber-400 transition-colors">
                  <Icon size={16} />
                </a>
              ))}

              <Link
                href="/#contact"
                className="ml-2 px-5 py-2 rounded-full bg-amber-400 text-slate-900 text-sm font-bold hover:bg-amber-500 transition-colors"
              >
                Enroll Now
              </Link>
            </div>

            {/* Mobile: bell + hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={openNotices}
                aria-label="Notices"
                className="relative text-white/80 hover:text-amber-400 transition-colors p-1.5"
              >
                <Bell size={20} />
                {noticeCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] min-h-[16px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none px-0.5">
                    {noticeCount > 9 ? '9+' : noticeCount}
                  </span>
                )}
              </button>
              <button className="text-white p-1" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-40 pt-[72px]" style={{ background: '#1e3a5f' }}>
          <div className="flex flex-col p-6 gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`py-3 text-base font-medium border-b border-white/10 transition-colors ${
                  isActive(href) ? 'text-amber-400' : 'text-white/90 hover:text-amber-400'
                }`}>
                {label}
              </Link>
            ))}
            <Link href="/#contact" onClick={() => setOpen(false)}
              className="mt-4 text-center py-3 rounded-full bg-amber-400 text-slate-900 font-bold hover:bg-amber-500 transition-colors">
              Enroll Now
            </Link>
            <div className="flex items-center justify-center gap-5 mt-6">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="text-white/70 hover:text-amber-400 transition-colors">
                  <Icon size={20} />
                </a>
              ))}
              <a href="https://wa.me/919871749012" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="text-white/70 hover:text-green-400 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="h-[72px]" />
    </>
  );
}
