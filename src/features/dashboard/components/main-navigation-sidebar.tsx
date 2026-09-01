import { AppSidebar } from '@/src/components';

export function MainNavigationSidebar({
  title,
  subtitle,
  profileName,
  profileImage,
  badge,
  items,
  onItemPress,
}: {
  title: string;
  subtitle?: string;
  profileName: string;
  profileImage?: string;
  badge: string;
  items: readonly { key: string; icon: string; label: string; active?: boolean }[];
  onItemPress?: (key: string) => void;
}) {
  return <AppSidebar title={title} subtitle={subtitle} profileName={profileName} profileImage={profileImage} badge={badge} items={[...items]} onItemPress={onItemPress} />;
}
