import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, TextInput, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function ChildrenEducationDirectoryContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f1eb' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[6], paddingBottom: 48, gap: spacing[5] }}>
        <View style={{ gap: spacing[2] }}>
          <Text variant="caption" color="#7c4a31" style={{ letterSpacing: 1.1, textTransform: 'uppercase' }}>
            Education Support
          </Text>
          <Text variant="h1" style={{ fontSize: 32, lineHeight: 38, fontFamily: 'serif', color: '#2f1d16' }}>
            Student Directory
          </Text>
        </View>

        <View style={{ gap: spacing[3] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], borderRadius: radius.full, backgroundColor: '#ffffff', paddingHorizontal: spacing[4], borderWidth: 1, borderColor: colors.border.DEFAULT }}>
            <MaterialIcons name="search" size={20} color="#94a3b8" />
            <TextInput
              placeholder="Search student, class, school"
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[2] }}>
            {['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map((item, index) => (
              <View key={item} style={{ borderRadius: radius.full, backgroundColor: index === 0 ? '#2f1d16' : '#ffffff', paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
                <Text variant="caption" color={index === 0 ? '#ffffff' : '#2f1d16'} style={{ fontFamily: typography.fontFamily.bold }}>
                  {item}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ gap: spacing[4] }}>
          {[
            ['Yash Kumar', 'Class 10 • Bright School', '92.4% last term'],
            ['Khushi Patel', 'Class 8 • Sunrise Academy', '88.1% last term'],
            ['Aarav Shah', 'Class 7 • Scholar Public', '91.0% last term'],
          ].map(([name, meta, score]) => (
            <View key={name} style={{ borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], gap: spacing[3], ...shadows.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                    {name}
                  </Text>
                  <Text variant="caption" color={colors.text.muted}>
                    {meta}
                  </Text>
                </View>
                <MaterialIcons name="school" size={22} color={colors.primary.DEFAULT} />
              </View>
              <View style={{ alignSelf: 'flex-start', borderRadius: radius.full, backgroundColor: '#fff7ed', paddingHorizontal: spacing[3], paddingVertical: spacing[2] }}>
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                  {score}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
