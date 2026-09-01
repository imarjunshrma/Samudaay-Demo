import { Image, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';
import { communityHubBottomTabs, eventCards, newsItems, stories } from '../constants';

export function CommunityHubContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <View style={{ borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight, backgroundColor: 'rgba(248,247,245,0.92)' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], maxWidth: 672, alignSelf: 'center', width: '100%' }}>
            <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="menu" size={30} color={colors.primary.DEFAULT} />
            </View>
            <Text variant="h5" color={colors.text.primary} style={{ flex: 1, textAlign: 'center', fontFamily: typography.fontFamily.bold }}>
              Indian Cobbler Community
            </Text>
            <View style={{ width: 40, alignItems: 'flex-end' }}>
              <View style={{ width: 40, height: 40, borderRadius: radius.lg, backgroundColor: 'rgba(242,120,13,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="notifications" size={24} color={colors.primary.DEFAULT} />
              </View>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 92 }}>
          <View style={{ maxWidth: 672, alignSelf: 'center', width: '100%' }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[4], paddingVertical: spacing[6], gap: spacing[6] }}>
              {stories.map((story) => (
                <View key={story.label} style={{ alignItems: 'center', gap: spacing[2], minWidth: 72 }}>
                  <View style={{ width: 64, height: 64, borderRadius: 32, padding: 4, backgroundColor: story.active ? 'rgba(242,120,13,0.2)' : 'rgba(242,120,13,0.05)', borderWidth: story.active ? 2 : 1, borderColor: story.active ? colors.primary.DEFAULT : colors.primary.border }}>
                    <Image source={{ uri: story.image }} resizeMode="cover" style={{ width: '100%', height: '100%', borderRadius: 28 }} />
                  </View>
                  <Text variant="caption" color={story.active ? colors.text.primary : '#64748b'} style={{ fontSize: 12, fontFamily: story.active ? typography.fontFamily.semibold : typography.fontFamily.medium }}>
                    {story.label}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
                <Text variant="h4" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>Monthly Publication</Text>
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>View Archive</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: spacing[4], padding: spacing[4], borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: 'rgba(242,120,13,0.05)' }}>
                <View style={{ width: 96, height: 128, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' }}>
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbBZ6bAL9pTFyxGIHQ_srbVSot6-GKwIANSU6vI44LzBOQubHnbv_H7izcQUxSqkS2yHylvTMrnwhu2XzIkhv_-aMg2XyJHAN2Dpq9dLcTVBr7H-V2BzC7iejtRlRqq2RExrv8w-Ciur2OKaEx_h-D5onO5e4tyrkE08Asab_NxDdXyJ800oOlxHkmlUdGyphyOnuX47j17Uj2o93LS5mkhb3Ny5YXxHdX8-YQFQxMMGaAXUnuAnZxrWRkkZxo-JHr_wHyMvq4gAWc' }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>Issue #42 • October 2023</Text>
                  <Text variant="bodyLg" color={colors.text.primary} style={{ marginTop: 4, fontFamily: typography.fontFamily.bold }}>The Future of Sustainable Soling</Text>
                  <Text variant="caption" color="#64748b" style={{ marginTop: spacing[2], fontSize: 12, lineHeight: 18 }}>
                    Featuring interviews with master craftsmen from Kanpur and Kolhapur.
                  </Text>
                  <Pressable style={{ marginTop: spacing[3], alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: spacing[2], backgroundColor: colors.primary.DEFAULT, paddingHorizontal: spacing[4], paddingVertical: spacing[2], borderRadius: radius.lg }}>
                    <MaterialIcons name="download" size={16} color="#fff" />
                    <Text variant="caption" color="#fff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>Download PDF</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={{ paddingVertical: spacing[6] }}>
              <View style={{ paddingHorizontal: spacing[4], flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
                <Text variant="h4" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>Upcoming Events</Text>
                <MaterialIcons name="calendar-month" size={24} color="#94a3b8" />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[4], gap: spacing[4] }}>
                {eventCards.map((card) => (
                  <View key={card.title} style={{ width: 288, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.background.surface, borderWidth: 1, borderColor: '#f1f5f9' }}>
                    <View style={{ height: 160 }}>
                      <Image source={{ uri: card.image }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
                      <View style={{ position: 'absolute', top: 12, right: 12, minWidth: 45, borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: spacing[2], paddingVertical: spacing[1], alignItems: 'center' }}>
                        <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', fontSize: 10 }}>{card.month}</Text>
                        <Text variant="h5" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>{card.day}</Text>
                      </View>
                    </View>
                    <View style={{ padding: spacing[4] }}>
                      <Text variant="bodyLg" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>{card.title}</Text>
                      <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <MaterialIcons name="location-on" size={14} color="#64748b" />
                        <Text variant="caption" color="#64748b">{card.location}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginTop: spacing[3], marginBottom: spacing[4] }}>
                        {card.tags.map((tag) => (
                          <View key={tag.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.md, backgroundColor: tag.bg, paddingHorizontal: spacing[2], paddingVertical: spacing[1] }}>
                            <MaterialIcons name={tag.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={12} color={tag.color} />
                            <Text variant="caption" color={tag.color} style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>{tag.label}</Text>
                          </View>
                        ))}
                      </View>
                      <Pressable style={{ width: '100%', borderRadius: radius.lg, backgroundColor: 'rgba(242,120,13,0.1)', paddingVertical: spacing[2], alignItems: 'center' }}>
                        <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>Register Now</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
              <Text variant="h4" color={colors.text.primary} style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>Community News</Text>
              <View style={{ gap: spacing[6] }}>
                {newsItems.map((item, index) => (
                  <View key={item.title} style={{ flexDirection: 'row', gap: spacing[4], paddingTop: index === 0 ? 0 : spacing[6], borderTopWidth: index === 0 ? 0 : 1, borderTopColor: '#f1f5f9' }}>
                    <Image source={{ uri: item.image }} resizeMode="cover" style={{ width: 80, height: 80, borderRadius: radius.lg }} />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', fontSize: 10 }}>{item.tag}</Text>
                        <Text variant="caption" color="#94a3b8" style={{ fontSize: 10 }}>{item.time}</Text>
                      </View>
                      <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold, marginBottom: 4 }}>{item.title}</Text>
                      <Text variant="caption" color="#64748b" style={{ lineHeight: 18 }}>{item.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
              <Pressable style={{ marginTop: spacing[8], width: '100%', borderRadius: radius.lg, borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: spacing[3], alignItems: 'center' }}>
                <Text variant="caption" color="#475569" style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>Load More News</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderTopColor: '#f1f5f9', backgroundColor: colors.background.DEFAULT }}>
          <View style={{ maxWidth: 672, alignSelf: 'center', width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
            {communityHubBottomTabs.map((item) => (
              <View key={item.label} style={{ flex: 1, alignItems: 'center', gap: 4, padding: spacing[2] }}>
                <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={item.active ? colors.primary.DEFAULT : '#94a3b8'} />
                <Text variant="caption" color={item.active ? colors.primary.DEFAULT : '#94a3b8'} style={{ fontSize: 10, fontFamily: item.active ? typography.fontFamily.bold : typography.fontFamily.medium }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
