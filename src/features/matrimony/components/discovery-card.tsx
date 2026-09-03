import { MaterialIcons } from '@expo/vector-icons';
import { Image, Pressable, TouchableOpacity, View } from 'react-native';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';

export type DiscoveryCardProps = {
  name: string;
  subtitle: string;
  image: string;
  ageHeight: string;
  education: string;
  profession: string;
  location?: string;
  locked?: boolean;
  ctaLabel?: string;
  favoriteTone?: 'primary' | 'muted';
  showOnlineStatus?: boolean;
  ctaDisabled?: boolean;
  statusLabel?: string;
  secondaryCtaLabel?: string;
  onPress?: () => void;
  onConnect?: () => void;
  onSecondaryAction?: () => void;
  onChat?: () => void;
};

export function DiscoveryCard({
  name,
  subtitle,
  image,
  ageHeight,
  education,
  profession,
  location,
  locked = false,
  ctaLabel = 'Send Connection Request',
  favoriteTone = 'primary',
  showOnlineStatus = false,
  ctaDisabled = false,
  statusLabel,
  secondaryCtaLabel,
  onPress,
  onConnect,
  onSecondaryAction,
  onChat,
}: DiscoveryCardProps) {
  return (
    <View style={{ backgroundColor: '#ffffff', borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: colors.primary.borderLight }}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        android_disableSound
        style={{ position: 'relative', aspectRatio: 4 / 5, overflow: 'hidden' }}>
        {image ? (
          <Image source={{ uri: image }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
        ) : (
          <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.subtle }}>
            <MaterialIcons name="person" size={72} color={colors.primary.DEFAULT} />
          </View>
        )}
        <View style={{ position: 'absolute', top: spacing[4], right: spacing[4], width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.background.surface, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="favorite" size={20} color={favoriteTone === 'primary' ? colors.primary.DEFAULT : colors.text.muted} />
        </View>
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing[4], backgroundColor: 'rgba(24,168,117,0.82)' }}>
          <Text variant="h2" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, fontWeight: '700', fontSize: 30, lineHeight: 34 }}>
            {name}
          </Text>
          <Text variant="caption" color="rgba(255,255,255,0.82)" style={{ fontFamily: typography.fontFamily.medium, textTransform: 'uppercase', letterSpacing: 1 }}>
            {subtitle}
          </Text>
        </View>
        {locked ? (
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(47,29,22,0.28)', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ backgroundColor: colors.background.surface, paddingHorizontal: spacing[4], paddingVertical: spacing[2], borderRadius: radius.lg }}>
              <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold }}>
                Premium Member Only
              </Text>
            </View>
          </View>
        ) : null}
      </Pressable>
      <View style={{ padding: spacing[4] }}>
        <Pressable
          onPress={onPress}
          disabled={!onPress}
          android_disableSound
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[2] }}>
          <View>
            <Text variant="h4" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
              {name}
            </Text>
            <Text variant="caption" color={colors.text.secondary} style={{ fontFamily: typography.fontFamily.medium }}>
              {subtitle}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: spacing[1] }}>
            {showOnlineStatus ? (
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Online Now
              </Text>
            ) : null}
            {statusLabel ? (
              <View style={{ borderRadius: radius.full, backgroundColor: colors.primary.muted, paddingHorizontal: spacing[2], paddingVertical: spacing[1] }}>
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.7 }}>
                  {statusLabel}
                </Text>
              </View>
            ) : null}
          </View>
        </Pressable>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
          <View style={{ width: '48%', flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <MaterialIcons name="height" size={18} color={colors.text.secondary} />
            <Text variant="caption" color={colors.text.secondary} style={{ fontFamily: typography.fontFamily.medium }}>
              {ageHeight}
            </Text>
          </View>
          <View style={{ width: '48%', flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <MaterialIcons name="school" size={18} color={colors.text.secondary} />
            <Text variant="caption" color={colors.text.secondary} style={{ fontFamily: typography.fontFamily.medium }}>
              {education}
            </Text>
          </View>
          <View style={{ width: '48%', flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <MaterialIcons name="work" size={18} color={colors.text.secondary} />
            <Text variant="caption" color={colors.text.secondary} style={{ fontFamily: typography.fontFamily.medium }}>
              {profession}
            </Text>
          </View>
          {location ? (
            <View style={{ width: '48%', flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
              <MaterialIcons name="location-on" size={18} color={colors.text.secondary} />
              <Text variant="caption" color={colors.text.secondary} style={{ fontFamily: typography.fontFamily.medium }}>
                {location}
              </Text>
            </View>
          ) : null}
        </View>
        {!locked ? (
          <View style={{ flexDirection: 'row', gap: spacing[2], paddingTop: spacing[3], alignItems: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={ctaDisabled}
              onPress={onConnect}
              style={{ flex: 1, backgroundColor: ctaDisabled ? colors.background.muted : colors.primary.DEFAULT, borderRadius: radius.lg, paddingVertical: spacing[3], alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: spacing[2] }}>
              <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                {ctaLabel}
              </Text>
              <MaterialIcons name="send" size={16} color="#ffffff" />
            </TouchableOpacity>
            {secondaryCtaLabel ? (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onSecondaryAction}
                style={{ borderRadius: radius.lg, paddingVertical: spacing[3], paddingHorizontal: spacing[3], alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.border }}>
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 13 }}>
                  {secondaryCtaLabel}
                </Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity activeOpacity={0.85} onPress={onChat} style={{ width: 48, height: 48, borderRadius: radius.lg, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.primary.border }}>
              <MaterialIcons name="chat" size={18} color={colors.primary.DEFAULT} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}
