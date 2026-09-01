import type { AppLanguage } from '@/src/types/app';

export function getIntlLocale(language: AppLanguage = 'en') {
  return language === 'gu' ? 'gu-IN' : 'en-IN';
}

export function formatCurrency(amount: number, currency = 'INR', language: AppLanguage = 'en') {
  return new Intl.NumberFormat(getIntlLocale(language), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateLabel(value: Date, language: AppLanguage = 'en') {
  return new Intl.DateTimeFormat(getIntlLocale(language)).format(value);
}
