import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export function KeyboardLayout({
  children,
  contentContainerStyle,
  extraScrollHeight = 24,
  keyboardShouldPersistTaps = 'handled',
  showsVerticalScrollIndicator = false,
  scrollEnabled = true,
  style,
}) {
  return (
    <KeyboardAwareScrollView
      bottomOffset={extraScrollHeight}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      style={[{ flex: 1 }, style]}
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingBottom: 0,
        },
        contentContainerStyle,
      ]}>
      <View style={{ flexGrow: 1 }}>
        {children}
      </View>
    </KeyboardAwareScrollView>
  );
}

export default KeyboardLayout;
