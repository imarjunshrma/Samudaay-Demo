import { Image, Linking, Pressable, View } from 'react-native';

import { Icon, Text } from '@/src/components';
import { colors, spacing, typography } from '@/src/theme';

type Trustee = {
  id?: string;
  name: string;
  role: string;
  meta: string;
  image?: string | null;
  phone?: string | null;
};

export function TrusteesList({ trustees }: { trustees: readonly Trustee[] }) {
  return (
    <View>
      {trustees.map((item, index) => (
        <View
          key={`${item.id || item.name || 'trustee'}-${index}`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[4],
            marginHorizontal: spacing[4],
            marginBottom: spacing[3],
            backgroundColor: '#ffffff',
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[5],
            borderRadius: 20,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: 'rgba(24,168,117,0.05)',
          }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: 'rgba(24,168,117,0.2)',
              backgroundColor: colors.primary.muted,
            }}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="person" size={32} color={colors.primary.DEFAULT} />
              </View>
            )}
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              variant="body"
              style={{
                color: colors.text.primary,
                fontFamily: typography.fontFamily.bold,
              }}>
              {item.name}
            </Text>
            <Text
              variant="caption"
              style={{
                color: colors.primary.DEFAULT,
                fontFamily: typography.fontFamily.semibold,
                fontSize: 14,
                marginTop: 2,
                marginBottom: 4,
              }}>
              {item.role}
            </Text>
            <Text
              variant="caption"
              style={{
                color: '#6b7280',
                fontSize: 12,
                lineHeight: 18,
              }}>
              {item.meta}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              const dialPhoneNumber = item.phone?.replace(/[^\d+#*]/g, '') ?? '';
              if (!dialPhoneNumber) {
                return;
              }
              void Linking.openURL(`tel:${dialPhoneNumber}`);
            }}
            accessibilityRole="button"
            accessibilityState={{ disabled: !item.phone }}
            disabled={!item.phone}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              minHeight: 36,
              paddingHorizontal: spacing[4],
              backgroundColor: index === 0 ? colors.primary.DEFAULT : 'rgba(24,168,117,0.1)',
              opacity: item.phone ? 1 : 0.55,
            }}>
            <Text
              variant="caption"
              style={{
                color: index === 0 ? '#ffffff' : colors.primary.DEFAULT,
                fontFamily: typography.fontFamily.bold,
                fontSize: 14,
              }}>
              Contact
            </Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}
