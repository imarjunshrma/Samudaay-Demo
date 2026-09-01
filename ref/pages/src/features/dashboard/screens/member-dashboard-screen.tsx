import React from 'react';
import { MemberDashboardContent as MemberDashboardContentView } from '../components/member-dashboard-content';

type MemberDashboardScreenProps = Parameters<typeof MemberDashboardContentView>[0];

export function MemberDashboardScreen(props: MemberDashboardScreenProps) {
  return <MemberDashboardContentView {...(props ?? {})} />;
}

export default MemberDashboardScreen;
