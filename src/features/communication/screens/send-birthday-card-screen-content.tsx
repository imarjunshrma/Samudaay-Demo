import React from 'react';
import { SendBirthdayCardContent as SendBirthdayCardContentView } from '../components/communication-content';

export function SendBirthdayCardScreenContent({ mode = 'user' }: { mode?: 'user' | 'admin' }) {
  return <SendBirthdayCardContentView mode={mode} />;
}
