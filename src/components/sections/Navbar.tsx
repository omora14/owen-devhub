'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import ResumeLink from '@/components/ResumeLink';

const navLinks = [
  { key: 'about', href: '#about' },
  { key: 'experience', href: '#experience' },
  { key: 'projects', href: '#projects' },
  { key: 'contact', href: '#contact' },
];

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 30);
        const sections = ['about', 'experience', 'projects', 'contact'];
        const current = sections.find((id) => {
          const el = document.getElementById(id);
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        });
        setActiveSection(current || '');
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'es' : 'en';
    router.push(`/${nextLocale}`);
  };

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 animate-nav-in',
          scrolled
            ? 'bg-ocean-deep/90 backdrop-blur-sm border-b border-white/10 shadow-2xl shadow-black/50'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group"
          >
            <span
              className={cn(
                'text-xl font-display font-bold transition-colors duration-200',
                scrolled ? 'text-sunset-orange' : 'text-sand-warm'
              )}
            >
              Owen
            </span>
            <span
              className={cn(
                'text-sm font-mono group-hover:text-sunset-orange transition-colors duration-200',
                scrolled ? 'text-sand-warm/70' : 'text-sand-warm/90'
              )}
            >
              - DevHub
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ key, href }) => (
              <button
                key={key}
                onClick={() => scrollTo(href)}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  activeSection === key
                    ? 'text-sunset-orange'
                    : 'text-sand-warm/70 hover:text-sand-warm'
                )}
              >
                {t(key)}
                {activeSection === key && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-sunset-orange/10 border border-sunset-orange/30"
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 text-sm text-sand-warm/70 hover:text-sand-warm hover:border-sunset-orange/40 hover:bg-sunset-orange/10 transition-all duration-200"
              aria-label="Switch language"
            >
              <Globe size={13} />
              <span className="font-mono uppercase text-xs tracking-widest">
                {locale === 'en' ? 'ES' : 'EN'}
              </span>
            </button>

            {/* Resume button (desktop) */}
            <ResumeLink
              locale={locale}
              className={cn(
                'hidden md:flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                scrolled
                  ? 'bg-sunset-orange/15 border border-sunset-orange/40 text-sunset-orange hover:bg-sunset-orange hover:text-white'
                  : 'bg-ocean-deep/70 border border-white/20 text-sand-warm hover:bg-ocean-deep/90 hover:border-white/30'
              )}
            >
              {t('resume')}
            </ResumeLink>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-sand-warm/70 hover:text-sand-warm hover:bg-white/5 transition-all"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-16 z-40 bg-ocean-deep/95 backdrop-blur-sm border-b border-white/10 shadow-2xl md:hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-2">
              {navLinks.map(({ key, href }) => (
                <button
                  key={key}
                  onClick={() => scrollTo(href)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                    activeSection === key
                      ? 'text-sunset-orange bg-sunset-orange/10 border border-sunset-orange/30'
                      : 'text-sand-warm/80 hover:text-sand-warm hover:bg-white/5'
                  )}
                >
                  {t(key)}
                </button>
              ))}
              <div className="mt-2 pt-4 border-t border-white/10">
                <ResumeLink
                  locale={locale}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-sunset-orange/15 border border-sunset-orange/40 text-sunset-orange text-sm font-medium hover:bg-sunset-orange hover:text-white transition-all duration-200"
                >
                  {t('resume')}
                </ResumeLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
