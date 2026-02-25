'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Briefcase, ChevronDown } from 'lucide-react';
import { experienceMeta } from '@/lib/data';
import { cn } from '@/lib/utils';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-sunset-orange/80 border border-sunset-orange/30 rounded-full px-3 py-1 bg-sunset-orange/5">
      {children}
    </span>
  );
}

type TranslatedItem = {
  title: string;
  company: string;
  bullets: string[];
};

function ExperienceCard({
  title,
  company,
  period,
  tags,
  bullets,
  index,
  isLast,
}: {
  title: string;
  company: string;
  period: string;
  tags: string[];
  bullets: string[];
  index: number;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="relative flex gap-6"
    >
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="relative z-10 w-10 h-10 rounded-full bg-ocean-navy border-2 border-sunset-orange/50 flex items-center justify-center shadow-lg shadow-sunset-orange/20">
          <Briefcase size={14} className="text-sunset-orange" />
        </div>
        {!isLast && (
          <div className="flex-1 w-px bg-gradient-to-b from-sunset-orange/30 to-transparent mt-2" />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 mb-8">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full text-left group"
        >
          <div className={cn(
            'glass rounded-2xl p-5 border transition-all duration-300',
            expanded
              ? 'border-sunset-orange/40 bg-sunset-orange/5'
              : 'border-white/8 hover:border-sunset-orange/25 hover:bg-white/3'
          )}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-sand-warm group-hover:text-sunset-orange transition-colors">
                  {title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-0.5">
                  <span className="text-sm text-sunset-orange/80 font-medium">{company}</span>
                  <span className="text-xs text-sand-warm/40 font-mono">{period}</span>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="flex-shrink-0 mt-1 text-sand-warm/40 group-hover:text-sunset-orange transition-colors"
              >
                <ChevronDown size={16} />
              </motion.div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-ocean-mid/60 border border-white/10 text-sand-warm/60"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Expanded bullets */}
            {expanded && (
              <motion.ul
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="mt-4 space-y-2 border-t border-white/8 pt-4"
              >
                {bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-sand-warm/70 leading-relaxed">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sunset-orange/70" />
                    {bullet}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
        </button>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const t = useTranslations('experience');
  const tRoot = useTranslations();
  const items = tRoot.raw('experienceItems') as TranslatedItem[];
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' });

  return (
    <section id="experience" className="relative py-24 px-4 sm:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto">
      {/* Ambient glow */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-sunset-orange/4 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-14 max-w-2xl"
      >
        <SectionLabel>
          <Briefcase size={11} />
          {t('title')}
        </SectionLabel>
        <h2 className="mt-4 text-3xl sm:text-4xl font-display font-bold text-sand-warm leading-tight">
          {t('title')}
        </h2>
        <p className="mt-3 text-sand-warm/55 text-base leading-relaxed">
          {t('subtitle')}
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="max-w-3xl">
        {experienceMeta.map((meta, i) => {
          const text = items[i] ?? { title: '', company: '', bullets: [] };
          return (
            <ExperienceCard
              key={meta.period + i}
              title={text.title}
              company={text.company}
              period={meta.period}
              tags={meta.tags}
              bullets={text.bullets}
              index={i}
              isLast={i === experienceMeta.length - 1}
            />
          );
        })}
      </div>
    </section>
  );
}
