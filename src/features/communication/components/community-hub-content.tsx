import { Pressable, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppBottomBar, AppHeader, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { getMemberBottomBarRoute, memberBottomBarItems } from '@/src/core/navigation/member-shell';
import { useDrawerOpenAction } from '@/src/core/navigation/use-drawer-open-action';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import { CommunityNotificationUpdates, CommunityPublicationCard, CommunityUpcomingEvents } from './community-hub-blocks';

export function CommunityHubContent({
  useMemberTabShell = false,
  mode = 'member',
}: {
  useMemberTabShell?: boolean;
  mode?: 'member' | 'admin';
} = {}) {
  const navigateBack = useBackNavigation();
  const { safeNavigateRoot, safePush } = useSafeNavigation();
  const openDrawer = useDrawerOpenAction();
  const t = useTranslations('communication.community-hub');
  const notificationsRoute = mode === 'admin' ? '/admin/notifications' : '/member/notifications';
  const chatsRoute = mode === 'admin' ? '/admin/community-chats' : '/communication/community-chats';
  const returnToRoute = mode === 'admin'
    ? '/admin/community'
    : useMemberTabShell
      ? '/member/community'
      : '/communication/community-hub';

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        {mode === 'admin' ? (
          <AppHeader
            title={t('title')}
            variant="back-inline"
            onLeftPress={navigateBack}
          />
        ) : (
          <AppHeader
            title={t('title')}
            variant="menu-notification"
            onLeftPress={openDrawer}
            onRightPress={() => safePush(notificationsRoute as never)}
          />
        )}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: useMemberTabShell ? 24 : 92 }}>
          <View style={{ maxWidth: 672, alignSelf: 'center', width: '100%' }}>
            <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
              <Pressable
                accessibilityRole="button"
                onPress={() => safePush(chatsRoute as never)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: colors.primary.borderLight,
                  backgroundColor: colors.background.surface,
                  paddingHorizontal: spacing[4],
                  paddingVertical: 14,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="forum" size={22} color={colors.primary.DEFAULT} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
                      Community Chats
                    </Text>
                    <Text variant="caption" color={colors.text.secondary}>
                      Open group chats and event discussions
                    </Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={colors.primary.DEFAULT} />
              </Pressable>
            </View>
            <CommunityPublicationCard />
            <CommunityUpcomingEvents returnTo={returnToRoute} />
            <CommunityNotificationUpdates />
          </View>
        </ScrollView>

        {useMemberTabShell || mode === 'admin' ? null : (
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            <AppBottomBar
              activeKey="community"
              onChange={(key) => safeNavigateRoot(getMemberBottomBarRoute(key))}
              items={memberBottomBarItems}
            />
          </View>
        )}
      </View>
    </AppSafeAreaView>
  );
}
