// Home.jsx (Portfolio editorial style — not SaaS)
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Download, Github, Linkedin, ChevronRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { usePortfolioData } from '@/content/usePortfolioData';
import ProjectCard from '@/Components/portfolio/ProjectCard';
import SkillsLoopStrip from '@/Components/portfolio/SkillsLoopStrip';
import TerminalHeroCard from '@/Components/portfolio/TerminalHeroCard';


import HeroNetworkBackground from '@/Components/portfolio/HeroNetworkBackground';

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut' }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } }
};

export default function Home() {
  const { t } = useTranslation();  const navigate = useNavigate();

  // Localized portfolio content tied to navbar language
  const { profile, hero, projects } = usePortfolioData();

  // CTAs are content (and therefore language-specific) — keep labels/destinations in portfolioData.en/pt.js
  const primaryCta = hero?.ctas?.find((c) => c.variant === 'primary') || hero?.ctas?.[0];
  const secondaryCta = hero?.ctas?.find((c) => c.variant === 'secondary') || hero?.ctas?.[1];

  const resolveCta = (cta) => {
    if (!cta) return null;
    if (cta.page) return { kind: 'internal', to: createPageUrl(cta.page), label: cta.label };
    if (cta.url) return { kind: 'external', href: cta.url, label: cta.label, external: cta.external !== false };
    return null;
  };

  const primaryResolved = resolveCta(primaryCta);
  const secondaryResolved = resolveCta(secondaryCta);

  // Signature line (fully controlled via src/content/portfolioData.*.js)
  const signature = hero?.signature;
  const sigBeforeLocation = signature?.beforeLocation ?? 'Based in';
  const sigAfterLocation = signature?.afterLocation ?? 'Available for roles in';
  const sigRoles = signature?.roles ?? 'Data / Analytics / AI';
  const sigLocationSeparator = signature?.locationSeparator ?? '.';
  const sigRolesSuffix = signature?.rolesSuffix ?? '.';



  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  const socials = [
    { key: 'linkedin', url: profile?.social?.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { key: 'github', url: profile?.social?.github, label: 'GitHub', Icon: Github }
  ].filter((s) => !!s.url);

  const goToProject = (projectId) => {
    if (!projectId) return;
    navigate(`${createPageUrl('Projects')}#project-${projectId}`, {
      state: { openProjectId: projectId }
    });
  };

  const onProjectRowClick = (e, projectId) => {
    // If user clicked an actual interactive element inside the card, don't hijack it.
    const target = e?.target;
    if (target && typeof target.closest === 'function') {
      const interactive = target.closest('a,button,[role="button"],[data-no-row-nav="true"]');
      if (interactive) return;
    }
    goToProject(projectId);
  };

  const onProjectRowKeyDown = (e, projectId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToProject(projectId);
    }
  };

  return (
    <div className="min-h-screen">
      {/* HERO (editorial, bold typography, minimal chrome) */}
      <section className="relative overflow-hidden pt-28 md:pt-36 pb-16 md:pb-20">
        {/* Base */}
        <div className="absolute inset-0 bg-white dark:bg-slate-950" />

        {/* Art direction: glow + grain + subtle line */}
        <div
          aria-hidden
          className="absolute -top-56 -right-56 w-[900px] h-[900px] rounded-full blur-3xl bg-cyan-500/12 dark:bg-cyan-400/10"
        />
        <div
          aria-hidden
          className="absolute -bottom-72 -left-72 w-[980px] h-[980px] rounded-full blur-3xl bg-teal-500/10 dark:bg-teal-400/9"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.05] pointer-events-none mix-blend-multiply dark:mix-blend-screen"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")"
          }}
        />
        <div
          aria-hidden
          className="absolute left-0 right-0 top-[70%] h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-slate-700/60"
        />

        {/* Keep your network background but let it be subtle art */}
        <HeroNetworkBackground />

        <div className="relative max-w-[92rem] mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* LEFT: Big editorial copy */}
            <motion.div variants={stagger} initial="initial" animate="animate" className="lg:col-span-7">
              {/* Small label */}
              <motion.div variants={fade} className="mb-8">
                <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300">
                  <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
                  {profile?.status}
                </span>
              </motion.div>

              {/* Headline: typography-led */}
              <motion.h1
                variants={fade}
                className="text-[2.75rem] md:text-[4.25rem] lg:text-[5.2rem] font-black tracking-tight leading-[0.95] text-slate-950 dark:text-white"
              >
                {profile?.title}
              </motion.h1>

              {/* Subhead: calm, confident */}
              <motion.p
                variants={fade}
                className="mt-8 text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-300 max-w-2xl"
              >
                {profile?.tagline}
              </motion.p>

              {/* Micro proof: fewer, stronger */}
              {Array.isArray(hero?.proofBullets) && hero.proofBullets.length > 0 && (
                <motion.ul variants={fade} className="mt-8 space-y-3 text-slate-700 dark:text-slate-300 max-w-2xl">
				  {hero.proofBullets.slice(0, 3).map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex-shrink-0" />
                      <span className="text-[0.98rem] leading-relaxed">{b}</span>
                    </li>
			  ))}
                </motion.ul>
              )}

              {/* CTAs: no SaaS buttons — more “studio” */}
              <motion.div variants={fade} className="mt-10 flex flex-wrap items-center gap-4">

                {/* Primary */}
                {primaryResolved && (
                  primaryResolved.kind === 'internal' ? (
                    <Link
                      to={primaryResolved.to}
                      className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-extrabold tracking-tight hover:opacity-95 transition"
                    >
	                      {primaryResolved.label ?? ''}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    <a
                      href={primaryResolved.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-extrabold tracking-tight hover:opacity-95 transition"
                    >
	                      {primaryResolved.label ?? ''}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  )
	                )}

                {/* Secondary */}
                {secondaryResolved && (
                  secondaryResolved.kind === 'internal' ? (
                    <Link
                      to={secondaryResolved.to}
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-slate-300/80 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold tracking-tight hover:border-slate-400 dark:hover:border-slate-600 transition"
                    >
	                      {secondaryResolved.label ?? ''}
                      <Download className="w-4 h-4" />
                    </Link>
                  ) : (
                    <a
                      href={secondaryResolved.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-slate-300/80 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold tracking-tight hover:border-slate-400 dark:hover:border-slate-600 transition"
                    >
	                      {secondaryResolved.label ?? ''}
                      <Download className="w-4 h-4" />
                    </a>
                  )
	                )}

                {/* Socials: minimal */}
                {socials.length > 0 && (
                  <div className="flex items-center gap-2 ml-1">
                    {socials.map(({ key, url, label, Icon }) => (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${label}`}
                        title={label}
                        className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-slate-300/80 dark:border-slate-700 text-slate-900 dark:text-white hover:border-cyan-300/80 dark:hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-300 transition"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Signature line */}
              <motion.div variants={fade} className="mt-12">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {sigBeforeLocation}{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {profile?.location || '—'}
                  </span>
                  {sigLocationSeparator}{' '}
                  {sigAfterLocation}{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">{sigRoles}</span>
                  {sigRolesSuffix}
                </p>
              </motion.div>
            </motion.div>

            {/* RIGHT: Terminal — presented like an art object */}
            <motion.div
              variants={fade}
              initial="initial"
              animate="animate"
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Frame */}
                <div className="absolute -inset-4 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md" />
                <div className="relative">
                  <TerminalHeroCard
                  photoUrl={profile.photoUrl}
                  name={profile.name}
                  terminalTitle={hero?.terminal?.title || 'portfolio.py'}
                  codeLineTemplate={hero?.terminal?.codeLineTemplate || hero?.terminal?.codeLine || 'print("Hello World! My name is {{name}}.")'}
                  typingSpeedMs={hero?.terminal?.typingSpeedMs || 50}
                />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills strip can stay — it reads like a marquee */}
      <SkillsLoopStrip />

      {/* FEATURED PROJECTS (gallery vibe, less “cards grid”) */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400">
                Selected work
              </p>
              <h2 className="mt-2 text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                {t('home.featuredTitle')}
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">
                {t('home.featuredSubtitle')}
              </p>
            </div>

            <Link
              to={createPageUrl('Projects')}
              className="hidden md:inline-flex items-center gap-2 text-slate-900 dark:text-white font-extrabold tracking-tight hover:text-cyan-600 dark:hover:text-cyan-300 transition"
            >
              {t('home.viewAllProjects')}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="space-y-6">
            {featuredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="border-t border-slate-200 dark:border-slate-800 pt-6"
              >
                {/* Clickable row -> navigates to Projects + focuses the same project */}
                <div
                  role="link"
                  tabIndex={0}
                  aria-label={`Open project: ${project.title || 'Project'}`}
                  onClick={(e) => onProjectRowClick(e, project.id)}
                  onKeyDown={(e) => onProjectRowKeyDown(e, project.id)}
                  className="cursor-pointer rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
                >
                  <ProjectCard project={project} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link
              to={createPageUrl('Projects')}
              className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-extrabold tracking-tight"
            >
              {t('home.viewAllProjects')}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
