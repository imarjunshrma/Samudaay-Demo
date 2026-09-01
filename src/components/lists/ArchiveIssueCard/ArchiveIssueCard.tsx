import { Image, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components/ui';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export interface ArchiveIssueCardProps {
  title: string;
  edition: string;
  image?: string | null;
  statusLabel?: string | null;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  manageActionLabel?: string | null;
  showSecondaryAction?: boolean;
  showDeleteAction?: boolean;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  onManagePress?: () => void;
  onDeletePress?: () => void;
}

export function ArchiveIssueCard({
  title,
  edition,
  image,
  statusLabel,
  primaryActionLabel = 'Read Online',
  secondaryActionLabel = 'PDF',
  manageActionLabel = null,
  showSecondaryAction = false,
  showDeleteAction = false,
  onPrimaryPress,
  onSecondaryPress,
  onManagePress,
  onDeletePress,
}: ArchiveIssueCardProps) {
  return (
    <View
      style={{
        borderRadius: 28,
        backgroundColor: '#ffffff',
        padding: spacing[4],
        borderWidth: 1,
        borderColor: 'rgba(242,120,13,0.05)',
        gap: spacing[4],
        ...shadows.sm,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[4] }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
              {title}
            </Text>
          <Text variant="caption" color={colors.text.muted}>
              {edition}
            </Text>
          {statusLabel ? (
            <View
              style={{
                alignSelf: 'flex-start',
                marginTop: spacing[2],
                borderRadius: radius.full,
                backgroundColor: colors.primary.subtle,
                paddingHorizontal: spacing[2],
                paddingVertical: 4,
              }}>
              <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
                {statusLabel}
              </Text>
            </View>
          ) : null}
        </View>
        <View>
          {image ? (
            <Image
              source={{ uri: image }}
              resizeMode="cover"
              style={{ width: 96, height: 128, borderRadius: radius.lg, backgroundColor: '#f1f5f9' }}
            />
          ) : (
            <View
              style={{
                width: 96,
                height: 128,
                borderRadius: radius.lg,
                backgroundColor: colors.primary.subtle,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialIcons name="menu-book" size={28} color={colors.primary.DEFAULT} />
            </View>
          )}
          {showDeleteAction ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Delete publication"
              activeOpacity={0.85}
              onPress={onDeletePress}
              style={{
                position: 'absolute',
                top: spacing[1],
                right: spacing[1],
                width: 32,
                height: 32,
                borderRadius: radius.full,
                borderWidth: 1,
                borderColor: '#fecaca',
                backgroundColor: '#fff1f2',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialIcons name="delete-outline" size={18} color={colors.status.error} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[2] }}>
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={onPrimaryPress}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[2],
            borderRadius: radius.lg,
            backgroundColor: colors.primary.DEFAULT,
            paddingVertical: spacing[3],
          }}>
          <MaterialIcons name="menu-book" size={18} color={colors.text.inverse} />
          <Text variant="body" style={{ color: colors.text.inverse, fontFamily: typography.fontFamily.bold }}>
            {primaryActionLabel}
          </Text>
        </TouchableOpacity>
        {showSecondaryAction ? (
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={onSecondaryPress}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[2],
              borderRadius: radius.lg,
              backgroundColor: colors.primary.subtle,
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[3],
              borderWidth: 1,
              borderColor: colors.primary.borderLight,
            }}>
            <MaterialIcons name="download" size={18} color={colors.primary.DEFAULT} />
            <Text variant="body" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>
              {secondaryActionLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {manageActionLabel ? (
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.85}
          onPress={onManagePress}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
            backgroundColor: '#ffffff',
            paddingVertical: spacing[3],
          }}>
          <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
            {manageActionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
