import { memo } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';

import { MotionView } from '@/src/components/motion';
import { useBottomSafeSpacing } from '@/src/components/layout/SafeAreaInsets';
import { Badge } from '@/src/components/ui/Badge';
import { Icon } from '@/src/components/ui/Icon';
import { Text } from '@/src/components/ui/Text';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing } from '@/src/theme';

type AppBottomBarVariant = 'member' | 'community' | 'finance' | 'minimal' | 'admin';

export interface AppBottomBarItem {
  key: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  label: string;
  badge?: number;
}

export interface AppBottomBarProps {
  items: readonly AppBottomBarItem[];
  activeKey: string;
  onChange: (key: string) => void;
  variant?: AppBottomBarVariant;
  showLabels?: boolean;
  forceVisible?: boolean;
  centerAction?: {
    icon: React.ComponentProps<typeof Icon>['name'];
    onPress?: () => void;
    label?: string;
  };
}

function AppBottomBarInner({
  items,
  activeKey,
  onChange,
  variant = 'member',
  showLabels = true,
  forceVisible: _forceVisible = false,
  centerAction,
}: AppBottomBarProps) {
  const t = useTranslations();
  const backgroundColor = variant === 'minimal' || variant === 'finance' ? '#ffffff' : colors.background.DEFAULT;
  const baseBottomPadding = centerAction ? spacing[2] : spacing[3];
  const bottomPadding = useBottomSafeSpacing(baseBottomPadding);

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: variant === 'community' ? '#f1f5f9' : colors.primary.borderLight,
        backgroundColor,
        paddingHorizontal: variant === 'minimal' ? spacing[2] : spacing[4],
        paddingTop: spacing[2],
        paddingBottom: bottomPadding,
      }}>
      <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', position: 'relative' }}>
        {items.map((item) => {
          const active = item.key === activeKey;

          return (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              disabled={active}
              hitSlop={8}
              onPress={() => {
                if (!active) {
                  onChange(item.key);
                }
              }}
              style={{ flex: 1, alignItems: 'center', gap: 4, minWidth: 64 }}>
              <MotionView
                animate={{ scale: active ? 1 : 0.88, opacity: active ? 1 : 0.7 }}
                transition={{ type: 'spring', damping: 18, stiffness: 260, mass: 0.8 }}
                style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={item.icon} size="bottomBar" color={active ? colors.primary.DEFAULT : '#94a3b8'} />
                {item.badge ? <Badge label={String(item.badge)} variant="warning" /> : null}
              </MotionView>
              {showLabels ? (
                <Text variant="navLabel" color={active ? colors.primary.DEFAULT : '#94a3b8'}>
                  {t(item.label)}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
        {centerAction ? (
          <View style={{ position: 'absolute', top: -24, left: 0, right: 0, alignItems: 'center' }}>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={centerAction.onPress}
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primary.DEFAULT,
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 6,
              }}>
              <Icon name={centerAction.icon} size="bottomBar" color={colors.text.inverse} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export const AppBottomBar = memo(AppBottomBarInner);
