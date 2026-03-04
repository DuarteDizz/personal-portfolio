// SkillsLoopStrip.jsx (Editorial / portfolio tape style)
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { ChevronRight, Code, Settings, Brain, Cpu, Sparkles, Database, BarChart3, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { createPageUrl } from '@/utils';
import { usePortfolioData } from '@/content/usePortfolioData';
import useElementVisibility from '@/hooks/useElementVisibility';
import useDeferredActivation from '@/hooks/useDeferredActivation';

const categoryIcons = {
  Programming: Code,
  'Data Engineering': Settings,
  Databases: Database,
  'Machine Learning': Brain,
  'Deep Learning': Cpu,
  'Generative AI': Sparkles,
  'Visualization & BI': BarChart3,
  'Cloud & MLOps': Cloud
};

const safeCategoryLabel = (t, raw) => {
  if (!raw) return '';
  const translated = t(`skillCategories.${raw}`, { defaultValue: raw });
  return translated || raw;
};

const normalizeLoopX = (value, width) => {
  if (!width || !Number.isFinite(value)) return 0;

  let next = value;
  const min = -width * 2;
  const max = 0;

  while (next <= min) next += width;
  while (next > max) next -= width;

  return next;
};

const SkillStripCard = memo(function SkillStripCard({
  skill,
  index,
  baseLen,
  t,
  draggingRef
}) {
  const Icon = categoryIcons[skill.category] || Code;
  const isDuplicate = index >= baseLen;
  const tags = Array.isArray(skill.tags) ? skill.tags.slice(0, 3) : [];

  return (
    <Link
      to={createPageUrl('Skills')}
      tabIndex={isDuplicate ? -1 : 0}
      aria-hidden={isDuplicate ? true : undefined}
      aria-label={isDuplicate ? undefined : t('skillsLoopStrip.aria.openSkillsCard', { name: skill.name })}
      title={isDuplicate ? undefined : t('skillsLoopStrip.titles.openSkillsCard')}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      onClick={(e) => {
        if (draggingRef.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className={[
        'group flex-shrink-0 w-[340px] md:w-[380px]',
        'rounded-2xl border border-slate-200/80 dark:border-slate-800',
        'bg-white dark:bg-slate-950',
        'px-5 py-5',
        'transition-colors duration-200',
        'hover:border-cyan-300/70 dark:hover:border-cyan-500/30'
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
            {skill.name}
          </h3>
          <p className="mt-1 text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
            {safeCategoryLabel(t, skill.category)}
          </p>
        </div>

        <div className="flex-shrink-0 w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
          <Icon className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors" />
        </div>
      </div>

      {skill.description && (
        <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 line-clamp-2">
          {skill.description}
        </p>
      )}

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={[
                'px-2.5 py-1 rounded-full text-[11px] font-semibold',
                'border border-slate-200 dark:border-slate-800',
                'text-slate-700 dark:text-slate-300',
                'group-hover:border-cyan-300/60 dark:group-hover:border-cyan-500/25',
                'transition-colors duration-200'
              ].join(' ')}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs font-bold tracking-tight text-slate-500 dark:text-slate-400">
        <span className="inline-block w-8 h-px bg-slate-200 dark:bg-slate-800" />
        {t('skillsLoopStrip.openSkills')}
      </div>
    </Link>
  );
});

export default function SkillsLoopStrip() {
  const { t } = useTranslation();
  const { skillsData } = usePortfolioData();

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const draggingRef = useRef(false);
  const rafRef = useRef(null);
  const lastFrameRef = useRef(0);

  const [scrollWidth, setScrollWidth] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const trackHydrationReady = useDeferredActivation({ minDelayMs: 180, timeoutMs: 900 });
  const shouldPrepareTrack = useElementVisibility(sectionRef, {
    threshold: 0.01,
    rootMargin: '280px 0px',
    once: true
  });
  const isInView = useElementVisibility(sectionRef, { threshold: 0.2, rootMargin: '120px 0px' });
  const x = useMotionValue(0);

  const LOOP_DURATION_SECONDS = 120;
  const baseLen = skillsData.length;
  const isTrackActive = trackHydrationReady && shouldPrepareTrack;

  const previewSkills = useMemo(
    () => skillsData.slice(0, Math.min(4, baseLen)),
    [baseLen, skillsData]
  );

  const displaySkills = useMemo(
    () => (isTrackActive ? [...skillsData, ...skillsData, ...skillsData] : []),
    [isTrackActive, skillsData]
  );

  useEffect(() => {
    if (!isTrackActive) return;

    const node = scrollRef.current;
    if (!node) return;

    const update = () => {
      const width = Math.round(node.scrollWidth / 3);
      setScrollWidth((prev) => (prev === width ? prev : width));
    };

    update();

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => update())
      : null;

    resizeObserver?.observe(node);
    window.addEventListener('resize', update, { passive: true });

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [displaySkills, isTrackActive]);

  useEffect(() => {
    if (!isTrackActive || !scrollWidth) return;

    const current = x.get();
    if (!Number.isFinite(current) || Math.abs(current) < 0.5) {
      x.set(-scrollWidth);
      return;
    }

    x.set(normalizeLoopX(current, scrollWidth));
  }, [isTrackActive, scrollWidth, x]);

  const shouldAutoplay = isTrackActive && !shouldReduceMotion && !isHovered && !isDragging && isInView && scrollWidth > 0;

  useEffect(() => {
    if (!shouldAutoplay) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastFrameRef.current = 0;
      return;
    }

    const pixelsPerSecond = scrollWidth / LOOP_DURATION_SECONDS;

    const tick = (timestamp) => {
      const last = lastFrameRef.current || timestamp;
      const deltaMs = Math.min(timestamp - last, 40);
      lastFrameRef.current = timestamp;

      const next = normalizeLoopX(x.get() - (pixelsPerSecond * deltaMs) / 1000, scrollWidth);
      x.set(next);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastFrameRef.current = 0;
    };
  }, [LOOP_DURATION_SECONDS, scrollWidth, shouldAutoplay, x]);

  const handleDragStart = useCallback(() => {
    draggingRef.current = true;
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    x.set(normalizeLoopX(x.get(), scrollWidth));
    setIsDragging(false);
    requestAnimationFrame(() => {
      draggingRef.current = false;
    });
  }, [scrollWidth, x]);

  const cards = useMemo(
    () => displaySkills.map((skill, index) => (
      <SkillStripCard
        key={`${skill.name}-${index}`}
        skill={skill}
        index={index}
        baseLen={baseLen}
        t={t}
        draggingRef={draggingRef}
      />
    )),
    [baseLen, displaySkills, t]
  );

  const previewCards = useMemo(
    () => previewSkills.map((skill, index) => (
      <SkillStripCard
        key={`${skill.name}-preview-${index}`}
        skill={skill}
        index={index}
        baseLen={previewSkills.length}
        t={t}
        draggingRef={draggingRef}
      />
    )),
    [previewSkills, t]
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-14 md:py-16 bg-white dark:bg-slate-950"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '560px' }}
    >
      <div
        aria-hidden
        className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800"
      />

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.05] pointer-events-none mix-blend-multiply dark:mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")"
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 mb-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400">
              {t('skillsLoopStrip.kicker')}
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {t('skillsLoopStrip.title')}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
              {t('skillsLoopStrip.subtitle')}
            </p>
          </div>

          <Link
            to={createPageUrl('Skills')}
            aria-label={t('skillsLoopStrip.aria.viewSkills')}
            title={t('skillsLoopStrip.titles.viewSkills')}
            className="hidden md:inline-flex items-center gap-2 text-slate-900 dark:text-white font-extrabold tracking-tight hover:text-cyan-600 dark:hover:text-cyan-300 transition"
          >
            {t('skillsLoopStrip.cta')}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={() => setIsHovered(true)}
        onBlurCapture={(e) => {
          const next = e.relatedTarget;
          if (!next || !e.currentTarget.contains(next)) setIsHovered(false);
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />

        {isTrackActive ? (
          <motion.div
            ref={scrollRef}
            className="flex gap-4 px-6 cursor-grab active:cursor-grabbing transform-gpu"
            style={{ x, touchAction: 'pan-y', willChange: 'transform' }}
            drag="x"
            dragConstraints={{ left: -scrollWidth * 2, right: 0 }}
            dragElastic={0.04}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {cards}
          </motion.div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 px-6 overflow-hidden transform-gpu"
            style={{ willChange: 'auto' }}
          >
            {previewCards}
          </div>
        )}
      </div>

      <div className="mt-8 text-center md:hidden px-6">
        <Link
          to={createPageUrl('Skills')}
          aria-label={t('skillsLoopStrip.aria.viewSkills')}
          title={t('skillsLoopStrip.titles.viewSkills')}
          className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-extrabold tracking-tight"
        >
          {t('skillsLoopStrip.cta')}
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      <p
        className={[
          'relative text-center text-xs text-slate-500 dark:text-slate-400 mt-7',
          'transition-opacity duration-200',
          isHovered ? 'opacity-100' : 'opacity-[0.65]'
        ].join(' ')}
      >
        {isHovered ? t('skillsLoopStrip.hint.hovered') : t('skillsLoopStrip.hint.idle')}
      </p>

      <div
        aria-hidden
        className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800"
      />
    </section>
  );
}
