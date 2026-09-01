import { DashboardUpdatesList } from './dashboard-updates-list';

export function MemberDashboardUpdatesSection({
  items,
  onItemPress,
  isLoading,
  errorMessage,
  onRetry,
}: {
  items: readonly { title: string; subtitle: string; image?: string }[];
  onItemPress?: (item: { title: string; subtitle: string; image?: string }) => void;
  isLoading?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}) {
  return (
    <DashboardUpdatesList
      items={items.map((item) => ({
        title: item.title,
        description: item.subtitle,
        image: item.image,
      }))}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={onRetry}
      onItemPress={
        onItemPress
          ? (item) =>
              onItemPress({
                title: item.title,
                subtitle: item.description,
                image: item.image,
              })
          : undefined
      }
    />
  );
}
