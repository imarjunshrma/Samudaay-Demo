import { MaterialIcons } from '@expo/vector-icons';
import { Image, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export function MatrimonyApprovalRow({
  name,
  locationAge,
  status,
  image,
}: {
  name: string;
  locationAge: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  image?: string | null;
}) {
  const statusStyles =
    status === 'Approved'
      ? { backgroundColor: 'rgba(0,80,75,0.1)', color: colors.status.success }
      : status === 'Rejected'
        ? { backgroundColor: colors.status.errorLight, color: colors.status.error }
        : { backgroundColor: colors.primary.muted, color: colors.primary.DEFAULT };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], padding: spacing[4] }}>
      <View style={{ width: 48, height: 48, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.background.muted, flexShrink: 0 }}>
        {image ? (
          <Image source={{ uri: image }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
        ) : (
          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="person" size={22} color={colors.text.muted} />
          </View>
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }} numberOfLines={1}>
          {name}
        </Text>
        <Text variant="caption" color={colors.text.muted}>
          {locationAge}
        </Text>
      </View>
      <Text
        variant="caption"
        style={{
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[1],
          borderRadius: radius.full,
          backgroundColor: statusStyles.backgroundColor,
          color: statusStyles.color,
          fontFamily: typography.fontFamily.bold,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
        {status}
      </Text>
    </View>
  );
}
