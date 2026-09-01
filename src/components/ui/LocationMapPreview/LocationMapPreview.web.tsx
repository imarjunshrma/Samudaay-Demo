import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components/ui/Text';
import { colors, radius, spacing, typography } from '@/src/theme';

export interface LocationMapPreviewProps {
  latitude: number;
  longitude: number;
  label: string;
  address?: string;
  height?: number;
  locationUrl?: string | null;
  googlePlaceId?: string | null;
}

const MAP_PREVIEW_ENABLED = process.env.EXPO_PUBLIC_ENABLE_MAP_PREVIEW === 'true';
const HAS_PUBLIC_GOOGLE_MAPS_KEY = Boolean(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);
const CAN_SHOW_WEB_MAP_PREVIEW = MAP_PREVIEW_ENABLED && HAS_PUBLIC_GOOGLE_MAPS_KEY;

export function LocationMapPreview({
  latitude,
  longitude,
  label,
  address,
  height = 180,
  locationUrl,
  googlePlaceId,
}: LocationMapPreviewProps) {
  const hasValidCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180;
  const mapPreviewAllowed = CAN_SHOW_WEB_MAP_PREVIEW;
  const handleOpenMap = () => {
    const coordinateQuery = encodeURIComponent(`${latitude},${longitude}`);
    const pinLabel = [label, address].filter(Boolean).join(', ').trim();
    const labeledCoordinateQuery = encodeURIComponent(
      pinLabel ? `${latitude},${longitude} (${pinLabel})` : `${latitude},${longitude}`,
    );
    const coordinateUrl = `https://www.google.com/maps?q=${labeledCoordinateQuery}`;
    const fallbackUrl = googlePlaceId
      ? `https://www.google.com/maps/search/?api=1&query=${coordinateQuery}&query_place_id=${encodeURIComponent(googlePlaceId)}`
      : String(locationUrl || '').trim();
    const targetUrl = hasValidCoordinates ? coordinateUrl : fallbackUrl;

    if (targetUrl && typeof window !== 'undefined') {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handleOpenMap}
      style={{
        height,
        borderRadius: radius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        backgroundColor: colors.background.surface,
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[2],
          backgroundColor: colors.background.muted,
        }}>
        <MaterialIcons name="map" size={40} color={colors.primary.DEFAULT} />
        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
          {label}
        </Text>
        {address ? (
          <Text
            variant="caption"
            style={{ color: colors.text.secondary, textAlign: 'center', paddingHorizontal: spacing[4] }}>
            {address}
          </Text>
        ) : null}
        <Text
          variant="caption"
          style={{ color: colors.text.secondary, textAlign: 'center', paddingHorizontal: spacing[4] }}>
          {!hasValidCoordinates
            ? 'Map preview unavailable until event coordinates are added.'
            : !mapPreviewAllowed
              ? 'Map preview is disabled until Google Maps is fully configured for this build.'
              : 'Map preview is available on the mobile app.'}
        </Text>
        <Text
          variant="caption"
          style={{ color: colors.primary.DEFAULT, textAlign: 'center', paddingHorizontal: spacing[4], fontFamily: typography.fontFamily.bold }}>
          Open in Maps
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          left: spacing[3],
          bottom: spacing[3],
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[1],
          borderRadius: radius.full,
          backgroundColor: 'rgba(255,255,255,0.92)',
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[2],
        }}>
        <MaterialIcons name="location-on" size={14} color={colors.primary.DEFAULT} />
        <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
