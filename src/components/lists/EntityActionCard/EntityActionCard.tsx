import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Button } from '@/src/components/ui/Button/Button';
import type { ButtonVariant } from '@/src/components/ui/Button/Button.types';
import { Text } from '@/src/components/ui/Text';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export interface EntityActionCardMetaItem {
  key: string;
  icon?: ReactNode;
  label: string;
  color?: string;
}

export interface EntityActionCardAction {
  key: string;
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
  flex?: number;
  disabled?: boolean;
  loading?: boolean;
}

export interface EntityActionCardProps {
  leading: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  detail?: ReactNode;
  titleSuffix?: ReactNode;
  headerRight?: ReactNode;
  metaItems?: EntityActionCardMetaItem[];
  actions?: EntityActionCardAction[];
  accentColor?: string;
  muted?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function EntityActionCard({
  leading,
  title,
  subtitle,
  detail,
  titleSuffix,
  headerRight,
  metaItems = [],
  actions = [],
  accentColor,
  muted = false,
  style,
}: EntityActionCardProps) {
  const hasActions = actions.length > 0;

  return (
    <View
      style={[
        {
          borderRadius: radius.xl,
          backgroundColor: colors.background.surface,
          borderWidth: 1,
          borderColor: colors.border.light,
          padding: spacing[4],
          gap: spacing[3],
          opacity: muted ? 0.75 : 1,
          ...shadows.sm,
        },
        accentColor ? { borderLeftWidth: 2, borderLeftColor: accentColor } : null,
        style,
      ]}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] }}>
        {leading}
        <View style={{ flex: 1, gap: spacing[2] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[2] }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' }}>
              <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, fontSize: 17 }}>
                {title}
              </Text>
              {titleSuffix}
            </View>
            {headerRight}
          </View>
          {subtitle ? (
            <Text variant="caption" style={{ color: colors.text.secondary, fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
              {subtitle}
            </Text>
          ) : null}
          {detail ? (
            <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.medium, fontSize: 12 }}>
              {detail}
            </Text>
          ) : null}
          {metaItems.length > 0 ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
              {metaItems.map((item) => (
                <View key={item.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  {item.icon}
                  <Text variant="caption" style={{ color: item.color ?? colors.text.secondary }}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      {hasActions ? (
        <View style={{ flexDirection: 'row', gap: spacing[3], borderTopWidth: 1, borderTopColor: colors.border.muted, paddingTop: spacing[3] }}>
          {actions.map((action, index) => (
            <View key={action.key} style={{ flex: action.flex ?? 1 }}>
              <Button
                variant={action.variant ?? (index === 0 ? 'outline' : 'soft')}
                fullWidth
                size="sm"
                leftIcon={action.leftIcon}
                disabled={action.disabled}
                loading={action.loading}
                onPress={action.onPress}>
                {action.label}
              </Button>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
