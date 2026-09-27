import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { Button, Text } from '@/src/components';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { matrimonyFeedService, type MatrimonyAccessRecord, type MatrimonyProfileRecord, type MatrimonyRequestRecord } from '../services/matrimony-feed-service';
import { matrimonyScreenCache } from '../services/matrimony-screen-cache';
import { MatrimonyMessagesSkeleton } from './matrimony-loading-states';
import { MatrimonyModuleTabs, type MatrimonyModuleTabKey } from './matrimony-module-tabs';
import { MatrimonySharedHeader } from './matrimony-shared-header';

function formatDate(value?: string | null, locale = 'en-IN', fallback = 'Recently') {
  if (!value) return fallback;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function MatrimonyRequestsContent({
  onTabPress,
}: {
  onTabPress?: (key: MatrimonyModuleTabKey) => boolean | void;
} = {}) {
  const router = useRouter();
  const t = useTranslations();
  const { language } = useAppPreferences();
  const [requests, setRequests] = useState<MatrimonyRequestRecord[]>(matrimonyScreenCache.requests);
  const [loading, setLoading] = useState(!matrimonyScreenCache.requestsLoaded);
  const [actioningRequestId, setActioningRequestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(matrimonyScreenCache.requestsError);
  const [access, setAccess] = useState<MatrimonyAccessRecord | null>(matrimonyScreenCache.access);
  const [myProfile, setMyProfile] = useState<MatrimonyProfileRecord | null>(matrimonyScreenCache.myProfile);
  const [myProfileLoaded, setMyProfileLoaded] = useState(matrimonyScreenCache.profileLoaded);

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
          matrimonyScreenCache.requestsError = t('matrimony.requests.errors.load');
          setRequests([]);
          setError(t('matrimony.requests.errors.load'));
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
  }, [t]);

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

  const pendingReceivedRequests = useMemo(
    () => requests.filter((request) => request.status === 'PENDING' && request.direction === 'received'),
    [requests],
  );
  const pendingSentRequests = useMemo(
    () => requests.filter((request) => request.status === 'PENDING' && request.direction === 'sent'),
    [requests],
  );
  const requestsLockedBySubscription = access?.canSendRequest === false;
  const requestsLockedByProfile = myProfileLoaded && !myProfile;
  const requestsLockedByApproval = myProfileLoaded && myProfile !== null && !['APPROVED', 'ACTIVE'].includes(myProfile.status);

  let lockTitle: string | null = null;
  let lockDescription: string | null = null;
  let lockActionLabel: string | null = null;
  let lockAction: (() => void) | null = null;

  if (requestsLockedBySubscription) {
    lockTitle = 'Matrimony access locked';
    lockDescription = access?.reason || 'A matrimony subscription with request access is required to manage requests.';
    lockActionLabel = 'Purchase subscription';
    lockAction = () => {
      router.push({
        pathname: '/matrimony/subscribe',
        params: { type: 'PROFILE_CREATION', returnTo: '/member/matrimony?tab=requests' },
      } as never);
    };
  } else if (requestsLockedByProfile) {
    lockTitle = 'Create your matrimony profile';
    lockDescription = 'You need a matrimony profile before requests become available.';
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
      ? 'Your matrimony profile update is under review. New requests remain locked until your approved profile is active.'
      : 'Your matrimony profile is under review. Requests will be available after approval.';
    lockActionLabel = 'Go to Profile';
    lockAction = () => {
      const handled = onTabPress?.('profile');
      if (handled === true) {
        return;
      }
      router.replace({ pathname: '/member/matrimony', params: { tab: 'profile' } } as never);
    };
  }

  async function reviewRequest(requestId: string, action: 'accept' | 'reject' | 'cancel') {
    setActioningRequestId(requestId);
    setError(null);
    try {
      const updated = await matrimonyFeedService.reviewConnectionRequest(requestId, action);
      setRequests((current) => {
        const nextRequests = current.map((request) => (request.id === requestId ? updated : request));
        matrimonyScreenCache.requests = nextRequests;
        return nextRequests;
      });
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : t('matrimony.requests.errors.update'));
    } finally {
      setActioningRequestId(null);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1 }}>
        <MatrimonySharedHeader onProfilePress={() => onTabPress?.('profile')} />

        <MatrimonyModuleTabs activeKey="requests" onTabPress={onTabPress} />

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

          <View style={{ padding: spacing[4], gap: spacing[4] }}>
            {error ? (
              <View style={{ borderRadius: radius.lg, backgroundColor: colors.status.errorLight, padding: spacing[3] }}>
                <Text variant="caption" style={{ color: colors.status.error, fontFamily: typography.fontFamily.bold }}>
                  {error}
                </Text>
              </View>
            ) : null}

            <View style={{ gap: spacing[2] }}>
              <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                {t('matrimony.requests.receivedTitle')}
              </Text>
              {loading ? (
                <MatrimonyMessagesSkeleton />
              ) : pendingReceivedRequests.length ? (
                <View style={{ gap: spacing[3] }}>
                  {pendingReceivedRequests.map((request) => {
                    const busy = actioningRequestId === request.id;
                    return (
                      <View key={request.id} style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4], gap: spacing[3] }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                          <MaterialIcons name="favorite-border" size={22} color={colors.primary.DEFAULT} />
                          <View style={{ flex: 1 }}>
                            <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                              {request.sender || 'Matrimony match'}
                            </Text>
                            <Text variant="caption" style={{ color: colors.text.muted, marginTop: 2 }}>
                              {t('matrimony.requests.requestedOn', {
                                date: formatDate(request.createdAt, language === 'gu' ? 'gu-IN' : 'en-IN', t('matrimony.requests.recently')),
                              })}
                            </Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                          <View style={{ flex: 1 }}>
                            <Button variant="outline" fullWidth disabled={busy} onPress={() => reviewRequest(request.id, 'reject')}>{t('matrimony.requests.reject')}</Button>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Button variant="primary" fullWidth disabled={busy} onPress={() => reviewRequest(request.id, 'accept')}>{t('matrimony.requests.accept')}</Button>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <Text variant="caption" style={{ color: colors.text.muted }}>{t('matrimony.requests.emptyReceived')}</Text>
              )}
            </View>

            <View style={{ gap: spacing[2] }}>
              <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                {t('matrimony.requests.sentTitle')}
              </Text>
              {loading ? (
                <MatrimonyMessagesSkeleton />
              ) : pendingSentRequests.length ? (
                <View style={{ gap: spacing[3] }}>
                  {pendingSentRequests.map((request) => {
                    const busy = actioningRequestId === request.id;
                    return (
                      <View key={request.id} style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.border.DEFAULT, padding: spacing[4], gap: spacing[3] }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                          <MaterialIcons name="schedule" size={22} color={colors.text.muted} />
                          <View style={{ flex: 1 }}>
                            <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                              {request.receiver || t('matrimony.requests.defaultMatch')}
                            </Text>
                            <Text variant="caption" style={{ color: colors.text.muted, marginTop: 2 }}>
                              {t('matrimony.requests.waiting')}
                            </Text>
                          </View>
                        </View>
                        <Button variant="outline" fullWidth disabled={busy} onPress={() => reviewRequest(request.id, 'cancel')}>
                          {t('matrimony.requests.cancel')}
                        </Button>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <Text variant="caption" style={{ color: colors.text.muted }}>{t('matrimony.requests.emptySent')}</Text>
              )}
            </View>
          </View>
        </ScrollView>
        )}


      </View>
    </SafeAreaView>
  );
}
