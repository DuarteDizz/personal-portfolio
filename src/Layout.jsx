import React, { useState, useEffect } from 'react';
import Navbar from '@/Components/portfolio/Navbar';
import Footer from '@/Components/portfolio/Footer';
import BackToTop from '@/Components/portfolio/BackToTop';

export default function Layout({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('portfolio-theme');
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </div>
);
}