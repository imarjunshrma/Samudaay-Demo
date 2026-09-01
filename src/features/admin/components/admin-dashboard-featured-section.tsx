import { useTranslations } from '@/src/i18n/use-translations';
import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AppBottomBar, AppHeader, Text } from '@/src/components';

import { adminBottomBarItems } from '@/src/core/navigation/admin-shell';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminDashboardFeaturedSection() {
  const t = useTranslations('admin.dashboard');
  return (
    <View style={{ flexDirection: 'row', gap: spacing[4], alignItems: 'center', flexWrap: 'wrap' }}>
      <View style={{ flex: 1, minWidth: '100%', borderRadius: radius.xl, backgroundColor: colors.background.surface, padding: spacing[5], overflow: 'hidden', borderWidth: 1, borderColor: colors.primary.borderLight, ...shadows.sm }}>
        <View style={{ position: 'relative', zIndex: 1 }}>
          <Text variant="caption" style={{ color: colors.text.secondary, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1.2 }}>
            {t('featured.title')}
          </Text>
          <Text variant="h3" style={{ marginTop: spacing[1], color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
            {t('featured.headline')}
          </Text>
          <Text variant="body" style={{ marginTop: spacing[3], color: colors.text.secondary, lineHeight: 22 }}>
            {t('featured.description')}
          </Text>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ marginTop: spacing[4], alignSelf: 'flex-start', borderRadius: radius.full, paddingHorizontal: spacing[4], paddingVertical: spacing[2], backgroundColor: colors.primary.muted, borderWidth: 1, borderColor: colors.primary.borderLight }}>
            <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.semibold }}>
              {t('featured.action')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ position: 'absolute', right: -48, bottom: -48, width: 192, height: 192, borderRadius: 999, backgroundColor: colors.primary.DEFAULT, opacity: 0.08 }} />
      </View>

      <View style={{ width: '100%', gap: spacing[3] }}>
        <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, padding: spacing[4], borderWidth: 1, borderColor: colors.primary.borderLight }}>
          <Text variant="h5" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
            {t('featured.growth.title')}
          </Text>
          <Text variant="body" style={{ marginTop: spacing[1], color: '#64748b', lineHeight: 20 }}>
            {t('featured.growth.description')}
          </Text>
        </View>
        <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, padding: spacing[4], borderWidth: 1, borderColor: colors.primary.borderLight }}>
          <Text variant="h5" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
            {t('featured.archive.title')}
          </Text>
          <Text variant="body" style={{ marginTop: spacing[1], color: '#64748b', lineHeight: 20 }}>
            {t('featured.archive.description')}
          </Text>
        </View>
      </View>
    </View>
  );
}
