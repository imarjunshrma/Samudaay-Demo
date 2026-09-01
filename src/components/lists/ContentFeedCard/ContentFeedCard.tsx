import { Image, Pressable, View } from 'react-native';

import { Button, Icon, Text } from '@/src/components/ui';
import { colors, radius, spacing, typography } from '@/src/theme';

export type ContentFeedCardVariant = 'publication' | 'event' | 'news';

export interface ContentFeedTag {
  label: string;
  icon?: React.ComponentProps<typeof Icon>['name'];
  color?: string;
  bg?: string;
}

export interface ContentFeedCardProps {
  title: string;
  description?: string;
  image?: string;
  variant?: ContentFeedCardVariant;
  eyebrow?: string;
  meta?: string;
  ctaLabel?: string;
  tags?: ContentFeedTag[];
  dateBadge?: { month: string; day: string };
}

export function ContentFeedCard({
  title,
  description,
  image,
  variant = 'news',
  eyebrow,
  meta,
  ctaLabel,
  tags = [],
  dateBadge,
}: ContentFeedCardProps) {
  if (variant === 'publication') {
    return (
      <View
        style={{
          flexDirection: 'row',
          gap: spacing[4],
          padding: spacing[4],
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: colors.primary.borderLight,
          backgroundColor: colors.primary.subtle,
        }}>
        <View style={{ width: 96, height: 128, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.background.surface, borderWidth: 1, borderColor: '#e2e8f0' }}>
          {image ? <Image source={{ uri: image }} resizeMode="cover" style={{ width: '100%', height: '100%' }} /> : null}
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          {eyebrow ? (
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
              {eyebrow}
            </Text>
          ) : null}
          <Text variant="bodyLg" style={{ marginTop: 4, fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          {description ? (
            <Text variant="caption" color="#64748b" style={{ marginTop: spacing[2], fontSize: 12, lineHeight: 18 }}>
              {description}
            </Text>
          ) : null}
          {ctaLabel ? (
            <View style={{ marginTop: spacing[3], alignSelf: 'flex-start' }}>
              <Button size="sm" leftIcon={<Icon name="download" size={16} color={colors.text.inverse} />}>
                {ctaLabel}
              </Button>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  if (variant === 'event') {
    return (
      <View
        style={{
          width: 288,
          borderRadius: radius.xl,
          overflow: 'hidden',
          backgroundColor: colors.background.surface,
          borderWidth: 1,
          borderColor: '#f1f5f9',
        }}>
        <View style={{ height: 160 }}>
          {image ? <Image source={{ uri: image }} resizeMode="cover" style={{ width: '100%', height: '100%' }} /> : null}
          {dateBadge ? (
            <View
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                minWidth: 45,
                borderRadius: radius.lg,
                backgroundColor: 'rgba(255,255,255,0.92)',
                paddingHorizontal: spacing[2],
                paddingVertical: spacing[1],
                alignItems: 'center',
              }}>
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', fontSize: 10 }}>
                {dateBadge.month}
              </Text>
              <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                {dateBadge.day}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={{ padding: spacing[4] }}>
          <Text variant="bodyLg" style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          {meta ? (
            <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="location-on" size={14} color="#64748b" />
              <Text variant="caption" color="#64748b">
                {meta}
              </Text>
            </View>
          ) : null}
          {tags.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginTop: spacing[3], marginBottom: spacing[4] }}>
              {tags.map((tag) => (
                <View key={tag.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.md, backgroundColor: tag.bg ?? colors.primary.subtle, paddingHorizontal: spacing[2], paddingVertical: spacing[1] }}>
                  {tag.icon ? <Icon name={tag.icon} size={12} color={tag.color ?? colors.primary.DEFAULT} /> : null}
                  <Text variant="caption" color={tag.color ?? colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
                    {tag.label}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
          {ctaLabel ? (
            <Button variant="soft" fullWidth>
              {ctaLabel}
            </Button>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <Pressable style={{ flexDirection: 'row', gap: spacing[4] }}>
      {image ? <Image source={{ uri: image }} resizeMode="cover" style={{ width: 80, height: 80, borderRadius: radius.lg }} /> : null}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          {eyebrow ? (
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', fontSize: 10 }}>
              {eyebrow}
            </Text>
          ) : <View />}
          {meta ? (
            <Text variant="caption" color="#94a3b8" style={{ fontSize: 10 }}>
              {meta}
            </Text>
          ) : null}
        </View>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, marginBottom: 4 }}>
          {title}
        </Text>
        {description ? (
          <Text variant="caption" color="#64748b" style={{ lineHeight: 18 }}>
            {description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
