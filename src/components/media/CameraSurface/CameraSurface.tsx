import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Camera, CameraView, type BarcodeScanningResult, type CameraCapturedPicture } from 'expo-camera';

import { Button, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { ensureCameraPermission } from '@/src/services/device/app-permissions';
import { colors, spacing, typography } from '@/src/theme';

type CameraSurfaceRenderArgs = {
  capture: () => Promise<void>;
  ready: boolean;
};

type CameraViewInstance = InstanceType<typeof CameraView>;

export interface CameraSurfaceProps {
  mode: 'scan' | 'capture';
  paused?: boolean;
  torchEnabled?: boolean;
  onScanned?: (result: BarcodeScanningResult) => void;
  onCaptured?: (photo: CameraCapturedPicture) => void;
  children?: ReactNode | ((args: CameraSurfaceRenderArgs) => ReactNode);
}

export function CameraSurface({
  mode,
  paused = false,
  torchEnabled = false,
  onScanned,
  onCaptured,
  children,
}: CameraSurfaceProps) {
  const t = useTranslations();
  const cameraRef = useRef<CameraViewInstance | null>(null);
  const [ready, setReady] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    Camera.getCameraPermissionsAsync()
      .then((permission) => {
        if (active) {
          setPermissionGranted(permission.granted);
        }
      })
      .catch(() => {
        if (active) {
          setPermissionGranted(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const capture = async () => {
    if (!cameraRef.current || !ready) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
    onCaptured?.(photo);
  };

  if (permissionGranted === null) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing[3], backgroundColor: colors.background.DEFAULT }}>
        <ActivityIndicator color={colors.primary.DEFAULT} />
        <Text variant="body" style={{ fontFamily: typography.fontFamily.medium }}>
          {t('camera.preparing')}
        </Text>
      </View>
    );
  }

  if (!permissionGranted) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing[4], backgroundColor: colors.background.DEFAULT, padding: spacing[4] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, textAlign: 'center' }}>
          {t('camera.permissionRequired')}
        </Text>
        <Button
          onPress={async () => {
            const permission = await ensureCameraPermission({
              deniedMessage: 'Allow camera access to continue.',
              blockedMessage: 'Camera access is disabled for this app. Enable it from app settings to continue.',
            });
            if (permission.granted) {
              setPermissionGranted(true);
            }
          }}>
          {t('camera.allow')}
        </Button>
      </View>
    );
  }

  const overlay = typeof children === 'function' ? children({ capture, ready }) : children;

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
        active={!paused}
        enableTorch={torchEnabled}
        barcodeScannerSettings={mode === 'scan' ? { barcodeTypes: ['qr'] } : undefined}
        onBarcodeScanned={
          mode === 'scan'
            ? (result) => {
                if (!paused) {
                  onScanned?.(result);
                }
              }
            : undefined
        }
        onCameraReady={() => setReady(true)}
      />
      {overlay ? <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>{overlay}</View> : null}
    </View>
  );
}
