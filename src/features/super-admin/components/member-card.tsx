import { View } from 'react-native';

import { Card, Text } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

function MemberCard() {
  return (
    <Card variant="elevated" padding="lg">
      <View style={{ gap: spacing[4], alignItems: 'center' }}>
        <View style={{ width: 128, height: 128, borderRadius: 999, backgroundColor: '#f8fafc', borderWidth: 4, borderColor: 'rgba(24,168,117,0.1)' }} />
        <View style={{ alignItems: 'center' }}>
          <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
            Rajesh Kumar
          </Text>
          <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold }}>
            ID: IC-2024-0891
          </Text>
          <View style={{ marginTop: spacing[2], borderRadius: 999, backgroundColor: colors.primary.subtle, paddingHorizontal: spacing[3], paddingVertical: spacing[1] }}>
            <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
              Current Role: Member
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

export { MemberCard };
