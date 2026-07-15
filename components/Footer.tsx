import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react';

const SOCIAL = [
  { icon: Facebook, href: 'https://www.facebook.com/share/1BQUxhnAGN/', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/vidya_coachings', label: 'Instagram' },
  { icon: Youtube, href: 'https://www.youtube.com/@vidyacoachings', label: 'YouTube' },
  { icon: Twitter, href: 'https://x.com/vidyacoachings', label: 'X / Twitter' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Vidya Coachings" width={44} height={44} className="rounded-full" />
              <span className="text-xl font-extrabold text-white">
                Vidya <span className="text-amber-400">Coachings</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-4">
              Established April 2015 — A Name of Trust for Quality Education &amp; Lifelong Learning.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-400 hover:text-slate-900 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Home', '/'],
                ['About', '/#about'],
                ['Programs', '/#programs'],
                ['Gallery', '/gallery'],
                ['Downloads', '/downloads'],
                ['Reviews', '/#reviews'],
                ['Contact', '/#contact'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-semibold mb-4">Programs</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {[
                'Primary (Class 1–8)',
                'Secondary (Class 9–10)',
                'Senior (Class 11–12)',
                'CUET Preparation',
                'CTET (Paper 1 & 2)',
                'KVS / NVS / CM Shri',
                'BA / MA (IGNOU + DUSOL)',
                'Army School Entrance',
                'Education Counselling',
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <Phone size={14} className="mt-1 flex-shrink-0 text-amber-400" />
                <a href="tel:+919871749012" className="hover:text-amber-400 transition-colors">+91 98717 49012</a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <Mail size={14} className="mt-1 flex-shrink-0 text-amber-400" />
                <a
                  href="mailto:vidyacoachings1@gmail.com"
                  className="hover:text-amber-400 transition-colors break-all"
                >
                  vidyacoachings1@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <Clock size={14} className="mt-1 flex-shrink-0 text-amber-400" />
                <span>Mon – Sat: 8:00 AM – 8:00 PM</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin size={14} className="mt-1 flex-shrink-0 text-amber-400" />
                <span>Badarpur &amp; Jaitpur, South Delhi 110044</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Vidya Coachings. All Rights Reserved.</p>
          <p>
            Designed &amp; Developed by{' '}
            <a
              href="https://wa.me/919540347869"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              Mr. Prince Kumar Das
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
