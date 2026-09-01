import type { ReactNode } from 'react';
import { Image, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export function EventScannerMemberSheet({
  name,
  memberId,
  eventTitle,
  avatar,
  children,
}: {
  name: string;
  memberId: string;
  eventTitle: string;
  avatar: string;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: '#ffffff', paddingHorizontal: spacing[6], paddingTop: spacing[4], paddingBottom: spacing[6] + insets.bottom }}>
      <View style={{ alignItems: 'center', marginBottom: spacing[6] }}>
        <View style={{ width: 48, height: 6, borderRadius: radius.full, backgroundColor: '#e2e8f0' }} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], marginBottom: spacing[5] }}>
        <Image source={{ uri: avatar }} resizeMode="cover" style={{ width: 80, height: 80, borderRadius: radius.xl, borderWidth: 2, borderColor: colors.primary.DEFAULT }} />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' }}>
            <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>{name}</Text>
            <View style={{ borderRadius: radius.full, backgroundColor: '#dcfce7', paddingHorizontal: spacing[2], paddingVertical: 3 }}>
              <Text variant="caption" color="#15803d" style={{ fontFamily: typography.fontFamily.bold, fontSize: 10, textTransform: 'uppercase' }}>Verified</Text>
            </View>
          </View>
          <Text variant="caption" color="#64748b">Member ID: {memberId}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
            <MaterialIcons name="event-available" size={14} color={colors.primary.DEFAULT} />
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>{eventTitle}</Text>
          </View>
        </View>
      </View>
      {children}
    </View>
  );
}
