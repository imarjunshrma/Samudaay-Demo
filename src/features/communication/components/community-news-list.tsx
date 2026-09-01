import { Image, Pressable, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';
import { newsItems } from '../constants';

type NewsItem = (typeof newsItems)[number];

export function CommunityNewsList() {
  return (
    <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
      <Text variant="h4" color={colors.text.primary} style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
        Community News
      </Text>
      <View style={{ gap: spacing[6] }}>
        {newsItems.map((item: NewsItem, index) => (
          <View key={item.title} style={{ flexDirection: 'row', gap: spacing[4], paddingTop: index === 0 ? 0 : spacing[6], borderTopWidth: index === 0 ? 0 : 1, borderTopColor: '#f1f5f9' }}>
            <Image source={{ uri: item.image }} resizeMode="cover" style={{ width: 80, height: 80, borderRadius: radius.lg }} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', fontSize: 10 }}>
                  {item.tag}
                </Text>
                <Text variant="caption" color="#94a3b8" style={{ fontSize: 10 }}>
                  {item.time}
                </Text>
              </View>
              <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold, marginBottom: 4 }}>
                {item.title}
              </Text>
              <Text variant="caption" color="#64748b" style={{ lineHeight: 18 }}>
                {item.desc}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Pressable style={{ marginTop: spacing[8], width: '100%', borderRadius: radius.lg, borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: spacing[3], alignItems: 'center' }}>
        <Text variant="caption" color="#475569" style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
          Load More News
        </Text>
      </Pressable>
    </View>
  );
}
