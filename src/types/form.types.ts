import type { ReactNode, RefObject } from 'react';
import type { KeyboardTypeOptions, StyleProp, TextInput, TextInputProps, TextStyle } from 'react-native';

export interface SelectOption<TValue extends string = string> {
  label: string;
  value: TValue;
  description?: string;
  disabled?: boolean;
}

export interface BaseFieldProps {
  name?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface TextFieldConfig extends BaseFieldProps {
  value?: string;
  onChangeText?: (value: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  textContentType?: TextInputProps['textContentType'];
  returnKeyType?: 'done' | 'next' | 'go' | 'search' | 'send';
  onSubmitEditing?: () => void;
  onBlur?: () => void;
  blurOnSubmit?: boolean;
  maxLength?: number;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
  variant?: 'default' | 'filled' | 'search' | 'compact' | 'registration';
  labelVariant?: 'uppercase' | 'default';
  inputStyle?: StyleProp<TextStyle>;
  inputRef?: RefObject<TextInput | null>;
  useSystemFont?: boolean;
}

export interface FileValue {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
}
