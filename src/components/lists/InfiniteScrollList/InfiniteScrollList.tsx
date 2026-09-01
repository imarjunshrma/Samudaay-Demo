import { cloneElement, isValidElement, useEffect, useMemo, useRef, type ReactElement, type ReactNode } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, type ListRenderItem, type StyleProp, View, type ViewStyle } from 'react-native';

import { EmptyState, ErrorState } from '@/src/components/feedback';
import { SkeletonListItem } from '@/src/components/ui/skeleton';
import { Text } from '@/src/components/ui/Text';
import { colors, spacing } from '@/src/theme';

export interface InfiniteScrollListProps<TItem> {
  data: readonly TItem[];
  renderItem: ListRenderItem<TItem>;
  keyExtractor: (item: TItem, index: number) => string;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  loadingMore?: boolean;
  loadingInitial?: boolean;
  loadingSearch?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  skeletonCount?: number;
  renderSkeletonItem?: (index: number) => ReactNode;
  footerSkeleton?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ListHeaderComponent?: React.ComponentType<any> | ReactElement | null;
  ListFooterComponent?: ReactElement | null;
  numColumns?: number;
  columnWrapperStyle?: StyleProp<ViewStyle>;
  emptyTitle?: string;
  emptyDescription?: string;
  errorMessage?: string | null;
  errorTitle?: string;
  onRetry?: () => void;
  retrying?: boolean;
  onEndReachedThreshold?: number;
  scrollEnabled?: boolean;
  hideLoadMoreText?: boolean;
  preserveHeaderOnInitialLoad?: boolean;
}

export function InfiniteScrollList<TItem>({
  data,
  renderItem,
  keyExtractor,
  onLoadMore,
  hasNextPage = false,
  loadingMore = false,
  loadingInitial = false,
  loadingSearch = false,
  refreshing = false,
  onRefresh,
  skeletonCount = 3,
  renderSkeletonItem,
  footerSkeleton,
  contentContainerStyle,
  ListHeaderComponent,
  ListFooterComponent,
  numColumns,
  columnWrapperStyle,
  emptyTitle = 'No results found',
  emptyDescription = 'Try adjusting your filters or search terms.',
  errorMessage,
  errorTitle = 'Unable to load records',
  onRetry,
  retrying = false,
  onEndReachedThreshold = 0.35,
  scrollEnabled = true,
  hideLoadMoreText = false,
  preserveHeaderOnInitialLoad = false,
}: InfiniteScrollListProps<TItem>) {
  const skeletonItems = useMemo(() => Array.from({ length: skeletonCount }, (_, index) => index), [skeletonCount]);
  const footerSkeletonCount = Math.min(4, Math.max(2, skeletonCount));
  const flattenedContentContainerStyle = useMemo(() => StyleSheet.flatten(contentContainerStyle) ?? {}, [contentContainerStyle]);
  const canTriggerLoadMoreRef = useRef(false);
  const lastTriggeredItemCountRef = useRef<number | null>(null);
  const emptyTopPadding = typeof flattenedContentContainerStyle.paddingTop === 'number'
    ? flattenedContentContainerStyle.paddingTop
    : spacing[4];
  const renderSkeletonRow = (index: number) => {
    const node = renderSkeletonItem ? renderSkeletonItem(index) : <SkeletonListItem />;
    return isValidElement(node) ? cloneElement(node, { key: `skeleton-${index}` }) : <View key={`skeleton-${index}`}>{node}</View>;
  };

  useEffect(() => {
    if (!loadingMore) {
      canTriggerLoadMoreRef.current = false;
    }
  }, [loadingMore]);

  useEffect(() => {
    if (!hasNextPage) {
      lastTriggeredItemCountRef.current = null;
    }
  }, [hasNextPage]);

  const emptyState = errorMessage ? (
    <View
      style={{
        width: '100%',
        maxWidth: 672,
        alignSelf: 'center',
        flexGrow: 1,
        paddingHorizontal: spacing[4],
        paddingTop: emptyTopPadding,
      }}>
      <ErrorState
        title={errorTitle}
        description={errorMessage}
        onRetry={onRetry}
        retryLoading={retrying}
      />
    </View>
  ) : !data.length ? (
    <View
      style={{
        gap: spacing[3],
        width: '100%',
        maxWidth: 672,
        alignSelf: 'center',
        flexGrow: 1,
        paddingHorizontal: spacing[4],
        paddingTop: emptyTopPadding,
      }}>
      <View style={{ width: '100%', alignSelf: 'stretch' }}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </View>
    </View>
  ) : null;

  if (loadingInitial) {
    if (preserveHeaderOnInitialLoad) {
      return (
        <FlatList
          style={{ flex: 1, width: '100%' }}
          data={skeletonItems}
          keyExtractor={(item) => `skeleton-${item}`}
          renderItem={({ item }) => renderSkeletonRow(item)}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={scrollEnabled}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={() => <View style={{ height: spacing[3] }} />}
          contentContainerStyle={[{ width: '100%', flexGrow: 1 }, contentContainerStyle]}
        />
      );
    }

    return (
      <View style={{ gap: spacing[3] }}>
        {skeletonItems.map((index) => renderSkeletonRow(index))}
      </View>
    );
  }

  return (
    <FlatList
      style={{ flex: 1, width: '100%' }}
      data={data as TItem[]}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      keyboardShouldPersistTaps="handled"
      scrollEnabled={scrollEnabled}
      bounces={false}
      overScrollMode="never"
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary.DEFAULT} /> : undefined}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={emptyState}
      ItemSeparatorComponent={() => <View style={{ height: spacing[3] }} />}
      ListFooterComponent={(
        <View>
          {loadingSearch ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing[3] }}>
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
            </View>
          ) : null}
          {loadingMore ? (
            footerSkeleton ? (
              <View style={{ paddingTop: spacing[3] }}>
                {footerSkeleton}
              </View>
            ) : (
              <View style={{ gap: spacing[3], paddingTop: spacing[3] }}>
                {skeletonItems.slice(0, footerSkeletonCount).map((index) => renderSkeletonRow(index))}
              </View>
            )
          ) : hasNextPage && !hideLoadMoreText ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing[3] }}>
              <Text variant="caption" color={colors.text.muted}>
                Scroll to load more
              </Text>
            </View>
          ) : null}
          {ListFooterComponent}
        </View>
      )}
      onEndReached={() => {
        if (!hasNextPage || loadingMore || !onLoadMore) {
          return;
        }

        if (!canTriggerLoadMoreRef.current) {
          return;
        }

        if (lastTriggeredItemCountRef.current === data.length) {
          return;
        }

        canTriggerLoadMoreRef.current = false;
        lastTriggeredItemCountRef.current = data.length;
        onLoadMore();
      }}
      onEndReachedThreshold={onEndReachedThreshold}
      onMomentumScrollBegin={() => {
        canTriggerLoadMoreRef.current = true;
      }}
      onScrollBeginDrag={() => {
        canTriggerLoadMoreRef.current = true;
      }}
      numColumns={numColumns}
      columnWrapperStyle={columnWrapperStyle}
      contentContainerStyle={[{ width: '100%', flexGrow: 1 }, contentContainerStyle]}
    />
  );
}
