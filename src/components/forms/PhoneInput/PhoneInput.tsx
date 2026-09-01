import { useEffect, useMemo, useState } from 'react';
import { useField } from 'formik';
import { Pressable, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';

import { appConfig } from '@/src/constants';
import { Text } from '@/src/components/ui';
import { countryCallingCodeOptions, type CountryCallingCodeOption } from '@/src/constants/country-calling-codes';
import { colors, radius, spacing, typography } from '@/src/theme';

type PhoneInputProps = {
  name?: string;
  label?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  rightIcon?: React.ComponentProps<typeof MaterialIcons>['name'];
  onRightIconPress?: () => void;
  rightIconAccessibilityLabel?: string;
};

type PhoneInputBodyProps = PhoneInputProps & {
  value?: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  resolvedError?: string;
};

function getDefaultCountryCode() {
  return appConfig.defaultCountryCode || '+91';
}

function getCountryCodeOptions() {
  return countryCallingCodeOptions;
}

const phoneCountryCodeOptions = getCountryCodeOptions();

function getFlagEmoji(iso2: string) {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function splitPhoneValue(value?: string) {
  const trimmed = String(value || '').trim();
  const digitsOnly = trimmed.replace(/[^\d]/g, '');

  if (!digitsOnly) {
    return {
      countryCode: getDefaultCountryCode(),
      localNumber: '',
    };
  }

  if (trimmed.startsWith('+')) {
    const matchedOption = [...phoneCountryCodeOptions]
      .sort((left, right) => right.value.length - left.value.length)
      .find((option) => trimmed.startsWith(option.value));

    if (matchedOption) {
      return {
        countryCode: matchedOption.value,
        localNumber: digitsOnly.slice(matchedOption.value.replace(/[^\d]/g, '').length),
      };
    }

    return {
      countryCode: getDefaultCountryCode(),
      localNumber: digitsOnly,
    };
  }

  return {
    countryCode: getDefaultCountryCode(),
    localNumber: digitsOnly,
  };
}

function buildPhoneValue(countryCode: string, localNumber: string) {
  const countryDigits = countryCode.replace(/[^\d]/g, '');
  const localDigits = localNumber.replace(/[^\d]/g, '');
  const maxLocalLength = countryCode === '+91'
    ? 10
    : Math.max(0, 15 - countryDigits.length);

  if (!localDigits) {
    return '';
  }

  return `${countryCode}${localDigits.slice(0, maxLocalLength)}`;
}

function PhoneInputBody({
  label = 'Mobile Number',
  value,
  onChangeText,
  onBlur,
  resolvedError,
  placeholder = '98765 43210',
  disabled,
  rightIcon,
  onRightIconPress,
  rightIconAccessibilityLabel,
}: PhoneInputBodyProps) {
  const [countryCodeDropdownOpen, setCountryCodeDropdownOpen] = useState(false);
  const parsedValue = useMemo(() => splitPhoneValue(value), [value]);
  const [selectedCountryCode, setSelectedCountryCode] = useState(parsedValue.countryCode);
  const selectedOption = useMemo(
    () => phoneCountryCodeOptions.find((option) => option.value === selectedCountryCode) ?? phoneCountryCodeOptions.find((option) => option.value === getDefaultCountryCode()) ?? phoneCountryCodeOptions[0],
    [selectedCountryCode],
  );

  useEffect(() => {
    if (String(value || '').trim().startsWith('+')) {
      setSelectedCountryCode(parsedValue.countryCode);
      return;
    }

    if (!String(value || '').trim()) {
      setSelectedCountryCode((current) => current || parsedValue.countryCode);
    }
  }, [parsedValue.countryCode, value]);

  const localNumber = parsedValue.localNumber;

  return (
    <View style={{ gap: spacing[2] }}>
      <Text
        variant="caption"
        color={resolvedError ? colors.status.error : '#6b7280'}
        style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
        {label}
      </Text>
      <View
        style={{
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: resolvedError ? colors.status.error : colors.primary.border,
          backgroundColor: disabled ? colors.background.muted : colors.background.surface,
          overflow: 'hidden',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 120,
              borderRightWidth: 1,
              borderRightColor: colors.primary.border,
            }}>
            <Dropdown
              data={phoneCountryCodeOptions}
              value={selectedCountryCode}
              labelField="compactLabel"
              valueField="value"
              disable={disabled}
              onFocus={() => setCountryCodeDropdownOpen(true)}
              onBlur={() => setCountryCodeDropdownOpen(false)}
              onChange={(item) => {
                setSelectedCountryCode(item.value);
                onChangeText(buildPhoneValue(item.value, localNumber));
                setCountryCodeDropdownOpen(false);
              }}
              style={{
                minHeight: 54,
                paddingHorizontal: spacing[3],
                backgroundColor: disabled ? colors.background.muted : colors.background.surface,
              }}
              placeholderStyle={{
                color: '#94a3b8',
                fontSize: 15,
              }}
              selectedTextStyle={{
                color: colors.text.primary,
                fontSize: 16,
                fontFamily: typography.fontFamily.medium,
              }}
              containerStyle={{
                width: 280,
                borderRadius: radius.xl,
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                backgroundColor: colors.background.surface,
                overflow: 'hidden',
              }}
              itemContainerStyle={{
                borderBottomWidth: 1,
                borderBottomColor: colors.primary.borderLight,
              }}
              itemTextStyle={{
                color: colors.text.primary,
                fontSize: 15,
              }}
              maxHeight={280}
              autoScroll={false}
              mode="default"
              dropdownPosition="bottom"
              flatListProps={{
                nestedScrollEnabled: true,
                keyboardShouldPersistTaps: 'handled',
              }}
              renderLeftIcon={() => (
                <Text variant="body" style={{ marginRight: spacing[2], fontSize: 20 }}>
                  {getFlagEmoji(selectedOption.iso2)}
                </Text>
              )}
              renderRightIcon={() => (
                <MaterialIcons
                  name={countryCodeDropdownOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={20}
                  color={colors.primary.DEFAULT}
                />
              )}
              renderItem={(item: CountryCallingCodeOption) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: spacing[3],
                    paddingVertical: spacing[3],
                    gap: spacing[3],
                    backgroundColor: item.value === selectedCountryCode ? colors.primary.subtle : colors.background.surface,
                  }}>
                  <Text variant="body" style={{ fontSize: 20 }}>
                    {getFlagEmoji(item.iso2)}
                  </Text>
                  <Text variant="body" color={colors.text.primary} numberOfLines={1} style={{ flex: 1 }}>
                    {item.countryName} ({item.dialCode})
                  </Text>
                </View>
              )}
            />
          </View>
          <TextInput
            value={localNumber}
            onBlur={onBlur}
            onChangeText={(nextValue) => onChangeText(buildPhoneValue(selectedCountryCode, nextValue))}
            keyboardType="phone-pad"
            placeholder={placeholder}
            placeholderTextColor="#94a3b8"
            editable={!disabled}
            style={{
              flex: 1,
              minHeight: 54,
              paddingHorizontal: spacing[4],
              color: colors.text.primary,
              fontSize: 18,
              fontFamily: typography.fontFamily.medium,
            }}
          />
          {rightIcon ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={rightIconAccessibilityLabel ?? 'Edit mobile number'}
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
              style={({ pressed }) => ({
                width: 46,
                height: 46,
                marginRight: spacing[2],
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                opacity: pressed && onRightIconPress ? 0.7 : 1,
              })}>
              <MaterialIcons name={rightIcon} size={20} color={colors.primary.DEFAULT} />
            </Pressable>
          ) : null}
        </View>
      </View>
      {resolvedError ? <Text variant="caption" color={colors.status.error}>{resolvedError}</Text> : null}
    </View>
  );
}

function FormikPhoneInput(props: PhoneInputProps & { name: string }) {
  const [field, meta, helpers] = useField<string>(props.name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <PhoneInputBody
      {...props}
      value={field.value ?? ''}
      onBlur={() => helpers.setTouched(true)}
      onChangeText={(nextValue) => helpers.setValue(nextValue)}
      resolvedError={hasError ? meta.error : props.error}
    />
  );
}

export function PhoneInput(props: PhoneInputProps) {
  if (props.name) {
    return <FormikPhoneInput {...(props as PhoneInputProps & { name: string })} />;
  }

  return (
    <PhoneInputBody
      {...props}
      value={props.value ?? ''}
      onChangeText={props.onChangeText ?? (() => undefined)}
      resolvedError={props.error}
    />
  );
}
