'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, User, Clock, Send, Loader2 } from 'lucide-react';

const INFO = [
  { icon: Phone, label: 'Call Us',       value: '+91 98717 49012',          href: 'tel:+919871749012',                 color: 'bg-blue-50   text-blue-600'   },
  { icon: Mail,  label: 'Email',         value: 'vidyacoachings1@gmail.com', href: 'mailto:vidyacoachings1@gmail.com',  color: 'bg-purple-50 text-purple-600' },
  { icon: User,  label: 'Founder',       value: 'Amarpal Saini',             href: null,                                color: 'bg-amber-50  text-amber-600'  },
  { icon: Clock, label: 'Working Hours', value: 'Mon – Sat: 8:00 AM – 8:00 PM', href: null,                            color: 'bg-green-50  text-green-600'  },
];

export default function ContactSection() {
  const [form, setForm] = useState({ name:'', phone:'', email:'', message:'' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{type:'success'|'error';text:string}|null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setMsg(null);
    try {
      const res = await fetch('/api/contact', {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) { setMsg({type:'success', text:"Message sent! We'll get back to you shortly."}); setForm({name:'',phone:'',email:'',message:''}); }
      else setMsg({type:'error', text: data.error ?? 'Something went wrong.'});
    } catch { setMsg({type:'error', text:'Network error. Please try again.'}); }
    finally { setSubmitting(false); }
  }

  return (
    <section id="contact" className="py-24 section-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Centred heading */}
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="section-header">
          <div className="accent-bar" />
          <h2 className="section-heading">Contact &amp; Location</h2>
          <p className="section-sub">Get in touch with us for admissions and enquiries</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INFO.map(({icon:Icon, label, value, href, color}, i) => (
              <motion.div
                key={label}
                initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}}
                transition={{delay: i * 0.1}}
                className="card flex items-start gap-4"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
                  {href
                    ? <a href={href} className="text-slate-900 font-semibold text-sm hover:text-amber-600 transition-colors break-all">{value}</a>
                    : <p className="text-slate-900 font-semibold text-sm">{value}</p>
                  }
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact form */}
          <motion.div
            initial={{opacity:0, x:30}} whileInView={{opacity:1, x:0}} viewport={{once:true}}
            transition={{duration:0.5}}
            className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                  <input id="contactName" type="text" required maxLength={150} placeholder="Your name"
                    className="input-field" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
                </div>
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                  <input id="contactPhone" type="tel" required maxLength={20} placeholder="+91 98765 43210"
                    className="input-field" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} />
                </div>
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 mb-1">Email (optional)</label>
                <input id="contactEmail" type="email" maxLength={200} placeholder="your@email.com"
                  className="input-field" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
              </div>
              <div>
                <label htmlFor="contactMessage" className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
                <textarea id="contactMessage" rows={4} required maxLength={600} placeholder="How can we help you?"
                  className="input-field resize-none" value={form.message} onChange={e => setForm({...form,message:e.target.value})} />
              </div>
              <button type="submit" disabled={submitting}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
                {submitting ? 'Sending…' : 'Send Message'}
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
