import { MaterialIcons } from '@expo/vector-icons';
import { Image, SafeAreaView, ScrollView, TextInput, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

const covers = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCSl9YRUjVQJb5PjHq0KpNqjap3jB57Q4L-nd8_TsUtC6P9IJ9uiSqq6ajh-0n1wL2tYlYuYa5n5Wf1N2e4ajA2rYyl7Cyk2z6fxdqW0qg4tqPiEINw5ZzvR11Oa5z6cCeS9bGm4eDk9GVkfrK1Fow_1g',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD1eXH3nWG-yNRP53KL7jD0D7MoQbb0DjbFNFErmUEo7Oy3NzvUc2Lr4gQV1MMa4K0rQ4j29Zxjv6P7nufW2Wxjv1V90N0aWl8PGN8GzH6dfiP1z0Y9',
];

export function GeneratePublicationContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[5] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Generate Publication
        </Text>
        <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], ...shadows.sm }}>
          {[
            ['Edition Title', 'April 2026 Community Digest'],
            ['Month', 'April 2026'],
            ['Theme', 'Events, education, trustees'],
          ].map(([label, placeholder]) => (
            <View key={label} style={{ gap: spacing[2] }}>
              <Text variant="caption" color={colors.text.secondary} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {label}
              </Text>
              <TextInput
                placeholder={placeholder}
                placeholderTextColor="#94a3b8"
                style={{
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  borderColor: colors.border.DEFAULT,
                  backgroundColor: '#ffffff',
                  paddingHorizontal: spacing[4],
                  paddingVertical: spacing[4],
                  fontFamily: typography.fontFamily.medium,
                }}
              />
            </View>
          ))}
        </View>
        <View style={{ borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[4], alignItems: 'center' }}>
          <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
            Generate Issue
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function PublicationArchiveContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[5] }}>
        <View style={{ gap: spacing[2] }}>
          <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
            Community Publications
          </Text>
          <Text variant="caption" color={colors.text.muted}>
            Monthly magazines, newsletters, and special community editions.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], borderRadius: radius.full, backgroundColor: '#ffffff', borderWidth: 1, borderColor: colors.border.DEFAULT, paddingHorizontal: spacing[4] }}>
          <MaterialIcons name="search" size={20} color="#94a3b8" />
          <TextInput
            placeholder="Search publications"
            placeholderTextColor="#94a3b8"
            style={{
              flex: 1,
              paddingVertical: spacing[4],
              fontSize: 15,
              color: colors.text.primary,
              fontFamily: typography.fontFamily.medium,
            }}
          />
        </View>

        {[
          ['Archive 2024', covers[0]],
          ['Archive 2023', covers[1]],
        ].map(([title, image]) => (
          <View key={title} style={{ gap: spacing[4] }}>
            <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
              {title}
            </Text>
            {[1, 2].map((item) => (
              <View key={item} style={{ borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[4], borderWidth: 1, borderColor: colors.border.muted, gap: spacing[4], ...shadows.sm }}>
                <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                  <Image source={{ uri: image }} resizeMode="cover" style={{ width: 88, height: 112, borderRadius: radius.lg, backgroundColor: '#e5e7eb' }} />
                  <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={{ gap: 4 }}>
                      <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                        {title === 'Archive 2024' ? 'Samaj Sandesh' : 'Community Chronicle'} {item}
                      </Text>
                      <Text variant="caption" color={colors.text.muted}>
                        January 2024 Edition
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                      <View style={{ flex: 1, borderRadius: radius.full, backgroundColor: '#fff7ed', paddingVertical: spacing[3], alignItems: 'center' }}>
                        <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                          Read Online
                        </Text>
                      </View>
                      <View style={{ flex: 1, borderRadius: radius.full, backgroundColor: '#111827', paddingVertical: spacing[3], alignItems: 'center' }}>
                        <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
                          PDF
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
