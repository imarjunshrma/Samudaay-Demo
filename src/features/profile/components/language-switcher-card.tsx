import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { SelectField, Text } from '@/src/components';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { AppLanguage } from '@/src/types/app';
import type { SelectOption } from '@/src/types';

type LanguageSwitcherCardProps = {
  label: string;
  helperText?: string;
};

export function LanguageSwitcherCard({ label, helperText }: LanguageSwitcherCardProps) {
  const { language, setLanguage } = useAppPreferences();
  const { session, updateSession } = useSession();
  const t = useTranslations();
  const [isSaving, setIsSaving] = useState(false);

  const languageOptions = useMemo<SelectOption<AppLanguage>[]>(
    () => [
      { label: t('common.language.english'), value: 'en' },
      { label: t('common.language.gujarati'), value: 'gu' },
    ],
    [t],
  );

  const handleLanguageChange = async (nextLanguage: AppLanguage) => {
    if (nextLanguage === language || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      setLanguage(nextLanguage);

      if (session) {
        await updateSession((current) => ({
          ...current,
          user: {
            ...current.user,
            preferredLanguage: nextLanguage,
          },
        }));
      }
    } catch {
      return;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View
      style={{
        gap: spacing[3],
        padding: spacing[5],
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
      }}>
      <View style={{ gap: spacing[1] }}>
        <Text
          variant="caption"
          color={colors.text.muted}
          style={{
            fontFamily: typography.fontFamily.bold,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}>
          {label}
        </Text>
        {helperText ? (
          <Text variant="body" color={colors.text.secondary} style={{ fontFamily: typography.fontFamily.medium }}>
            {helperText}
          </Text>
        ) : null}
      </View>

      <SelectField
        label=""
        value={language}
        options={languageOptions}
        variant="dropdown"
        onSelect={(nextValue) => {
          void handleLanguageChange(nextValue);
        }}
        placeholder={t('common.language.english')}
        disabled={isSaving}
        labelVariant="default"
      />
    </View>
  );
}
