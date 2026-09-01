import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { apiConfig } from '@/src/constants/apiConfig';
import { profileSecondaryLanguage } from '@/src/core/config/profile-language';

const translationCache = new Map<string, string>();

function buildCacheKey(text: string, target: string) {
  return `${target}:${text.trim().toLowerCase()}`;
}

async function translateThroughBackend(text: string, target: string) {
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

export async function resolveSecondaryLanguageText(
  englishText: string,
  existingSecondaryText?: string | null,
) {
  const trimmedEnglish = String(englishText || '').trim();
  const trimmedSecondary = String(existingSecondaryText || '').trim();

  if (trimmedSecondary && trimmedSecondary.toLowerCase() !== trimmedEnglish.toLowerCase()) {
    return trimmedSecondary;
  }

  if (!trimmedEnglish) {
    return '';
  }

  if (profileSecondaryLanguage === 'en') {
    return trimmedEnglish;
  }

  const cacheKey = buildCacheKey(trimmedEnglish, profileSecondaryLanguage);
  const cached = translationCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  if (!apiConfig.isConfigured) {
    return trimmedEnglish;
  }

  try {
    const translatedText = await translateThroughBackend(trimmedEnglish, profileSecondaryLanguage);
    if (!translatedText || translatedText === trimmedEnglish) {
      return trimmedEnglish;
    }

    translationCache.set(cacheKey, translatedText);
    return translatedText;
  } catch {
    translationCache.delete(cacheKey);
    return trimmedEnglish;
  }
}
