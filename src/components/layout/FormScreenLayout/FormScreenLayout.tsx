import type { ComponentRef, ReactNode, Ref } from 'react';
import { Dimensions, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export interface FormScreenLayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  scrollViewRef?: Ref<ComponentRef<typeof KeyboardAwareScrollView>>;
}

const FOOTER_HEIGHT = 72;

export function FormScreenLayout({ header, footer, children, scrollViewRef }: FormScreenLayoutProps) {
  const windowDimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('screen').height;
  const reservedBottomInset = Platform.OS === 'android' ? Math.max(0, screenHeight - windowDimensions.height - insets.top) : insets.bottom;
  const footerSafeAreaBottom = footer && Platform.OS === 'android' ? Math.max(0, insets.bottom - reservedBottomInset) : 0;
  const footerHeight = footer ? FOOTER_HEIGHT : 0;
  const footerTotalHeight = footerHeight + footerSafeAreaBottom;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      {header}

      <View style={styles.body}>
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          bottomOffset={footerTotalHeight + 16}
          keyboardShouldPersistTaps="handled"
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {children}
          </View>
        </KeyboardAwareScrollView>

        {footer ? (
          <KeyboardStickyView>
            <View style={{ height: footerTotalHeight }}>
              <View style={[styles.footer, { height: footerHeight }]}>
                {footer}
              </View>
              {footerSafeAreaBottom ? <View style={{ height: footerSafeAreaBottom }} /> : null}
            </View>
          </KeyboardStickyView>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    width: '100%',
  },
  footer: {
    paddingHorizontal: 16,
  },
});
