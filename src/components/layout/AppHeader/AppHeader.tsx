import { memo, type ReactNode, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { usePathname } from 'expo-router';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import { IconButton } from '@/src/components/ui/IconButton';
import { Text } from '@/src/components/ui/Text';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { colors, radius, spacing, typography } from '@/src/theme';
import { useNotificationSummary } from '@/src/features/communication/hooks/use-communication-feeds';

const DRAWER_ALLOWED_PREFIXES = [
  '/admin/dashboard',
  '/admin/manage-directory',
  '/admin/invoices',
  '/admin/profile',
  '/member',
  '/member/community',
  '/member/members',
  '/member/matrimony',
  '/profile/my-profile',
];

type AppHeaderVariant = 'plain' | 'back' | 'back-inline' | 'centered' | 'menu-notification' | 'title-action' | 'brand';

export interface AppHeaderAction {
  key: string;
  icon: React.ComponentProps<typeof IconButton>['icon'];
  onPress?: () => void;
  variant?: React.ComponentProps<typeof IconButton>['variant'];
}

export interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  variant?: AppHeaderVariant;
  titleVariant?: React.ComponentProps<typeof Text>['variant'];
  contentMaxWidth?: number | null;
  leftSlot?: ReactNode;
  centerSlot?: ReactNode;
  leftIcon?: React.ComponentProps<typeof IconButton>['icon'];
  rightIcon?: React.ComponentProps<typeof IconButton>['icon'];
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onBackPress?: () => void;
  actions?: AppHeaderAction[];
  sticky?: boolean;
  transparent?: boolean;
  rightSlot?: ReactNode;
}

function ActionGroup({ actions }: { actions: AppHeaderAction[] }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
      {actions.map((action) => (
        <IconButton key={action.key} icon={action.icon} onPress={action.onPress} variant={action.variant ?? 'soft'} />
      ))}
    </View>
  );
}

