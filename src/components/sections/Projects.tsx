'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github, Tag, ChevronRight, FolderCode } from 'lucide-react';
import { projectsMeta } from '@/lib/data';
import { cn } from '@/lib/utils';

type ProjectMeta = (typeof projectsMeta)[0];

type TranslatedProjectItem = {
  description: string;
  longDescription: string;
  metrics: string[];
};

type Project = ProjectMeta & TranslatedProjectItem & { title: string };

const projectTitles = ['Phronesis', 'Secure File Sync', 'Centurion', 'Emotisphere', 'KB Connector Tool', 'CryptoRealityCheck'];

const categoryColors: Record<string, string> = {
  'Mobile App & AI/ML': 'from-purple-500/20 to-blue-500/20 border-purple-500/30',
  'Systems Programming & Security': 'from-red-500/20 to-orange-500/20 border-red-500/30',
  'Data Analytics & AI/ML': 'from-sunset-orange/20 to-sunset-gold/20 border-sunset-orange/30',
  'Data Visualization & Go': 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30',
  'Data Manipulation & Integration': 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  'Data Science & Sentiment Analysis': 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-sunset-orange/80 border border-sunset-orange/30 rounded-full px-3 py-1 bg-sunset-orange/5">
      {children}
    </span>
  );
}
const staggerDelay = ['delay-0', 'delay-100', 'delay-200', 'delay-100', 'delay-200', 'delay-300'];

function ProjectCard({
  project,
  index,
  visible,
  expanded,
  onToggle,
}: {
  project: Project;
  index: number;
  visible: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations('projects');
  const color = categoryColors[project.subtitle] || 'from-sunset-orange/20 to-sunset-gold/20 border-sunset-orange/30';

  return (
    <button
      onClick={onToggle}
      className={cn(
        'group relative w-full text-left glass rounded-2xl border overflow-hidden',
        'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-sunset-orange/10',
        'transition-all duration-300 cursor-pointer',
        project.highlight ? 'border-sunset-orange/25' : 'border-white/8 hover:border-sunset-orange/20',
        visible ? 'animate-fade-in-up' : 'opacity-0',
        staggerDelay[index] ?? ''
      )}
    >
      <div className={cn('h-1 w-full bg-gradient-to-r', color)} />

      <div className="p-6">
        {project.highlight && (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-sunset-orange bg-sunset-orange/10 border border-sunset-orange/30 rounded-full px-2.5 py-0.5 mb-3">
            ★ Featured
          </span>
        )}

        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-sand-warm group-hover:text-sunset-orange transition-colors">
              {project.title}
            </h3>
            <p className="text-xs text-sunset-orange/70 mt-0.5">{project.subtitle}</p>
          </div>
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-sunset-orange/10 border border-sunset-orange/25 flex items-center justify-center text-sunset-orange group-hover:bg-sunset-orange group-hover:text-white transition-all duration-200">
            <FolderCode size={15} />
          </div>
        </div>

        <p className="mt-3 text-sm text-sand-warm/60 leading-relaxed line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-0.5 rounded-full bg-ocean-mid/60 border border-white/8 text-sand-warm/55"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-ocean-mid/60 border border-white/8 text-sand-warm/40">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/8">
          <span className="text-xs font-mono text-sand-warm/35">{project.date}</span>
          <span className="text-xs text-sunset-orange/70 group-hover:text-sunset-orange flex items-center gap-1 transition-colors">
            {expanded ? t('close') : t('view_github')}
            <ChevronRight size={11} className={cn('transition-transform', expanded && 'group-hover:translate-x-0.5')} />
          </span>
        </div>

        {expanded && (
          <div className="mt-4 space-y-5">
            <p className="text-sm text-sand-warm/75 leading-relaxed">{project.longDescription}</p>

            {project.metrics.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-sunset-orange/70 mb-3 flex items-center gap-2">
                  <ChevronRight size={12} /> {t('highlights_label')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.metrics.map((m) => (
                    <div key={m} className="glass rounded-xl px-3 py-2.5 border border-white/8">
                      <span className="text-xs sm:text-sm text-sand-warm/80">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-sunset-orange/70 mb-3 flex items-center gap-2">
                <Tag size={12} /> {t('tech_label')}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-ocean-mid border border-white/10 text-sand-warm/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-1 flex items-center gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sunset-orange/15 border border-sunset-orange/40 text-sunset-orange text-sm font-medium hover:bg-sunset-orange hover:text-white transition-all duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github size={14} />
                  {t('view_github')}
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

export default function Projects() {
  const t = useTranslations('projects');
  const tRoot = useTranslations();
  const translatedItems = tRoot.raw('projectItems') as TranslatedProjectItem[];
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' });
  const isGridInView = useInView(gridRef, { once: true, margin: '-60px' });

  const projects: Project[] = projectsMeta.map((meta, i) => ({
    ...meta,
    title: projectTitles[i] ?? meta.id,
    ...(translatedItems[i] ?? { description: '', longDescription: '', metrics: [] }),
  }));

  return (
    <section id="projects" className="cv-auto relative py-24 px-4 sm:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12 max-w-2xl"
      >
        <SectionLabel>
          <FolderCode size={11} />
          {t('title')}
        </SectionLabel>
        <h2 className="mt-4 text-3xl sm:text-4xl font-display font-bold text-sand-warm">
          {t('title')}
        </h2>
        <p className="mt-3 text-sand-warm/55 text-base leading-relaxed">
          {t('subtitle')}
        </p>
      </motion.div>

      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            visible={isGridInView}
            expanded={expandedId === project.id}
            onToggle={() =>
              setExpandedId((current) => (current === project.id ? null : project.id))
            }
          />
        ))}
      </div>
    </section>
  );
}
