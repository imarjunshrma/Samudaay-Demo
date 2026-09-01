import React from 'react';
import { NotificationsContent as NotificationsContentView } from '../components/communication-content';

export function NotificationsScreenContent({ mode = 'user' }: { mode?: 'user' | 'admin' }) {
  return <NotificationsContentView mode={mode} />;
}
