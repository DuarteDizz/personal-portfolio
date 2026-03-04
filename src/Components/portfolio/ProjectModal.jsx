import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  X,
  Github,
  ExternalLink,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  Wrench,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon
} from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { usePortfolioData } from '@/content/usePortfolioData';
import { useTranslation } from 'react-i18next';

const hasText = (v) => typeof v === 'string' && v.trim().length > 0;
const hasContent = (v) =>
  hasText(v) ||
  (Array.isArray(v) && v.some((item) => typeof item === 'string' && item.trim().length > 0));

const parseProjectId = (v) => (v === null || v === undefined ? '' : String(v));

export default function ProjectModal({ project, onClose }) {
  const { t } = useTranslation();
  const { projects: allProjects } = usePortfolioData();
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef(null);
  const touchStartXRef = useRef(null);

  // Local navigation (Prev/Next) without needing parent state changes
  const [activeProject, setActiveProject] = useState(project ?? null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveProject(project ?? null);
    setActiveImageIndex(0);
    setIsGalleryOpen(false);
  }, [project]);

  const data = useMemo(() => {
    if (!activeProject) return null;

    return {
      id: activeProject.id,
      title: activeProject.title,
      tags: Array.isArray(activeProject.tags) ? activeProject.tags : [],
      techStack: Array.isArray(activeProject.techStack) ? activeProject.techStack : [],
      images: Array.isArray(activeProject.images)
        ? activeProject.images.filter((src) => typeof src === 'string' && src.trim().length > 0)
        : [],
      impactStatement: activeProject.impactStatement,
      metrics: Array.isArray(activeProject.metrics) ? activeProject.metrics : [],
      problem: activeProject.problem,
      approach: activeProject.approach,
      results: activeProject.results,
      whatIdImprove: activeProject.whatIdImprove,
      reproducibility: activeProject.reproducibility,
      links: activeProject.links || {}
    };
  }, [activeProject]);

  const imageCount = data?.images?.length ?? 0;
  const safeImageIndex = imageCount ? Math.min(activeImageIndex, imageCount - 1) : 0;
  const heroMedia = imageCount ? data.images[safeImageIndex] : null;
  const canNavigateImages = imageCount > 1;

  const nav = useMemo(() => {
    if (!data) return { prev: null, next: null };

    const ids = allProjects.map((p) => parseProjectId(p.id));
    const idx = ids.indexOf(parseProjectId(data.id));

    const prev = idx > 0 ? allProjects[idx - 1] : null;
    const next = idx >= 0 && idx < allProjects.length - 1 ? allProjects[idx + 1] : null;

    return { prev, next };
  }, [allProjects, data]);

  useEffect(() => {
    if (!imageCount) {
      if (activeImageIndex !== 0) setActiveImageIndex(0);
      if (isGalleryOpen) setIsGalleryOpen(false);
      return;
    }

    if (activeImageIndex > imageCount - 1) {
      setActiveImageIndex(imageCount - 1);
    }
  }, [activeImageIndex, imageCount, isGalleryOpen]);

  useEffect(() => {
    if (!imageCount || typeof window === 'undefined') return;

    const preloadIndexes = [safeImageIndex];
    if (imageCount > 1) {
      preloadIndexes.push((safeImageIndex + 1) % imageCount, (safeImageIndex - 1 + imageCount) % imageCount);
    }

    preloadIndexes.forEach((index) => {
      const src = data?.images?.[index];
      if (!src) return;
      const img = new window.Image();
      img.src = src;
    });
  }, [data, imageCount, safeImageIndex]);

  const resetScrollTop = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    });
  }, []);

  const goToProject = useCallback(
    (p) => {
      if (!p) return;
      setActiveProject(p);
      setActiveImageIndex(0);
      setIsGalleryOpen(false);
      resetScrollTop();
    },
    [resetScrollTop]
  );

  const openGallery = useCallback(
    (index = 0) => {
      if (!imageCount) return;
      const boundedIndex = Math.max(0, Math.min(index, imageCount - 1));
      setActiveImageIndex(boundedIndex);
      setIsGalleryOpen(true);
    },
    [imageCount]
  );

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
  }, []);

  const showPrevImage = useCallback(() => {
    if (!imageCount) return;
    setActiveImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
  }, [imageCount]);

  const showNextImage = useCallback(() => {
    if (!imageCount) return;
    setActiveImageIndex((prev) => (prev + 1) % imageCount);
  }, [imageCount]);

  const handleGalleryTouchStart = useCallback((e) => {
    touchStartXRef.current = e.changedTouches?.[0]?.clientX ?? null;
  }, []);

  const handleGalleryTouchEnd = useCallback(
    (e) => {
      if (!canNavigateImages) {
        touchStartXRef.current = null;
        return;
      }

      const startX = touchStartXRef.current;
      const endX = e.changedTouches?.[0]?.clientX ?? null;
      touchStartXRef.current = null;

      if (startX === null || endX === null) return;

      const deltaX = endX - startX;
      if (Math.abs(deltaX) < 40) return;

      if (deltaX < 0) {
        showNextImage();
      } else {
        showPrevImage();
      }
    },
    [canNavigateImages, showNextImage, showPrevImage]
  );

  // ESC to close + arrow keys to navigate + lock body scroll while open + reset scroll
  useEffect(() => {
    if (!data) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isGalleryOpen) {
          e.preventDefault();
          closeGallery();
          return;
        }

        onClose?.();
        return;
      }

      // Avoid hijacking arrow keys when user is selecting text / etc.
      const tag = (e.target?.tagName || '').toLowerCase();
      const isTyping =
        tag === 'input' || tag === 'textarea' || e.target?.isContentEditable === true;

      if (isTyping) return;

      if (e.key === 'ArrowLeft') {
        if (isGalleryOpen) {
          e.preventDefault();
          if (canNavigateImages) showPrevImage();
          return;
        }

        if (nav.prev) {
          e.preventDefault();
          goToProject(nav.prev);
        }
      }

      if (e.key === 'ArrowRight') {
        if (isGalleryOpen) {
          e.preventDefault();
          if (canNavigateImages) showNextImage();
          return;
        }

        if (nav.next) {
          e.preventDefault();
          goToProject(nav.next);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    resetScrollTop();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow || '';
    };
  }, [
    canNavigateImages,
    closeGallery,
    data,
    goToProject,
    isGalleryOpen,
    nav.next,
    nav.prev,
    onClose,
    resetScrollTop,
    showNextImage,
    showPrevImage
  ]);

  if (!data) return null;

  const linkItems = [
    data.links?.github
      ? { key: 'github', label: t('projectModal.linkLabels.github'), href: data.links.github, Icon: Github }
      : null,
    data.links?.demo
      ? { key: 'demo', label: t('projectModal.linkLabels.demo'), href: data.links.demo, Icon: ExternalLink }
      : null,
    data.links?.blog
      ? { key: 'blog', label: t('projectModal.linkLabels.blog'), href: data.links.blog, Icon: BookOpen }
      : null
  ].filter(Boolean);

  const modalMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 18 },
        transition: { duration: 0.45, ease: 'easeOut' }
      };

  const galleryMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.98 },
        transition: { duration: 0.22, ease: 'easeOut' }
      };

  const galleryCountLabel = t('projectModal.gallery.count', {
    current: safeImageIndex + 1,
    total: imageCount
  });

  return (
    <AnimatePresence>
      {data && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-50"
            onClick={onClose}
            aria-hidden
          >
            <div className="absolute inset-0 bg-black/70" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10" />
            <div
              className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")"
              }}
            />
          </motion.div>

          {/* Dialog */}
          <motion.div
            {...modalMotion}
            role="dialog"
            aria-modal="true"
            aria-label={t('projectModal.aria.dialog', { title: data.title })}
            className={[
              'fixed z-50',
              'inset-4 md:inset-8 lg:inset-12',
              'rounded-[2rem] overflow-hidden',
              'bg-white dark:bg-slate-950',
              'border border-slate-200/70 dark:border-slate-800/70',
              'shadow-[0_30px_120px_-30px_rgba(0,0,0,0.55)]',
              'flex flex-col'
            ].join(' ')}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="relative">
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-teal-500/8"
              />
              <div className="relative px-6 md:px-8 py-5 border-b border-slate-200/70 dark:border-slate-800/70">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
                        {t('projectModal.caseStudy')}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">/</span>
                      <span className="inline-flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        {t('projectModal.selectedWork')}
                      </span>
                    </div>

                    <h2 className="mt-2 text-2xl md:text-3xl font-display font-black tracking-tight text-slate-950 dark:text-white leading-tight truncate">
                      {data.title}
                    </h2>

                    {data.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {data.tags.slice(0, 8).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800/70 rounded-full px-3 py-1"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Prev / Next project navigation */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-slate-700 dark:text-slate-100 hover:text-slate-950 dark:hover:text-white"
                      onClick={() => goToProject(nav.prev)}
                      disabled={!nav.prev}
                      aria-label={t('projectModal.aria.prev')}
                      title={t('projectModal.titles.prev')}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-slate-700 dark:text-slate-100 hover:text-slate-950 dark:hover:text-white"
                      onClick={() => goToProject(nav.next)}
                      disabled={!nav.next}
                      aria-label={t('projectModal.aria.next')}
                      title={t('projectModal.titles.next')}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="rounded-full text-slate-700 dark:text-slate-100 hover:text-slate-950 dark:hover:text-white"
                      aria-label={t('projectModal.aria.close')}
                      title={t('projectModal.titles.close')}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  {t('projectModal.tipPrefix')} <span className="font-semibold">←</span> /{' '}
                  <span className="font-semibold">→</span> {t('projectModal.tipNavigate')}{' '}
                  <span className="font-semibold">Esc</span> {t('projectModal.tipSuffix')}
                </div>
              </div>
            </div>

            {/* Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              {/* Hero media */}
              {heroMedia && (
                <div className="px-6 md:px-8 pt-6">
                  <figure className="rounded-[1.5rem] overflow-hidden border border-slate-200/70 dark:border-slate-800/70 bg-slate-100 dark:bg-slate-900">
                    <button
                      type="button"
                      onClick={() => openGallery(safeImageIndex)}
                      aria-label={t(
                        canNavigateImages ? 'projectModal.gallery.open' : 'projectModal.gallery.openSingle'
                      )}
                      className="group relative block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-inset"
                    >
                      <img
                        src={heroMedia}
                        alt={t('projectModal.gallery.imageAlt', {
                          title: data.title,
                          current: safeImageIndex + 1,
                          total: imageCount
                        })}
                        className="w-full h-[220px] md:h-[320px] object-cover cursor-zoom-in"
                        loading="lazy"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
                      />

                      <div className="absolute top-4 right-4 inline-flex items-center rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-semibold text-white">
                        {galleryCountLabel}
                      </div>

                      {hasText(data.impactStatement) && (
                        <figcaption className="absolute bottom-0 left-0 right-0 p-5 md:p-6 pointer-events-none">
                          <div className="max-w-3xl">
                            <p className="text-white/85 text-xs font-semibold tracking-wide mb-2">
                              {t('projectModal.impactLabel')}
                            </p>
                            <p className="text-white text-lg md:text-xl font-bold leading-snug">
                              {data.impactStatement}
                            </p>
                          </div>
                        </figcaption>
                      )}
                    </button>
                  </figure>
                </div>
              )}

              <div className="px-6 md:px-8 py-8">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
                  {/* LEFT: Story */}
                  <div className="lg:col-span-7">
                    {!heroMedia && hasText(data.impactStatement) && (
                      <div className="mb-8">
                        <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                          {t('projectModal.impactLabel')}
                        </p>
                        <p className="text-xl md:text-2xl font-display font-black tracking-tight text-slate-950 dark:text-white leading-snug">
                          {data.impactStatement}
                        </p>
                        <div className="mt-5 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
                      </div>
                    )}

                    <StorySection n="01" title={t('projectModal.sections.problem')} content={data.problem} />
                    <StorySection n="02" title={t('projectModal.sections.approach')} content={data.approach} />
                    <StorySection n="03" title={t('projectModal.sections.results')} content={data.results} />

                    {(hasContent(data.whatIdImprove) || hasContent(data.reproducibility)) && (
                      <div className="mt-10 pt-8 border-t border-slate-200/70 dark:border-slate-800/70 space-y-8">
                        {hasContent(data.whatIdImprove) && (
                          <StorySection n="04" title={t('projectModal.sections.improve')} content={data.whatIdImprove} />
                        )}
                        {hasContent(data.reproducibility) && (
                          <StorySection n="05" title={t('projectModal.sections.repro')} content={data.reproducibility} />
                        )}
                      </div>
                    )}
                  </div>

                  {/* RIGHT: Quick facts */}
                  <aside className="lg:col-span-5">
                    <div className="lg:sticky lg:top-6 space-y-6">
                      {/* Metrics */}
                      {data.metrics.length > 0 && (
                        <div className="rounded-[1.5rem] border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/50 backdrop-blur-md p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-4 h-4 text-cyan-700 dark:text-cyan-300" />
                            <h3 className="text-sm font-extrabold tracking-wide text-slate-950 dark:text-white">
                              {t('projectModal.quickMetrics')}
                            </h3>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {data.metrics.slice(0, 6).map((m, idx) => (
                              <div
                                key={idx}
                                className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 p-4"
                              >
                                <div className="text-xl font-black text-slate-950 dark:text-white leading-none">
                                  {m.value}
                                </div>
                                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                                  {m.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tech stack */}
                      {data.techStack.length > 0 && (
                        <div className="rounded-[1.5rem] border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/50 backdrop-blur-md p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Wrench className="w-4 h-4 text-teal-700 dark:text-teal-300" />
                            <h3 className="text-sm font-extrabold tracking-wide text-slate-950 dark:text-white">
                              {t('projectModal.stack')}
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {data.techStack.slice(0, 18).map((tech) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800/70 rounded-full px-3 py-1"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Links (single place; no top buttons) */}
                      {linkItems.length > 0 && (
                        <div className="rounded-[1.5rem] border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/50 backdrop-blur-md p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <LinkIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                            <h3 className="text-sm font-extrabold tracking-wide text-slate-950 dark:text-white">
                              {t('projectModal.links')}
                            </h3>
                          </div>

                          <div className="space-y-2">
                            {linkItems.map(({ key, href, label, Icon }) => (
                              <a
                                key={key}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 px-4 py-3 hover:border-cyan-300/70 dark:hover:border-cyan-500/25 transition"
                              >
                                <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                  <Icon className="w-4 h-4 text-slate-700 dark:text-slate-300 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition" />
                                  {label}
                                </span>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isGalleryOpen && heroMedia && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="fixed inset-0 z-[60] bg-slate-950/78 backdrop-blur-md"
                  onClick={closeGallery}
                  aria-hidden
                />

                <motion.div
                  {...galleryMotion}
                  className="fixed inset-0 z-[61] flex items-center justify-center p-3 md:p-8"
                  onClick={closeGallery}
                  role="dialog"
                  aria-modal="true"
                  aria-label={t('projectModal.gallery.aria', { title: data.title })}
                >
                  <div
                    className="relative"
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={handleGalleryTouchStart}
                    onTouchEnd={handleGalleryTouchEnd}
                  >
                    <img
                      src={heroMedia}
                      alt={t('projectModal.gallery.imageAlt', {
                        title: data.title,
                        current: safeImageIndex + 1,
                        total: imageCount
                      })}
                      className="block max-w-[96vw] max-h-[92vh] md:max-w-[94vw] md:max-h-[90vh] h-auto w-auto rounded-[1.75rem] object-contain shadow-[0_30px_120px_-40px_rgba(0,0,0,0.8)] select-none"
                      loading="eager"
                      decoding="async"
                      draggable={false}
                    />

                    <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-white/10" />

                    <div className="absolute top-3 left-3 md:top-4 md:left-4 inline-flex items-center rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur-sm">
                      {galleryCountLabel}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closeGallery}
                      className="absolute top-3 right-3 md:top-4 md:right-4 rounded-full border border-white/10 bg-slate-950/55 text-white/85 backdrop-blur-sm hover:bg-slate-950/72 hover:text-white"
                      aria-label={t('projectModal.gallery.closeLabel')}
                      title={t('projectModal.gallery.closeLabel')}
                    >
                      <X className="w-5 h-5" />
                    </Button>

                    {canNavigateImages && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={showPrevImage}
                          className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-slate-950/55 text-white backdrop-blur-sm hover:bg-slate-950/72 hover:text-white"
                          aria-label={t('projectModal.gallery.prevLabel')}
                          title={t('projectModal.gallery.prevLabel')}
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={showNextImage}
                          className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-slate-950/55 text-white backdrop-blur-sm hover:bg-slate-950/72 hover:text-white"
                          aria-label={t('projectModal.gallery.nextLabel')}
                          title={t('projectModal.gallery.nextLabel')}
                        >
                          <ChevronRight className="w-6 h-6" />
                        </Button>
                      </>
                    )}

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold text-white/75 backdrop-blur-sm">
                      {canNavigateImages ? (
                        <>
                          <span className="text-white/85">←</span> / <span className="text-white/85">→</span> {t('projectModal.gallery.navigateHint')} •{' '}
                          <span className="text-white/85">Esc</span> {t('projectModal.gallery.closeHint')}
                        </>
                      ) : (
                        <>
                          <span className="text-white/85">Esc</span> {t('projectModal.gallery.closeHint')}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

function StorySection({ n, title, content }) {
  if (!content) return null;

  const normalizedContent = Array.isArray(content)
    ? content.filter((item) => typeof item === 'string' && item.trim().length > 0)
    : content;
  const isList = Array.isArray(normalizedContent);

  if (isList && normalizedContent.length === 0) return null;
  if (!isList && !hasText(normalizedContent)) return null;

  // Subtle, premium accent (varies slightly by section number)
  const accentByN = {
    '01': 'from-cyan-500 to-teal-500',
    '02': 'from-teal-500 to-emerald-500',
    '03': 'from-sky-500 to-cyan-500',
    '04': 'from-violet-500 to-cyan-500',
    '05': 'from-slate-500 to-cyan-500'
  };
  const accent = accentByN[n] || 'from-cyan-500 to-teal-500';

  return (
    <section className="mb-10">
      <div className="grid grid-cols-[14px_1fr] gap-4">
        {/* Colored accent bar (the “little bit of color” on the left) */}
        <div className="pt-1">
          <div className={`w-[4px] h-10 rounded-full bg-gradient-to-b ${accent}`} aria-hidden />
        </div>

        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-black tracking-[0.25em] text-slate-400 dark:text-slate-600">
              {n}
            </span>
            <h3 className="text-xl md:text-2xl font-display font-black tracking-tight text-slate-950 dark:text-white">
              {title}
            </h3>
          </div>

          <div className="mt-4">
            {isList ? (
              <ul className="space-y-3">
                {normalizedContent.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <span
                      className={`mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${accent} flex-shrink-0`}
                      aria-hidden
                    />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[1.02rem]">
                {normalizedContent}
              </p>
            )}
          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
        </div>
      </div>
    </section>
  );
}
