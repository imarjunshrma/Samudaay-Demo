import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, SelectField, Text, TextField } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

type AdminItem = {
  title: string;
  meta: string;
};

export function AdminCardList({
  items,
  actions,
}: {
  items: readonly AdminItem[];
  actions?: readonly [string, string];
}) {
  return (
    <View style={{ gap: spacing[4] }}>
      {items.map((item) => (
        <Card key={item.title} variant="elevated" padding="lg">
          <View style={{ gap: spacing[3] }}>
            <View>
              <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                {item.title}
              </Text>
              <Text variant="caption" color={colors.text.muted}>
                {item.meta}
              </Text>
            </View>
            {actions ? (
              <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                <View style={{ flex: 1 }}>
                  <Button variant="soft" fullWidth size="sm">
                    {actions[0]}
                  </Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Button variant="secondary" fullWidth size="sm">
                    {actions[1]}
                  </Button>
                </View>
              </View>
            ) : null}
          </View>
        </Card>
      ))}
    </View>
  );
}
