import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { Button, Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';
import { matrimonyFeedService, type MatrimonyAccessRecord, type MatrimonyProfileRecord, type MatrimonyRequestRecord } from '../services/matrimony-feed-service';
import { matrimonyScreenCache } from '../services/matrimony-screen-cache';
import { MatrimonyMessagesSkeleton } from './matrimony-loading-states';
import { MatrimonyModuleTabs, type MatrimonyModuleTabKey } from './matrimony-module-tabs';
import { MatrimonySharedHeader } from './matrimony-shared-header';

function getOtherPersonName(request: MatrimonyRequestRecord) {
  if (request.direction === 'sent') {
    return request.receiver || 'Matrimony match';
  }
  return request.sender || 'Matrimony match';
}

function getOtherProfileId(request: MatrimonyRequestRecord) {
  if (request.direction === 'sent') {
    return request.receiverProfileId;
  }
  return request.senderProfileId;
}

function getOtherProfileImage(request: MatrimonyRequestRecord) {
  if (request.direction === 'sent') {
    return request.receiverImage || null;
  }
  return request.senderImage || null;
}

function formatDate(value?: string | null) {
  if (!value) return 'Recently connected';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Recently connected';
  return parsed.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function MatrimonyMessagesContent({
  activeModuleTab,
  onTabPress,
}: {
  /** When embedded in the container, overrides the URL param. */
  activeModuleTab?: 'matches' | 'messages';
  onTabPress?: (key: MatrimonyModuleTabKey) => boolean | void;
} = {}) {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string | string[] }>();
  const urlTab = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  const [requests, setRequests] = useState<MatrimonyRequestRecord[]>(matrimonyScreenCache.requests);
  const [loading, setLoading] = useState(!matrimonyScreenCache.requestsLoaded);
  const [error, setError] = useState<string | null>(matrimonyScreenCache.requestsError);
  const [access, setAccess] = useState<MatrimonyAccessRecord | null>(matrimonyScreenCache.access);
  const [myProfile, setMyProfile] = useState<MatrimonyProfileRecord | null>(matrimonyScreenCache.myProfile);
  const [myProfileLoaded, setMyProfileLoaded] = useState(matrimonyScreenCache.profileLoaded);
  const [failedImageRequestIds, setFailedImageRequestIds] = useState<Record<string, true>>({});

  useEffect(() => {
    let active = true;
    if (!matrimonyScreenCache.requestsLoaded) {
      setLoading(true);
    }
    matrimonyFeedService
      .loadConnectionRequests()
      .then((result) => {
        if (active) {
          matrimonyScreenCache.requests = result;
          matrimonyScreenCache.requestsLoaded = true;
          matrimonyScreenCache.requestsError = null;
          setRequests(result);
          setError(null);
        }
      })
      .catch(() => {
        if (active) {
          matrimonyScreenCache.requests = [];
          matrimonyScreenCache.requestsLoaded = true;
          matrimonyScreenCache.requestsError = 'Unable to load matrimony requests.';
          setRequests([]);
          setError('Unable to load matrimony requests.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([
        matrimonyFeedService.loadAccess().catch(() => null),
        matrimonyFeedService.loadMyProfile(),
      ]).then(([accessResult, profile]) => {
        if (!active) return;
        matrimonyScreenCache.access = accessResult;
        matrimonyScreenCache.myProfile = profile;
        matrimonyScreenCache.profileLoaded = true;
        setAccess(accessResult);
        setMyProfile(profile);
        setMyProfileLoaded(true);
      });

      return () => {
        active = false;
      };
    }, []),
  );

  // Prop takes priority (embedded in container); fall back to URL param for standalone deep-link usage
  const activeTab = activeModuleTab ?? (urlTab === 'matches' ? 'matches' : 'messages');
  const visibleRequests = useMemo(
    () => requests.filter((request) => request.status === 'ACCEPTED' && (activeTab === 'matches' || request.chatId)),
    [activeTab, requests],
  );
  const title = activeTab === 'matches' ? 'Matches' : 'Messages';
  const subtitle = activeTab === 'matches'
    ? 'All accepted matrimony connections appear here.'
    : 'Accepted matrimony connections with chat appear here.';

  const emptyTitle = activeTab === 'matches' ? 'No matches yet' : 'No matrimony messages yet';
  const emptyDescription = activeTab === 'matches'
    ? 'Accepted matrimony connections will appear here.'
    : 'Send or accept a matrimony request to start a private conversation.';
  const requestsLockedBySubscription = access?.canSendRequest === false;
  const requestsLockedByProfile = myProfileLoaded && !myProfile;
  const requestsLockedByApproval = myProfileLoaded && myProfile !== null && !['APPROVED', 'ACTIVE'].includes(myProfile.status);

  let lockTitle: string | null = null;
  let lockDescription: string | null = null;
  let lockActionLabel: string | null = null;
  let lockAction: (() => void) | null = null;

  if (requestsLockedBySubscription) {
    lockTitle = 'Matrimony access locked';
    lockDescription = access?.reason || 'A matrimony subscription with request access is required to view matches and messages.';
    lockActionLabel = 'Purchase subscription';
    lockAction = () => {
      router.push({
        pathname: '/matrimony/subscribe',
        params: { type: 'PROFILE_CREATION', returnTo: '/member/matrimony?tab=messages' },
      } as never);
    };
  } else if (requestsLockedByProfile) {
    lockTitle = 'Create your matrimony profile';
    lockDescription = 'You need a matrimony profile before matches and messages become available.';
    lockActionLabel = 'Go to Profile';
    lockAction = () => {
      const handled = onTabPress?.('profile');
      if (handled === true) {
        return;
      }
      router.replace({ pathname: '/member/matrimony', params: { tab: 'profile' } } as never);
    };
  } else if (requestsLockedByApproval) {
    lockTitle = 'Profile approval pending';
    lockDescription = myProfile?.hasPendingReview
      ? 'Your matrimony profile update is under review. Messaging will remain available once your approved profile is active.'
      : 'Your matrimony profile is under review. Matches and messages will be available after approval.';
    lockActionLabel = 'Go to Profile';
    lockAction = () => {
      const handled = onTabPress?.('profile');
      if (handled === true) {
        return;
      }
      router.replace({ pathname: '/member/matrimony', params: { tab: 'profile' } } as never);
    };
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1 }}>
        <MatrimonySharedHeader onProfilePress={() => onTabPress?.('profile')} />

        <MatrimonyModuleTabs activeKey={activeTab} onTabPress={onTabPress} />

        {lockTitle && lockDescription ? (
          <View style={{ flex: 1, padding: spacing[4], justifyContent: 'center' }}>
            <View
              style={{
                borderRadius: radius.xl,
                backgroundColor: colors.background.surface,
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                padding: spacing[5],
                gap: spacing[4],
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: radius.full,
                  backgroundColor: colors.primary.muted,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialIcons name="lock" size={28} color={colors.primary.DEFAULT} />
              </View>
              <View style={{ gap: spacing[2], alignItems: 'center' }}>
                <Text variant="h3" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, textAlign: 'center' }}>
                  {lockTitle}
                </Text>
                <Text variant="body" style={{ color: colors.text.secondary, lineHeight: 22, textAlign: 'center' }}>
                  {lockDescription}
                </Text>
              </View>
              {lockAction && lockActionLabel ? (
                <Button fullWidth rounded onPress={lockAction}>
                  {lockActionLabel}
                </Button>
              ) : null}
            </View>
          </View>
        ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing[4] }}>

          <View style={{ padding: spacing[4], gap: spacing[3] }}>
            {error ? (
              <View style={{ borderRadius: radius.lg, backgroundColor: colors.status.errorLight, padding: spacing[3] }}>
                <Text variant="caption" style={{ color: colors.status.error, fontFamily: typography.fontFamily.bold }}>
                  {error}
                </Text>
              </View>
            ) : null}

            <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
              {title}
            </Text>
            <Text variant="body" style={{ color: colors.text.secondary, lineHeight: 22 }}>
              {subtitle}
            </Text>

            {loading ? (
              <MatrimonyMessagesSkeleton />
            ) : visibleRequests.length ? (
              <View style={{ gap: spacing[3] }}>
                {visibleRequests.map((request) => {
                  const name = getOtherPersonName(request);
                  const profileImage = failedImageRequestIds[request.id] ? null : getOtherProfileImage(request);
                  const hasChat = Boolean(request.chatId);
                  return (
                    <TouchableOpacity
                      key={request.id}
                      accessibilityRole="button"
                      activeOpacity={0.85}
                      disabled={!hasChat}
                      onPress={() => {
                        if (!request.chatId) {
                          return;
                        }
                        router.push({
                          pathname: '/events/event-live-chat',
                          params: {
                            chatId: request.chatId,
                            chatTitle: name,
                            chatContext: 'matrimony',
                            profileId: getOtherProfileId(request),
                          },
                        } as never);
                      }}
                      style={{
                        borderRadius: radius.xl,
                        backgroundColor: colors.background.surface,
                        borderWidth: 1,
                        borderColor: colors.border.DEFAULT,
                        padding: spacing[4],
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: spacing[3],
                        opacity: hasChat ? 1 : 0.75,
                      }}>
                      <View
                        style={{
                          width: 48,
                          minWidth: 48,
                          height: 48,
                          borderRadius: radius.full,
                          backgroundColor: colors.primary.muted,
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          borderWidth: profileImage ? 0 : 1,
                          borderColor: profileImage ? 'transparent' : colors.primary.borderLight,
                        }}>
                        {profileImage ? (
                          <Image
                            source={{ uri: profileImage }}
                            onError={() => {
                              setFailedImageRequestIds((current) => (current[request.id] ? current : { ...current, [request.id]: true }));
                            }}
                            resizeMode="cover"
                            style={{ width: '100%', height: '100%' }}
                          />
                        ) : (
                          <MaterialIcons name="favorite" size={20} color={colors.primary.DEFAULT} />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                          {name}
                        </Text>
                        <Text variant="caption" style={{ color: colors.text.muted, marginTop: 2 }}>
                          {hasChat ? `Connected ${formatDate(request.createdAt)}` : 'Accepted'}
                        </Text>
                      </View>
                      {hasChat ? <MaterialIcons name="chevron-right" size={22} color={colors.text.muted} /> : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View
                style={{
                  borderRadius: radius.xl,
                  backgroundColor: colors.background.surface,
                  borderWidth: 1,
                  borderColor: colors.border.DEFAULT,
                  padding: spacing[5],
                  alignItems: 'center',
                  gap: spacing[2],
                }}>
                <MaterialIcons name="forum" size={28} color={colors.text.muted} />
                <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                  {emptyTitle}
                </Text>
                <Text variant="caption" style={{ color: colors.text.muted, textAlign: 'center' }}>
                  {emptyDescription}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        )}


      </View>
    </SafeAreaView>
  );
}
