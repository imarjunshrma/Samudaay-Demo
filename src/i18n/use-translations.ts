import { useMemo } from 'react';

import { useAppPreferences } from '@/src/core/providers/app-provider';

import { createTranslator, type TranslationNamespace } from './index';

export function useTranslations(namespace?: TranslationNamespace) {
  const { language } = useAppPreferences();

  return useMemo(() => createTranslator(language, namespace), [language, namespace]);
}
