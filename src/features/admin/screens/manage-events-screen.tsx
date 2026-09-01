import React from 'react';
import { ManageEventsContent as ManageEventsContentView } from '../components/manage-events-content';

type ManageEventsScreenProps = Parameters<typeof ManageEventsContentView>[0];

export function ManageEventsScreen(props: ManageEventsScreenProps) {
  return <ManageEventsContentView {...(props ?? {})} />;
}

export default ManageEventsScreen;
