import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors, radius, spacing } from '@/src/theme';

export function EventScannerControls({
  flashlightOn = false,
  onFlashlightPress,
  onScanPress,
  onSyncPress,
}: {
  flashlightOn?: boolean;
  onFlashlightPress?: () => void;
  onScanPress?: () => void;
  onSyncPress?: () => void;
}) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: spacing[8], flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing[6] }}>
      <Pressable onPress={onFlashlightPress} style={{ width: 48, height: 48, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: flashlightOn ? 'rgba(24,168,117,0.28)' : 'rgba(0,0,0,0.5)', borderWidth: 1, borderColor: flashlightOn ? 'rgba(24,168,117,0.75)' : 'rgba(255,255,255,0.2)' }}>
        <MaterialIcons name="flashlight-on" size={22} color="#ffffff" />
      </Pressable>
      {onScanPress ? (
        <Pressable onPress={onScanPress} style={{ width: 64, height: 64, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.DEFAULT }}>
          <MaterialIcons name="qr-code-scanner" size={32} color="#ffffff" />
        </Pressable>
      ) : null}
      <Pressable onPress={onSyncPress} style={{ width: 48, height: 48, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
        <MaterialIcons name="sync" size={22} color="#ffffff" />
      </Pressable>
    </View>
  );
}
