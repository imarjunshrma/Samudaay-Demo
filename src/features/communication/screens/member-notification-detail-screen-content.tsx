import { useEffect } from 'react';
import { Image, Platform, ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { AppHeader, Card, Text } from '@/src/components';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { notificationFeedService } from '../services/notification-feed-service';
import { colors, radius, spacing, typography } from '@/src/theme';

function readParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

const multilingualTextStyle = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: undefined,
  }),
  fontWeight: undefined,
} as const;

export function MemberNotificationDetailScreenContent() {
  const navigateBack = useBackNavigation();
  const params = useLocalSearchParams<{
    notificationId?: string;
    title?: string;
    message?: string;
    image?: string;
    senderName?: string;
    time?: string;
    tag?: string;
    returnTo?: string;
  }>();

  const notificationId = readParam(params.notificationId) || '';
  const title = readParam(params.title) || 'Notification';
  const message = readParam(params.message) || '';
  const image = readParam(params.image) || '';
  const senderName = readParam(params.senderName) || '';
  const time = readParam(params.time) || '';
  const tag = readParam(params.tag) || 'Update';

  useEffect(() => {
    if (!notificationId) {
      return;
    }

    void notificationFeedService.markNotificationRead(notificationId);
  }, [notificationId]);

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center' }}>
        <AppHeader
          title="Notification Details"
          variant="back-inline"
          onLeftPress={navigateBack}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: spacing[4], paddingBottom: spacing[8], gap: spacing[4] }}>
          <Card variant="elevated" padding="lg" style={{ borderColor: colors.primary.borderLight }}>
            <View style={{ gap: spacing[3] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
                <Text
                  variant="caption"
                  color={colors.primary.DEFAULT}
                  style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  {tag}
                </Text>
                {time ? (
                  <Text variant="caption" color={colors.text.muted}>
                    {time}
                  </Text>
                ) : null}
              </View>
              <Text variant="h3" style={{ fontFamily: typography.fontFamily.bold }}>
                {title}
              </Text>
              {senderName ? (
                <Text variant="body" color={colors.text.secondary}>
                  From {senderName}
                </Text>
              ) : null}
            </View>
          </Card>

          {image ? (
            <Image
              source={{ uri: image }}
              resizeMode="cover"
              style={{
                width: '100%',
                height: 340,
                borderRadius: radius.xl,
                backgroundColor: colors.background.elevated,
              }}
            />
          ) : null}

          <Card variant="default" padding="lg" style={{ borderColor: colors.primary.borderLight }}>
            <Text variant="body" color={colors.text.secondary} style={[{ lineHeight: 24 }, multilingualTextStyle]}>
              {message}
            </Text>
          </Card>
        </ScrollView>
      </View>
    </AppSafeAreaView>
  );
}
