import { View } from 'react-native';

import { EmptyState } from '@/src/components/feedback/EmptyState';
import { ErrorState } from '@/src/components/feedback/ErrorState';
import { SkeletonList } from '@/src/components/feedback/Skeleton';
import { spacing } from '@/src/theme';

export type AsyncStateProps = {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  loadingCount?: number;
  loadingFallback?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: {
    label: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
  };
  errorTitle?: string;
  onRetry?: () => void;
  retryLoading?: boolean;
  children: React.ReactNode;
};

export function AsyncState({
  loading = false,
  error,
  empty = false,
  loadingCount = 3,
  loadingFallback,
  emptyTitle = 'Nothing here yet',
  emptyDescription = 'New records will appear here when available.',
  emptyAction,
  errorTitle,
  onRetry,
  retryLoading = false,
  children,
}: AsyncStateProps) {
  if (loading) {
    return (
      <View style={{ gap: spacing[3] }}>
        {loadingFallback ?? <SkeletonList count={loadingCount} />}
      </View>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={errorTitle}
        description={error}
        onRetry={onRetry}
        retryLoading={retryLoading}
      />
    );
  }

  if (empty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return <>{children}</>;
}
