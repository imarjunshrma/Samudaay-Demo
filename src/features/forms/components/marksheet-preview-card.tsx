import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export type MarksheetPreviewCardProps = {
  fileName: string;
  fileSizeLabel?: string | null;
  academicYear: string;
  standardSemester: string;
  department: string;
  createdAt?: string | null;
  onView?: () => void;
  onDelete?: () => void;
};

export function MarksheetPreviewCard({
  fileName,
  fileSizeLabel,
  academicYear,
  standardSemester,
  department,
  createdAt,
  onView,
  onDelete,
}: MarksheetPreviewCardProps) {
  return (
    <View
      style={{
        marginTop: spacing[4],
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        backgroundColor: colors.background.surface,
        padding: spacing[4],
        gap: spacing[3],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], flex: 1 }}>
        <View style={{ width: 40, height: 40, borderRadius: radius.lg, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="description" size={20} color={colors.primary.DEFAULT} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="caption" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold, fontSize: 13 }}>
            {fileName}
          </Text>
          <Text variant="caption" color={colors.text.muted} style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6 }}>
            {academicYear} • {standardSemester} • {department}
          </Text>
          {createdAt ? (
            <Text variant="caption" color={colors.text.muted} style={{ fontSize: 10, marginTop: 2 }}>
              {new Date(createdAt).toLocaleDateString('en-IN')}
              {fileSizeLabel ? ` • ${fileSizeLabel}` : ''}
            </Text>
          ) : fileSizeLabel ? (
            <Text variant="caption" color={colors.text.muted} style={{ fontSize: 10, marginTop: 2 }}>
              {fileSizeLabel}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: spacing[3] }}>
        {onDelete ? (
          <Pressable onPress={onDelete} style={{ width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="delete-outline" size={20} color={colors.status.error} />
          </Pressable>
        ) : null}
        {onView ? (
          <Pressable onPress={onView} style={{ width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="visibility" size={20} color={colors.primary.DEFAULT} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
