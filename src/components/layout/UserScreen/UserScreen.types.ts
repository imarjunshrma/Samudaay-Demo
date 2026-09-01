import type { PropsWithChildren, ReactNode } from 'react';

import type { BottomBarItem } from '@/src/components/layout/UserBottomBar';
import type { UserHeaderProps } from '@/src/components/layout/UserHeader';

export interface UserScreenProps extends PropsWithChildren {
  header?: UserHeaderProps;
  bottomBarItems?: BottomBarItem[];
  activeBottomBarKey?: string;
  onBottomBarPress?: (item: BottomBarItem) => void;
  hero?: ReactNode;
}
