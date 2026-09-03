import { View } from 'react-native';

import { Icon } from '@/src/components/ui/Icon';
import { Text } from '@/src/components/ui/Text';
import { colors, radius, spacing, typography } from '@/src/theme';

export type StatHighlightCardVariant = 'summary' | 'accent' | 'dark';

export interface StatHighlightCardProps {
  label: string;
  value: string;
  helper?: string;
  icon?: React.ComponentProps<typeof Icon>['name'];
  variant?: StatHighlightCardVariant;
}

export function StatHighlightCard({
  label,
  value,
  helper,
  icon,
  variant = 'summary',
}: StatHighlightCardProps) {
  const isAccent = variant === 'accent';
  const isDark = variant === 'dark';

  return (
    <View
      style={{
        gap: spacing[2],
        borderRadius: radius.xl,
        padding: spacing[6],
        backgroundColor: isDark ? '#46291e' : isAccent ? colors.primary.DEFAULT : 'rgba(24,168,117,0.1)',
        borderWidth: isAccent || isDark ? 0 : 1,
        borderColor: 'rgba(24,168,117,0.2)',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text
          variant="caption"
          color={isDark ? 'rgba(255,255,255,0.8)' : isAccent ? 'rgba(255,255,255,0.85)' : '#475569'}
          style={{ fontFamily: typography.fontFamily.medium, textTransform: 'uppercase', letterSpacing: 1 }}>
          {label}
        </Text>
        {icon ? (
          <Icon
            name={icon}
            size={18}
            color={isDark || isAccent ? colors.text.inverse : colors.primary.DEFAULT}
          />
        ) : null}
      </View>
      <Text
        variant="h1"
        color={isDark || isAccent ? colors.text.inverse : colors.primary.DEFAULT}
        style={{ fontFamily: typography.fontFamily.bold }}>
        {value}
      </Text>
      {helper ? (
        <Text
          variant="caption"
          color={isDark ? 'rgba(255,255,255,0.72)' : isAccent ? 'rgba(255,255,255,0.82)' : '#6b7280'}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
}
