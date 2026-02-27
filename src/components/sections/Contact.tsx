'use client';

import { useRef, useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Send, Download, CheckCircle, AlertCircle, Mail, MessageSquare } from 'lucide-react';
import emailjs from '@emailjs/browser';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-sunset-orange/80 border border-sunset-orange/30 rounded-full px-3 py-1 bg-sunset-orange/5">
      {children}
    </span>
  );
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const t = useTranslations('contact');
  const headerRef = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' });

  const [status, setStatus] = useState<FormStatus>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus('sending');

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

    try {
      await Promise.all([
        // Auto-reply to the sender (template uses {{name}}, {{email}}, {{message}})
        emailjs.sendForm(
          serviceId,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          formRef.current,
          publicKey
        ),
        // Notification to your inbox (template uses {{from_name}}, {{reply_to}}, {{message}})
        emailjs.send(
          serviceId,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_TWO_ID!,
          {
            from_name: form.name,
            reply_to: form.email,
            message: form.message,
          },
          publicKey
        ),
      ]);

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="cv-auto relative py-24 px-4 sm:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-14 text-center max-w-2xl mx-auto"
      >
        <SectionLabel>
          <Mail size={11} />
          Contact
        </SectionLabel>
        <h2 className="mt-4 text-3xl sm:text-4xl font-display font-bold text-sand-warm">
          {t('title')}
        </h2>
        <p className="mt-3 text-sand-warm/55 text-base leading-relaxed">
          {t('subtitle')}
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="md:col-span-3"
        >
          <form ref={formRef} onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8 border border-white/10 space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-sand-warm/70 mb-2">
                {t('name_label')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder={t('name_placeholder')}
                className="w-full px-4 py-3 rounded-xl bg-ocean-mid/50 border border-white/10 text-sand-warm placeholder-sand-warm/30 text-sm focus:outline-none focus:border-sunset-orange/50 focus:bg-ocean-mid/70 transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-sand-warm/70 mb-2">
                {t('email_label')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder={t('email_placeholder')}
                className="w-full px-4 py-3 rounded-xl bg-ocean-mid/50 border border-white/10 text-sand-warm placeholder-sand-warm/30 text-sm focus:outline-none focus:border-sunset-orange/50 focus:bg-ocean-mid/70 transition-all duration-200"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-sand-warm/70 mb-2">
                {t('message_label')}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={handleChange}
                placeholder={t('message_placeholder')}
                className="w-full px-4 py-3 rounded-xl bg-ocean-mid/50 border border-white/10 text-sand-warm placeholder-sand-warm/30 text-sm focus:outline-none focus:border-sunset-orange/50 focus:bg-ocean-mid/70 transition-all duration-200 resize-none"
              />
            </div>

            {/* Status message */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm"
              >
                <CheckCircle size={16} />
                {t('success')}
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                <AlertCircle size={16} />
                {t('error')}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'sending' || status === 'success'}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sunset-orange to-sunset-flame text-white font-semibold text-sm shadow-lg shadow-sunset-orange/25 hover:shadow-sunset-orange/40 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
            >
              {status === 'sending' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('sending')}
                </>
              ) : (
                <>
                  <Send size={15} />
                  {t('send')}
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Side panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="md:col-span-2 flex flex-col gap-5"
        >
          {/* Quick reply note */}
          <div className="glass rounded-2xl p-6 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-sunset-orange/15 border border-sunset-orange/30 flex items-center justify-center text-sunset-orange mb-4">
              <MessageSquare size={18} />
            </div>
            <h3 className="text-base font-semibold text-sand-warm mb-2">Fast responses</h3>
            <p className="text-sm text-sand-warm/55 leading-relaxed">
              I typically respond within 24 hours. Don&apos;t hesitate to reach out — I&apos;m always open to discussing new projects, ideas, or opportunities.
            </p>
          </div>

          {/* Resume CTA */}
          <div className="glass rounded-2xl p-6 border border-white/10">
            <p className="text-sm text-sand-warm/60 leading-relaxed mb-4">
              {t('resume_cta')}
            </p>
            <a
              href="/Owen-Morales-Resume.pdf"
              download
              className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-sunset-orange/12 border border-sunset-orange/35 text-sunset-orange text-sm font-medium hover:bg-sunset-orange hover:text-white transition-all duration-200"
            >
              <Download size={15} />
              {t('resume_button')}
            </a>
          </div>

          {/* Social links */}
          <div className="glass rounded-2xl p-6 border border-white/10">
            <p className="text-xs font-mono uppercase tracking-widest text-sand-warm/40 mb-4">Connect</p>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/omora14"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/8 text-sand-warm/65 text-sm hover:border-sunset-orange/30 hover:text-sunset-orange hover:bg-sunset-orange/5 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                github.com/omora14
              </a>
              <a
                href="https://linkedin.com/in/moralow"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/8 text-sand-warm/65 text-sm hover:border-sunset-orange/30 hover:text-sunset-orange hover:bg-sunset-orange/5 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                linkedin.com/in/moralow
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
