import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getPortfolioData } from './index';

export function usePortfolioData() {
  const { i18n } = useTranslation();
  const lng = i18n.resolvedLanguage || i18n.language || 'en';
  return useMemo(() => getPortfolioData(lng), [lng]);
}
