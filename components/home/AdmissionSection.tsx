'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Loader2, Send, CheckCircle } from 'lucide-react';

const CLASSES = [
  'Class 1','Class 2','Class 3','Class 4','Class 5',
  'Class 6','Class 7','Class 8','Class 9','Class 10',
  'Class 11 (Arts)','Class 11 (Science)','Class 11 (Commerce)',
  'Class 12 (Arts)','Class 12 (Science)','Class 12 (Commerce)',
  'CUET','CTET','BA/MA (IGNOU/DUSOL)','Other',
];

const BENEFITS = [
  'Expert faculty with 10+ years experience',
  'Hindi & English medium classes',
  'Personalised attention for every student',
  'Proven track record of 100% results',
];

export default function AdmissionSection() {
  const [form, setForm] = useState({ student_name:'', class:'', parent_name:'', phone:'', email:'', message:'' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{type:'success'|'error';text:string}|null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setMsg(null);
    try {
      const res = await fetch('/api/admission', {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({type:'success', text:'Enquiry submitted! Our team will contact you shortly.'});
        setForm({student_name:'', class:'', parent_name:'', phone:'', email:'', message:''});
      } else setMsg({type:'error', text: data.error ?? 'Something went wrong.'});
    } catch { setMsg({type:'error', text:'Network error. Please try again.'}); }
    finally { setSubmitting(false); }
  }

  return (
    <section id="query" className="py-24 section-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Centred heading */}
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="section-header">
          <div className="accent-bar" />
          <h2 className="section-heading">Admission Enquiry</h2>
          <p className="section-sub">Fill out the form and we&apos;ll get back to you within 24 hours</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* Benefits side panel */}
          <motion.div
            initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
            transition={{duration:0.5}}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div
              className="rounded-3xl p-8 text-white"
              style={{background:'linear-gradient(135deg,#1e3a5f 0%,#2d5282 100%)'}}
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-400 flex items-center justify-center mb-5">
                <ClipboardList size={26} className="text-slate-900" />
              </div>
              <h3 className="text-xl font-extrabold mb-2">Join Vidya Coachings</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Start your academic journey with Delhi&apos;s trusted coaching institute.
                Established 2015 — 10+ years of excellence.
              </p>
              <ul className="flex flex-col gap-3">
                {BENEFITS.map(b => (
                  <li key={b} className="flex items-start gap-3 text-sm text-white/90">
                    <CheckCircle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
            transition={{duration:0.5, delay:0.1}}
            className="lg:col-span-3 bg-white rounded-3xl shadow-lg border border-slate-100 p-8"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-slate-700 mb-1">Student Name *</label>
                  <input id="studentName" type="text" required maxLength={150} placeholder="Student's full name"
                    className="input-field" value={form.student_name} onChange={e => setForm({...form,student_name:e.target.value})} />
                </div>
                <div>
                  <label htmlFor="classSelect" className="block text-sm font-medium text-slate-700 mb-1">Class *</label>
                  <select id="classSelect" required className="input-field" value={form.class} onChange={e => setForm({...form,class:e.target.value})}>
                    <option value="">Select Class…</option>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="parentName" className="block text-sm font-medium text-slate-700 mb-1">Parent / Guardian *</label>
                  <input id="parentName" type="text" required maxLength={150} placeholder="Parent's name"
                    className="input-field" value={form.parent_name} onChange={e => setForm({...form,parent_name:e.target.value})} />
                </div>
                <div>
                  <label htmlFor="admPhone" className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                  <input id="admPhone" type="tel" required maxLength={20} placeholder="+91 98765 43210"
                    className="input-field" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} />
                </div>
              </div>
              <div>
                <label htmlFor="admEmail" className="block text-sm font-medium text-slate-700 mb-1">Email (optional)</label>
                <input id="admEmail" type="email" maxLength={200} placeholder="your@email.com"
                  className="input-field" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
              </div>
              <div>
                <label htmlFor="admMessage" className="block text-sm font-medium text-slate-700 mb-1">Message (optional)</label>
                <textarea id="admMessage" rows={3} maxLength={600} placeholder="Any specific query or requirement…"
                  className="input-field resize-none" value={form.message} onChange={e => setForm({...form,message:e.target.value})} />
              </div>
              <button type="submit" disabled={submitting}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed py-4 text-base font-bold">
                {submitting ? <Loader2 size={18} className="animate-spin"/> : <Send size={18}/>}
                {submitting ? 'Submitting…' : 'Submit Enquiry'}
              </button>
              {msg && (
                <p className={`text-sm rounded-xl px-4 py-3 text-center ${msg.type==='success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {msg.text}
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
