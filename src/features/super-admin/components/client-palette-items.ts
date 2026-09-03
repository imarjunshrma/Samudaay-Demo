import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { FileUpload, FormLabel, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

import type { FileValue } from '@/src/types';

export const clientPaletteItems = [
  { name: 'Bespoke Tan', swatches: ['#46291e', '#256fd4', '#fdf9f6'] },
  { name: 'Slate & Steel', swatches: ['#1a2e35', '#5d6d7e', '#f8f9f9'] },
  { name: 'Forest Path', swatches: ['#2d5a27', '#8fb9a8', '#f4f7f4'] },
] as const;
