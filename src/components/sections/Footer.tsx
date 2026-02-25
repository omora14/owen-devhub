'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Download, ExternalLink } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/8 bg-ocean-deep">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-sunset-orange/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-1">
            <div className="text-2xl font-display font-bold text-gradient mb-2">
              Owen Morales
            </div>
            <div className="text-sm font-mono text-sand-warm/40 mb-4">— DevHub</div>
            <p className="text-sm text-sand-warm/50 leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-sand-warm/35 mb-4">Navigate</p>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'About', href: '#about' },
                { label: 'Experience', href: '#experience' },
                { label: 'Projects', href: '#projects' },
                { label: 'Skills', href: '#skills' },
                { label: 'Contact', href: '#contact' },
              ].map(({ label, href }) => (
                <button
                  key={href}
                  onClick={() => {
                    const id = href.replace('#', '');
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-fit text-sm text-sand-warm/55 hover:text-sunset-orange transition-colors duration-200"
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-sand-warm/35 mb-4">Connect</p>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/omora14"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-sand-warm/55 hover:text-sunset-orange transition-colors duration-200 group"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub</span>
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="https://linkedin.com/in/moralow"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-sand-warm/55 hover:text-sunset-orange transition-colors duration-200 group"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span>LinkedIn</span>
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="/Owen-Morales-Resume.pdf"
                download
                className="flex items-center gap-2.5 text-sm text-sand-warm/55 hover:text-sunset-orange transition-colors duration-200 group"
              >
                <Download size={14} className="flex-shrink-0" />
                <span>Download Resume</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-white/8">
          <p className="text-xs text-sand-warm/30 font-mono">
            {t('copyright', { year })}
          </p>
          <p className="text-xs text-sand-warm/30">
            {t('made_with')}
          </p>
        </div>
      </div>
    </footer>
  );
}
