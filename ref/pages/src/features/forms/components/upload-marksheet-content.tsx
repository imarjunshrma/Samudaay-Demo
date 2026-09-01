import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, TextInput, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export function UploadMarksheetContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f1eb' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[6], paddingBottom: 48, gap: spacing[5] }}>
        <View style={{ gap: spacing[2] }}>
          <Text variant="caption" color="#7c4a31" style={{ letterSpacing: 1.1, textTransform: 'uppercase' }}>
            Student Support
          </Text>
          <Text variant="h1" style={{ fontSize: 32, lineHeight: 38, fontFamily: 'serif', color: '#2f1d16' }}>
            Upload Marksheet
          </Text>
        </View>

        <View style={{ gap: spacing[3], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5] }}>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            Step 1: Select Child
          </Text>
          {['Yash Kumar', 'Riya Kumar'].map((name, index) => (
            <View key={name} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 22, backgroundColor: index === 0 ? '#fff7ed' : '#f8fafc', padding: spacing[4], borderWidth: 1, borderColor: index === 0 ? colors.primary.border : colors.border.DEFAULT }}>
              <View>
                <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                  {name}
                </Text>
                <Text variant="caption" color={colors.text.muted}>
                  Class {index === 0 ? '10' : '7'}
                </Text>
              </View>
              {index === 0 ? <MaterialIcons name="check-circle" size={22} color={colors.primary.DEFAULT} /> : null}
            </View>
          ))}
        </View>

        <View style={{ gap: spacing[3], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5] }}>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            Step 2: Academic Details
          </Text>
          <TextInput
            placeholder="Academic Year"
            placeholderTextColor="#94a3b8"
            style={{
              borderRadius: radius.xl,
              borderWidth: 1,
              borderColor: colors.border.DEFAULT,
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[4],
              fontFamily: typography.fontFamily.medium,
              backgroundColor: '#ffffff',
            }}
          />
          <TextInput
            placeholder="School / Board"
            placeholderTextColor="#94a3b8"
            style={{
              borderRadius: radius.xl,
              borderWidth: 1,
              borderColor: colors.border.DEFAULT,
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[4],
              fontFamily: typography.fontFamily.medium,
              backgroundColor: '#ffffff',
            }}
          />
        </View>

        <View style={{ gap: spacing[3], borderRadius: 28, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primary.border, backgroundColor: '#fff7ed', padding: spacing[6], alignItems: 'center' }}>
          <MaterialIcons name="upload-file" size={28} color={colors.primary.DEFAULT} />
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
            Step 3: Upload Marksheet
          </Text>
          <Text variant="caption" color={colors.text.muted} style={{ textAlign: 'center' }}>
            Upload a clear PDF or image copy of the latest marksheet.
          </Text>
        </View>

        <View style={{ borderRadius: radius.full, backgroundColor: '#2f1d16', paddingVertical: spacing[4], alignItems: 'center' }}>
          <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
            Submit Marksheet
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
