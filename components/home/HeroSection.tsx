'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarCheck, Languages, BookOpen, Monitor, MapPin, UserPlus } from 'lucide-react';

const DOODLES = [
  '😊','📚','✏️','⭐','🎓','🍎','🔢','🌏',
  '💡','📐','🖊️','📖','🏆','🔬','🧩','❤️',
  '🎯','✨','🌟','📝','🔑','🏅','🎒','🖍️',
  '🎵','🌈','🦋','🌸',
];

// Small floating particle dots
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 4 + (i % 4) * 2,
  left: `${(i * 5.6 + 3) % 98}%`,
  top:  `${(i * 7.3 + 8) % 85}%`,
  delay: i * 0.3,
  dur:   3 + (i % 4),
}));

const chipVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: 0.6 + i * 0.1, type: 'spring', stiffness: 200 } }),
};

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[94vh] flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #fde68a 45%, #fef9c3 80%, #fff 100%)' }}
    >
      {/* ── Big blurred orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30 animate-drift"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', animationDuration: '12s' }} />
        <div className="absolute -bottom-40 -right-20 w-[450px] h-[450px] rounded-full opacity-20 animate-drift"
          style={{ background: 'radial-gradient(circle, #1e3a5f 0%, transparent 70%)', animationDuration: '16s', animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-[280px] h-[280px] rounded-full opacity-15 animate-drift"
          style={{ background: 'radial-gradient(circle, #fcd34d 0%, transparent 70%)', animationDuration: '10s', animationDelay: '4s' }} />
      </div>

      {/* ── Rotating ring decorations ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-16 right-16 w-64 h-64 rounded-full border-2 border-amber-300/30 animate-spin-slow" />
        <div className="absolute top-20 right-20 w-52 h-52 rounded-full border border-amber-400/20 animate-spin-slow2" />
        <div className="absolute bottom-24 left-16 w-48 h-48 rounded-full border-2 border-slate-900/10 animate-spin-slow" style={{ animationDuration: '22s' }} />
        <div className="absolute bottom-28 left-20 w-36 h-36 rounded-full border border-amber-500/20 animate-spin-slow2" style={{ animationDuration: '32s' }} />
      </div>

      {/* ── Subtle dot-grid pattern ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, #1e3a5f 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {PARTICLES.map(p => (
          <span
            key={p.id}
            className="absolute rounded-full bg-amber-500/20 animate-float"
            style={{
              width: p.size, height: p.size,
              left: p.left, top: p.top,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      {/* ── Floating emoji doodles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {DOODLES.map((emoji, i) => (
          <span
            key={i}
            className="absolute opacity-[0.13] animate-float"
            style={{
              fontSize: `${1.2 + (i % 3) * 0.4}rem`,
              left: `${(i * 3.5 + 1) % 98}%`,
              top:  `${(i * 9.3 + 4) % 87}%`,
              animationDelay: `${i * 0.28}s`,
              animationDuration: `${3.5 + (i % 4)}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center w-full">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 border border-amber-300 text-slate-700 text-sm font-semibold shadow-sm backdrop-blur-sm">
            <CalendarCheck size={14} className="text-amber-600" />
            Established April 2015 · 10+ Years of Excellence
          </span>
        </motion.div>

        {/* Headline — staggered words */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-[3.8rem] font-extrabold text-slate-900 leading-tight"
          >
            Expert Tuition for{' '}
            <span className="relative inline-block" style={{ color: '#1e3a5f' }}>
              Class 1 to 12
              {/* Animated underline */}
              <motion.span
                className="absolute -bottom-1 left-0 h-1.5 rounded-full bg-amber-400"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.9 }}
                aria-hidden="true"
              />
            </span>
          </motion.h1>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-slate-700 text-lg md:text-xl italic font-medium mb-10"
        >
          &ldquo;A Name of Trust for Quality Education &amp; Lifelong Learning&rdquo;
        </motion.p>

        {/* Feature chips */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {[
            { icon: Languages, label: 'Hindi & English Medium' },
            { icon: BookOpen,  label: 'All Subjects' },
            { icon: Monitor,   label: 'Offline & Online' },
            { icon: MapPin,    label: 'Badarpur & Jaitpur' },
          ].map(({ icon: Icon, label }, i) => (
            <motion.span
              key={label}
              custom={i}
              variants={chipVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/75 border border-amber-300 text-slate-700 text-sm font-medium shadow-sm backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-200 cursor-default"
            >
              <Icon size={14} className="text-amber-600" />
              {label}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/#contact"
            className="group relative inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-base text-white shadow-xl overflow-hidden"
            style={{ background: '#1e3a5f' }}
          >
            {/* Shine sweep on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden="true" />
            <UserPlus size={18} />
            Join Now
          </Link>
          <a
            href="https://wa.me/919871749012"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-base bg-white/85 border-2 border-slate-900 text-slate-900 hover:bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Us
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-14 flex flex-col items-center gap-1 text-slate-500 text-xs"
        >
          <span>Scroll down</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="w-5 h-8 rounded-full border-2 border-slate-400 flex items-start justify-center pt-1"
          >
            <div className="w-1 h-2 bg-slate-400 rounded-full" />
          </motion.div>
        </motion.div>
      </div>

      {/* Double wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0 80L60 70C120 60 240 40 360 36.7C480 33.3 600 46.7 720 50C840 53.3 960 46.7 1080 40C1200 33.3 1320 26.7 1380 23.3L1440 20V80H0Z" fill="white" fillOpacity="0.5"/>
          <path d="M0 80L60 73C120 67 240 53 360 50C480 47 600 53 720 56.7C840 60 960 60 1080 53.3C1200 46.7 1320 33.3 1380 26.7L1440 20V80H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
