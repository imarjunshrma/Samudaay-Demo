import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components/ui/Text';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { colors, radius, spacing, typography } from '@/src/theme';

export interface PaginationProps {
  pages: readonly (string | number)[];
  activePage: string | number;
  onChange?: (page: string | number) => void;
  loading?: boolean;
  showArrows?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

export function Pagination({
  pages,
  activePage,
  onChange,
  loading = false,
  showArrows = true,
  onPrevious,
  onNext,
}: PaginationProps) {
  if (loading) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing[2], marginTop: spacing[4], marginBottom: spacing[8] }}>
        {showArrows ? <SkeletonBlock width={28} height={28} radiusSize={radius.lg} /> : null}
        {pages.map((page) => (
          <SkeletonBlock key={String(page)} width={40} height={40} radiusSize={radius.lg} />
        ))}
        {showArrows ? <SkeletonBlock width={28} height={28} radiusSize={radius.lg} /> : null}
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing[2], marginTop: spacing[4], marginBottom: spacing[8] }}>
      {showArrows ? (
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ padding: spacing[2], borderRadius: radius.lg }} onPress={onPrevious}>
          <MaterialIcons name="chevron-left" size={24} color={colors.text.muted} />
        </TouchableOpacity>
      ) : null}
      {pages.map((page) => {
        const active = page === activePage;
        return (
          <TouchableOpacity
            key={String(page)}
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() => onChange?.(page)}
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.lg,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: active ? colors.primary.DEFAULT : colors.background.surface,
            }}>
            <Text style={{ color: active ? colors.text.inverse : colors.text.primary, fontFamily: typography.fontFamily.bold }}>
              {page}
            </Text>
          </TouchableOpacity>
        );
      })}
      {showArrows ? (
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ padding: spacing[2], borderRadius: radius.lg }} onPress={onNext}>
          <MaterialIcons name="chevron-right" size={24} color={colors.text.muted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
