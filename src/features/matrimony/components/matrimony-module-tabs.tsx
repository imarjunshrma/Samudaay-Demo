import { useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export type MatrimonyModuleTabKey = 'discovery' | 'matches' | 'requests' | 'messages' | 'profile';

const matrimonyModuleTabs = [
  { key: 'discovery', label: 'Discovery', icon: 'travel-explore', route: '/matrimony/discovery' },
  { key: 'matches', label: 'Matches', icon: 'favorite', route: '/matrimony/messages', params: { tab: 'matches' } },
  { key: 'requests', label: 'Requests', icon: 'mark-email-unread', route: '/matrimony/requests' },
  { key: 'messages', label: 'Messages', icon: 'forum', route: '/matrimony/messages' },
  { key: 'profile', label: 'Profile', icon: 'person', route: '/matrimony/create-profile' },
] as const;

function getMatrimonyModuleRoute(key: MatrimonyModuleTabKey) {
  switch (key) {
    case 'matches':
      return { pathname: '/member/matrimony', params: { tab: 'matches' } } as const;
    case 'requests':
      return { pathname: '/member/matrimony', params: { tab: 'requests' } } as const;
    case 'messages':
      return { pathname: '/member/matrimony', params: { tab: 'messages' } } as const;
    case 'discovery':
      return { pathname: '/member/matrimony', params: { tab: 'discovery' } } as const;
    case 'profile':
      return { pathname: '/member/matrimony', params: { tab: 'profile' } } as const;
    default:
      return { pathname: '/member/matrimony', params: { tab: 'discovery' } } as const;
  }
}

export function MatrimonyModuleTabs({
  activeKey,
  onTabPress,
}: {
  activeKey: MatrimonyModuleTabKey;
  onTabPress?: (key: MatrimonyModuleTabKey) => boolean | void;
}) {
  const router = useRouter();

  return (
    <View style={{ paddingTop: spacing[3] }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing[4], gap: spacing[2] }}>
        {matrimonyModuleTabs.map((item) => {
          const active = item.key === activeKey;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => {
                const handled = onTabPress?.(item.key);
                if (handled === true) {
                  return;
                }
                if (item.key === activeKey) {
                  return;
                }
                router.replace(getMatrimonyModuleRoute(item.key) as never);
              }}
              style={{
                minWidth: 104,
                minHeight: 44,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
                borderRadius: radius.full,
                borderWidth: 1,
                borderColor: active ? colors.primary.DEFAULT : colors.border.DEFAULT,
                backgroundColor: active ? colors.primary.DEFAULT : colors.background.surface,
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[2],
                ...(active ? shadows.sm : null),
              }}>
              <MaterialIcons
                name={item.icon}
                size={16}
                color={active ? colors.text.inverse : colors.text.secondary}
              />
              <Text
                variant="caption"
                style={{
                  color: active ? colors.text.inverse : colors.text.primary,
                  fontFamily: typography.fontFamily.bold,
                  fontSize: 13,
                }}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
