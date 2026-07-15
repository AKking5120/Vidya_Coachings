'use client';

import { motion } from 'framer-motion';
import { Star, Phone } from 'lucide-react';

interface FacultyMember {
  initials: string;
  name: string;
  subject: string;
  experience: string;
  phone: string;
  branches: string;
  color: string;
}

// Avatar gradient colours cycling through brand palette
const COLORS = [
  'from-[#1e3a5f] to-[#2d5282]',
  'from-amber-500 to-amber-600',
  'from-purple-600 to-purple-700',
  'from-teal-600 to-teal-700',
  'from-rose-500 to-rose-600',
  'from-indigo-600 to-indigo-700',
  'from-green-600 to-green-700',
];

function assignColor(idx: number) { return COLORS[idx % COLORS.length]; }

const _DIRECTOR_RAW = [
  { initials: 'AS', name: 'Amarpal Saini Sir (AP Saini Sir)', subject: '11th & 12th Arts Subjects',   experience: '12+', phone: '9871749012', branches: 'Branch 1, 2 & 3' },
  { initials: 'MS', name: 'Mohit Singh Sir',                  subject: '1st to 8th All Subjects',      experience: '5+',  phone: '7827945038', branches: 'Branch 1, 2 & 3' },
];
const DIRECTOR: FacultyMember[] = _DIRECTOR_RAW.map((m, i) => ({ ...m, color: assignColor(i) }));

const _SENIOR_RAW = [
  { initials: 'AS', name: 'Amarpal Saini Sir',  subject: '11th & 12th History, Economics, Sociology',  experience: '12+', phone: '9871749012', branches: 'Branch 1, 2 & 3' },
  { initials: 'UG', name: 'Usman Ghani Sir',    subject: '11th & 12th Mathematics',                    experience: '14+', phone: '9871029057', branches: 'Branch 2' },
  { initials: 'SH', name: 'Saddam Hussain Sir', subject: '11th & 12th Accountancy',                    experience: '6+',  phone: '9210129833', branches: 'Branch 2' },
  { initials: 'AU', name: 'Aman Upadhyay Sir',  subject: '11th & 12th Physics & Chemistry',            experience: '6+',  phone: '8130150058', branches: 'Branch 2' },
  { initials: 'VJ', name: 'Vivek Kr. Jha Sir',  subject: '11th & 12th Political Science',              experience: '3+',  phone: '9911382175', branches: 'Branch 2' },
  { initials: 'MS', name: 'Mohit Singh Sir',    subject: '11th & 12th Geography',                      experience: '5+',  phone: '7827945038', branches: 'Branch 1, 2 & 3' },
  { initials: 'FM', name: 'Fatma Mam',          subject: '9th–10th Natural Science | 11th–12th Biology',experience: '5+',  phone: '8448162535', branches: 'Branch 1 & 2' },
];
const SENIOR: FacultyMember[] = _SENIOR_RAW.map((m, i) => ({ ...m, color: assignColor(i) }));

const _SECONDARY_RAW = [
  { initials: 'AS', name: 'Amarpal Saini Sir', subject: '9th & 10th Social Studies', experience: '12+', phone: '9871749012', branches: 'Branch 1, 2 & 3' },
  { initials: 'GS', name: 'Gaurav Singh Sir',  subject: '9th & 10th Mathematics',    experience: '5+',  phone: '8851338396', branches: 'Branch 1 & 2' },
  { initials: 'FM', name: 'Fatma Mam',         subject: '9th & 10th Natural Science', experience: '5+', phone: '8448162535', branches: 'Branch 1 & 2' },
];
const SECONDARY: FacultyMember[] = _SECONDARY_RAW.map((m, i) => ({ ...m, color: assignColor(i) }));

const _PRIMARY_RAW = [
  { initials: 'PG', name: 'Pooja Gupta Mam',  subject: '1st to 8th (All Subjects)', experience: '5+', phone: '7982531323', branches: 'Branch 1 & 3' },
  { initials: 'GM', name: 'Gulnaz Mam',        subject: '1st to 8th (All Subjects)', experience: '3+', phone: '9718377598', branches: 'Branch 2' },
  { initials: 'NK', name: 'Neetu Kumari Mam',  subject: '1st to 5th (All Subjects)', experience: '5+', phone: '8595916376', branches: 'Branch 1 & 3' },
  { initials: 'RG', name: 'Riya Gupta Mam',    subject: '1st to 5th (All Subjects)', experience: '2+', phone: '7042916714', branches: 'Branch 1 & 3' },
  { initials: 'BM', name: 'Bhawna Mam',        subject: '1st to 5th (All Subjects)', experience: '2+', phone: '8810298147', branches: 'Branch 1 & 3' },
  { initials: 'MS', name: 'Mohit Singh Sir',   subject: '1st to 8th (All Subjects)', experience: '5+', phone: '7827945038', branches: 'Branch 1, 2 & 3' },
];
const PRIMARY: FacultyMember[] = _PRIMARY_RAW.map((m, i) => ({ ...m, color: assignColor(i) }));

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

function FacultyCard({ member, index }: { member: FacultyMember; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="card flex flex-col items-center text-center gap-3 group"
    >
      <div
        className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-xl font-extrabold text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
      >
        {member.initials}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm leading-snug">{member.name}</h4>
        <p className="text-amber-600 text-xs font-medium mt-1">{member.subject}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-500">
        <Star size={11} className="text-amber-400 fill-amber-400" />
        <span>{member.experience} Yrs Experience</span>
      </div>
      <a
        href={`tel:+91${member.phone}`}
        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
      >
        <Phone size={11} />{member.phone}
      </a>
      <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
        {member.branches}
      </span>
    </motion.div>
  );
}

function GroupHeading({ title }: { title: string }) {
  return (
    <motion.h3
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3"
    >
      <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block" />
      {title}
    </motion.h3>
  );
}

export default function TeamSection() {
  return (
    <section className="py-24 section-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Centred heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <div className="accent-bar" />
          <h2 className="section-heading">Our Expert Faculty</h2>
          <p className="section-sub">Meet our dedicated team of passionate educators</p>
        </motion.div>

        {/* Directors */}
        <div className="mb-12">
          <GroupHeading title="Director & Coordinator" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {DIRECTOR.map((m, i) => (
              <motion.div
                key={m.name}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card border-t-4 border-amber-400 text-center flex flex-col items-center gap-3"
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-xl font-extrabold text-white shadow-md`}
                >
                  {m.initials}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">{m.name}</h4>
                  <p className="text-amber-600 text-sm font-medium mt-0.5">{m.subject}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span>{m.experience} Years Experience</span>
                </div>
                <a href={`tel:+91${m.phone}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  <Phone size={11} /> {m.phone}
                </a>
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  {m.branches}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Senior */}
        <div className="mb-12">
          <GroupHeading title="Senior Faculty (11th & 12th)" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {SENIOR.map((m, i) => <FacultyCard key={`${m.name}-${i}`} member={m} index={i} />)}
          </div>
        </div>

        {/* 9th-10th */}
        <div className="mb-12">
          <GroupHeading title="Class 9th & 10th Faculty" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {SECONDARY.map((m, i) => <FacultyCard key={`${m.name}-${i}`} member={m} index={i} />)}
          </div>
        </div>

        {/* Primary */}
        <div>
          <GroupHeading title="Class 1st to 8th Faculty" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {PRIMARY.map((m, i) => <FacultyCard key={`${m.name}-${i}`} member={m} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
