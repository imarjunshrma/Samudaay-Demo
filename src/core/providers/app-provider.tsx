import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';

import { AppQueryProvider } from '@/src/core/providers/query-provider';
import { SessionProvider } from '@/src/core/providers/session-provider';
import { CommunityGate } from '@/src/features/community/components/community-gate';
import { CommunitySessionWatcher } from '@/src/features/community/components/community-session-watcher';
import { storageKeys } from '@/src/constants/storageKeys';
import { getSecureItem, setSecureItem } from '@/src/services/secure-storage';
import { AppThemeProvider } from '@/src/theme';
import type { AppLanguage, ThemeMode } from '@/src/types/app';

interface AppPreferencesContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
}

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);

function isAppLanguage(value: string | null): value is AppLanguage {
  return value === 'en' || value === 'gu';
}

export function AppProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [languageHydrated, setLanguageHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    getSecureItem(storageKeys.language)
      .then((storedLanguage) => {
        if (!active || !isAppLanguage(storedLanguage)) {
          if (active) {
            setLanguageHydrated(true);
          }
          return;
        }
        setLanguage(storedLanguage);
        setLanguageHydrated(true);
      })
      .catch(() => {
        if (active) {
          setLanguageHydrated(true);
        }
        return;
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!languageHydrated) {
      return;
    }

    setSecureItem(storageKeys.language, language).catch(() => {
      return;
    });
  }, [language, languageHydrated]);

  const resolvedTheme =
    themeMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themeMode;

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      themeMode,
      setThemeMode,
      resolvedTheme,
    }),
    [language, resolvedTheme, themeMode],
  );

  return (
    <AppPreferencesContext.Provider value={value}>
      <AppQueryProvider>
        {/* Samudaay: the community is resolved before the session so every call hits the right tenant. */}
        <CommunityGate>
          <SessionProvider onSessionLanguageChange={setLanguage}>
            <CommunitySessionWatcher />
            <AppThemeProvider scheme={resolvedTheme}>{children}</AppThemeProvider>
          </SessionProvider>
        </CommunityGate>
      </AppQueryProvider>
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);

  if (!context) {
    throw new Error('useAppPreferences must be used within AppProvider');
  }

  return context;
}
