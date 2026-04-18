'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Tag, ChevronRight, FolderCode, X } from 'lucide-react';
import { projectsMeta } from '@/lib/data';
import { cn } from '@/lib/utils';

type ProjectMeta = (typeof projectsMeta)[0];

type TranslatedProjectItem = {
  description: string;
  longDescription: string;
  metrics: string[];
};

type Project = ProjectMeta & TranslatedProjectItem & { title: string };

const projectTitles = ['Phronesis', 'Secure File Sync', 'Centurion', 'Roomies Chore', 'Emotisphere', 'KB Connector Tool', 'Stardew Like', 'CryptoRealityCheck'];

const categoryColors: Record<string, string> = {
  'Mobile App & AI/ML': 'from-purple-500/20 to-blue-500/20 border-purple-500/30',
  'Systems Programming & Security': 'from-red-500/20 to-orange-500/20 border-red-500/30',
  'Data Analytics & AI/ML': 'from-sunset-orange/20 to-sunset-gold/20 border-sunset-orange/30',
  'Mobile App & Collaboration': 'from-sky-500/20 to-indigo-500/20 border-sky-500/30',
  'Data Visualization & Go': 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30',
  'Data Manipulation & Integration': 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  'Game Development & Godot': 'from-lime-500/20 to-emerald-500/20 border-lime-500/30',
  'Data Science & Sentiment Analysis': 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
};

const MD_MODAL_QUERY = '(min-width: 768px)';

function subscribeMdModal(onChange: () => void) {
  const mq = window.matchMedia(MD_MODAL_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getMdModalSnapshot() {
  return window.matchMedia(MD_MODAL_QUERY).matches;
}

function getMdModalServerSnapshot() {
  return false;
}

function useDesktopProjectModal() {
  return useSyncExternalStore(subscribeMdModal, getMdModalSnapshot, getMdModalServerSnapshot);
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-sunset-orange/80 border border-sunset-orange/30 rounded-full px-3 py-1 bg-sunset-orange/5">
      {children}
    </span>
  );
}

const staggerDelay = ['delay-0', 'delay-100', 'delay-200', 'delay-100', 'delay-200', 'delay-300', 'delay-100', 'delay-200'];

function ProjectDetailBody({ project, className }: { project: Project; className?: string }) {
  const t = useTranslations('projects');

  return (
    <div className={cn('space-y-5', className)}>
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
        {!project.github && (
          <p className="text-xs text-sand-warm/55">{t('private_notice')}</p>
        )}
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const t = useTranslations('projects');
  const color =
    categoryColors[project.subtitle] || 'from-sunset-orange/20 to-sunset-gold/20 border-sunset-orange/30';

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <button
        type="button"
        aria-label={t('close')}
        className="absolute inset-0 bg-ocean-deep/95"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
        className="relative z-10 w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-3xl border border-white/15 bg-ocean-navy shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            'h-1.5 w-full shrink-0 rounded-t-3xl bg-gradient-to-r',
            color.split(' ')[0],
            'via-sunset-orange/60',
            color.split(' ')[1]
          )}
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-xl p-2 text-sand-warm/50 transition-colors hover:bg-white/8 hover:text-sand-warm"
          aria-label={t('close')}
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8 pr-14">
          <span className="text-xs font-mono tracking-wider text-sunset-orange/70">{project.subtitle}</span>
          <h3 id="project-modal-title" className="mt-1 font-display text-2xl font-bold leading-tight text-sand-warm sm:text-3xl">
            {project.title}
          </h3>
          <p className="mt-1.5 font-mono text-sm text-sand-warm/40">{project.date}</p>
          <ProjectDetailBody project={project} className="mt-6" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({
  project,
  index,
  visible,
  expanded,
  isDesktop,
  isModalTarget,
  onToggle,
}: {
  project: Project;
  index: number;
  visible: boolean;
  expanded: boolean;
  isDesktop: boolean;
  isModalTarget: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations('projects');
  const color = categoryColors[project.subtitle] || 'from-sunset-orange/20 to-sunset-gold/20 border-sunset-orange/30';

  const footerLabel = isDesktop
    ? isModalTarget
      ? t('close')
      : t('details')
    : expanded
      ? t('close')
      : t('view_github');

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'group relative w-full text-left glass rounded-2xl border overflow-hidden sm:self-start',
        'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-sunset-orange/10',
        'transition-all duration-300 cursor-pointer',
        project.highlight ? 'border-sunset-orange/25' : 'border-white/8 hover:border-sunset-orange/20',
        visible ? 'animate-fade-in-up' : 'opacity-0',
        isDesktop && isModalTarget && 'ring-2 ring-sunset-orange/40 border-sunset-orange/35',
        staggerDelay[index] ?? ''
      )}
    >
      <div className={cn('h-1 w-full bg-gradient-to-r', color)} />

      <div className="p-6">
        {project.highlight && (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-sunset-orange bg-sunset-orange/10 border border-sunset-orange/30 rounded-full px-2.5 py-0.5 mb-3">
            {'\u2605'} Featured
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

        <p className="mt-3 text-sm text-sand-warm/60 leading-relaxed line-clamp-2">{project.description}</p>

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
            {footerLabel}
            <ChevronRight
              size={11}
              className={cn('transition-transform', (expanded || isModalTarget) && 'rotate-90')}
            />
          </span>
        </div>

        {expanded && !isDesktop && <ProjectDetailBody project={project} className="mt-4" />}
      </div>
    </button>
  );
}

export default function Projects() {
  const t = useTranslations('projects');
  const tRoot = useTranslations();
  const translatedItems = tRoot.raw('projectItems') as TranslatedProjectItem[];
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const isDesktop = useDesktopProjectModal();
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' });
  const isGridInView = useInView(gridRef, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!isDesktop) {
      setModalProject(null);
    } else {
      setExpandedId(null);
    }
  }, [isDesktop]);

  const projects: Project[] = projectsMeta.map((meta, i) => ({
    ...meta,
    title: projectTitles[i] ?? meta.id,
    ...(translatedItems[i] ?? { description: '', longDescription: '', metrics: [] }),
  }));

  const handleCardClick = (project: Project) => {
    if (isDesktop) {
      setModalProject((current) => (current?.id === project.id ? null : project));
    } else {
      setExpandedId((current) => (current === project.id ? null : project.id));
    }
  };

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto">
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

      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:items-start"
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            visible={isGridInView}
            isDesktop={isDesktop}
            isModalTarget={modalProject?.id === project.id}
            expanded={!isDesktop && expandedId === project.id}
            onToggle={() => handleCardClick(project)}
          />
        ))}
      </div>

      <AnimatePresence>
        {isDesktop && modalProject && (
          <ProjectModal key={modalProject.id} project={modalProject} onClose={() => setModalProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
