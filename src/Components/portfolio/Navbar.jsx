// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Terminal } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Button } from '@/Components/ui/button';
import { USFlag, BrazilFlag } from '@/Components/ui/FlagIcon';
import { usePortfolioData } from '@/content/usePortfolioData';

export default function Navbar({ theme, toggleTheme }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const { brand } = usePortfolioData();

  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || 'en';
  const setLang = (next) => i18n.changeLanguage(next);
const location = useLocation();
  const navItems = [
    { name: t('navbar.home'), page: 'Home' },
    { name: t('navbar.projects'), page: 'Projects' },
    { name: t('navbar.skills'), page: 'Skills' },
    { name: t('navbar.about'), page: 'About' },
    { name: t('navbar.blog'), page: 'Blog' },
    { name: t('navbar.contact'), page: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Set favicon dynamically from brand.favicon (and title)
  useEffect(() => {
    if (!brand?.favicon) return;

    const setIcon = (rel) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = brand.favicon;
    };

    setIcon('icon');
    setIcon('shortcut icon');
    setIcon('apple-touch-icon'); // nice to have for iOS/bookmarks

    if (brand?.siteTitle) document.title = brand.siteTitle;
  }, [brand?.favicon, brand?.siteTitle]);

  const isActive = (page) => {
    const currentPath = location.pathname;
    if (page === 'Home') return currentPath === '/' || currentPath === '';
    return currentPath.toLowerCase().includes(page.toLowerCase());
  };

  const showImageLogo = !!brand?.navbarIcon && !logoFailed;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to={createPageUrl('Home')}
              className="flex items-center gap-3 text-slate-900 dark:text-white font-bold text-xl"
              aria-label={brand?.siteTitle ? `${brand.siteTitle} home` : 'Home'}
            >
              {showImageLogo ? (
                // ✅ PURE IMAGE (no wrapper background / no container)
                <img
                  src={brand.navbarIcon}
                  alt={`${brand?.siteTitle || 'Logo'} logo`}
                  className="block h-18 md:h-20 lg:h-24 w-auto object-contain"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                // Fallback icon if no image or image fails
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
              )}

              <span className="hidden sm:inline">
                {brand?.siteTitle || 'Diego Duarte'}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.page)
                      ? 'text-cyan-600 dark:text-cyan-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.name}
                  {isActive(item.page) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Language toggle - desktop (flag buttons) */}
              <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => lang === 'pt' && setLang('en')}
                  aria-label="Switch language to English"
                  className={`p-2 rounded-lg transition-all ${
                    lang === 'en'
                      ? 'bg-white dark:bg-slate-700 shadow-sm scale-105'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <USFlag className="w-5 h-5 rounded" />
                </button>

                <button
                  onClick={() => lang === 'en' && setLang('pt')}
                  aria-label="Mudar idioma para Português"
                  className={`p-2 rounded-lg transition-all ${
                    lang === 'pt'
                      ? 'bg-white dark:bg-slate-700 shadow-sm scale-105'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <BrazilFlag className="w-5 h-5 rounded" />
                </button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-xl"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-slate-400 hover:text-yellow-500 transition-colors" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600 hover:text-slate-900 transition-colors" />
                )}
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-xl"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-50 md:hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-bold text-lg text-slate-900 dark:text-white">
                    Menu
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.page}
                      to={createPageUrl(item.page)}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive(item.page)
                          ? 'bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-600 dark:text-cyan-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Language toggle - mobile */}
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 px-4">
                      {t('nav_language', lang)}
                    </p>
                    <div className="flex gap-2 px-4">
                      <button
                        onClick={() => {
                          if (lang === 'pt') setLang('en');
                          setIsMobileMenuOpen(false);
                        }}
                        aria-label="Switch language to English"
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 ${
                          lang === 'en'
                            ? 'bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-600 dark:text-cyan-400 ring-2 ring-cyan-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <USFlag className="w-5 h-5 rounded" />
                        <span>English</span>
                      </button>

                      <button
                        onClick={() => {
                          if (lang === 'en') setLang('pt');
                          setIsMobileMenuOpen(false);
                        }}
                        aria-label="Mudar idioma para Português"
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 ${
                          lang === 'pt'
                            ? 'bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-600 dark:text-cyan-400 ring-2 ring-cyan-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <BrazilFlag className="w-5 h-5 rounded" />
                        <span>Português</span>
                      </button>
                    </div>
                  </div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
