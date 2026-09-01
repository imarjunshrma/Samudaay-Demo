import { useState } from 'react';
import { Image, Pressable, TouchableOpacity, View, type DimensionValue, type ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Icon } from '@/src/components/ui/Icon';
import { Text } from '@/src/components/ui/Text';
import { colors, radius, spacing, typography } from '@/src/theme';

export interface TemplateCardProps {
  title: string;
  image: string;
  selected?: boolean;
  editable?: boolean;
  size?: 'default' | 'compact';
  width?: DimensionValue;
  height?: DimensionValue;
  onPress?: () => void;
  onEditPress?: () => void;
  onDeletePress?: () => void;
}

export function TemplateCard({ title, image, selected = false, editable = false, size = 'default', width, height, onPress, onEditPress, onDeletePress }: TemplateCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const compact = size === 'compact';
  const cardWidth = width ?? (compact ? '30.5%' : '47%');
  const checkSize = compact ? 20 : 24;
  const titlePadding = compact ? spacing[2] : spacing[4];
  const frameRadius = compact ? radius.lg : radius.xl;
  const cardBaseStyle: ViewStyle = {
    width: cardWidth,
    flexShrink: 0,
    alignSelf: 'flex-start',
  };
  const cardFrameStyle: ViewStyle = height
    ? { ...cardBaseStyle, height }
    : { ...cardBaseStyle, aspectRatio: 3 / 4 };

  const content = (
    <View
      style={{
        width: '100%',
        height: '100%',
        borderRadius: frameRadius,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: selected ? colors.primary.DEFAULT : colors.primary.borderLight,
        position: 'relative',
        backgroundColor: colors.background.surface,
      }}>
      {!imageFailed ? (
        <Image
          source={{ uri: image }}
          resizeMode="cover"
          onError={() => setImageFailed(true)}
          style={{ width: '100%', height: '100%' }}
        />
      ) : null}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          backgroundColor: selected ? 'rgba(47, 29, 22, 0.12)' : 'rgba(15, 23, 42, 0.18)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: titlePadding,
          paddingTop: compact ? spacing[5] : spacing[7],
          paddingBottom: titlePadding,
          backgroundColor: 'rgba(15, 23, 42, 0.62)',
        }}>
        <Text
          variant="caption"
          color={colors.text.inverse}
          style={{
            fontFamily: typography.fontFamily.bold,
            fontSize: compact ? 11 : 14,
            lineHeight: compact ? 14 : 18,
          }}>
          {title}
        </Text>
      </View>
      {selected ? (
        <View
          style={{
            position: 'absolute',
            right: spacing[2],
            top: spacing[2],
            width: checkSize,
            height: checkSize,
            borderRadius: radius.full,
            backgroundColor: colors.primary.DEFAULT,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="check" size={compact ? 12 : 14} color={colors.text.inverse} />
        </View>
      ) : null}
      {editable ? (
        <View style={{ position: 'absolute', right: spacing[2], top: spacing[2], flexDirection: 'row', gap: spacing[2] }}>
          {onDeletePress ? (
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={(event) => {
                event.stopPropagation();
                onDeletePress();
              }}
              style={{
                width: 24,
                height: 24,
                borderRadius: radius.full,
                backgroundColor: colors.background.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialIcons name="delete" size={14} color={colors.status.error} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={(event) => {
              event.stopPropagation();
              onEditPress?.();
            }}
            style={{
              width: 24,
              height: 24,
              borderRadius: radius.full,
              backgroundColor: colors.background.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialIcons name="edit" size={14} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          cardFrameStyle,
          selected ? { transform: [{ translateY: -2 }] } : null,
          pressed ? { opacity: 0.92 } : null,
        ]}>
        {content}
      </Pressable>
    );
  }

  return <View style={cardFrameStyle}>{content}</View>;
}
