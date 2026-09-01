import type { ReactNode } from 'react';

export type HeaderVariant =
  | 'back-title'
  | 'back-title-action'
  | 'centered-title'
  | 'logo-title-actions'
  | 'title-subtitle';

export interface UserHeaderProps {
  variant: HeaderVariant;
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  showBack?: boolean;
  rightActions?: ReactNode[];
  logoComponent?: ReactNode;
  transparent?: boolean;
}
