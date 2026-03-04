// About.jsx (premium portfolio — modern, audacious, professional)
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Mail,
  Briefcase,
  User,
  Settings,
  Heart,
  CheckCircle,
  Github,
  Linkedin,
  ArrowRight,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/Components/ui/badge';
import { createPageUrl } from '@/utils';
import { usePortfolioData } from '@/content/usePortfolioData';
import { useTranslation } from 'react-i18next';

import EducationCard from '@/Components/experience/EducationCard';
import TimelineCard from '@/Components/experience/TimelineCard';

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' },
  viewport: { once: true, amount: 0.25 }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true, amount: 0.2 }
};

const blockIcons = {
  user: User,
  briefcase: Briefcase,
  settings: Settings,
  heart: Heart
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function NavItem({ id, label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={[
        'w-full text-left px-3 py-2 rounded-xl transition flex items-center gap-3',
        'focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20',
        isActive
          ? 'bg-gradient-to-r from-cyan-500/12 to-teal-500/10 text-slate-950 dark:text-white border border-cyan-500/10'
          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
      ].join(' ')}
    >
      <motion.span
        aria-hidden
        className={[
          'w-2.5 h-2.5 rounded-full flex-shrink-0',
          isActive
            ? 'bg-gradient-to-r from-cyan-500 to-teal-500 shadow-[0_0_0_6px_rgba(34,211,238,0.08)] dark:shadow-[0_0_0_6px_rgba(34,211,238,0.06)]'
            : 'bg-slate-300 dark:bg-slate-700'
        ].join(' ')}
        animate={
          isActive
            ? { scale: [1, 1.35, 1], opacity: [1, 0.85, 1] }
            : { scale: 1, opacity: 1 }
        }
        transition={isActive ? { duration: 1.35, repeat: Infinity, ease: 'easeInOut' } : undefined}
      />
      <span className="font-semibold">{label}</span>
    </button>
  );
}

export default function About() {
  const { profile, skillsData, skillCategories, experience, aboutBlocks } = usePortfolioData();

  const { t, i18n } = useTranslation();
  const categoryLabel = (cat) => t(`skillCategories.${cat}`, { defaultValue: cat });

  const workExperience = useMemo(() => experience.filter((e) => e.type === 'work'), [experience]);
  const education = useMemo(() => experience.filter((e) => e.type === 'education'), [experience]);

  const [activeSection, setActiveSection] = useState('summary');

  // ✅ Resizable split (desktop)
  const splitRef = useRef(null);
  const draggingRef = useRef(false);
  const [splitPct, setSplitPct] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('about_timeline_split');
      if (saved) setSplitPct(clamp(parseFloat(saved), 30, 70));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('about_timeline_split', String(splitPct));
    } catch {}
  }, [splitPct]);

  const setFromClientX = (clientX) => {
    const el = splitRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = (x / rect.width) * 100;
    setSplitPct(clamp(pct, 30, 70));
  };

  const onDividerPointerDown = (e) => {
    e.preventDefault();
    draggingRef.current = true;
    setIsDragging(true);
    setFromClientX(e.clientX);
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current) return;
      setFromClientX(e.clientX);
    };
    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const onDividerKeyDown = (e) => {
    const step = e.shiftKey ? 5 : 2;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSplitPct((v) => clamp(v - step, 30, 70));
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSplitPct((v) => clamp(v + step, 30, 70));
    }
    if (e.key === 'Home') {
      e.preventDefault();
      setSplitPct(30);
    }
    if (e.key === 'End') {
      e.preventDefault();
      setSplitPct(70);
    }
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveSection(id);

    try {
      window.history.replaceState(null, '', `#${id}`);
    } catch {}

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Track section in view (for left nav highlight)
  useEffect(() => {
    const ids = ['summary', 'overview', 'skills', 'timeline'];
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { threshold: [0.2, 0.35, 0.5], rootMargin: '-10% 0px -70% 0px' }
    );

    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ✅ lightweight SEO helpers
  useEffect(() => {
    const siteName = profile?.name || 'Portfolio';
    document.title = `${t('navbar.about')} | ${siteName}`;

    const rawDesc =
      profile?.bio ||
      profile?.title ||
      t('about.metaDescriptionFallback', {
        defaultValue: 'Professional background, experience, skills and education.'
      });
    const desc = String(rawDesc).replace(/\s+/g, ' ').trim().slice(0, 155);

    const upsertMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    upsertMeta('description', desc);

    const schemaId = 'person-jsonld';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile?.name,
      jobTitle: profile?.title,
      image: profile?.photoUrl,
      email: profile?.email ? `mailto:${profile.email}` : undefined,
      address: profile?.location
        ? { '@type': 'PostalAddress', addressLocality: profile.location }
        : undefined,
      sameAs: [profile?.social?.linkedin || null, profile?.social?.github || null].filter(Boolean)
    };

    let script = document.getElementById(schemaId);
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = schemaId;
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(schema);
  }, [profile, i18n.language, t]);

  return (
    <div className="min-h-screen py-16 md:py-20 bg-white dark:bg-slate-950 relative overflow-x-clip">

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Editorial header */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="mb-10 md:mb-14"
        >

          <div className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                {t('navbar.about')}
              </span>
            </div>
          <div>

            <div className="grid lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-9">
                <h1 className="font-black tracking-tight text-slate-950 dark:text-white leading-[0.95] text-[2.6rem] md:text-[3.6rem] lg:text-[4.2rem]">
                  {profile?.name}
                </h1>
                <p className="mt-4 text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
                  {profile?.title}
                </p>
              </div>

              <div className="lg:col-span-3 flex lg:justify-end">
                <div className="flex flex-wrap gap-3" />
              </div>
            </div>

            <div className="mt-2 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
          </div>
        </motion.header>

        {/* MAIN LAYOUT */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          {/* LEFT STICKY PROFILE CARD */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div
                className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70
                bg-white/80 dark:bg-slate-900/70 backdrop-blur
                p-6 md:p-7 shadow-sm"
              >
                <div className="relative mb-6">
                  <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/30 to-teal-500/25 p-[2px]">
                    <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                      <img
                        src={profile?.photoUrl}
                        alt={profile?.name || t('about.profilePhotoAlt', { defaultValue: 'Profile photo' })}
                        className="w-full aspect-[4/5] object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  {profile?.location && (
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <MapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />
                      <span>{profile.location}</span>
                    </div>
                  )}

                  {profile?.email && (
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <Mail className="w-4 h-4 flex-shrink-0 text-slate-400" />
                      <a
                        href={`mailto:${profile.email}`}
                        className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors break-all"
                      >
                        {profile.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Contact + socials row */}
                <div className="mt-6 flex items-center gap-3">
                  <Link
                    to={createPageUrl('Contact')}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold
                      bg-gradient-to-r from-cyan-500 to-teal-500 text-white
                      shadow-sm hover:shadow-md hover:shadow-cyan-500/20 transition"
                  >
                    {t('common.contact')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {profile?.social?.github && (
                    <a
                      href={profile.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/70
                        border border-slate-200/80 dark:border-slate-700/80
                        text-slate-700 dark:text-slate-100 shadow-sm
                        hover:bg-slate-50 dark:hover:bg-slate-800/90
                        hover:text-cyan-700 dark:hover:text-cyan-300
                        hover:border-cyan-500/30 dark:hover:border-cyan-400/30 transition-all"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}

                  {profile?.social?.linkedin && (
                    <a
                      href={profile.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/70
                        border border-slate-200/80 dark:border-slate-700/80
                        text-slate-700 dark:text-slate-100 shadow-sm
                        hover:bg-slate-50 dark:hover:bg-slate-800/90
                        hover:text-cyan-700 dark:hover:text-cyan-300
                        hover:border-cyan-500/30 dark:hover:border-cyan-400/30 transition-all"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>

                <div className="mt-7 pt-6 border-t border-slate-200/70 dark:border-slate-800/70">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                    {t('about.toc')}
                  </p>

                  <nav className="grid gap-2 text-sm">
                    <NavItem
                      id="summary"
                      label={t('about.nav.summary')}
                      isActive={activeSection === 'summary'}
                      onClick={scrollTo}
                    />
                    <NavItem
                      id="overview"
                      label={t('about.nav.highlights')}
                      isActive={activeSection === 'overview'}
                      onClick={scrollTo}
                    />
                    <NavItem
                      id="skills"
                      label={t('about.nav.coreSkills')}
                      isActive={activeSection === 'skills'}
                      onClick={scrollTo}
                    />
                    <NavItem
                      id="timeline"
                      label={t('about.nav.timeline')}
                      isActive={activeSection === 'timeline'}
                      onClick={scrollTo}
                    />
                  </nav>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <main className="lg:col-span-8">
            {/* SUMMARY */}
            <motion.section id="summary" {...fadeInUp} className="mb-10 scroll-mt-28">
              <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-7 md:p-8 shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {t('about.summaryTitle')}
                </h2>
                <div className="h-[3px] w-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 opacity-70 mb-4" />
                <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  {profile?.bio}
                </p>
              </div>
            </motion.section>

            {/* HIGHLIGHTS */}
            <motion.section
              id="overview"
              className="mb-12 scroll-mt-28"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={staggerContainer.viewport}
            >
              <motion.div variants={fadeInUp} className="mb-5">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {t('about.highlightsTitle')}
                </h2>
                <div className="h-[3px] w-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 opacity-70" />
                <p className="mt-3 text-slate-600 dark:text-slate-400">
                  {t('about.highlightsSubtitle')}
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {aboutBlocks.map((block, index) => {
                  const Icon = blockIcons[block.icon] || User;
                  return (
                    <motion.article
                      key={index}
                      variants={fadeInUp}
                      className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70
                        bg-white/80 dark:bg-slate-900/70 backdrop-blur
                        p-6 md:p-7 shadow-sm
                        hover:shadow-md hover:border-cyan-500/30 hover:shadow-cyan-500/10 transition"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/12 to-teal-500/10 flex items-center justify-center border border-cyan-500/10">
                          <Icon className="w-5 h-5 text-cyan-700 dark:text-cyan-300" />
                        </div>
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                          {block.title}
                        </h3>
                      </div>

                      <ul className="space-y-2.5">
                        {block.bullets.map((bullet, i) => (
                          <li
                            key={i}
                            className="text-slate-600 dark:text-slate-400 flex items-start gap-2.5"
                          >
                            <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.article>
                  );
                })}
              </div>
            </motion.section>

            {/* SKILLS */}
            <motion.section
              id="skills"
              className="mb-2 scroll-mt-28"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={staggerContainer.viewport}
            >
              <motion.div variants={fadeInUp} className="flex items-end justify-between gap-6 mb-5">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {t('about.coreSkillsTitle')}
                  </h2>
                  <div className="h-[3px] w-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 opacity-70" />
                  <p className="mt-3 text-slate-600 dark:text-slate-400">
                    {t('about.coreSkillsSubtitle')}
                  </p>
                </div>

                <Link
                  to={createPageUrl('Skills')}
                  className="hidden md:inline-flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-semibold hover:gap-3 transition-all"
                >
                  {t('common.viewAll')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <div className="space-y-6">
                {skillCategories.map((category) => {
                  const categorySkills = skillsData.filter((s) => s.category === category).slice(0, 10);

                  return (
                    <motion.div
                      key={category}
                      variants={fadeInUp}
                      className="rounded-3xl border border-slate-200/70 dark:border-slate-800/70
                        bg-white/80 dark:bg-slate-900/70 backdrop-blur
                        p-6 md:p-7 shadow-sm
                        hover:border-cyan-500/25 hover:shadow-md hover:shadow-cyan-500/10 transition"
                    >
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {categoryLabel(category)}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {t('about.topCount', { count: categorySkills.length })}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill) => (
                          <Badge
                            key={skill.name}
                            variant="secondary"
                            className="bg-slate-100/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200
                              border border-slate-200/50 dark:border-slate-700/50
                              px-3 py-1.5 rounded-xl hover:border-cyan-500/25 transition"
                          >
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 md:hidden">
                <Link
                  to={createPageUrl('Skills')}
                  className="inline-flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-semibold"
                >
                  {t('about.viewAllSkills')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.section>
          </main>
        </div>

        {/* =========================
            EXPERIENCE & EDUCATION
            ========================= */}
        <section id="timeline" className="mt-14 md:mt-16 scroll-mt-24">
          {/* Mobile (stacked) */}
          <div className="lg:hidden">
            <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md overflow-hidden">
              <div className="relative p-7 md:p-8 border-b border-slate-200/70 dark:border-slate-800">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10"
                />
                <div className="relative text-center">
                  <span className="inline-block px-4 py-1.5 text-sm font-semibold text-teal-800 bg-teal-50 rounded-full mb-5 dark:text-teal-200 dark:bg-teal-500/10">
                    {t('about.careerJourney')}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t('about.experienceTitle')}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
                      &
                    </span>{' '}
                    {t('about.educationTitle')}
                  </h2>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    {t('about.tapToExpand')}
                  </p>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-12">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                      {t('about.professionalExperience')}
                    </h3>
                  </div>

                  <div className="relative">
                    {workExperience.map((exp, idx) => (
                      <TimelineCard
                        key={idx}
                        title={exp.title}
                        subtitle={exp.company}
                        location={exp.location}
                        dateRange={exp.period}
                        description={exp.description}
                        bullets={exp.highlights || []}
                        isLast={idx === workExperience.length - 1}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-500 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                      {t('about.education')}
                    </h3>
                  </div>

                  <div className="space-y-5">
                    {education.map((edu, index) => (
                      <EducationCard
                        key={index}
                        degree={edu.title}
                        fieldOfStudy={edu.fieldOfStudy || edu.description}
                        institution={edu.company}
                        location={edu.location}
                        graduationYear={edu.period}
                        gpa={edu.gpa}
                        honors={edu.highlights || []}
                        index={index}
                      />
                    ))}
                  </div>
                </div>

                <motion.div
                  {...fadeInUp}
                  className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md p-7 md:p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                        {t('about.fullStoryTitle')}
                      </h3>
                      <p className="mt-2 text-slate-600 dark:text-slate-400">
                        {t('about.fullStoryBody')}
                      </p>
                    </div>
                    <Link
                      to={createPageUrl('Contact')}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:shadow-xl hover:shadow-cyan-500/25 transition"
                    >
                      {t('common.contact')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Desktop (Resizable split) */}
          <div className="hidden lg:block">
            <div
              ref={splitRef}
              className="relative rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md overflow-hidden"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/6 via-transparent to-teal-500/6"
              />

              <div className="relative p-8 border-b border-slate-200/70 dark:border-slate-800">
                <div className="flex flex-col items-center text-center">
                  <span className="inline-block px-4 py-1.5 text-sm font-semibold text-teal-800 bg-teal-50 rounded-full mb-5 dark:text-teal-200 dark:bg-teal-500/10">
                    {t('about.careerJourney')}
                  </span>

                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t('about.experienceTitle')}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
                      &
                    </span>{' '}
                    {t('about.educationTitle')}
                  </h2>

                  <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-3xl">
                    {t('about.dragDividerHelp')}
                  </p>
                </div>
              </div>

              <div
                className="relative grid"
                style={{
                  gridTemplateColumns: `${splitPct}% 12px ${100 - splitPct}%`
                }}
              >
                <div className="p-8">
                  <motion.div
                    className="flex items-center gap-3 mb-8"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                      {t('about.professionalExperience')}
                    </h3>
                  </motion.div>

                  <div className="relative pr-2">
                    {workExperience.map((exp, idx) => (
                      <TimelineCard
                        key={idx}
                        title={exp.title}
                        subtitle={exp.company}
                        location={exp.location}
                        dateRange={exp.period}
                        description={exp.description}
                        bullets={exp.highlights || []}
                        isLast={idx === workExperience.length - 1}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div
                    className={[
                      'absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px]',
                      'bg-gradient-to-b from-cyan-300/60 via-teal-300/40 to-cyan-100/40',
                      'dark:from-cyan-500/30 dark:via-teal-500/15 dark:to-slate-800'
                    ].join(' ')}
                    aria-hidden
                  />

                  <div
                    onPointerDown={onDividerPointerDown}
                    onDoubleClick={() => setSplitPct(50)}
                    onKeyDown={onDividerKeyDown}
                    role="separator"
                    aria-orientation="vertical"
                    aria-label={t('about.resizeAria')}
                    aria-valuemin={30}
                    aria-valuemax={70}
                    aria-valuenow={Math.round(splitPct)}
                    tabIndex={0}
                    className="absolute inset-y-0 left-0 right-0 cursor-col-resize select-none"
                  >
                    <div
                      className={[
                        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                        'w-8 h-14 rounded-2xl',
                        'bg-white/90 dark:bg-slate-900/80',
                        'border border-slate-200/70 dark:border-slate-800',
                        'shadow-sm',
                        isDragging ? 'ring-2 ring-cyan-300/60 dark:ring-cyan-500/20' : ''
                      ].join(' ')}
                    >
                      <div className="h-full w-full flex items-center justify-center gap-1">
                        <span className="w-[2px] h-7 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span className="w-[2px] h-7 rounded-full bg-slate-300 dark:bg-slate-700" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <motion.div
                    className="flex items-center gap-3 mb-8"
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-500 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
                      {t('about.education')}
                    </h3>
                  </motion.div>

                  <div className="space-y-5 pl-2">
                    {education.map((edu, index) => (
                      <EducationCard
                        key={index}
                        degree={edu.title}
                        fieldOfStudy={edu.fieldOfStudy || edu.description}
                        institution={edu.company}
                        location={edu.location}
                        graduationYear={edu.period}
                        gpa={edu.gpa}
                        honors={edu.highlights || []}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t('about.dividerTip')}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
