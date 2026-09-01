import { Image, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export type StudentCardProps = {
  name: string;
  gujaratiName: string;
  parent: string;
  school: string;
  classLabel: string;
  image: string;
  raised?: boolean;
};

export function StudentCard({
  name,
  gujaratiName,
  parent,
  school,
  classLabel,
  image,
  raised = false,
}: StudentCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.background.surface,
        borderRadius: radius.xl,
        overflow: 'hidden',
        marginTop: raised ? spacing[12] : 0,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
      }}>
      <View style={{ position: 'relative', aspectRatio: 4 / 3 }}>
        <Image source={{ uri: image }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
        <View style={{ position: 'absolute', top: spacing[4], left: spacing[4] }}>
          <View style={{ backgroundColor: 'rgba(242,120,13,0.1)', borderRadius: 999, paddingHorizontal: spacing[3], paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(242,120,13,0.2)' }}>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2 }}>
              {classLabel}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ padding: spacing[6], gap: spacing[4] }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
              {name}
            </Text>
            <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.medium, opacity: 0.9 }}>
              {gujaratiName}
            </Text>
          </View>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ padding: spacing[3], backgroundColor: colors.primary.muted, borderRadius: radius.full }}>
            <MaterialIcons name="download" size={20} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>

        <View style={{ gap: spacing[3], paddingTop: spacing[4], borderTopWidth: 1, borderTopColor: colors.primary.borderLight }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1, fontFamily: typography.fontFamily.bold }}>
              Parent
            </Text>
            <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.semibold }}>
              {parent}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1, fontFamily: typography.fontFamily.bold }}>
              School
            </Text>
            <Text variant="body" style={{ color: colors.text.primary }}>
              {school}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
