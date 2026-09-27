function normalizeSecondaryLanguage(value?: string | null) {
  const normalized = String(value || '').trim().toLowerCase().replace('_', '-');
  if (!normalized) {
    return 'gu';
  }

  if (['gujarati', 'gujarat', 'gu-in', 'guj'].includes(normalized)) {
    return 'gu';
  }

  if (['english', 'en-us', 'en-in', 'en-gb'].includes(normalized)) {
    return 'en';
  }

  return normalized;
}

const configuredSecondaryLanguage = normalizeSecondaryLanguage(process.env.EXPO_PUBLIC_SECOND_LANGUAGE);

export type ProfileSecondaryLanguage = string;

export const profileSecondaryLanguage: ProfileSecondaryLanguage = configuredSecondaryLanguage;

export const profileSecondaryLanguageLabel =
  profileSecondaryLanguage === 'gu'
    ? {
        english: 'Gujarati',
        local: 'ગુજરાતી',
      }
    : profileSecondaryLanguage === 'en'
      ? {
          english: 'English',
          local: 'English',
        }
      : {
          english: profileSecondaryLanguage,
          local: profileSecondaryLanguage,
        };
