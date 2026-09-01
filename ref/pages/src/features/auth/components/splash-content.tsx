import { Image, Pressable, SafeAreaView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function SplashContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.background.DEFAULT }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 448, width: '100%', alignSelf: 'center', padding: spacing[4] }}>
          <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="menu" size={28} color={colors.text.primary} />
          </View>
          <Text variant="h5" style={{ flex: 1, textAlign: 'center' }}>{' '}</Text>
          <View style={{ width: 48 }} />
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', maxWidth: 448, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[6] }}>
          <View style={{ width: '100%', marginBottom: spacing[8], alignItems: 'center' }}>
            <View style={{ width: 280, height: 280, borderRadius: 140, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...shadows.md }}>
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida/ADBb0ui91TcnXdBUV3HyuHBhE9jXGgCmxBpelyWpiJq4KhI4AmDUJedjA4_iSbsoKCxQQKhlZFOcXBAYEE4VmHdgKahPkEx9u6zeeqNsQrEAlcs8G5-3bNGqamrHGrHZfFDmAQl8sGxJ0uwLvyT8o2vZ3aBlc4ANwJMAfD2HcruYeYn_BvAeJBZcd5SJBEe9std_R_rAWNNXl3EVhaqCdjokVmt5bcXEa4K2tWW7-0j5ju2lGXNKb-36HWUjYPmZCMvOd4EyBZgMfkxV41g' }} resizeMode="contain" style={{ width: '100%', height: '100%', padding: spacing[4] as never }} />
              <View style={{ position: 'absolute', left: 16, right: 16, top: 16, bottom: 16, borderRadius: 124, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
            </View>
          </View>
          <View style={{ alignItems: 'center', gap: spacing[4] }}>
            <Text variant="h1" style={{ textAlign: 'center', fontSize: 36, lineHeight: 40, fontFamily: typography.fontFamily.bold }}>
              Mochi Ekta Cheritable Trust
            </Text>
            <View style={{ width: 64, height: 4, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT }} />
            <Text variant="h4" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold }}>
              Empowering our Community
            </Text>
            <Text variant="body" color="#64748b" style={{ fontSize: 18, fontFamily: typography.fontFamily.medium }}>
              Connecting People
            </Text>
          </View>
        </View>

        <View style={{ maxWidth: 448, width: '100%', alignSelf: 'center', padding: spacing[8], gap: spacing[4] }}>
          <Pressable style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2], borderRadius: radius.xl, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[4], ...shadows.lg }}>
            <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
              Get Started
            </Text>
            <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
          </Pressable>
          <Text variant="caption" color="#94a3b8" style={{ textAlign: 'center', fontSize: 14 }}>
            By continuing, you agree to our Terms of Service
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4, marginTop: spacing[4] }}>
            <View style={{ width: 8, height: 8, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT }} />
            <View style={{ width: 8, height: 8, borderRadius: radius.full, backgroundColor: 'rgba(242,120,13,0.3)' }} />
            <View style={{ width: 8, height: 8, borderRadius: radius.full, backgroundColor: 'rgba(242,120,13,0.3)' }} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
