export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface AppNotification {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}
