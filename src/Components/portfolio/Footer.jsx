import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, Terminal, Heart } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { usePortfolioData } from '@/content/usePortfolioData';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const { profile } = usePortfolioData();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link 
              to={createPageUrl('Home')}
              className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl mb-4"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              {profile?.name}
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-md">
              {profile?.bio}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">{t('footer.quickLinks')}</h4>
            <nav className="space-y-2">
              {[
                { key: 'Home', label: t('navbar.home') },
                { key: 'Projects', label: t('navbar.projects') },
                { key: 'About', label: t('navbar.about') },
                // { key: 'Blog', label: t('navbar.blog') },
                { key: 'Contact', label: t('navbar.contact') }
              ].map((item) => (
                <Link
                  key={item.key}
                  to={createPageUrl(item.key)}
                  className="block text-sm text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">{t('footer.connect')}</h4>
            <div className="flex gap-3">
              <a 
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              <a 
                href={`mailto:${profile.email}`}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            © {currentYear} {profile?.name}. {t('footer.rights')}.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 flex items-center gap-1">
            {t('footer.builtWith')} <Heart className="w-4 h-4 text-red-500 fill-red-500" /> {t('footer.usingReact')}
          </p>
        </div>
      </div>
    </footer>
  );
}