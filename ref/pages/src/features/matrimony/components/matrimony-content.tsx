import { MaterialIcons } from '@expo/vector-icons';
import { Image, SafeAreaView, ScrollView, TextInput, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

const matchImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB9iCxLgwWHNZN_5rM31mENUKiEbhCFskqk56xYxaS1k6tCzlcwlyN_PgvVr2h7y6fF8YvfAe8DB5La1ktE-s3aZb7sXQ8bUtHkcZelCV4qPdh2wY8WZCwEtT4CxKfQz7EnTjNkw4F0n8Fd4v9PTxblV1b6zBs9DAhyY_K79IrPR-m2KGd7f1h5ZsOXiWDZdQw0QBC8q4ArwP4W9qFVcRrX8l7ZEZXHcC6jA6vFVVxftV5pMs8rkG7ufEqAHNw5B0eQ0tt3j77zbU';

function MatrimonyHeader({ title }: { title: string }) {
  return (
    <View style={{ paddingHorizontal: spacing[5], paddingTop: spacing[5], gap: spacing[3] }}>
      <Text variant="h4" style={{ fontFamily: 'serif', color: '#47291f' }}>
        Cobbler Matrimony
      </Text>
      <Text variant="h1" style={{ fontSize: 28, lineHeight: 34, fontFamily: typography.fontFamily.extrabold }}>
        {title}
      </Text>
    </View>
  );
}

function SearchPill({ placeholder }: { placeholder: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        borderRadius: radius.full,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: colors.border.DEFAULT,
        paddingHorizontal: spacing[4],
      }}>
      <MaterialIcons name="search" size={20} color="#94a3b8" />
      <TextInput
        placeholder={placeholder}
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
  );
}

export function MatrimonyDiscoveryContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fdf7f3' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <MatrimonyHeader title="Hand-picked Matches for Your Family" />
        <View style={{ padding: spacing[5], gap: spacing[4] }}>
          <SearchPill placeholder="Search by city, age, education..." />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[2] }}>
            {['Age', 'Education', 'Profession', 'City'].map((item) => (
              <View key={item} style={{ borderRadius: radius.full, backgroundColor: '#ffffff', paddingHorizontal: spacing[4], paddingVertical: spacing[2], borderWidth: 1, borderColor: colors.border.DEFAULT }}>
                <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold }}>
                  {item}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={{ borderRadius: 28, backgroundColor: '#2f1d16', padding: spacing[5], gap: spacing[2] }}>
            <Text variant="caption" color="rgba(255,255,255,0.68)" style={{ letterSpacing: 1.1, textTransform: 'uppercase' }}>
              Premium
            </Text>
            <Text variant="h5" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
              Direct Family Connect
            </Text>
            <Text variant="caption" color="rgba(255,255,255,0.78)">
              Unlock verified contacts and priority introductions.
            </Text>
          </View>

          <View style={{ borderRadius: 30, overflow: 'hidden', backgroundColor: '#ffffff', ...shadows.md }}>
            <Image source={{ uri: matchImage }} resizeMode="cover" style={{ width: '100%', height: 280 }} />
            <View style={{ padding: spacing[5], gap: spacing[3] }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                    Ananya Verma, 24
                  </Text>
                  <Text variant="caption" color={colors.text.muted}>
                    Profile ID: CM-2048
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <MaterialIcons name="verified" size={18} color="#059669" />
                  <Text variant="caption" color="#059669" style={{ fontFamily: typography.fontFamily.bold }}>
                    Verified
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
                {['MBA', 'Vadodara', 'Family Business', 'Online'].map((item) => (
                  <View key={item} style={{ borderRadius: radius.full, backgroundColor: '#fff7ed', paddingHorizontal: spacing[3], paddingVertical: 6 }}>
                    <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
              <Text variant="body" color={colors.text.secondary} style={{ lineHeight: 22 }}>
                Warm, grounded, and family-oriented. Looking for a respectful partner with shared community values.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function MatrimonyDiscoveryPremiumContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f1eb' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[6], paddingBottom: 40, gap: spacing[5] }}>
        <View style={{ gap: spacing[2] }}>
          <Text variant="h4" style={{ fontFamily: 'serif', color: '#47291f' }}>
            Cobbler Matrimony
          </Text>
          <Text variant="h1" style={{ fontSize: 34, lineHeight: 40, fontFamily: 'serif', color: '#2f1d16' }}>
            Hand-picked Matches for Your Family
          </Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
          {['Newly Joined', 'Highly Compatible', 'Nearby Masters'].map((item, index) => (
            <View key={item} style={{ borderRadius: radius.full, backgroundColor: index === 0 ? '#2f1d16' : '#ffffff', paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
              <Text variant="caption" color={index === 0 ? '#ffffff' : '#2f1d16'} style={{ fontFamily: typography.fontFamily.bold }}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ gap: spacing[4] }}>
          {[
            ['Riya Desai', '26', 'Architect', 'Ahmedabad'],
            ['Ishita Patel', '25', 'Designer', 'Vadodara'],
            ['Khushi Rana', '24', 'Dentist', 'Surat'],
          ].map(([name, age, role, city], index) => (
            <View key={name} style={{ borderRadius: 28, backgroundColor: index === 0 ? '#2f1d16' : '#ffffff', padding: spacing[5], gap: spacing[3], ...shadows.sm }}>
              <Text variant="h4" color={index === 0 ? '#ffffff' : '#2f1d16'} style={{ fontFamily: 'serif' }}>
                {name}, {age}
              </Text>
              <Text variant="body" color={index === 0 ? 'rgba(255,255,255,0.82)' : colors.text.secondary}>
                {role} • {city}
              </Text>
              <Text variant="caption" color={index === 0 ? '#f7c59f' : colors.primary.DEFAULT} style={{ letterSpacing: 1, textTransform: 'uppercase' }}>
                Highly compatible
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FormField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <View style={{ gap: spacing[2] }}>
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
          fontSize: 15,
          color: colors.text.primary,
        }}
      />
    </View>
  );
}

export function CreateMatrimonyProfileContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[5] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Create Matrimony Profile
        </Text>

        <View style={{ borderRadius: 28, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primary.border, backgroundColor: '#fff7ed', padding: spacing[6], alignItems: 'center', gap: spacing[3] }}>
          <MaterialIcons name="photo-library" size={28} color={colors.primary.DEFAULT} />
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
            Upload Photos
          </Text>
          <Text variant="caption" color={colors.text.muted}>
            Maximum 5 clear profile photos
          </Text>
        </View>

        <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], borderWidth: 1, borderColor: colors.border.muted }}>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            Personal Details
          </Text>
          <FormField label="Full Name" placeholder="Enter full name" />
          <FormField label="Age" placeholder="24" />
          <FormField label="Height" placeholder={'5\'4"'} />
        </View>

        <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], borderWidth: 1, borderColor: colors.border.muted }}>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            Professional & Educational
          </Text>
          <FormField label="Education" placeholder="MBA / B.Tech / CA" />
          <FormField label="Profession" placeholder="Designer / Doctor / Business" />
          <FormField label="Annual Income" placeholder="Optional" />
        </View>

        <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], borderWidth: 1, borderColor: colors.border.muted }}>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            Location
          </Text>
          <FormField label="City" placeholder="Vadodara" />
          <FormField label="State" placeholder="Gujarat" />
        </View>

        <View style={{ borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[4], alignItems: 'center' }}>
          <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
            Save Profile
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function ApproveMatrimonyProfilesContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[5] }}>
        <View style={{ gap: spacing[3] }}>
          <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
            Profile Moderation
          </Text>
          <View style={{ alignSelf: 'flex-start', borderRadius: radius.full, backgroundColor: '#fff7ed', paddingHorizontal: spacing[3], paddingVertical: spacing[2] }}>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
              Pending Review (12)
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: spacing[2] }}>
            {['Newest', 'Urgent'].map((item, index) => (
              <View key={item} style={{ borderRadius: radius.full, paddingHorizontal: spacing[4], paddingVertical: spacing[2], backgroundColor: index === 0 ? colors.primary.DEFAULT : '#ffffff' }}>
                <Text variant="caption" color={index === 0 ? '#ffffff' : colors.text.secondary} style={{ fontFamily: typography.fontFamily.bold }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: spacing[4] }}>
          {[
            ['Meera Shah', '25 • Ahmedabad • BDS'],
            ['Pooja Kumar', '27 • Vadodara • MBA'],
          ].map(([name, meta]) => (
            <View key={name} style={{ borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], gap: spacing[4], borderWidth: 1, borderColor: colors.border.muted, ...shadows.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                    {name}
                  </Text>
                  <Text variant="caption" color={colors.text.muted}>
                    {meta}
                  </Text>
                </View>
                <MaterialIcons name="verified-user" size={22} color="#059669" />
              </View>
              <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                <View style={{ flex: 1, borderRadius: radius.full, backgroundColor: '#ecfdf5', paddingVertical: spacing[3], alignItems: 'center' }}>
                  <Text variant="caption" color="#047857" style={{ fontFamily: typography.fontFamily.bold }}>
                    Approve
                  </Text>
                </View>
                <View style={{ flex: 1, borderRadius: radius.full, backgroundColor: '#fef2f2', paddingVertical: spacing[3], alignItems: 'center' }}>
                  <Text variant="caption" color="#b91c1c" style={{ fontFamily: typography.fontFamily.bold }}>
                    Reject
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5], borderWidth: 1, borderColor: colors.border.muted, gap: spacing[3] }}>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            Reject Reason
          </Text>
          <View style={{ borderRadius: radius.xl, backgroundColor: '#f8fafc', padding: spacing[4] }}>
            <Text variant="body" color={colors.text.secondary}>
              Select a reason before rejecting a profile.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
