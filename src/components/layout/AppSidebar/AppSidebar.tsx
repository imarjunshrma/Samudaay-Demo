import { ActivityIndicator, Image, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/src/components/ui';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

export interface AppSidebarItem {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  active?: boolean;
}

export interface AppSidebarProps {
  title?: string;
  profileName: string;
  badge?: string;
  subtitle?: string;
  profileImage?: string;
  items: AppSidebarItem[];
  onItemPress?: (key: string) => void;
  logoutLabel?: string;
  onLogoutPress?: () => void;
  logoutLoading?: boolean;
  variant?: 'default' | 'updated';
}

const sidebarThemes = {
  default: {
    background: colors.background.surfaceAlt,
    text: colors.text.secondary,
    strong: colors.text.primary,
    active: colors.primary.DEFAULT,
    activeText: colors.text.inverse,
    accent: colors.primary.DEFAULT,
    badgeBg: colors.primary.muted,
    border: colors.primary.borderLight,
  },
  updated: {
    background: colors.background.surfaceAlt,
    text: colors.text.secondary,
    strong: colors.text.primary,
    active: colors.primary.DEFAULT,
    activeText: colors.text.inverse,
    accent: colors.primary.DEFAULT,
    badgeBg: colors.primary.muted,
    border: colors.primary.borderLight,
  },
} as const;

export function AppSidebar({
  title = 'sidebar.title',
  profileName,
  badge = 'sidebar.badge',
  subtitle = 'sidebar.subtitle',
  profileImage,
  items,
  onItemPress,
  logoutLabel = 'actions.logout',
  onLogoutPress,
  logoutLoading = false,
  variant = 'default',
}: AppSidebarProps) {
  const t = useTranslations();
  const theme = sidebarThemes[variant];
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        height: '100%',
        flex: 1,
        overflow: 'hidden',
        width: 320,
        backgroundColor: theme.background,
        borderTopRightRadius: radius.xl,
        borderBottomRightRadius: radius.xl,
      }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing[4],
          paddingTop: insets.top + spacing[4],
          paddingBottom: insets.bottom + spacing[6],
        }}>
        <View style={{ paddingHorizontal: spacing[4], marginBottom: spacing[8] }}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              resizeMode="cover"
              style={{ width: 80, height: 80, borderRadius: radius.lg, marginBottom: spacing[4] }}
            />
          ) : (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: radius.lg,
                marginBottom: spacing[4],
                backgroundColor: '#fdf9f6',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="person" size={32} color={theme.accent} />
            </View>
          )}
          <Text variant="h4" style={{ color: theme.strong, fontFamily: typography.fontFamily.bold }}>
            {profileName}
          </Text>
          <View
            style={{
              alignSelf: 'flex-start',
              marginTop: spacing[2],
              borderRadius: 4,
              backgroundColor: theme.badgeBg,
              paddingHorizontal: spacing[2],
              paddingVertical: 4,
            }}>
            <Text
              variant="caption"
              style={{
                color: colors.primary.dark!,
                fontFamily: typography.fontFamily.medium,
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}>
              {badge}
            </Text>
          </View>
          <Text variant="caption" style={{ marginTop: spacing[2], color: 'rgba(80,68,65,0.7)' }}>
            {t(subtitle)}
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1, minHeight: 0 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: spacing[4] }}>
          <View style={{ borderTopWidth: 1, borderTopColor: theme.border, paddingTop: spacing[4] }}>
            {items.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => onItemPress?.(item.key)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing[4],
                  borderRadius: 10,
                  backgroundColor: item.active ? 'rgba(242,120,13,0.12)' : 'transparent',
                  borderWidth: item.active ? 1 : 0,
                  borderColor: item.active ? 'rgba(242,120,13,0.22)' : 'transparent',
                  paddingHorizontal: spacing[4],
                  paddingVertical: spacing[3],
                  marginBottom: 4,
                  overflow: 'hidden',
                }}>
                {item.active ? (
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      backgroundColor: theme.active,
                    }}
                  />
                ) : null}
                <Icon name={item.icon} size={20} color={item.active ? colors.primary.DEFAULT : theme.text} />
                <Text
                  variant="caption"
                  color={item.active ? colors.primary.DEFAULT : theme.text}
                  style={{
                    fontFamily: item.active ? typography.fontFamily.bold : typography.fontFamily.medium,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                  }}>
                  {t(item.label)}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={{ borderTopWidth: 1, borderTopColor: theme.border, paddingTop: spacing[4] }}>
          <Pressable
            disabled={logoutLoading}
            onPress={onLogoutPress}
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], paddingHorizontal: spacing[4], paddingVertical: spacing[3], opacity: logoutLoading ? 0.7 : 1 }}>
            {logoutLoading ? <ActivityIndicator size="small" color="#ba1a1a" /> : <Icon name="logout" size={20} color="#ba1a1a" />}
            <Text
              variant="caption"
              style={{
                color: '#ba1a1a',
                fontFamily: typography.fontFamily.medium,
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}>
              {t(logoutLabel)}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
