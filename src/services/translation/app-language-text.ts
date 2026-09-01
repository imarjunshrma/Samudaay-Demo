import { useEffect, useState } from 'react';

import { apiConfig } from '@/src/constants/apiConfig';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { apiClient } from '@/src/services/api/client';
import type { AppLanguage } from '@/src/types/app';

const translationCache = new Map<string, string>();

function buildCacheKey(text: string, target: AppLanguage) {
  return `${target}:${text.trim().toLowerCase()}`;
}

async function translateThroughBackend(text: string, target: AppLanguage) {
  const response = await apiClient<{ data: { translatedText: string } }>(apiEndpoints.translateText, {
    method: 'POST',
    body: JSON.stringify({
      text,
      source: 'en',
      target,
      format: 'text',
    }),
  });

  return String(response.data?.translatedText ?? '').trim();
}

export async function resolveAppLanguageText(text: string, language: AppLanguage) {
  const trimmedText = text.trim();
  if (!trimmedText || language === 'en') {
    return trimmedText;
  }

  const cacheKey = buildCacheKey(trimmedText, language);
  const cached = translationCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  if (!apiConfig.isConfigured) {
    return trimmedText;
  }

  try {
    const translatedText = await translateThroughBackend(trimmedText, language);
    if (!translatedText || translatedText === trimmedText) {
      return trimmedText;
    }

    translationCache.set(cacheKey, translatedText);
    return translatedText;
  } catch {
    translationCache.delete(cacheKey);
    return trimmedText;
  }
}

export function useAppLanguageText(text?: string | null) {
  const { language } = useAppPreferences();
  const trimmedText = String(text || '').trim();
  const [resolvedText, setResolvedText] = useState(trimmedText);

  useEffect(() => {
    let active = true;
    setResolvedText(trimmedText);

    if (!trimmedText) {
      return () => {
        active = false;
      };
    }

    void resolveAppLanguageText(trimmedText, language).then((nextText) => {
      if (!active) {
        return;
      }
      setResolvedText(nextText || trimmedText);
    });

    return () => {
      active = false;
    };
  }, [language, trimmedText]);

  return resolvedText;
}
