'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, Download, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import { education } from '@/lib/data';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-sunset-orange/80 border border-sunset-orange/30 rounded-full px-3 py-1 bg-sunset-orange/5">
      {children}
    </span>
  );
}

export default function About() {
  const t = useTranslations('about');
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(triggerRef, { once: true, margin: '-80px' });

  return (
    <section id="about" className="relative py-24 px-4 sm:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto">
      <div ref={triggerRef}>
        {/* Top row: label + toggle button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
        >
          <div>
            <SectionLabel>{t('label')}</SectionLabel>
            <p className="mt-3 text-sand-warm/50 text-sm max-w-md">
              {open ? '' : 'A Software Engineer & Data Scientist building products that matter.'}
            </p>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-sand-warm/70 text-sm font-medium hover:border-sunset-orange/40 hover:text-sunset-orange hover:bg-sunset-orange/8 transition-all duration-300 self-start sm:self-auto"
          >
            {open ? t('toggle_hide') : t('toggle_show')}
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={15} />
            </motion.span>
          </button>
        </motion.div>

        {/* Education — always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={14} className="text-sunset-orange/70" />
            <span className="text-xs font-mono uppercase tracking-widest text-sand-warm/40">{t('education_label')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {education.map((edu) => (
              <div key={edu.degree} className="glass rounded-xl p-4 border border-white/8 hover:border-sunset-orange/20 transition-all duration-300">
                <div className="text-sm font-semibold text-sand-warm">{edu.degree}</div>
                <div className="text-xs text-sunset-orange/80 mt-0.5">{edu.school}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-sand-warm/50">{edu.period}</span>
                  <span className="text-xs font-mono bg-sunset-orange/15 text-sunset-orange px-2 py-0.5 rounded-full">
                    GPA {edu.gpa}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Expandable story section */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: 20 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-10 pt-4"
              >
                {/* Photo */}
                <div className="lg:col-span-2 flex flex-col items-center gap-6">
                  <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-3xl overflow-hidden border-2 border-sunset-orange/25 shadow-2xl shadow-sunset-orange/10 glow-orange">
                    <Image
                      src="/pp.jpg"
                      alt={t('photo_alt')}
                      fill
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-sm font-semibold text-sand-warm">Owen Morales</p>
                      <p className="text-xs text-sunset-orange">Software Engineer & Data Scientist</p>
                    </div>
                  </div>
                </div>

                {/* Story text */}
                <div className="lg:col-span-3 flex flex-col gap-5">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-sand-warm leading-snug">
                    {t('title')}
                  </h2>
                  {(['p1', 'p2', 'p3', 'p4'] as const).map((key, i) => (
                    <motion.p
                      key={key}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                      className="text-sand-warm/70 text-base leading-relaxed"
                    >
                      {t(key)}
                    </motion.p>
                  ))}

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65, duration: 0.5 }}
                    className="pt-2"
                  >
                    <a
                      href="/Owen-Morales-Resume.pdf"
                      download
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sunset-orange to-sunset-flame text-white font-semibold text-sm shadow-lg shadow-sunset-orange/25 hover:shadow-sunset-orange/40 hover:scale-[1.03] transition-all duration-300"
                    >
                      <Download size={15} />
                      Download Resume
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
