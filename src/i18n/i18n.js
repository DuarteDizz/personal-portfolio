import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import pt from './locales/pt.json';

export const LANG_STORAGE_KEY = 'portfolio-lang';
export const LEGACY_LANG_STORAGE_KEY = 'site_lang';

function detectLanguage() {
  try {
    const saved =
      window.localStorage.getItem(LANG_STORAGE_KEY) ||
      window.localStorage.getItem(LEGACY_LANG_STORAGE_KEY);

    if (saved && (saved === 'en' || saved === 'pt')) return saved;
  } catch {
    // ignore
  }

  const nav = (navigator.language || navigator.languages?.[0] || 'en').toLowerCase();
  return nav.startsWith('pt') ? 'pt' : 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pt: { translation: pt }
    },
    lng: detectLanguage(),
    fallbackLng: 'en',
    supportedLngs: ['en', 'pt'],
    interpolation: { escapeValue: false },
    returnEmptyString: false,
    returnNull: false
  });

i18n.on('languageChanged', (lng) => {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lng);
    window.localStorage.setItem(LEGACY_LANG_STORAGE_KEY, lng);
  } catch {
    // ignore
  }
});

export default i18n;