import type { RefObject } from 'react';
import { TextInput } from 'react-native';

import { Icon } from '@/src/components/ui';
import { colors } from '@/src/theme';

import { TextField } from '@/src/components/forms/TextField';

type SearchInputProps = {
  name?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  inputRef?: RefObject<TextInput | null>;
};

export function SearchInput({ placeholder = 'Search', inputRef, ...props }: SearchInputProps) {
  return (
    <TextField
      {...props}
      placeholder={placeholder}
      variant="search"
      leftIcon={<Icon name="search" size="md" color={colors.text.muted} />}
      inputRef={inputRef ?? undefined}
    />
  );
}
