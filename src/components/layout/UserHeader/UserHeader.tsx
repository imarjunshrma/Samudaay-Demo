import { View } from 'react-native';

import { Text } from '@/src/components/ui';
import { colors } from '@/src/theme';

import { HeaderBackTitle } from './HeaderBackTitle';
import { HeaderCentered } from './HeaderCentered';
import { HeaderLogoTitle } from './HeaderLogoTitle';
import { HeaderWithActions } from './HeaderWithActions';
import type { UserHeaderProps } from './UserHeader.types';

export function UserHeader(props: UserHeaderProps) {
  return (
    <View
      style={{
        backgroundColor: props.transparent ? 'transparent' : colors.background.DEFAULT,
        borderBottomWidth: props.transparent ? 0 : 1,
        borderBottomColor: colors.primary.borderLight,
      }}>
      {props.variant === 'back-title' ? <HeaderBackTitle title={props.title} onBackPress={props.onBackPress} /> : null}
      {props.variant === 'centered-title' ? (
        <HeaderCentered title={props.title} onBackPress={props.onBackPress} showBack={props.showBack} />
      ) : null}
      {props.variant === 'back-title-action' ? (
        <HeaderWithActions title={props.title} onBackPress={props.onBackPress} rightActions={props.rightActions} />
      ) : null}
      {props.variant === 'logo-title-actions' ? (
        <HeaderLogoTitle title={props.title} logoComponent={props.logoComponent} rightActions={props.rightActions} />
      ) : null}
      {props.variant === 'title-subtitle' ? (
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <Text variant="h5">{props.title}</Text>
          {props.subtitle ? <Text variant="caption" color={colors.text.muted}>{props.subtitle}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}
