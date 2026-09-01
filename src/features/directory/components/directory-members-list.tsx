import { View } from 'react-native';

import { MemberListItem } from '@/src/components';
import { spacing } from '@/src/theme';

type DirectoryMember = {
  name: string;
  location: string;
  role: string;
  image?: string;
  online?: boolean;
};

export function DirectoryMembersList({ members }: { members: readonly DirectoryMember[] }) {
  return (
    <View style={{ gap: spacing[4] }}>
      {members.map((member) => (
        <MemberListItem
          key={member.name}
          variant="directory"
          name={member.name}
          subtitle={member.role}
          location={member.location}
          avatarUrl={member.image}
          online={member.online}
        />
      ))}
    </View>
  );
}
