import { MaterialIcons } from '@expo/vector-icons';
import { Image, TouchableOpacity, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { DiscoveryCardProps } from './discovery-card';

export function PremiumDiscoveryCard({
  name,
  subtitle,
  image,
  ageHeight,
  education,
  profession,
}: Pick<DiscoveryCardProps, 'name' | 'subtitle' | 'image' | 'ageHeight' | 'education' | 'profession'>) {
  return (
    <View style={{ backgroundColor: colors.background.surface, borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: colors.primary.borderLight }}>
      <View style={{ position: 'relative', aspectRatio: 4 / 5, overflow: 'hidden' }}>
        <Image source={{ uri: image }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
        <TouchableOpacity activeOpacity={0.85} style={{ position: 'absolute', top: spacing[4], right: spacing[4], width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.background.surface, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
          <MaterialIcons name="favorite" size={20} color={colors.primary.DEFAULT} />
        </TouchableOpacity>
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing[4], backgroundColor: 'rgba(242,120,13,0.82)' }}>
          <Text variant="h2" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 30, lineHeight: 34 }}>
            {name}
          </Text>
          <Text variant="caption" color="rgba(255,255,255,0.82)" style={{ fontFamily: typography.fontFamily.medium, textTransform: 'uppercase', letterSpacing: 1 }}>
            {subtitle}
          </Text>
        </View>
      </View>
      <View style={{ padding: spacing[4] }}>
        <View style={{ gap: spacing[4], marginBottom: spacing[4] }}>
          <View>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
              Age &amp; Height
            </Text>
            <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.medium, marginTop: 2 }}>
              {ageHeight}
            </Text>
          </View>
          <View>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
              Education
            </Text>
            <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.medium, marginTop: 2 }}>
              {education}
            </Text>
          </View>
          <View>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
              Profession
            </Text>
            <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.medium, marginTop: 2 }}>
              {profession}
            </Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.85} style={{ width: '100%', borderRadius: radius.lg, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[4], flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2] }}>
          <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
            Send Connection Request
          </Text>
          <MaterialIcons name="send" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
