import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KeyboardAwareView } from '@/src/components/layout/KeyboardAwareView';
import { UserBottomBar } from '@/src/components/layout/UserBottomBar';
import { UserHeader } from '@/src/components/layout/UserHeader';
import { colors, layout, spacing } from '@/src/theme';

import type { UserScreenProps } from './UserScreen.types';

export function UserScreen({
  children,
  header,
  bottomBarItems,
  activeBottomBarKey,
  onBottomBarPress,
  hero,
}: PropsWithChildren<UserScreenProps>) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      {header ? <UserHeader {...header} /> : null}
      <KeyboardAwareView>
        <View style={{ flex: 1, paddingHorizontal: layout.screenPadding, paddingTop: spacing[4], paddingBottom: spacing[8], gap: spacing[6] }}>
          {hero}
          {children}
        </View>
      </KeyboardAwareView>
      {bottomBarItems && activeBottomBarKey && onBottomBarPress ? (
        <UserBottomBar items={bottomBarItems} activeKey={activeBottomBarKey} onItemPress={onBottomBarPress} />
      ) : null}
    </SafeAreaView>
  );
}
