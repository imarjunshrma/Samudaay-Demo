import { Pressable, Image, View } from 'react-native';

import { Icon } from '@/src/components/ui/Icon';
import { Text } from '@/src/components/ui/Text';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export interface EventPassAddon {
  icon: React.ComponentProps<typeof Icon>['name'];
  title: string;
}

export interface EventPassCardProps {
  name: string;
  eventTitle: string;
  qrImage: string;
  addOns: EventPassAddon[];
  onSharePress?: () => void;
}

export function EventPassCard({ name, eventTitle, qrImage, addOns, onSharePress }: EventPassCardProps) {
  return (
    <View
      style={{
        width: 320,
        maxWidth: '100%',
        borderRadius: radius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(242,120,13,0.1)',
        backgroundColor: '#ffffff',
        ...shadows.lg,
      }}>
      {onSharePress ? (
        <Pressable
          accessibilityRole="button"
          onPress={onSharePress}
          style={{
            position: 'absolute',
            top: spacing[4],
            right: spacing[4],
            zIndex: 2,
            width: 38,
            height: 38,
            borderRadius: radius.full,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.94)',
            borderWidth: 1,
            borderColor: 'rgba(242,120,13,0.14)',
          }}>
          <Icon name="share" size={18} color={colors.primary.DEFAULT} />
        </Pressable>
      ) : null}
      <View style={{ alignItems: 'center', backgroundColor: 'rgba(242,120,13,0.05)', padding: spacing[8] }}>
        <View
          style={{
            width: '100%',
            maxWidth: 240,
            aspectRatio: 1,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: '#f1f5f9',
            backgroundColor: '#ffffff',
            padding: spacing[4],
          }}>
          <Image source={{ uri: qrImage }} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
        </View>
        <Text
          variant="caption"
          color={colors.primary.DEFAULT}
          style={{ marginTop: spacing[4], fontFamily: typography.fontFamily.medium, fontSize: 14, textTransform: 'uppercase', letterSpacing: 2 }}>
          Scan at Entrance
        </Text>
      </View>
      <View style={{ paddingHorizontal: spacing[6], paddingBottom: spacing[6], alignItems: 'center' }}>
        <Text variant="h3" style={{ textAlign: 'center', fontFamily: typography.fontFamily.bold }}>
          {name}
        </Text>
        <Text variant="caption" color="#64748b" style={{ marginTop: 4, fontSize: 14 }}>
          {eventTitle}
        </Text>
        <View style={{ width: '100%', marginVertical: spacing[6], position: 'relative', borderTopWidth: 1, borderStyle: 'dashed', borderTopColor: '#e2e8f0' }}>
          <View style={{ position: 'absolute', left: -36, top: -12, width: 24, height: 24, borderRadius: radius.full, backgroundColor: colors.background.DEFAULT, borderRightWidth: 1, borderRightColor: 'rgba(242,120,13,0.1)' }} />
          <View style={{ position: 'absolute', right: -36, top: -12, width: 24, height: 24, borderRadius: radius.full, backgroundColor: colors.background.DEFAULT, borderLeftWidth: 1, borderLeftColor: 'rgba(242,120,13,0.1)' }} />
        </View>
        <View style={{ width: '100%' }}>
          <Text variant="caption" color="#94a3b8" style={{ marginBottom: spacing[2], fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            Registered Add-ons
          </Text>
          {addOns.length ? (
            <View style={{ gap: spacing[3] }}>
              {addOns.map((addOn) => (
                <View
                  key={addOn.title}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing[3],
                    borderRadius: radius.lg,
                    borderWidth: 1,
                    borderColor: 'rgba(242,120,13,0.1)',
                    backgroundColor: 'rgba(242,120,13,0.05)',
                    padding: spacing[3],
                  }}>
                  <Icon name={addOn.icon} size={20} color={colors.primary.DEFAULT} />
                  <View style={{ flex: 1 }}>
                    <Text variant="caption" style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                      {addOn.title}
                    </Text>
                    <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.medium, fontSize: 12 }}>
                      Included
                    </Text>
                  </View>
                  <Icon name="check-circle" size={18} color="#22c55e" />
                </View>
              ))}
            </View>
          ) : (
            <Text variant="caption" color="#64748b" style={{ fontSize: 13 }}>
              No add-ons attached to this pass.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
