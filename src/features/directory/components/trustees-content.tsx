import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, Text } from '@/src/components';
import { SkeletonListItem } from '@/src/components/ui/skeleton';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useSession } from '@/src/core/providers/session-provider';
import { useTrusteeDirectory } from '@/src/features/directory/hooks/use-directory';
import { useTranslations } from '@/src/i18n/use-translations';
import { translateLocationText } from '@/src/services/location/location-label-translation';
import { colors, radius, spacing, typography } from '@/src/theme';
import { TrusteesIntro, TrusteesList } from './directory-blocks';

export function TrusteesContent() {
  const navigateBack = useBackNavigation();
  const t = useTranslations('admin.manage-trustees');
  const appT = useTranslations();
  const { language } = useAppPreferences();
  const { hasPermission } = useSession();
  const { items, error, isLoading } = useTrusteeDirectory();
  const canViewPhone = hasPermission('phone.view');
  const trustees = useMemo(() => {
    const seen = new Set<string>();

    return items
      .map((item) => ({
        id: item.id,
        name: item.title,
        role: item.subtitle,
        meta: item.meta || translateLocationText([item.city, item.state].filter(Boolean).join(', '), language) || t('meta'),
        image: item.avatarUrl,
        phone: canViewPhone ? item.phone : undefined,
      }))
      .filter((item) => {
        const key = [
          item.id || '',
          item.name.trim().toLowerCase(),
          item.phone?.trim() || '',
        ].join('::');

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      });
  }, [canViewPhone, items, language, t]);

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <AppHeader
          variant="back-inline"
          title={appT('nav.trustees')}
          rightIcon="search"
          onLeftPress={() => navigateBack('/member')}
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <TrusteesIntro />
          {isLoading ? (
            <View style={{ gap: spacing[3], paddingHorizontal: spacing[4] }}>
              {[0, 1, 2].map((index) => (
                <View
                  key={index}
                  style={{
                    borderRadius: radius.xl,
                    borderWidth: 1,
                    borderColor: colors.primary.borderLight,
                    backgroundColor: colors.background.surface,
                    padding: spacing[4],
                  }}>
                  <SkeletonListItem />
                </View>
              ))}
            </View>
          ) : error ? (
            <View
              style={{
                marginHorizontal: spacing[4],
                borderRadius: radius.xl,
                borderWidth: 1,
                borderColor: '#fecaca',
                backgroundColor: '#fef2f2',
                padding: spacing[4],
              }}>
              <Text style={{ color: '#b91c1c', fontFamily: typography.fontFamily.semibold }}>
                {error instanceof Error ? error.message : 'Unable to load trustees.'}
              </Text>
            </View>
          ) : trustees.length ? (
            <TrusteesList trustees={trustees} />
          ) : (
            <View
              style={{
                marginHorizontal: spacing[4],
                borderRadius: radius.xl,
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                backgroundColor: colors.background.surface,
                padding: spacing[4],
              }}>
              <Text style={{ color: colors.text.muted, fontFamily: typography.fontFamily.medium }}>
                {t('empty')}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </AppSafeAreaView>
  );
}
