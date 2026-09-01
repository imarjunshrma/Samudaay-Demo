import { useEffect, useRef } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components/ui/Text';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { colors, spacing, typography } from '@/src/theme';

import { AppHeader } from './AppHeader';

export interface AppHeaderSearchProps {
  title: string;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  searchActive: boolean;
  onSearchPress: () => void;
  onCloseSearch: () => void;
  onBackPress?: () => void;
  placeholder?: string;
}

export function AppHeaderSearch({
  title,
  searchValue,
  onSearchValueChange,
  searchActive,
  onSearchPress,
  onCloseSearch,
  onBackPress,
  placeholder = 'Search',
}: AppHeaderSearchProps) {
  const searchInputRef = useRef<TextInput>(null);
  const navigateBack = useBackNavigation();
  const resolvedBackPress = onBackPress ?? navigateBack;

  useEffect(() => {
    if (!searchActive) {
      return;
    }

    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [searchActive]);

  return (
    <AppHeader
      variant="back-inline"
      onLeftPress={() => resolvedBackPress()}
      title={undefined}
      leftSlot={(
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Back"
            activeOpacity={0.85}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={() => resolvedBackPress()}
            style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          {searchActive ? (
            <TextInput
              ref={searchInputRef}
              value={searchValue}
              onChangeText={onSearchValueChange}
              placeholder={placeholder}
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor={colors.primary.DEFAULT}
              returnKeyType="search"
              style={{
                flex: 1,
                minWidth: 0,
                color: colors.text.primary,
                fontFamily: typography.fontFamily.medium,
                fontWeight: '500',
                fontSize: 18,
                lineHeight: 22,
                letterSpacing: -0.1,
                paddingVertical: 0,
                paddingHorizontal: 0,
                marginTop: -2,
                textAlignVertical: 'center',
                includeFontPadding: false,
              }}
            />
          ) : (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Search ${title.toLowerCase()}`}
              activeOpacity={0.85}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              onPress={onSearchPress}
              style={{
                flex: 1,
                minWidth: 0,
                paddingVertical: spacing[1],
              }}>
              <Text
                variant="h5"
                style={{
                  fontFamily: typography.fontFamily.bold,
                  color: colors.text.primary,
                }}>
                {title}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      rightSlot={(
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={searchActive ? 'Close search' : `Search ${title.toLowerCase()}`}
          activeOpacity={0.85}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          onPress={searchActive ? onCloseSearch : onSearchPress}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: colors.primary.muted,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons
            name={searchActive ? 'close' : 'search'}
            size={20}
            color={colors.primary.DEFAULT}
          />
        </TouchableOpacity>
      )}
    />
  );
}
