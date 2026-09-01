import type { AppLanguage } from '@/src/types/app';

export function selectLanguage(language: AppLanguage, english: string, gujarati: string) {
  return language === 'gu' ? gujarati : english;
}
