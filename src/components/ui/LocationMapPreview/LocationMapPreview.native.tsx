import { ActivityIndicator, Alert, Animated, Easing, Linking, Pressable, StyleSheet, View } from 'react-native';
import { createElement, useEffect, useRef, useState } from 'react';
import type { ElementType } from 'react';
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
const CAN_ATTEMPT_NATIVE_MAP_PREVIEW = MAP_PREVIEW_ENABLED && HAS_PUBLIC_GOOGLE_MAPS_KEY;

export function LocationMapPreview({
  latitude,
  longitude,
  label,
  address,
  height = 180,
  locationUrl,
  googlePlaceId,
}: LocationMapPreviewProps) {
  const [mapReady, setMapReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const mapOpacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const hasValidCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180;

  let NativeMapView: ElementType | null = null;
  let NativeMarker: ElementType | null = null;
  let nativeGoogleProvider: unknown = undefined;
  let nativeMapLoadError: string | null = null;

  if (CAN_ATTEMPT_NATIVE_MAP_PREVIEW && hasValidCoordinates && !mapFailed) {
    try {
      // react-native-maps is loaded lazily because this preview is optional.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mapsModule = require('react-native-maps') as {
        default: ElementType;
        Marker: ElementType;
        PROVIDER_GOOGLE?: unknown;
      };
      NativeMapView = mapsModule.default;
      NativeMarker = mapsModule.Marker;
      nativeGoogleProvider = mapsModule.PROVIDER_GOOGLE;
    } catch (error) {
      NativeMapView = null;
      NativeMarker = null;
      nativeGoogleProvider = undefined;
      nativeMapLoadError = error instanceof Error ? error.message : 'Unable to load react-native-maps';
    }
  }

  const mapPreviewAllowed = CAN_ATTEMPT_NATIVE_MAP_PREVIEW;
  const showFallbackCard = !mapPreviewAllowed || !hasValidCoordinates || !NativeMapView || !NativeMarker || mapFailed;

  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    console.info('[map-preview]', {
      label,
      latitude,
      longitude,
      hasValidCoordinates,
      mapPreviewEnabled: MAP_PREVIEW_ENABLED,
      hasPublicGoogleMapsKey: HAS_PUBLIC_GOOGLE_MAPS_KEY,
      mapPreviewAllowed,
      nativeMapViewLoaded: Boolean(NativeMapView),
      nativeMarkerLoaded: Boolean(NativeMarker),
      mapFailed,
      showFallbackCard,
      nativeMapLoadError,
    });
  }, [
    NativeMapView,
    NativeMarker,
    hasValidCoordinates,
    label,
    latitude,
    longitude,
    mapFailed,
    mapPreviewAllowed,
    showFallbackCard,
    nativeMapLoadError,
  ]);

  useEffect(() => {
    if (!mapReady) {
      return;
    }

    Animated.parallel([
      Animated.timing(mapOpacity, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [mapOpacity, mapReady, overlayOpacity]);

  const handleOpenMap = async () => {
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

    try {
      const supported = await Linking.canOpenURL(targetUrl);
      if (!supported) {
        throw new Error('Map URL is not supported on this device.');
      }

      await Linking.openURL(targetUrl);
    } catch (error) {
      Alert.alert('Unable to open map', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Opens this location in your map app."
      onPress={() => {
        void handleOpenMap();
      }}
      style={{
        height,
        borderRadius: radius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        backgroundColor: colors.background.surface,
      }}>
      {showFallbackCard ? (
        <FallbackCard
          address={address}
          hasValidCoordinates={hasValidCoordinates}
          label={label}
          mapPreviewAllowed={mapPreviewAllowed}
        />
      ) : (
        <Animated.View style={{ flex: 1, opacity: mapOpacity }}>
          {createElement(
            NativeMapView as ElementType,
            {
              style: { flex: 1 },
              initialRegion: {
                latitude,
                longitude,
                latitudeDelta: 0.012,
                longitudeDelta: 0.012,
              },
              provider: nativeGoogleProvider,
              onMapReady: () => {
                if (__DEV__) {
                  console.info('[map-preview]', {
                    label,
                    source: 'onMapReady',
                  });
                }
                setMapReady(true);
              },
              onError: (error: unknown) => {
                if (__DEV__) {
                  console.info('[map-preview]', {
                    label,
                    source: 'onError',
                    error,
                  });
                }
                setMapFailed(true);
              },
              scrollEnabled: false,
              zoomEnabled: false,
              rotateEnabled: false,
              pitchEnabled: false,
            },
            createElement(NativeMarker as ElementType, {
              coordinate: { latitude, longitude },
              title: label,
              description: address,
            }),
          )}
        </Animated.View>
      )}
      {showFallbackCard ? null : (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              opacity: overlayOpacity,
              backgroundColor: colors.background.muted,
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[2],
            },
          ]}>
          <ActivityIndicator color={colors.primary.DEFAULT} />
          <MaterialIcons name="map" size={28} color={colors.primary.DEFAULT} />
          <Text variant="caption" style={{ color: colors.text.secondary, fontFamily: typography.fontFamily.medium }}>
            Loading map
          </Text>
        </Animated.View>
      )}
      <MapBadge label={label} />
    </Pressable>
  );
}

function FallbackCard({
  label,
  address,
  hasValidCoordinates,
  mapPreviewAllowed,
}: {
  label: string;
  address?: string;
  hasValidCoordinates: boolean;
  mapPreviewAllowed: boolean;
}) {
  return (
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
            : 'Map preview is temporarily unavailable.'}
      </Text>
      <Text
        variant="caption"
        style={{ color: colors.primary.DEFAULT, textAlign: 'center', paddingHorizontal: spacing[4], fontFamily: typography.fontFamily.bold }}>
        Tap to open in Maps
      </Text>
    </View>
  );
}

function MapBadge({ label }: { label: string }) {
  return (
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
  );
}
