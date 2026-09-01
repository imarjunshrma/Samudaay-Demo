import { AppSidebar } from '@/src/components';

export function UnifiedDashboardSidebar({
  title,
  profileName,
  profileImage,
  badge,
  subtitle,
  items,
  onItemPress,
}: {
  title: string;
  profileName: string;
  profileImage?: string;
  badge: string;
  subtitle: string;
  items: readonly { key: string; icon: string; label: string; active?: boolean }[];
  onItemPress: (key: string) => void;
}) {
  return (
    <AppSidebar
      title={title}
      profileName={profileName}
      profileImage={profileImage}
      badge={badge}
      subtitle={subtitle}
      items={[...items]}
      onItemPress={onItemPress}
    />
  );
}
