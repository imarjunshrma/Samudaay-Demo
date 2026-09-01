import type { PropsWithChildren } from 'react';
import { LinearGradientLikeBackground, type GradientTone } from '@/src/components/ui/gradient-background';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { palette, spacing, typography } from '@/src/theme/tokens';
import type { LocalizedText } from '@/src/types/app';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface AppScreenProps extends PropsWithChildren {
  eyebrow?: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  tone?: GradientTone;
  footerSpacing?: boolean;
}

export function AppScreen({
  children,
  title,
  description,
  eyebrow,
  tone = 'warm',
  footerSpacing = true,
}: AppScreenProps) {
  const { language, resolvedTheme } = useAppPreferences();
  const colors = palette[resolvedTheme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollView
        bottomOffset={24}
        contentContainerStyle={[styles.content, footerSpacing && styles.footerSpacing]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}>
        <LinearGradientLikeBackground tone={tone}>
          {eyebrow ? (
            <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow[language]}</Text>
          ) : null}
          <Text style={[styles.title, { color: colors.text }]}>{title[language]}</Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>{description[language]}</Text>
        </LinearGradientLikeBackground>
        <View style={styles.body}>{children}</View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  footerSpacing: {
    paddingBottom: spacing.xxxl,
  },
  body: {
    gap: spacing.lg,
  },
  eyebrow: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.display,
  },
  description: {
    ...typography.body,
    marginTop: spacing.sm,
    maxWidth: 680,
  },
});
