import { Image, Pressable, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EmptyState, ErrorState, ListRowSkeleton, Text } from '@/src/components';

import { colors, radius, spacing, typography } from '@/src/theme';

export function DashboardUpdatesList({
  items,
  onItemPress,
  isLoading = false,
  errorMessage,
  onRetry,
}: {
  items: readonly { title: string; description: string; image?: string }[];
  onItemPress?: (item: { title: string; description: string; image?: string }) => void;
  isLoading?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}) {
  const visibleItems = items.map((item) => ({
    ...item,
    title: item.title.trim() || 'Community update',
    description: item.description.trim() || 'New community activity.',
  }));

  if (isLoading && !visibleItems.length) {
    return (
      <View style={{ minHeight: 128, gap: spacing[4] }}>
        {Array.from({ length: 3 }, (_, index) => (
          <ListRowSkeleton key={index} minHeight={80} showTrailing={false} />
        ))}
      </View>
    );
  }

  if (errorMessage && !visibleItems.length) {
    return (
      <ErrorState
        title="Unable to load recent updates"
        description={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (!visibleItems.length) {
    return (
      <EmptyState
        icon="notifications-none"
        title="No recent updates"
        description="New community notices and registration updates will appear here."
        size="sm"
      />
    );
  }

  return (
    <View style={{ gap: spacing[4] }}>
      {errorMessage ? (
        <ErrorState
          title="Recent updates may be outdated"
          description={errorMessage}
          onRetry={onRetry}
        />
      ) : null}
      {visibleItems.map((item, index) => (
        <Pressable
          key={`${item.title}-${item.description}-${index}`}
          accessibilityRole={onItemPress ? 'button' : undefined}
          onPress={onItemPress ? () => onItemPress(item) : undefined}
          style={{
            flexDirection: 'row',
            gap: spacing[4],
            padding: spacing[3],
            backgroundColor: colors.background.surface,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
            opacity: 1,
          }}>
          {item.image ? (
            <View style={{ width: 48, height: 48, borderRadius: radius.lg, overflow: 'hidden', flexShrink: 0 }}>
              <Image source={{ uri: item.image }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
            </View>
          ) : (
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: radius.lg,
                backgroundColor: colors.primary.muted,
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
              <MaterialIcons name="campaign" size={22} color={colors.primary.DEFAULT} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, lineHeight: 18 }}>
              {item.title}
            </Text>
            <Text variant="caption" color="#64748b" style={{ marginTop: 2, fontSize: 12, lineHeight: 16 }}>
              {item.description}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
