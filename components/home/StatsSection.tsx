'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Clock, MapPin, TrendingUp } from 'lucide-react';

const STATS = [
  { target: 1000, suffix: '+', label: 'Students Taught',  icon: Users,      bg: 'from-amber-400 to-orange-400' },
  { target: 10,   suffix: '+', label: 'Years Experience', icon: Clock,      bg: 'from-blue-500 to-indigo-500'  },
  { target: 3,    suffix: '',  label: 'Branches',         icon: MapPin,     bg: 'from-purple-500 to-pink-500'  },
  { target: 100,  suffix: '%', label: 'Result Rate',      icon: TrendingUp, bg: 'from-green-500 to-teal-500'   },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    const steps = 60;
    const inc = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, target);
      setCount(Math.floor(cur));
      if (cur >= target) clearInterval(t);
    }, 1800 / steps);
    return () => clearInterval(t);
  }, [inView, target]);

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#2d5282 50%,#1e3a5f 100%)' }}>

      {/* BG decoration — spinning rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border border-white/5 animate-spin-slow" />
        <div className="absolute -top-10 -left-10 w-60 h-60 rounded-full border border-amber-400/10 animate-spin-slow2" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full border border-white/5 animate-spin-slow" style={{ animationDuration: '25s' }} />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full border border-amber-400/10 animate-spin-slow2" style={{ animationDuration: '35s' }} />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-10 animate-drift"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)', animationDuration: '14s' }} />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full opacity-10 animate-drift"
          style={{ background: 'radial-gradient(circle, #fbbf24, transparent 70%)', animationDuration: '10s', animationDelay: '3s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map(({ target, suffix, label, icon: Icon, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 32, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12, type: 'spring', stiffness: 120 }}
              className="relative flex flex-col items-center text-center gap-4 p-7 rounded-3xl bg-white/8 border border-white/10 backdrop-blur-sm overflow-hidden group hover:bg-white/12 transition-all duration-300"
            >
              {/* Glow on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${bg} rounded-3xl`} />

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center shadow-lg`}>
                <Icon size={26} className="text-white" />
              </div>

              {/* Number */}
              <div className="text-4xl md:text-5xl font-extrabold text-white">
                <CountUp target={target} suffix={suffix} />
              </div>
              <p className="text-sm font-semibold text-white/60 uppercase tracking-widest">{label}</p>

              {/* Bottom accent line */}
              <motion.div
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${bg}`}
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.12 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none" className="w-full h-10">
          <path d="M0 48L120 40C240 32 480 16 720 16C960 16 1200 32 1320 40L1440 48V48H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
