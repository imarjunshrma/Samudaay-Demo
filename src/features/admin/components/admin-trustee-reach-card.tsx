import { Image, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard, SearchInput, Text } from '@/src/components';

import { adminBottomBarItems } from '@/src/core/navigation/admin-shell';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminTrusteeReachCard() {
  return (
    <View
      style={{
        marginHorizontal: spacing[4],
        marginTop: spacing[3],
        marginBottom: spacing[5],
        padding: spacing[4],
        borderRadius: radius.xl,
        backgroundColor: colors.primary.DEFAULT,
        ...shadows.sm,
      }}>
      <Text style={{ color: colors.text.inverse, fontFamily: typography.fontFamily.bold, fontSize: 18, marginBottom: spacing[3] }}>
        Our Reach
      </Text>
      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontFamily: typography.fontFamily.bold }}>
            Members
          </Text>
          <Text style={{ color: colors.text.inverse, fontFamily: typography.fontFamily.bold, fontSize: 24, lineHeight: 28 }}>
            12,500+
          </Text>
        </View>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontFamily: typography.fontFamily.bold }}>
            Districts
          </Text>
          <Text style={{ color: colors.text.inverse, fontFamily: typography.fontFamily.bold, fontSize: 24, lineHeight: 28 }}>
            48
          </Text>
        </View>
      </View>
    </View>
  );
}
