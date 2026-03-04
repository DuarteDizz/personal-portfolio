import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { usePortfolioData } from '@/content/usePortfolioData';
import ProjectCard from '@/Components/portfolio/ProjectCard';
import ProjectModal from '@/Components/portfolio/ProjectModal';
import { preloadImages, isRenderableImageSrc } from '@/utils/imagePreload';

const parseProjectIdFromHash = (hash) => {
  if (!hash) return null;
  const raw = String(hash).replace('#', '');
  if (!raw.startsWith('project-')) return null;
  return raw.slice('project-'.length);
};

export default function Projects() {
  const location = useLocation();
  const { t } = useTranslation();

  // Localized portfolio content tied to navbar language
  const { projects, projectTags } = usePortfolioData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [highlightId, setHighlightId] = useState(null);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const title = (project?.title || '').toLowerCase();
      const desc = (project?.shortDescription || project?.description || '').toLowerCase();
      const stack = Array.isArray(project?.techStack) ? project.techStack : [];
      const tags = Array.isArray(project?.tags) ? project.tags : [];

      const matchesSearch =
        q === '' ||
        title.includes(q) ||
        desc.includes(q) ||
        stack.some((tech) => String(tech).toLowerCase().includes(q));

      const matchesTags =
        selectedTags.length === 0 || selectedTags.some((tag) => tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  useEffect(() => {
    const aboveTheFoldImages = filteredProjects
      .map((project) => (Array.isArray(project?.images) ? project.images.find(isRenderableImageSrc) : null))
      .filter(Boolean);

    preloadImages(aboveTheFoldImages, { limit: 6 });
  }, [filteredProjects]);

  // ✅ Handle navigation from Home: /projects#project-{id} + state.openProjectId
  useEffect(() => {
    const stateId = location?.state?.openProjectId;
    const hashId = parseProjectIdFromHash(location?.hash);
    const targetId = stateId ?? hashId;

    if (!targetId) return;

    // Make sure the project is visible
    setSearchQuery('');
    setSelectedTags([]);

    const idStr = String(targetId);

    const scrollAndHighlight = () => {
      const el = document.getElementById(`project-${idStr}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setHighlightId(idStr);
        window.setTimeout(() => setHighlightId(null), 1800);
      }
    };

    // Slight delay to let AnimatePresence/layout render the list
    const t1 = window.setTimeout(() => {
      requestAnimationFrame(scrollAndHighlight);

      // ✅ Only auto-open modal when coming from Home via router state
      if (stateId) {
        const p = projects.find((x) => String(x.id) === idStr);
        if (p) window.setTimeout(() => setSelectedProject(p), 320);
      }
    }, 60);

    return () => window.clearTimeout(t1);
  }, [location?.key, location?.hash, location?.state]);

  return (
    <div className="min-h-screen">
      {/* Editorial backdrop */}
      <section className="relative overflow-hidden pt-24 md:pt-28 pb-16">
        <div className="absolute inset-0 bg-white dark:bg-slate-950" />

        {/* Glow */}
        <div
          aria-hidden
          className="absolute -top-56 -right-56 w-[900px] h-[900px] rounded-full blur-3xl bg-cyan-500/10 dark:bg-cyan-400/10"
        />
        <div
          aria-hidden
          className="absolute -bottom-72 -left-72 w-[980px] h-[980px] rounded-full blur-3xl bg-teal-500/10 dark:bg-teal-400/9"
        />

        {/* Grain */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.05] pointer-events-none mix-blend-multiply dark:mix-blend-screen"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")"
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400">
              {t('projects.badge')}
            </p>
            <h1 className="mt-2 text-4xl md:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[0.95]">
            {t('projects.title')}
            </h1>
            <p className="mt-5 text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {t('projects.subtitle')}
            </p>
          </motion.div>

          {/* ✅ Search and Filters (OLD LOOK kept) */}
          <motion.div
            className="mb-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder={t('projects.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2">
              {projectTags.slice(0, 10).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
                  className={`cursor-pointer transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                    {t(`projectTags.${tag}`, { defaultValue: tag })}
                </Badge>
              ))}
            </div>

            {/* Active filters */}
            {(searchQuery || selectedTags.length > 0) && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-slate-500">
                {t('projects.count', { count: filteredProjects.length })}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  {t('common.clearFilters')}
                </Button>
              </div>
            )}
          </motion.div>

          {/* Gallery grid (portfolio-ish) */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7" initial="initial" animate="animate">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                const idStr = String(project.id);
                const isHighlighted = highlightId === idStr;

                return (
                  <motion.div
                    key={project.id}
                    id={`project-${idStr}`}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 18 }}
                    transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.03 }}
                    className={[
                      'scroll-mt-28',
                      isHighlighted
                        ? 'rounded-3xl ring-2 ring-cyan-400/60 dark:ring-cyan-400/25 ring-offset-4 ring-offset-white dark:ring-offset-slate-950 transition'
                        : ''
                    ].join(' ')}
                  >
                    <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/35 backdrop-blur-md p-10 text-center"
            >
              <Filter className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('projects.noResultsTitle')}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">{t('projects.noResultsSubtitle')}</p>
              <Button variant="outline" onClick={clearFilters}>
                {t('projects.clearAllFilters')}
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}