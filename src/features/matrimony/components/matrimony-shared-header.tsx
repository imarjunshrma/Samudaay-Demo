import { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { AppHeader, Text } from '@/src/components';
import { DashboardHeaderActions } from '@/src/features/dashboard/components/dashboard-header-actions';
import { colors, radius, spacing, typography } from '@/src/theme';
import { useMemberMenuAction } from '@/src/core/navigation/use-member-menu-action';
import { matrimonyFeedService, type MatrimonyAccessRecord, type MatrimonyProfileRecord } from '../services/matrimony-feed-service';
import { matrimonyScreenCache } from '../services/matrimony-screen-cache';

function canOpenProfileEditor(profile: MatrimonyProfileRecord | null) {
  return !profile || profile.status === 'REJECTED' || profile.status === 'DRAFT' || profile.status === 'PENDING_APPROVAL';
}

function getProfileActionIcon(profile: MatrimonyProfileRecord | null, loaded: boolean) {
  if (!loaded) return 'hourglass-empty' as const;
  if (!profile) return 'person-add' as const;
  if (profile.status === 'REJECTED') return 'edit' as const;
  if (profile.status === 'PENDING_APPROVAL') return 'schedule' as const;
  return 'verified' as const;
}

export function MatrimonySharedHeader({
  title = 'Matrimony',
  onProfilePress,
}: {
  title?: string;
  onProfilePress?: () => void;
}) {
  const router = useRouter();
  const openMemberMenu = useMemberMenuAction();
  const [myProfile, setMyProfile] = useState<MatrimonyProfileRecord | null>(matrimonyScreenCache.myProfile);
  const [myProfileLoaded, setMyProfileLoaded] = useState(matrimonyScreenCache.profileLoaded);
  const [access, setAccess] = useState<MatrimonyAccessRecord | null>(matrimonyScreenCache.access);
  const hasPremiumSubscription = Boolean(access?.subscription?.status === 'ACTIVE');
  const premiumLabel = 'Premium';

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([
        matrimonyFeedService.loadMyProfile().catch(() => null),
        matrimonyFeedService.loadAccess().catch(() => null),
      ]).then(([profile, accessResult]) => {
        if (!active) return;
        matrimonyScreenCache.myProfile = profile;
        matrimonyScreenCache.profileLoaded = true;
        matrimonyScreenCache.access = accessResult;
        setMyProfile(profile);
        setMyProfileLoaded(true);
        setAccess(accessResult);
      }).catch(() => {
        if (!active) return;
        matrimonyScreenCache.profileLoaded = true;
        setMyProfileLoaded(true);
      });

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <AppHeader
      title={title}
      variant="menu-notification"
      onLeftPress={openMemberMenu}
      rightSlot={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
          {hasPremiumSubscription ? (
            <View
              style={{
                borderRadius: radius.full,
                backgroundColor: colors.status.success,
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[1],
              }}>
              <Text
                variant="caption"
                style={{
                  color: colors.text.inverse,
                  fontFamily: typography.fontFamily.bold,
                }}>
                {premiumLabel}
              </Text>
            </View>
          ) : null}
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            disabled={!myProfileLoaded || !canOpenProfileEditor(myProfile)}
            onPress={() => {
              if (onProfilePress) {
                onProfilePress();
                return;
              }
              router.push('/matrimony/create-profile' as never);
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: myProfile?.status === 'APPROVED' || myProfile?.status === 'ACTIVE'
                ? 'rgba(0,80,75,0.1)'
                : colors.primary.muted,
              opacity: !myProfileLoaded ? 0.65 : 1,
            }}>
            <MaterialIcons
              name={getProfileActionIcon(myProfile, myProfileLoaded)}
              size={20}
              color={myProfile?.status === 'APPROVED' || myProfile?.status === 'ACTIVE' ? colors.status.success : colors.primary.DEFAULT}
            />
          </TouchableOpacity>
          <DashboardHeaderActions
            onNotificationsPress={() => router.push('/member/notifications')}
          />
        </View>
      }
    />
  );
}
