import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { BarcodeScanningResult } from 'expo-camera';
import { SafeAreaView as SafeAreaViewNative, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader, Dialog, QrCodeScannerSurface, Text, type DialogVariant } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import {
  EventScannerControls,
  EventScannerMemberSheet,
  EventServiceCard,
} from './event-shared-blocks';
import { eventService } from '../services/event-service';

type ScannerService = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  subtitle: string;
  state: 'action' | 'redeemed';
};

type ScannedEventPass = Awaited<ReturnType<typeof eventService.scanEventPass>>;
type ScanHighlight = { x: number; y: number; width: number; height: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getBarcodeBounds(result: BarcodeScanningResult): ScanHighlight | null {
  const points = Array.isArray(result.cornerPoints) ? result.cornerPoints : [];
  const finitePoints = points.filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));

  if (finitePoints.length >= 2) {
    const xs = finitePoints.map((point) => point.x);
    const ys = finitePoints.map((point) => point.y);
    const x = Math.min(...xs);
    const y = Math.min(...ys);
    return {
      x,
      y,
      width: Math.max(...xs) - x,
      height: Math.max(...ys) - y,
    };
  }

  if (result.bounds?.origin && result.bounds?.size) {
    return {
      x: result.bounds.origin.x,
      y: result.bounds.origin.y,
      width: result.bounds.size.width,
      height: result.bounds.size.height,
    };
  }

  return null;
}

function getScannerTrackingBox(barcode: ScanHighlight | null, scannerSize: { width: number; height: number }) {
  if (!barcode || !scannerSize.width || !scannerSize.height || barcode.width < 12 || barcode.height < 12) {
    return null;
  }

  const minSize = 56;
  const padding = Math.max(18, Math.min(barcode.width, barcode.height) * 0.18);
  const maxWidth = Math.max(minSize, scannerSize.width - spacing[6]);
  const maxHeight = Math.max(minSize, scannerSize.height - spacing[6]);
  const width = Math.min(maxWidth, Math.max(minSize, barcode.width + padding * 2));
  const height = Math.min(maxHeight, Math.max(minSize, barcode.height + padding * 2));
  const x = clamp(barcode.x - padding, spacing[3], Math.max(spacing[3], scannerSize.width - width - spacing[3]));
  const y = clamp(barcode.y - padding, spacing[3], Math.max(spacing[3], scannerSize.height - height - spacing[3]));

  return {
    x,
    y,
    width,
    height,
  };
}

function getOverlapRatio(inner: ScanHighlight, outer: ScanHighlight) {
  const xOverlap = Math.max(0, Math.min(inner.x + inner.width, outer.x + outer.width) - Math.max(inner.x, outer.x));
  const yOverlap = Math.max(0, Math.min(inner.y + inner.height, outer.y + outer.height) - Math.max(inner.y, outer.y));
  const innerArea = inner.width * inner.height;

  return innerArea > 0 ? (xOverlap * yOverlap) / innerArea : 0;
}

function isBarcodeInsideScanWindow(barcode: ScanHighlight | null, scanWindow: ScanHighlight | null) {
  if (!barcode || !scanWindow || barcode.width < 12 || barcode.height < 12) {
    return false;
  }

  const centerX = barcode.x + barcode.width / 2;
  const centerY = barcode.y + barcode.height / 2;
  const centerInside =
    centerX >= scanWindow.x &&
    centerX <= scanWindow.x + scanWindow.width &&
    centerY >= scanWindow.y &&
    centerY <= scanWindow.y + scanWindow.height;

  return centerInside && getOverlapRatio(barcode, scanWindow) >= 0.55;
}

