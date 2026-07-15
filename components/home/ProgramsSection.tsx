'use client';

import { motion } from 'framer-motion';
import {
  Baby, BookOpen, GraduationCap, University, School,
  BookMarked, Compass, Shield, Users,
} from 'lucide-react';

const PROGRAMS = [
  { icon: Baby,          color: 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white', title: 'Primary (1st – 8th)',   desc: 'All foundational subjects with personal attention and care.' },
  { icon: BookOpen,      color: 'bg-blue-100   text-blue-600   group-hover:bg-blue-500   group-hover:text-white', title: 'Secondary (9th – 10th)', desc: 'Complete board preparation. Hindi & English medium.' },
  { icon: GraduationCap, color: 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white', title: 'Senior (11th – 12th)',  desc: 'Arts/Humanities, Science & Commerce streams.' },
  { icon: University,    color: 'bg-purple-100 text-purple-600 group-hover:bg-purple-500 group-hover:text-white', title: 'CUET',                   desc: 'College Admissions Entrance Exam preparation.' },
  { icon: School,        color: 'bg-teal-100   text-teal-600   group-hover:bg-teal-500   group-hover:text-white', title: 'CTET (Paper 1 & 2)',    desc: 'Central Teacher Eligibility Test — CBSE.' },
  { icon: BookMarked,    color: 'bg-green-100  text-green-600  group-hover:bg-green-500  group-hover:text-white', title: 'KVS | NVS | CM Shri',  desc: 'School Admission Entrance Exam coaching.' },
  { icon: Users,         color: 'bg-cyan-100   text-cyan-600   group-hover:bg-cyan-500   group-hover:text-white', title: 'BA | MA',                desc: 'IGNOU + DUSOL Humanities classes.' },
  { icon: Shield,        color: 'bg-red-100    text-red-600    group-hover:bg-red-500    group-hover:text-white', title: 'Army School',            desc: 'Army School Entrance Exam preparation.' },
  { icon: Compass,       color: 'bg-rose-100   text-rose-600   group-hover:bg-rose-500   group-hover:text-white', title: 'Counselling',            desc: 'Education counselling & career guidance.' },
];

export default function ProgramsSection() {
  return (
    <section id="programs" className="py-24 section-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Centred heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <div className="accent-bar" />
          <h2 className="section-heading">Academic Programs</h2>
          <p className="section-sub">Comprehensive coaching for every class and competitive exam</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROGRAMS.map(({ icon: Icon, color, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="group card flex gap-5 items-start cursor-default"
            >
              <div
                className={`w-13 h-13 min-w-[52px] min-h-[52px] rounded-2xl flex items-center justify-center transition-all duration-300 ${color}`}
              >
                <Icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
