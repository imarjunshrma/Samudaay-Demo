import { ScrollView, View } from 'react-native';

import { AppHeader, AppSafeAreaView, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

type LegalDocumentKind = 'privacy' | 'terms';

export function ProfileLegalDocumentContent({ kind }: { kind: LegalDocumentKind }) {
  const navigateBack = useBackNavigation();
  const t = useTranslations('profile.legal');
  const title = t(`${kind}.title`);
  const subtitle = t(`${kind}.subtitle`);
  const itemCount = kind === 'privacy' ? 6 : 7;
  const items = Array.from({ length: itemCount }, (_, index) => t(`${kind}.item${index + 1}`));

  return (
    <AppSafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <AppHeader title={title} variant="back" onLeftPress={navigateBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[6], paddingBottom: spacing[6], gap: spacing[5] }}>
        <View
          style={{
            backgroundColor: colors.background.surface,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
            padding: spacing[6],
            gap: spacing[2],
          }}>
          <Text variant="h3" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          <Text variant="body" color={colors.text.secondary} style={{ lineHeight: 22 }}>
            {subtitle}
          </Text>
        </View>

        <View style={{ gap: spacing[4] }}>
          {items.map((item, index) => (
            <View
              key={`${kind}-${index + 1}`}
              style={{
                flexDirection: 'row',
                gap: spacing[4],
                alignItems: 'flex-start',
                backgroundColor: colors.background.surface,
                borderRadius: radius.xl,
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                padding: spacing[5],
              }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: radius.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.primary.subtle,
                }}>
                <Text variant="label" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                  {String(index + 1)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body" color={colors.text.primary} style={{ lineHeight: 24 }}>
                  {item}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}
