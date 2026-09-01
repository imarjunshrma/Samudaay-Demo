import { Image, TouchableOpacity, View, type DimensionValue } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AppSidebar, FeatureCard, PremiumBannerCard, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function UnifiedDashboardBanners() {
  const t = useTranslations('dashboard.home');
  return (
    <View style={{ gap: spacing[4] }}>
      <PremiumBannerCard
        eyebrow={t('banners.featured.eyebrow')}
        title={t('banners.featured.title')}
        description={t('banners.featured.description')}
        variant="dark"
      />
      <PremiumBannerCard
        eyebrow={t('banners.growth.eyebrow')}
        title={t('banners.growth.title')}
        description={t('banners.growth.description')}
        variant="light"
      />
      <PremiumBannerCard
        eyebrow={t('banners.archive.eyebrow')}
        title={t('banners.archive.title')}
        description={t('banners.archive.description')}
        variant="light"
      />
    </View>
  );
}
