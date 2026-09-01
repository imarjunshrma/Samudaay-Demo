import React from 'react';
import { MemberDirectoryContent as MemberDirectoryContentView } from '../components/member-directory-content';

export function MemberDirectoryScreen() {
  return <MemberDirectoryContentView />;
}

export function CommunityMemberDirectoryScreen() {
  return <MemberDirectoryContentView userType="community_member" presentation="inner" />;
}

export default MemberDirectoryScreen;
