import { Pressable, ScrollView, View } from 'react-native';

import { Badge, Text } from '@/src/components/ui';
import { colors, radius, spacing, typography } from '@/src/theme';

export type TabsVariant = 'underline' | 'pill' | 'scroll-chip';

export interface TabsItem {
  key: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  items: TabsItem[];
  activeKey: string;
  onChange: (key: string) => void;
  variant?: TabsVariant;
  scrollable?: boolean;
}

function TabsRow({ items, activeKey, onChange, variant, scrollable = false }: TabsProps) {
  const shouldScrollUnderlineTabs = scrollable || items.length > 4;

  if (variant === 'pill') {
    return (
      <View
        style={{
          flexDirection: 'row',
          gap: spacing[2],
          borderRadius: radius.lg,
          backgroundColor: '#f1f5f9',
          padding: spacing[1],
        }}>
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <Pressable
              key={item.key}
              onPress={() => onChange(item.key)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: radius.md,
                backgroundColor: active ? colors.background.surface : 'transparent',
                paddingVertical: spacing[2],
              }}>
              <Text
                variant="caption"
                color={active ? colors.primary.DEFAULT : '#64748b'}
                style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  if (variant === 'scroll-chip') {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: spacing[3] }}>
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <Pressable
              key={item.key}
              onPress={() => onChange(item.key)}
              style={{
                height: 36,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[2],
                borderRadius: radius.lg,
                borderWidth: active ? 0 : 1,
                borderColor: colors.primary.border,
                backgroundColor: active ? colors.primary.DEFAULT : colors.background.surface,
                paddingHorizontal: spacing[4],
              }}>
              <Text
                variant="caption"
                color={active ? colors.text.inverse : '#475569'}
                style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
                {item.label}
              </Text>
              {item.badge ? (
                active ? (
                  <Text variant="caption" color={colors.text.inverse} style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                    {item.badge}
                  </Text>
                ) : (
                  <Badge label={String(item.badge)} />
                )
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    );
  }

  const underlineTabs = (
    <View style={{ flexDirection: 'row', gap: spacing[8], borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight }}>
      {items.map((item) => {
        const active = item.key === activeKey;

        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderBottomWidth: 2,
              borderBottomColor: active ? colors.primary.DEFAULT : 'transparent',
              paddingHorizontal: spacing[2],
              paddingTop: spacing[4],
              paddingBottom: spacing[3],
            }}>
            <Text
              variant="caption"
              color={active ? colors.primary.DEFAULT : '#64748b'}
              style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  if (shouldScrollUnderlineTabs) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingRight: spacing[4] }}>
        {underlineTabs}
      </ScrollView>
    );
  }

  return underlineTabs;
}

export function Tabs({ variant = 'underline', ...props }: TabsProps) {
  return <TabsRow {...props} variant={variant} />;
}
