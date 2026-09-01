import { Image, TouchableOpacity, View, type DimensionValue } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AppSidebar, FeatureCard, PremiumBannerCard, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function MainNavigationBanners() {
  const t = useTranslations('dashboard.home');
  return (
    <>
      <PremiumBannerCard
        eyebrow={t('banners.upcoming.eyebrow')}
        title={t('banners.upcoming.title')}
        description={t('banners.upcoming.description')}
        variant="light"
      />
      <PremiumBannerCard
        eyebrow={t('banners.fund.eyebrow')}
        title={t('banners.fund.title')}
        description={t('banners.fund.description')}
        variant="dark"
      />
    </>
  );
}
