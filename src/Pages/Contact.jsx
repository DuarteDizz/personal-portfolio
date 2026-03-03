// Contact.jsx — premium, modern, audacious (portfolio-first, not SaaS)
// Header container removed (no bordered/boxed hero)
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Github,
  Linkedin,
  MapPin,
  Send,
  ExternalLink,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { usePortfolioData } from '@/content/usePortfolioData';

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

const cardIn = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

const safeString = (v) => (typeof v === 'string' ? v : '');
const hasText = (v) => safeString(v).trim().length > 0;

export default function Contact() {
  const { t, i18n } = useTranslation();
  const { profile } = usePortfolioData();
  const [copied, setCopied] = useState(false);

  const socialLinks = useMemo(() => {
    const socials = profile?.social || {};
    return [
      socials.github
        ? {
            name: 'GitHub',
            icon: Github,
            url: socials.github,
            hint: t('contact.links.githubHint')
          }
        : null,
      socials.linkedin
        ? {
            name: 'LinkedIn',
            icon: Linkedin,
            url: socials.linkedin,
            hint: t('contact.links.linkedinHint')
          }
        : null,
      profile?.email
        ? {
            name: t('contact.links.emailName'),
            icon: Mail,
            url: `mailto:${profile.email}`,
            hint: t('contact.links.emailHint')
          }
        : null
    ].filter(Boolean);
  }, [profile, i18n.language]);

  const handleCopy = async () => {
    try {
      if (!profile?.email) return;
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore (clipboard may be blocked)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = safeString(formData.get('name'));
    const email = safeString(formData.get('email'));
    const message = safeString(formData.get('message'));

    const subject = t('contact.mail.subject', { name });
    const body = t('contact.mail.body', { name, email, message });

    const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
  };

  return (
    <div className="min-h-screen py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero / Header (NO container card) */}
        <motion.header {...fadeInUp} className="relative mb-10 md:mb-14">
          {/* subtle background glows */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
            <div className="absolute inset-x-0 top-10 h-px bg-gradient-to-r from-transparent via-slate-200/70 dark:via-slate-800/70 to-transparent" />
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/10">
              <Sparkles className="w-4 h-4 text-cyan-700 dark:text-cyan-300" />
              <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">{t('navbar.contact')}</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('contact.hero.titleLead')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
                {' '}
                {t('contact.hero.titleHighlight')}
              </span>
              .
            </h1>

            <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-300">
              {t('contact.hero.body')}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href={profile?.email ? `mailto:${profile.email}` : '#'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:shadow-xl hover:shadow-cyan-500/25 transition"
              >
                <Mail className="w-4 h-4" />{' '}{t('contact.hero.primaryCta')}</a>

              {profile?.social?.linkedin && (
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition"
                  aria-label={t('contact.hero.linkedinAria')}
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </a>
              )}
            </div>
          </div>
        </motion.header>

        {/* Main grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* LEFT: Sticky contact card */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <motion.div {...cardIn}>
                <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md overflow-hidden">
                  {/* Top accent strip */}
                  <div className="relative p-7 md:p-8 border-b border-slate-200/70 dark:border-slate-800">
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10"
                    />
                    <div className="relative">
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                        {t('contact.direct.title')}
                      </h2>
                      <p className="mt-2 text-slate-600 dark:text-slate-300">
                        {t('contact.direct.subtitle')}
                      </p>
                    </div>
                  </div>

                  <div className="p-7 md:p-8 space-y-6">
                    {/* Email block */}
                    {profile?.email && (
                      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
                              {t('contact.blocks.email.label')}
                            </p>
                            <a
                              href={`mailto:${profile.email}`}
                              className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors break-all"
                            >
                              <Mail className="w-4 h-4 text-cyan-700 dark:text-cyan-300" />
                              {profile.email}
                            </a>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                              {t('contact.blocks.email.note')}
                            </p>
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCopy}
                            className="rounded-xl border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40"
                            aria-label={t('contact.blocks.email.copyAria')}
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              {copied ? (
                                <motion.span
                                  key="copied"
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -6 }}
                                  className="inline-flex items-center gap-2"
                                >
                                  <Check className="w-4 h-4 text-teal-600" />
                                  {t('contact.blocks.email.copied')}
                                </motion.span>
                              ) : (
                                <motion.span
                                  key="copy"
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -6 }}
                                  className="inline-flex items-center gap-2"
                                >
                                  <Copy className="w-4 h-4" />
                                  {t('contact.blocks.email.copy')}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {hasText(profile?.location) && (
                      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/12 to-teal-500/10 border border-cyan-500/10 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-cyan-700 dark:text-cyan-300" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
                              {t('contact.blocks.location.label')}
                            </p>
                            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                              {profile.location}
                            </p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                              {t('contact.blocks.location.meta')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Social grid */}
                    {socialLinks.length > 0 && (
                      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                        <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 mb-4">
                          {t('contact.blocks.links.label')}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-3">
                          {socialLinks.map((social) => (
                            <a
                              key={social.name}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={[
                                'group rounded-2xl border border-slate-200/70 dark:border-slate-800',
                                'bg-white/70 dark:bg-slate-950/40',
                                'p-4 transition',
                                'hover:border-cyan-500/35 hover:shadow-lg hover:shadow-cyan-500/10'
                              ].join(' ')}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200/70 dark:border-slate-800">
                                  <social.icon className="w-5 h-5 text-slate-700 dark:text-slate-200 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                      {social.name}
                                    </p>
                                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                                  </div>
                                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    {social.hint}
                                  </p>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Micro-note */}
                    <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-gradient-to-br from-cyan-500/8 via-transparent to-teal-500/8 p-5">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 w-9 h-9 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {t('contact.note.title')}
                          </p>
                          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {t('contact.note.body')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </aside>

          {/* RIGHT: Form */}
          <section className="lg:col-span-7">
            <motion.div {...cardIn} transition={{ ...cardIn.transition, delay: 0.06 }}>
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-teal-500/8"
                />

                {/* Form header */}
                <div className="relative p-7 md:p-8 border-b border-slate-200/70 dark:border-slate-800">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('contact.formTitle')}</h2>
                  <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-2xl">{t('contact.formSubtitle')}</p>
                </div>

                <div className="relative p-7 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
                        >
                          {t('contact.form.name')}
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder={t('contact.form.namePlaceholder')}
                          className="h-12 bg-white dark:bg-slate-950/40 border-slate-200/70 dark:border-slate-800 rounded-2xl"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
                        >
                          {t('contact.form.email')}
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder={t('contact.form.emailPlaceholder')}
                          className="h-12 bg-white dark:bg-slate-950/40 border-slate-200/70 dark:border-slate-800 rounded-2xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
                      >
                        {t('contact.form.message')}
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        placeholder={t('contact.form.messagePlaceholder')}
                        className="bg-white dark:bg-slate-950/40 border-slate-200/70 dark:border-slate-800 rounded-2xl resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:shadow-xl hover:shadow-cyan-500/25 transition-all"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        {t('contact.form.send')}
                      </Button>

                      <p className="mt-3 text-xs text-center text-slate-500 dark:text-slate-400">
                        {t('contact.form.disclaimer')}
                      </p>
                    </div>
                  </form>

                  <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {t('contact.replyTime', { time: '24–48h' })}
                      </p>
                      {profile?.social?.github && (
                        <a
                          href={profile.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-semibold hover:gap-3 transition-all"
                        >
                          {t('contact.githubCta')}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
}
