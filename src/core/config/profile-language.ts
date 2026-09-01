const configuredSecondaryLanguage = process.env.EXPO_PUBLIC_SECOND_LANGUAGE?.trim().toLowerCase();

export type ProfileSecondaryLanguage = string;

export const profileSecondaryLanguage: ProfileSecondaryLanguage = configuredSecondaryLanguage || 'gu';

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
