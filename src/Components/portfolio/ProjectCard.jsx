import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, BookOpen, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/Components/ui/badge.jsx';
import { useTranslation } from 'react-i18next';
import { preloadImages, isRenderableImageSrc } from '@/utils/imagePreload';

const isRenderableLink = (href) => typeof href === 'string' && href.trim().length > 0 && href.trim() !== '#';

export default function ProjectCard({ project, onClick }) {
  const { t } = useTranslation();

  const imageSources = useMemo(
    () => (Array.isArray(project?.images) ? project.images.filter(isRenderableImageSrc) : []),
    [project?.images]
  );

  const handlePreloadGallery = () => {
    if (imageSources.length === 0) return;
    preloadImages(imageSources, { limit: Math.min(imageSources.length, 4) });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 cursor-pointer"
      onClick={onClick}
      onMouseEnter={handlePreloadGallery}
      onFocus={handlePreloadGallery}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
        {imageSources[0] ? (
          <img
            src={imageSources[0]}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isRenderableLink(project.links?.github) && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
              aria-label={t('projectCard.aria.github')}
              title={t('projectCard.titles.github')}
            >
              <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </a>
          )}
          {isRenderableLink(project.links?.demo) && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
              aria-label={t('projectCard.aria.demo')}
              title={t('projectCard.titles.demo')}
            >
              <ExternalLink className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </a>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
          <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors flex-shrink-0" />
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{project.shortDescription}</p>

        <div className="mb-4 p-3 bg-gradient-to-r from-cyan-500/5 to-teal-500/5 rounded-lg border border-cyan-500/10">
          <p className="text-sm text-cyan-700 dark:text-cyan-300 font-medium">📈 {project.impactStatement}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-normal"
            >
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 4 && (
            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-normal">
              +{project.techStack.length - 4}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
