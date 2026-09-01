import { Image, ScrollView, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, spacing, typography } from '@/src/theme';
import { stories } from '../constants';

type StoryItem = (typeof stories)[number];

export function CommunityStoriesRow() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[4], paddingVertical: spacing[6], gap: spacing[6] }}>
      {stories.map((story: StoryItem) => (
        <View key={story.label} style={{ alignItems: 'center', gap: spacing[2], minWidth: 72 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              padding: 4,
              backgroundColor: story.active ? 'rgba(242,120,13,0.2)' : 'rgba(242,120,13,0.05)',
              borderWidth: story.active ? 2 : 1,
              borderColor: story.active ? colors.primary.DEFAULT : colors.primary.border,
            }}>
            <Image source={{ uri: story.image }} resizeMode="cover" style={{ width: '100%', height: '100%', borderRadius: 28 }} />
          </View>
          <Text variant="caption" color={story.active ? colors.text.primary : '#64748b'} style={{ fontSize: 12, fontFamily: story.active ? typography.fontFamily.semibold : typography.fontFamily.medium }}>
            {story.label}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
