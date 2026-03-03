import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Search,
  X,
  Code,
  Settings,
  Brain,
  Cpu,
  Sparkles,
  Database,
  BarChart3,
  Cloud,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePortfolioData } from '@/content/usePortfolioData';
import { useTranslation } from 'react-i18next'


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

const parseCategoryFromHash = (hash) => {
  if (!hash) return null;
  const raw = String(hash).replace('#', '').trim();
  if (!raw) return null;
  if (!raw.startsWith('cat-')) return null;
  return decodeURIComponent(raw.slice('cat-'.length));
};

export default function Skills() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();

  // Localized portfolio content (skills/projects) tied to the navbar language
  const { skillsData, skillCategories, projects } = usePortfolioData();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);

  const listRef = useRef(null);

  const filteredSkills = useMemo(() => {
    let result = skillsData;

    if (selectedCategory !== 'All') {
      result = result.filter((skill) => skill.category === selectedCategory);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (skill) =>
          (skill.name || '').toLowerCase().includes(q) ||
          (skill.description || '').toLowerCase().includes(q) ||
          (skill.highlights || []).some((h) => String(h).toLowerCase().includes(q))
      );
    }

    return result;
  }, [skillsData, selectedCategory, searchQuery]);

  const categoryLabel = (cat) => {
    if (!cat) return '';
    return t(`skillCategories.${cat}`, { defaultValue: cat });
  };

  const levelLabel = (level) => {
    if (!level) return '';
    const key = String(level).trim().toLowerCase();
    return t(`skillLevels.${key}`, { defaultValue: level });
  };

  const grouped = useMemo(() => {
    const byCat = new Map();
    for (const s of filteredSkills) {
      const cat = s.category || 'Other';
      if (!byCat.has(cat)) byCat.set(cat, []);
      byCat.get(cat).push(s);
    }

    const ordered = [];
    const allCats = selectedCategory === 'All' ? skillCategories : [selectedCategory];
    for (const c of allCats) {
      if (byCat.has(c)) ordered.push([c, byCat.get(c)]);
    }
    for (const [c, arr] of byCat.entries()) {
      if (!ordered.find(([k]) => k === c)) ordered.push([c, arr]);
    }
    return ordered;
  }, [filteredSkills, selectedCategory]);

  const getRelatedProjects = (skillProjectIds) => {
    if (!skillProjectIds || skillProjectIds.length === 0) return [];
    const idSet = new Set(skillProjectIds.map((id) => String(id)));
    return projects.filter((p) => idSet.has(String(p.id)));
  };

  // Optional: allow linking into a category via hash: /skills#cat-Data%20Engineering
  useEffect(() => {
    const cat = parseCategoryFromHash(location?.hash);
    if (!cat) return;
    if (cat === 'All' || skillCategories.includes(cat)) {
      setSelectedCategory(cat);
      setSearchQuery('');
      requestAnimationFrame(() =>
        listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    }
  }, [location?.key, location?.hash]);

  const headlineMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' }
      };

  return (
    <div className="min-h-screen py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header (portfolio/editorial) */}
        <motion.div className="mb-14" {...headlineMotion}>
          <div className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              {t('skills.badge')}
            </span>
          </div>

          <h1 className="mt-4 font-black tracking-tight text-slate-950 dark:text-white leading-[0.95] text-[2.6rem] md:text-[3.6rem] lg:text-[4.2rem]">
            {t('skills.headline')}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
            {t('skills.lede')}
          </p>

          <div className="mt-10 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
        </motion.div>

        {/* Search + mobile category dropdown */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder={t('skills.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label={t('skills.search.clearAria')}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category dropdown for smaller screens */}
            <div className="md:w-72 lg:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-12 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-slate-900 dark:text-slate-100 font-medium"
                aria-label={t('skills.categorySelectAria')}
              >
                <option value="All">{t('skills.filters.all')}</option>
                {skillCategories.map((c) => (
                  <option key={c} value={c}>
                    {categoryLabel(c)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Portfolio layout: Category rail + editorial list */}
        <div className="grid lg:grid-cols-12 gap-10" ref={listRef}>
          {/* Left rail (desktop filters) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-3">
              <p className="text-xs font-black tracking-[0.22em] text-slate-400 dark:text-slate-600">
                {t('skills.categoriesLabel')}
              </p>

              <div className="rounded-[1.5rem] border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={[
                    'w-full text-left px-5 py-4 flex items-center justify-between',
                    selectedCategory === 'All'
                      ? 'bg-gradient-to-r from-cyan-500/10 to-teal-500/10'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/40 transition'
                  ].join(' ')}
                >
                  <span className="font-semibold text-slate-900 dark:text-white">{t('skills.filters.all')}</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {skillsData.length}
                  </span>
                </button>

                {skillCategories.map((cat) => {
                  const Icon = categoryIcons[cat] || Code;
                  const count = skillsData.filter((s) => s.category === cat).length;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={[
                        'w-full text-left px-5 py-4 flex items-center gap-3 justify-between border-t border-slate-200/70 dark:border-slate-800/70',
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-cyan-500/10 to-teal-500/10'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-900/40 transition'
                      ].join(' ')}
                    >
                      <span className="inline-flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200/60 dark:border-slate-800/60">
                          <Icon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white truncate">{categoryLabel(cat)}</span>
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right: editorial index list */}
          <section className="lg:col-span-9">
            <div className="space-y-10">
              {grouped.map(([cat, arr]) => {
                const Icon = categoryIcons[cat] || Code;

                return (
                  <div key={cat} className="border-t border-slate-200 dark:border-slate-800 pt-8">
                    <div className="flex items-end justify-between gap-6 mb-6">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-slate-800 dark:text-slate-200" />
                          </span>
                          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                            {categoryLabel(cat)}
                          </h2>
                        </div>
                        <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">
                          {t('skills.categoryItemCount', { count: arr.length })}
                        </p>
                      </div>

                      <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {t('skills.clickHint')} <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="divide-y divide-slate-200/70 dark:divide-slate-800/70 rounded-[1.5rem] border border-slate-200/70 dark:border-slate-800/70 overflow-hidden bg-white dark:bg-slate-950">
                      <AnimatePresence initial={false} mode="popLayout">
                        {arr.map((skill, idx) => {
                          const SkillIcon = categoryIcons[skill.category] || Code;
                          const proofCount = Array.isArray(skill.relatedProjectIds)
                            ? skill.relatedProjectIds.length
                            : 0;

                          return (
                            <motion.button
                              key={`${skill.category}-${skill.name}`}
                              type="button"
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ delay: Math.min(idx * 0.02, 0.2) }}
                              onClick={() => setSelectedSkill(skill)}
                              className="w-full text-left px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition group"
                              aria-haspopup="dialog"
                            >
                              <div className="flex items-start gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/15 dark:border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                  <SkillIcon className="w-6 h-6 text-cyan-700 dark:text-cyan-300" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                      <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-950 dark:text-white truncate">
                                        {skill.name}
                                      </h3>
                                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                                        {skill.description}
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      {skill.level && (
                                        <Badge variant="secondary" className="rounded-full">
                                          {levelLabel(skill.level)}
                                        </Badge>
                                      )}
                                      {proofCount > 0 && (
                                        <Badge
                                          variant="secondary"
                                          className="rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800/70"
                                        >
                                      {t('skills.projectsCountLabel', { count: proofCount })}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  {Array.isArray(skill.highlights) && skill.highlights.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {skill.highlights.slice(0, 4).map((h, i) => (
                                        <span
                                          key={i}
                                          className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/60"
                                        >
                                          {h}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <ArrowUpRight className="w-5 h-5 text-slate-300 dark:text-slate-700 group-hover:text-cyan-500 transition mt-1" />
                              </div>
                            </motion.button>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty state */}
            {filteredSkills.length === 0 && (
              <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-4 border border-slate-200/70 dark:border-slate-800/70">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{t('skills.empty.title')}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">{t('skills.empty.subtitle')}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                >{t('skills.empty.cta')}</Button>
              </motion.div>
            )}
          </section>
        </div>
      </div>

      {/* Skill Sheet (portfolio-style modal) */}
      <AnimatePresence>
        {selectedSkill && (
          <SkillSheet
            skill={selectedSkill}
            onClose={() => setSelectedSkill(null)}
            getRelatedProjects={getRelatedProjects}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SkillSheet({ skill, onClose, getRelatedProjects }) {
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef(null);
  const { t } = useTranslation();

  const categoryLabel = (cat) => {
    if (!cat) return '';
    return t(`skillCategories.${cat}`, { defaultValue: cat });
  };

  const levelLabel = (level) => {
    if (!level) return '';
    const key = String(level).trim().toLowerCase();
    return t(`skillLevels.${key}`, { defaultValue: level });
  };

  const Icon = categoryIcons[skill.category] || Code;

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow || '';
    };
  }, [onClose]);

  const related = Array.isArray(skill.relatedProjectIds) ? getRelatedProjects(skill.relatedProjectIds) : [];

  const modalMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 18 },
        transition: { duration: 0.45, ease: 'easeOut' }
      };

  return (
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

      {/* Sheet */}
      <motion.div
        {...modalMotion}
        role="dialog"
        aria-modal="true"
        aria-label={t('skills.modal.ariaWithName', { name: skill.name })}
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
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-teal-500/8" />
          <div className="relative px-6 md:px-8 py-5 border-b border-slate-200/70 dark:border-slate-800/70">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
                    {t('skills.modal.kicker')}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <span>{categoryLabel(skill.category)}</span>
                </div>

                <h2 className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-slate-950 dark:text-white leading-tight truncate">
                  {skill.name}
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {skill.level && (
                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                      {levelLabel(skill.level)}
                    </Badge>
                  )}
                  {related.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800/70 px-3 py-1"
                    >{t('skills.usedInProjectsCount', { count: related.length })}</Badge>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-100 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                aria-label={t('skills.modal.closeAria')}
                title={t('skills.modal.closeTitle')}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-8 py-8">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Left */}
            <div className="lg:col-span-7">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/15 dark:border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-cyan-700 dark:text-cyan-300" />
                </div>
                <div>
                  <p className="text-xs font-black tracking-[0.22em] text-slate-400 dark:text-slate-600">
                    {t('skills.modal.sections.overview')}
                  </p>
                  <p className="mt-2 text-[1.02rem] leading-relaxed text-slate-700 dark:text-slate-300">
                    {skill.description}
                  </p>
                </div>
              </div>

              {Array.isArray(skill.highlights) && skill.highlights.length > 0 && (
                <div className="mb-10">
                  <p className="text-xs font-black tracking-[0.22em] text-slate-400 dark:text-slate-600 mb-3">
                    {t('skills.modal.sections.focusAreas')}
                  </p>
                  <ul className="space-y-3">
                    {skill.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex-shrink-0" />
                        <span className="leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
                </div>
              )}

              {related.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-black tracking-[0.22em] text-slate-400 dark:text-slate-600 mb-4">
                    {t('skills.modal.sections.proof')}
                  </p>
                  <div className="space-y-3">
                    {related.map((p) => (
                      <Link
                        key={p.id}
                        to={createPageUrl('Projects')}
                        state={{ openProjectId: String(p.id) }}
                        onClick={onClose}
                        className="block p-5 rounded-[1.25rem] border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-extrabold tracking-tight text-slate-950 dark:text-white truncate">
                              {p.title}
                            </p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                              {p.shortDescription}
                            </p>
                          </div>
                          <ExternalLink className="w-5 h-5 text-slate-300 dark:text-slate-700 group-hover:text-cyan-500 transition flex-shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right */}
            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-6 space-y-6">
                <div className="rounded-[1.5rem] border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md p-6">
                  <p className="text-sm font-extrabold tracking-tight text-slate-950 dark:text-white mb-3">
                    {t('skills.modal.right.howShowsTitle')}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {t('skills.modal.right.howShowsBody')}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                      {t('skills.modal.right.chips.production')}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                      {t('skills.modal.right.chips.interfaces')}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                      {t('skills.modal.right.chips.evidence')}
                    </span>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200/70 dark:border-slate-800/70 bg-gradient-to-br from-cyan-500/8 via-transparent to-teal-500/8 p-6">
                  <p className="text-sm font-extrabold tracking-tight text-slate-950 dark:text-white">
                    {t('skills.modal.right.smallSignalTitle')}
                  </p>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {t('skills.modal.right.smallSignalBody')}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </motion.div>
    </>
  );
}
