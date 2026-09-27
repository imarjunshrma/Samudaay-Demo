import { Pressable, View } from 'react-native';

import { MemberListItem } from '@/src/components';
import { spacing } from '@/src/theme';

export function ChatListSection({
  groups,
  onPressGroup,
  onLongPressGroup,
  selectedGroupId,
}: {
  groups: readonly {
    id: string;
    title: string;
    preview: string;
    image: string;
    time: string;
    unread?: string;
    active?: boolean;
    status?: string;
    type?: string;
    canManage?: boolean;
  }[];
  onPressGroup?: (group: { id: string; title: string; preview: string; image: string; time: string; unread?: string; active?: boolean; status?: string; type?: string; canManage?: boolean }) => void;
  onLongPressGroup?: (group: { id: string; title: string; preview: string; image: string; time: string; unread?: string; active?: boolean; status?: string; type?: string; canManage?: boolean }) => void;
  selectedGroupId?: string | null;
}) {
  return (
    <View style={{ paddingTop: spacing[2] }}>
      {groups.map((group) => (
        <Pressable
          key={group.id}
          onPress={() => onPressGroup?.(group)}
          onLongPress={() => onLongPressGroup?.(group)}
          accessibilityRole="button"
          style={({ pressed }) => {
            const isSelected = selectedGroupId === group.id;
            return {
              marginHorizontal: spacing[3],
              marginBottom: spacing[2],
              borderRadius: 18,
              borderWidth: 1,
              borderColor: isSelected ? 'rgba(242,120,13,0.28)' : 'transparent',
              backgroundColor: isSelected ? 'rgba(242,120,13,0.12)' : pressed ? 'rgba(15,23,42,0.04)' : 'transparent',
              paddingVertical: spacing[1],
              paddingLeft: isSelected ? spacing[1] : 0,
              shadowColor: isSelected ? '#f2780d' : '#000',
              shadowOpacity: isSelected ? 0.12 : 0,
              shadowRadius: isSelected ? 10 : 0,
              shadowOffset: { width: 0, height: 4 },
              elevation: isSelected ? 1 : 0,
            };
          }}>
          <MemberListItem
            variant="chat"
            name={group.title}
            subtitle={
              group.status === 'DISABLED'
                ? `Disabled - ${group.preview}`
                : group.status === 'RESTRICTED'
                  ? `Admin only - ${group.preview}`
                  : group.preview
            }
            avatarUrl={group.image}
            location={group.time}
            online={group.active}
            actionLabel={group.unread}
            selected={selectedGroupId === group.id}
          />
        </Pressable>
      ))}
    </View>
  );
}
