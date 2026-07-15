'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GraduationCap, Award, CheckCircle, Heart, Quote } from 'lucide-react';

const IMAGES = [
  { src: '/aboutcontentphoto.jpeg',  alt: 'Founder — Amarpal Saini' },
  { src: '/aboutcontentphoto1.jpeg', alt: 'Vidya Coachings campus' },
  { src: '/aboutcontentphoto2.jpeg', alt: 'Teaching session' },
  { src: '/aboutcontentphoto3.jpeg', alt: 'Students at Vidya Coachings' },
];

const QUALIFICATIONS = [
  { icon: GraduationCap, text: 'MA Political Science' },
  { icon: GraduationCap, text: 'MA Hindi' },
  { icon: Award,         text: 'PGDSLM' },
  { icon: CheckCircle,   text: 'CTET Qualified (Paper 1 & 2)' },
  { icon: CheckCircle,   text: 'B.Ed' },
  { icon: CheckCircle,   text: 'D.EL.ED' },
  { icon: Heart,         text: 'NCC A, B & C Certificate Holder' },
  { icon: Heart,         text: 'Academic Educator — Magic Bus India Foundation (7+ yrs)' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function AboutSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % IMAGES.length), 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="about" className="py-24 section-gray overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Centred heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <div className="accent-bar" />
          <h2 className="section-heading">About the Founder</h2>
          <p className="section-sub">The vision and passion behind Vidya Coachings</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* ── Image slider ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-5"
          >
            {/* Decorative ring */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-100 ring-4 ring-amber-200">
              {IMAGES.map((img, i) => (
                <div
                  key={img.src}
                  className={`transition-opacity duration-700 ${
                    i === active ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={800}
                    height={600}
                    className="w-full h-auto block"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i === 0}
                  />
                </div>
              ))}
              {/* Caption pill */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs px-4 py-1.5 rounded-full whitespace-nowrap">
                {IMAGES[active].alt}
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === active
                      ? 'bg-amber-400 w-8'
                      : 'bg-slate-300 w-2.5 hover:bg-amber-300'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* ── Text side ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Quote block */}
            <div className="relative bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-5">
              <Quote size={28} className="text-amber-300 absolute top-3 right-4" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Vidya Coachings</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                A well-established academic coaching institute in Badarpur &amp; Jaitpur, South New Delhi.
                Founded in April 2015, dedicated to quality education and nurturing young minds across
                all classes and streams.
              </p>
            </div>

            {/* Founder card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-extrabold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#1e3a5f,#2d5282)' }}
                >
                  AS
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 leading-tight">Amarpal Saini</h4>
                  <p className="text-amber-600 text-xs font-semibold">Founder &amp; Director</p>
                </div>
              </div>

              <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                Passionate educator with 10+ years experience. Core Humanities specialist committed to
                youth mentorship and community education.
              </p>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                {QUALIFICATIONS.map(({ icon: Icon, text }) => (
                  <motion.div
                    key={text}
                    variants={itemVariants}
                    className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2"
                  >
                    <Icon size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
                    <span>{text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
