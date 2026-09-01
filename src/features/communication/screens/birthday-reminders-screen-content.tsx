import React from 'react';
import { BirthdayRemindersContent as BirthdayRemindersContentView } from '../components/communication-content';

export function BirthdayRemindersScreenContent({ mode = 'user' }: { mode?: 'user' | 'admin' }) {
  return <BirthdayRemindersContentView mode={mode} />;
}