export function QrScannerContent() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId?: string; returnTo?: string; scanMode?: string }>();
  const navigateBack = useBackNavigation();
  const insets = useSafeAreaInsets();
  const t = useTranslations('events.qr-scanner');
  const [activeTab, setActiveTab] = useState<'attendance' | 'addons'>('attendance');
  const [activeMember, setActiveMember] = useState<ScannedEventPass | null>(null);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [validating, setValidating] = useState(false);
  const [scannerSize, setScannerSize] = useState({ width: 0, height: 0 });
  const [qrInsideWindow, setQrInsideWindow] = useState(false);
  const [trackedQrBox, setTrackedQrBox] = useState<ScanHighlight | null>(null);
  const [dialog, setDialog] = useState<{
    visible: boolean;
    variant: DialogVariant;
    title: string;
    description?: string;
  }>({ visible: false, variant: 'info', title: '' });
  const lastScanAtRef = useRef(0);
  const trackingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scannerPaused = sheetVisible || validating || dialog.visible;
  const isMemberScanMode = params.scanMode === 'member-registration';
  const scanGate = useMemo<ScanHighlight | null>(() => {
    if (!scannerSize.width || !scannerSize.height) {
      return null;
    }

    const size = Math.min(280, Math.max(220, scannerSize.width - spacing[12]));
    return {
      x: (scannerSize.width - size) / 2,
      y: Math.max(spacing[16] + spacing[4], (scannerSize.height - size) / 2 - spacing[8]),
      width: size,
      height: size,
    };
  }, [scannerSize.height, scannerSize.width]);
  const visibleServices = useMemo<ScannerService[]>(() => {
    if (!activeMember) {
      return [];
    }

    if (activeTab === 'attendance') {
      return [
        {
          icon: 'event-available',
          title: t('result.entry.title'),
          subtitle: activeMember.alreadyProcessed ? t('result.entry.alreadyMarked') : activeMember.attendedAt ? t('result.entry.marked') : t('result.entry.ready'),
          state: activeMember.attendedAt ? 'redeemed' : 'action',
        },
      ];
    }

    if (!activeMember.addOn) {
      return [];
    }

    return [
      {
        icon: 'confirmation-number',
        title: activeMember.addOn,
        subtitle: activeMember.alreadyProcessed ? t('result.addon.alreadyConsumed') : activeMember.addOnConsumedAt ? t('result.addon.consumed') : t('result.addon.ready'),
        state: activeMember.addOnConsumedAt ? 'redeemed' : 'action',
      },
    ];
  }, [activeMember, activeTab, t]);

  useEffect(() => {
    return () => {
      if (trackingTimeoutRef.current) {
        clearTimeout(trackingTimeoutRef.current);
      }
    };
  }, []);

  const handleBarcodeScanned = useCallback(
    async (result: BarcodeScanningResult) => {
      if (scannerPaused) {
        return;
      }

      const token = result.data.trim();
      if (!token) {
        return;
      }

      const barcodeBounds = getBarcodeBounds(result);
      const insideWindow = isBarcodeInsideScanWindow(barcodeBounds, scanGate);
      const trackingBox = getScannerTrackingBox(barcodeBounds, scannerSize);
      setTrackedQrBox(trackingBox);
      if (trackingTimeoutRef.current) {
        clearTimeout(trackingTimeoutRef.current);
      }
      if (trackingBox) {
        trackingTimeoutRef.current = setTimeout(() => {
          setTrackedQrBox(null);
          setQrInsideWindow(false);
        }, 800);
      }
      setQrInsideWindow(insideWindow);
      if (!insideWindow) {
        return;
      }

      const now = Date.now();
      if (now - lastScanAtRef.current < 1200) {
        return;
      }
      lastScanAtRef.current = now;
      setValidating(true);

      try {
        if (isMemberScanMode) {
          const member = await eventService.scanMemberQr(token);
          const returnPath = params.returnTo || '/admin/event-registrations';
          const separator = returnPath.includes('?') ? '&' : '?';
          router.replace(
            `${returnPath}${separator}${new URLSearchParams({
              scanName: member.name || '',
              scanPhone: member.phone || '',
              scanEmail: member.email || '',
              scanAddress: member.address || '',
              scanCity: member.city || '',
              scanState: member.state || '',
              scanCountry: member.country || 'India',
              scanMemberId: member.memberId || '',
            }).toString()}` as never,
          );
          return;
        }

        const scanned = await eventService.scanEventPass(token, activeTab);
        setActiveMember(scanned);
        setSheetVisible(true);
      } catch (error) {
        setDialog({
          visible: true,
          variant: 'error',
          title: t('errors.scanFailed'),
          description: error instanceof Error ? error.message : t('errors.unableToValidate'),
        });
      } finally {
        setValidating(false);
      }
    },
    [activeTab, isMemberScanMode, params.returnTo, router, scanGate, scannerPaused, scannerSize, t],
  );

  return (
    <SafeAreaViewNative edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT, position: 'relative' }}>
        <AppHeader
          title={t('title')}
          variant="title-action"
          leftIcon="arrow-back"
          rightIcon="history"
          onLeftPress={navigateBack}
        />

        <View
          style={{ flex: 1, backgroundColor: '#000000' }}
          onLayout={(event: LayoutChangeEvent) => {
            const { width, height } = event.nativeEvent.layout;
            setScannerSize({ width, height });
          }}>
          <QrCodeScannerSurface paused={scannerPaused} torchEnabled={flashlightOn} onScanned={handleBarcodeScanned}>
            <LinearGradient
              colors={['rgba(15,23,42,0.18)', 'rgba(0,0,0,0.58)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFillObject,
                {
                  backgroundColor: flashlightOn ? 'rgba(24,168,117,0.08)' : 'transparent',
                },
              ]}
            />
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: spacing[6],
                paddingBottom: spacing[16],
              }}>
              <View style={{ position: 'absolute', top: spacing[5], left: spacing[5], right: spacing[5], alignItems: 'center' }}>
                <View
                  style={{
                    borderRadius: radius.full,
                    backgroundColor: 'rgba(0,0,0,0.58)',
                    paddingHorizontal: spacing[4],
                    paddingVertical: spacing[2],
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.18)',
                  }}>
                  <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.medium }}>
                    {validating ? t('status.validating') : isMemberScanMode ? 'Align member QR inside the frame' : t('status.alignQr')}
                  </Text>
                </View>
              </View>
              {trackedQrBox ? (
                <View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left: trackedQrBox.x,
                    top: trackedQrBox.y,
                    width: trackedQrBox.width,
                    height: trackedQrBox.height,
                    borderRadius: radius.xl,
                    borderWidth: qrInsideWindow ? 4 : 3,
                    borderColor: '#22c55e',
                    backgroundColor: qrInsideWindow ? 'rgba(34,197,94,0.14)' : 'rgba(34,197,94,0.06)',
                    shadowColor: '#22c55e',
                    shadowOpacity: qrInsideWindow ? 0.65 : 0.3,
                    shadowRadius: qrInsideWindow ? 18 : 10,
                    shadowOffset: { width: 0, height: 0 },
                  }}
                />
              ) : null}
              <EventScannerControls
                flashlightOn={flashlightOn}
                onFlashlightPress={() => setFlashlightOn((current) => !current)}
                onSyncPress={() => {
                  if (trackingTimeoutRef.current) {
                    clearTimeout(trackingTimeoutRef.current);
                  }
                  setSheetVisible(false);
                  setValidating(false);
                  lastScanAtRef.current = 0;
                  setActiveMember(null);
                  setQrInsideWindow(false);
                  setTrackedQrBox(null);
                }}
              />
            </View>
          </QrCodeScannerSurface>
        </View>

        {sheetVisible && activeMember ? (
          <>
            <View
              style={{
                position: 'absolute',
                left: spacing[4],
                right: spacing[4],
                bottom: 420,
                zIndex: 30,
                borderRadius: radius.xl,
                backgroundColor: 'rgba(24,168,117,0.1)',
                padding: spacing[1],
              }}>
              <View style={{ flexDirection: 'row' }}>
                {[
                  { key: 'attendance', label: t('tabs.attendance') },
                  { key: 'addons', label: t('tabs.addons') },
                ].map((item) => {
                  const active = activeTab === item.key;

                  return (
                    <Pressable
                      key={item.key}
                      onPress={() => setActiveTab(item.key as 'attendance' | 'addons')}
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: radius.lg,
                        backgroundColor: active ? '#ffffff' : 'transparent',
                        paddingVertical: spacing[3],
                      }}>
                      <Text
                        variant="caption"
                        color={active ? colors.primary.DEFAULT : '#64748b'}
                        style={{ fontFamily: active ? typography.fontFamily.bold : typography.fontFamily.medium, fontSize: 14 }}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 40,
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.6)',
                paddingBottom: spacing[4] + insets.bottom,
              }}>
              <EventScannerMemberSheet
                name={activeMember.name}
                memberId={activeMember.memberId}
                eventTitle={activeMember.eventTitle}
                avatar={`https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(activeMember.name)}`}>
                <View
                  style={{
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: 'rgba(24,168,117,0.18)',
                    backgroundColor: 'rgba(24,168,117,0.05)',
                    padding: spacing[4],
                  }}>
                  <Text
                    variant="caption"
                    color={colors.primary.DEFAULT}
                    style={{
                      marginBottom: spacing[3],
                      fontFamily: typography.fontFamily.bold,
                      fontSize: 12,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}>
                    {t('sections.serviceVerification')}
                  </Text>
                  <View style={{ gap: spacing[3] }}>
                    {visibleServices.map((service, index) => (
                      <EventServiceCard
                        key={service.title}
                        icon={service.icon}
                        title={service.title}
                        subtitle={service.subtitle}
                        state={service.state}
                        showDivider={index < visibleServices.length - 1}
                      />
                    ))}
                    {visibleServices.length === 0 ? (
                      <View style={{ alignItems: 'center', paddingVertical: spacing[4] }}>
                        <Text variant="body" color="#64748b" style={{ textAlign: 'center', fontFamily: typography.fontFamily.medium }}>
                          {activeTab === 'addons' ? t('result.addon.none') : t('result.empty')}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                <View style={{ marginTop: spacing[5] }}>
                  <Pressable
                    onPress={() => {
                      if (trackingTimeoutRef.current) {
                        clearTimeout(trackingTimeoutRef.current);
                      }
                      setSheetVisible(false);
                      lastScanAtRef.current = Date.now();
                      setActiveTab('attendance');
                      setActiveMember(null);
                      setQrInsideWindow(false);
                      setTrackedQrBox(null);
                    }}
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: radius.lg,
                      backgroundColor: '#0f172a',
                      paddingVertical: spacing[4],
                    }}>
                    <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, letterSpacing: 0.4 }}>
                      {t('actions.nextScan')}
                    </Text>
                  </Pressable>
                </View>
              </EventScannerMemberSheet>
            </View>
          </>
        ) : null}

        <Dialog
          visible={dialog.visible}
          variant={dialog.variant}
          title={dialog.title}
          description={dialog.description}
          onConfirm={() => setDialog((current) => ({ ...current, visible: false }))}
          onCancel={() => setDialog((current) => ({ ...current, visible: false }))}
        />
      </View>
    </SafeAreaViewNative>
  );
}