function AppHeaderInner({
  title,
  subtitle,
  variant = 'back',
  leftSlot,
  centerSlot,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  onBackPress,
  actions,
  transparent = false,
  rightSlot,
  titleVariant,
  contentMaxWidth = 672,
}: AppHeaderProps) {
  const sideSlotSize = 44;
  const navigation = useNavigation();
  const pathname = usePathname();
  const navigateBack = useBackNavigation();
  const { safePush } = useSafeNavigation();
  const showLeft = variant === 'back' || variant === 'back-inline' || variant === 'title-action' || variant === 'centered';
  const inlineBack = variant === 'back' || variant === 'back-inline';
  const translucentBack = variant === 'back-inline';
  const usesMenuLeftAction = variant === 'menu-notification' || variant === 'brand';
  const canOpenDrawer = useMemo(
    () => DRAWER_ALLOWED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)),
    [pathname],
  );
  const resolvedLeftIcon = leftIcon ?? (showLeft ? 'arrow-back' : usesMenuLeftAction && (canOpenDrawer || onLeftPress) ? 'menu' : undefined);
  const handleBack = useCallback(() => navigateBack(), [navigateBack]);
  const openDrawer = useCallback(() => {
    let currentNavigation: any = navigation;

    while (currentNavigation) {
      const state = typeof currentNavigation.getState === 'function' ? currentNavigation.getState() : undefined;

      if (state?.type === 'drawer') {
        currentNavigation.dispatch(DrawerActions.openDrawer());
        return;
      }

      currentNavigation = typeof currentNavigation.getParent === 'function' ? currentNavigation.getParent() : undefined;
    }
  }, [navigation]);
  const handleNotificationsPress = useCallback(() => {
    safePush(pathname.startsWith('/admin') ? '/admin/notification-inbox' : '/member/notifications');
  }, [pathname, safePush]);
  const unreadNotificationCount = useNotificationSummary(variant === 'menu-notification');
  const resolvedLeftPress = onLeftPress
    ?? (inlineBack ? (onBackPress ?? handleBack) : usesMenuLeftAction && canOpenDrawer ? openDrawer : undefined);
  const resolvedRightPress = onRightPress ?? (variant === 'menu-notification' ? handleNotificationsPress : undefined);
  const backgroundColor =
    variant === 'brand' || translucentBack ? 'rgba(248,247,245,0.92)' : transparent ? 'transparent' : colors.background.DEFAULT;

  return (
    <View
      style={{
        backgroundColor,
        borderBottomWidth: transparent ? 0 : 1,
        borderBottomColor: colors.primary.borderLight,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: inlineBack ? 'flex-start' : 'space-between',
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[4],
          minHeight: inlineBack ? 76 : 64,
          maxWidth: contentMaxWidth ?? undefined,
          width: '100%',
          alignSelf: 'center',
        }}>
        <View
          pointerEvents="box-none"
          style={{
            minWidth: sideSlotSize,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: spacing[3],
            flex: inlineBack ? 1 : undefined,
            zIndex: 2,
          }}>
          {leftSlot
            ? leftSlot
            : resolvedLeftIcon
              ? <IconButton icon={resolvedLeftIcon} onPress={resolvedLeftPress} variant={variant === 'back' ? 'plain' : 'plain'} />
              : null}
          {inlineBack && title ? (
            <View pointerEvents="none" style={{ flex: 1, gap: 2, minHeight: sideSlotSize, justifyContent: 'center' }}>
              <Text
                variant={titleVariant ?? 'h5'}
                color={colors.text.primary}
                style={{
                  fontFamily: typography.fontFamily.bold,
                  textAlign: 'left',
                  letterSpacing: -0.2,
                }}>
                {title}
              </Text>
              {subtitle ? (
                <Text variant="caption" color={colors.text.muted} style={{ textAlign: 'left' }}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>

        <View pointerEvents={centerSlot ? 'box-none' : 'none'} style={{ flex: inlineBack ? 0 : 1, alignItems: inlineBack ? 'flex-end' : 'center' }}>
          {centerSlot ? (
            centerSlot
          ) : title && !inlineBack ? (
            <>
              <Text
                variant="h5"
                color={variant === 'brand' ? colors.text.primary : colors.text.primary}
                style={{
                  textAlign: 'center',
                  fontFamily: variant === 'brand' ? typography.fontFamily.bold : typography.fontFamily.bold,
                }}>
                {title}
              </Text>
              {subtitle ? (
                <Text variant="caption" color={colors.text.muted} style={{ marginTop: 2 }}>
                  {subtitle}
                </Text>
              ) : null}
            </>
          ) : null}
        </View>

        <View
          pointerEvents="box-none"
          style={{
            minWidth: sideSlotSize,
            minHeight: sideSlotSize,
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 2,
          }}>
          {rightSlot
            ? rightSlot
            : actions?.length
              ? <ActionGroup actions={actions} />
              : rightIcon
                ? (
                  <View style={{ position: 'relative' }}>
                    <IconButton
                      icon={rightIcon}
                      onPress={resolvedRightPress}
                      variant={variant === 'menu-notification' ? 'soft' : 'plain'}
                      size={variant === 'menu-notification' ? 'xl' : 'md'}
                    />
                    {variant === 'menu-notification' && unreadNotificationCount > 0 ? (
                      <View
                        pointerEvents="none"
                        style={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          minWidth: 18,
                          height: 18,
                          borderRadius: radius.full,
                          backgroundColor: '#dc2626',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingHorizontal: 4,
                          borderWidth: 1,
                          borderColor: colors.background.DEFAULT,
                        }}>
                        <Text variant="caption" color={colors.text.inverse} style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
                          {unreadNotificationCount > 99 ? '99+' : String(unreadNotificationCount)}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                )
                : variant === 'menu-notification'
                  ? (
                    <View style={{ position: 'relative' }}>
                      <IconButton icon="notifications" onPress={resolvedRightPress} variant="soft" size="xl" />
                      {unreadNotificationCount > 0 ? (
                        <View
                          pointerEvents="none"
                          style={{
                            position: 'absolute',
                            top: -2,
                            right: -2,
                            minWidth: 18,
                            height: 18,
                            borderRadius: radius.full,
                            backgroundColor: '#dc2626',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 4,
                            borderWidth: 1,
                            borderColor: colors.background.DEFAULT,
                          }}>
                          <Text variant="caption" color={colors.text.inverse} style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
                            {unreadNotificationCount > 99 ? '99+' : String(unreadNotificationCount)}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  )
                  : <View style={{ width: sideSlotSize, height: sideSlotSize, borderRadius: radius.full }} />}
        </View>
      </View>
    </View>
  );
}

export const AppHeader = memo(AppHeaderInner);
