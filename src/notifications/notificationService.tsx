import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { appConfig } from '@/src/constants';
import { createNotificationId } from '@/src/notifications/notificationHelpers';
import type { AppNotification, ToastVariant } from '@/src/notifications/notificationTypes';

interface NotificationContextValue {
  notifications: AppNotification[];
  show: (variant: ToastVariant, title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: PropsWithChildren) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const show = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      const id = createNotificationId();
      setNotifications((current) => [...current, { id, variant, title, description }]);
      setTimeout(() => dismiss(id), appConfig.toastDurationMs);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notifications, show, dismiss }), [dismiss, notifications, show]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }

  return context;
}
