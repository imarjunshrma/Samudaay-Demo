import { Image, TouchableOpacity, View, type DimensionValue } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { AppSidebar, FeatureCard, PremiumBannerCard, Text } from '@/src/components';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function MainNavigationHero({ title, description }: { title: string; description: string }) {
  return (
    <View>
      <Text variant="h1" style={{ color: '#46291e', fontSize: 46, lineHeight: 50, fontFamily: typography.fontFamily.bold, fontStyle: 'italic', marginBottom: spacing[4] }}>
        {title}
      </Text>
      <Text variant="body" style={{ color: '#504441', fontSize: 18, maxWidth: 420 }}>
        {description}
      </Text>
    </View>
  );
}
