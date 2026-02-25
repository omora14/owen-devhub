'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Code2, Layers, Server, BarChart3, Wrench } from 'lucide-react';
import { skills } from '@/lib/data';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-sunset-orange/80 border border-sunset-orange/30 rounded-full px-3 py-1 bg-sunset-orange/5">
      {children}
    </span>
  );
}

const categoryConfig = [
  {
    key: 'languages' as const,
    icon: Code2,
    color: 'text-purple-400 bg-purple-400/10 border-purple-400/25',
    badgeColor: 'bg-purple-500/10 border-purple-500/20 text-purple-300/80 hover:border-purple-400/50 hover:text-purple-200',
  },
  {
    key: 'frontend' as const,
    icon: Layers,
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/25',
    badgeColor: 'bg-blue-500/10 border-blue-500/20 text-blue-300/80 hover:border-blue-400/50 hover:text-blue-200',
  },
  {
    key: 'backend' as const,
    icon: Server,
    color: 'text-sunset-orange bg-sunset-orange/10 border-sunset-orange/25',
    badgeColor: 'bg-sunset-orange/10 border-sunset-orange/20 text-sunset-orange/80 hover:border-sunset-orange/50 hover:text-sunset-orange',
  },
  {
    key: 'data' as const,
    icon: BarChart3,
    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
    badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300/80 hover:border-emerald-400/50 hover:text-emerald-200',
  },
  {
    key: 'tools' as const,
    icon: Wrench,
    color: 'text-sunset-gold bg-sunset-gold/10 border-sunset-gold/25',
    badgeColor: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300/80 hover:border-yellow-400/50 hover:text-yellow-200',
  },
];

function SkillCategory({
  category,
  items,
  index,
}: {
  category: (typeof categoryConfig)[0];
  items: string[];
  index: number;
}) {
  const t = useTranslations('skills');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const Icon = category.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className="glass rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-all duration-300"
    >
      {/* Category header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${category.color}`}>
          <Icon size={15} />
        </div>
        <h3 className="text-sm font-semibold text-sand-warm/80 uppercase tracking-wider font-mono">
          {t(`categories.${category.key}`)}
        </h3>
      </div>

      {/* Skill badges */}
      <div className="flex flex-wrap gap-2">
        {items.map((skill, i) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, delay: index * 0.1 + i * 0.04 }}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-default ${category.badgeColor}`}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const t = useTranslations('skills');
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' });

  const allSkillsCount = Object.values(skills).flat().length;

  return (
    <section id="skills" className="relative py-24 px-4 sm:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto">
      {/* Ambient */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[500px] bg-purple-500/4 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div className="max-w-2xl">
          <SectionLabel>
            <Code2 size={11} />
            {t('title')}
          </SectionLabel>
          <h2 className="mt-4 text-3xl sm:text-4xl font-display font-bold text-sand-warm">
            {t('title')}
          </h2>
          <p className="mt-3 text-sand-warm/55 text-base leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-4xl font-display font-bold text-gradient">{allSkillsCount}+</div>
          <div className="text-xs text-sand-warm/40 font-mono mt-0.5">Technologies</div>
        </div>
      </motion.div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoryConfig.map((category, i) => (
          <SkillCategory
            key={category.key}
            category={category}
            items={skills[category.key]}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
