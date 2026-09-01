import { TextInput, View } from 'react-native';

import { Text } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

function SurfaceInput({
  label,
  placeholder,
  suffix,
}: {
  label: string;
  placeholder: string;
  suffix?: string;
}) {
  return (
    <View style={{ width: '48%', gap: spacing[2] }}>
      <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </Text>
      {suffix ? (
        <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor="#94a3b8"
            style={{
              flex: 1,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(212,195,190,0.5)',
              backgroundColor: '#ffffff',
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[4],
              fontFamily: typography.fontFamily.medium,
            }}
          />
          <View style={{ justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(212,195,190,0.5)', backgroundColor: '#f8fafc', paddingHorizontal: spacing[4] }}>
            <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.bold }}>
              {suffix}
            </Text>
          </View>
        </View>
      ) : (
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(212,195,190,0.5)',
            backgroundColor: '#ffffff',
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[4],
            fontFamily: typography.fontFamily.medium,
          }}
        />
      )}
    </View>
  );
}

export { SurfaceInput };
