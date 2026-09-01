import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { colors } from '@/src/theme';

export function AuthSecurityShell({ children }: { children: ReactNode }) {
  return (
    <AppSafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.glowPrimary} pointerEvents="none" />
        <View style={styles.glowWarm} pointerEvents="none" />
        {children}
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  glowPrimary: {
    position: 'absolute',
    top: -120,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: colors.primary.muted,
    opacity: 0.9,
  },
  glowWarm: {
    position: 'absolute',
    bottom: -140,
    left: -90,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: 'rgba(150, 73, 0, 0.06)',
  },
});
