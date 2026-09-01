import type { ReactNode } from 'react';

import { CameraSurface } from '@/src/components/media/CameraSurface';
import type { BarcodeScanningResult } from 'expo-camera';

export interface QrCodeScannerSurfaceProps {
  onScanned: (result: BarcodeScanningResult) => void;
  paused?: boolean;
  torchEnabled?: boolean;
  children?: React.ReactNode;
}

export function QrCodeScannerSurface({ onScanned, paused = false, torchEnabled = false, children }: QrCodeScannerSurfaceProps) {
  return (
    <CameraSurface mode="scan" paused={paused} torchEnabled={torchEnabled} onScanned={onScanned}>
      {children as ReactNode}
    </CameraSurface>
  );
}
