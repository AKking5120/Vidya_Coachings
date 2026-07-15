'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

const BRANCHES = [
  {
    num: '1.0',
    name: 'Vidya 1.0',
    address: 'House No. A-145/1, Gali No. 15,\nHarsh Vihar, Hari Nagar Part-3,\nJaitpur, Badarpur, New Delhi — 110044',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=House+A-145/1+Gali+15+Harsh+Vihar+Jaitpur+Badarpur+Delhi+110044',
  },
  {
    num: '2.0',
    name: 'Vidya 2.0',
    badge: 'Main Branch',
    address: 'T-Point, Tanki Road,\nEkta Vihar, Jaitpur Extension,\nBadarpur, Delhi — 110044',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vidya+Coachings+2.0+Badarpur+Delhi',
  },
  {
    num: '3.0',
    name: 'Branch 3.0',
    address: 'Om Nagar, Near Narsingh Shah ki Kothi,\nJaitpur-Badarpur area,\nNew Delhi — 110044',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Om+Nagar+Jaitpur+Badarpur+Delhi+110044',
  },
];

export default function LocationsSection() {
  return (
    <section id="locations" className="py-24 section-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Centred heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <div className="accent-bar" />
          <h2 className="section-heading">Our Branches</h2>
          <p className="section-sub">Visit us at any of our convenient locations in South Delhi</p>
        </motion.div>

        {/* Branch cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {BRANCHES.map(({ num, name, badge, address, mapsUrl }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="card flex flex-col items-center text-center gap-4 group"
            >
              {/* Number circle */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'linear-gradient(135deg,#1e3a5f,#2d5282)' }}
              >
                {num}
              </div>

              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 text-lg">{name}</h3>
                  {badge && (
                    <span className="text-xs bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-full">
                      {badge}
                    </span>
                  )}
                </div>
                <div className="flex items-start justify-center gap-1.5 text-slate-500 text-sm">
                  <MapPin size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="whitespace-pre-line leading-relaxed text-left">{address}</p>
                </div>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border-2 border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-slate-900 transition-all duration-300"
              >
                <Navigation size={14} />
                Get Directions
              </a>
            </motion.div>
          ))}
        </div>

        {/* Embedded map */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-2 ring-slate-100"
          style={{ height: '380px' }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1047.8901432744397!2d77.33197387925534!3d28.500863450614204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce7568fc4654d%3A0xb946b5623192dfc1!2sVidya%20Coachings%202.0!5e1!3m2!1sen!2sin!4v1779817310499!5m2!1sen!2sin"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Vidya Coachings 2.0 on Google Maps"
          />
        </motion.div>
      </div>
    </section>
  );
}
