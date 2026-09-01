import { Image, View } from 'react-native';

import { Icon, Text } from '@/src/components/ui';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export interface MatchCardProps {
  name: string;
  age: string;
  profileId?: string;
  image?: string;
  chips?: string[];
  description?: string;
  verified?: boolean;
  variant?: 'discovery' | 'compact';
}

export function MatchCard({
  name,
  age,
  profileId,
  image,
  chips = [],
  description,
  verified = false,
  variant = 'discovery',
}: MatchCardProps) {
  if (variant === 'compact') {
    return (
      <View
        style={{
          borderRadius: 28,
          backgroundColor: '#ffffff',
          padding: spacing[5],
          gap: spacing[3],
          ...shadows.sm,
        }}>
        <Text variant="h4" style={{ color: '#2f1d16', fontFamily: typography.fontFamily.bold }}>
          {name}, {age}
        </Text>
        <Text variant="body" color={colors.text.secondary}>
          {description}
        </Text>
        <Text variant="caption" color={colors.primary.DEFAULT} style={{ letterSpacing: 1, textTransform: 'uppercase' }}>
          Highly compatible
        </Text>
      </View>
    );
  }

  return (
    <View style={{ borderRadius: 30, overflow: 'hidden', backgroundColor: '#ffffff', ...shadows.md }}>
      {image ? <Image source={{ uri: image }} resizeMode="cover" style={{ width: '100%', height: 280 }} /> : null}
      <View style={{ padding: spacing[5], gap: spacing[3] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
              {name}, {age}
            </Text>
            {profileId ? <Text variant="caption" color={colors.text.muted}>Profile ID: {profileId}</Text> : null}
          </View>
          {verified ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="verified" size={18} color="#059669" />
              <Text variant="caption" color="#059669" style={{ fontFamily: typography.fontFamily.bold }}>
                Verified
              </Text>
            </View>
          ) : null}
        </View>
        {chips.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
            {chips.map((item) => (
              <View key={item} style={{ borderRadius: radius.full, backgroundColor: '#fff7ed', paddingHorizontal: spacing[3], paddingVertical: 6 }}>
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
        {description ? (
          <Text variant="body" color={colors.text.secondary} style={{ lineHeight: 22 }}>
            {description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
