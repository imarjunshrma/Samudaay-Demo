import type { IconName } from '@/src/components/ui';

export interface BottomBarItem {
  key: string;
  icon: IconName;
  label: string;
  route: string;
  badge?: number;
}

export interface UserBottomBarProps {
  items: BottomBarItem[];
  activeKey: string;
  onItemPress: (item: BottomBarItem) => void;
}
