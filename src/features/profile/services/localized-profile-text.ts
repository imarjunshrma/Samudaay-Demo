import { useMemo } from 'react';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useAppLanguageText } from '@/src/services/translation/app-language-text';

export function useLocalizedProfileText(
  englishText?: string | null,
  secondaryText?: string | null,
) {
  const { language } = useAppPreferences();
  const primary = String(englishText || '').trim();
  const secondary = String(secondaryText || '').trim();
  const liveTranslatedPrimary = useAppLanguageText(primary);

  return useMemo(() => {
    if (language === 'gu') {
      return secondary || liveTranslatedPrimary || primary;
    }

    return primary || secondary;
  }, [language, liveTranslatedPrimary, primary, secondary]);
}
