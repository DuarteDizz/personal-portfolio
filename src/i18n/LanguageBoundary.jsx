import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Forces a full-tree re-render on language change.
 * That way even components not calling useTranslation() update immediately.
 */
export default function LanguageBoundary({ children }) {
  useTranslation();
  return <>{children}</>;
}