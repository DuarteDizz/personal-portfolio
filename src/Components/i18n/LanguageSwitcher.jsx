import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function LanguageSwitcher({ className = '' }) {
  const { i18n, t } = useTranslation();
  const isPT = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('pt');

  const toggle = () => {
    i18n.changeLanguage(isPT ? 'en' : 'pt');
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggle}
      className={[
        'rounded-full gap-2 font-semibold',
        'bg-white/70 dark:bg-slate-900/40',
        'border-slate-200/70 dark:border-slate-800/70',
        className
      ].join(' ')}
      aria-label={t('languageSwitcher.label')}
      title={t('languageSwitcher.label')}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm">{isPT ? t('languageSwitcher.pt') : t('languageSwitcher.en')}</span>
    </Button>
  );
}