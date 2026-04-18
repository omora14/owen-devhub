'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronDown, Download, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import ResumeLink from '@/components/ResumeLink';

function Typewriter({ words }: { words: string[] }) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), 80);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), 45);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    }

    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words]);

  return (
    <span className="font-sans font-semibold text-sunset-flame">
      {displayed}
      <span className="cursor-blink text-sunset-orange ml-0.5">|</span>
    </span>
  );
}

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const roles = t.raw('roles') as string[];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.75);
        for (let x = 0; x <= canvas.width; x += 6) {
          const y =
            canvas.height * 0.75 +
            Math.sin(x * 0.008 + t + i * 1.2) * (15 + i * 10) +
            Math.sin(x * 0.015 + t * 0.7) * 8;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = `rgba(13, 31, 53, ${0.35 - i * 0.08})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    const onScroll = () => {
      cancelAnimationFrame(animId);
      clearTimeout(scrollTimeout);
      if (window.scrollY < window.innerHeight) {
        scrollTimeout = setTimeout(() => {
          animId = requestAnimationFrame(draw);
        }, 150);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    draw();
    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(scrollTimeout);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollDown = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/costarica-beach.webp"
          alt="Costa Rica Pacific Sunset"
          fill
          priority
          quality={75}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/40 via-ocean-deep/55 to-ocean-deep/98" />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/60 via-transparent to-ocean-deep/60" />
      </div>

      {/* Animated wave canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ willChange: 'transform' }}
      />

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center gap-6">
        {/* Greeting + Name */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <p className="text-sand-warm/60 text-lg sm:text-xl font-light mb-1">
            {t('greeting')}
          </p>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold text-sand-warm leading-tight">
            {t('name')}
          </h1>
        </motion.div>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-2xl sm:text-3xl lg:text-4xl min-h-[48px] flex items-center justify-center"
        >
          <Typewriter words={roles} />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-2"
        >
          <button
            onClick={scrollToProjects}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-sunset-orange to-sunset-flame text-white font-semibold text-sm shadow-lg shadow-sunset-orange/30 hover:shadow-sunset-orange/50 hover:scale-105 transition-all duration-300"
          >
            {t('cta_projects')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <ResumeLink
            locale={locale}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/25 text-sand-warm/85 font-semibold text-sm hover:border-sunset-orange/60 hover:text-sunset-orange hover:bg-sunset-orange/10 transition-all duration-300"
          >
            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
            {t('cta_resume')}
          </ResumeLink>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        onClick={scrollDown}
        className="absolute bottom-8 z-20 flex flex-col items-center gap-2 text-sand-warm/40 hover:text-sand-warm/70 transition-colors group"
      >
        <span className="text-xs tracking-widest uppercase font-mono">{t('scroll')}</span>
        <ChevronDown size={18} className="animate-bounce" />
      </motion.button>
    </section>
  );
}
