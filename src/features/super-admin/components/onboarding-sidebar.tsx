import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

function OnboardingSidebar() {
  return (
    <View style={{ width: 240, paddingVertical: spacing[6], backgroundColor: '#f4efe8', borderRightWidth: 1, borderRightColor: 'rgba(212,195,190,0.3)' }}>
      <View style={{ paddingHorizontal: spacing[6], marginBottom: spacing[6] }}>
        <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
          New Organization
        </Text>
      </View>
      <View style={{ gap: spacing[1] }}>
        {['Organization Details', 'Licensing & Seats', 'Brand Configuration', 'Review & Launch'].map((label, index) => (
          <TouchableOpacity
            key={label}
            accessibilityRole="button"
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[3],
              paddingHorizontal: spacing[6],
              paddingVertical: spacing[3],
              backgroundColor: index === 0 ? '#ebe3dc' : 'transparent',
              borderTopRightRadius: 999,
              borderBottomRightRadius: 999,
              transform: [{ translateX: index === 0 ? 4 : 0 }],
            }}>
            <MaterialIcons name={['domain', 'verified-user', 'palette', 'rocket-launch'][index] as never} size={20} color={index === 0 ? colors.primary.DEFAULT : colors.text.muted} />
            <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, color: index === 0 ? colors.text.primary : colors.text.secondary }}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export { OnboardingSidebar };
