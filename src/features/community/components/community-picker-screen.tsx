import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { communityConfig, type SelectedCommunity } from '@/src/core/config/community';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { colors } from '@/src/theme/colors';
import { fontFamily } from '@/src/theme/typography';

import { fetchCommunities } from '../services/community-selection.service';

const APP_LOGO = require('../../../../app/logo.png');

const copy = {
  en: {
    title: 'Select your community',
    changeTitle: 'Change community',
    back: 'Back',
    subtitle: 'Step 1 of 2',
    description: 'Choose the community or trust you belong to. You can register or log in after this.',
    search: 'Search by name or city',
    empty: 'No communities found.',
    noMatch: 'No community matches your search.',
    retry: 'Try again',
    current: 'Last used',
    available: 'Available communities',
  },
  gu: {
    title: 'તમારો સમુદાય પસંદ કરો',
    changeTitle: 'સમુદાય બદલો',
    back: 'પાછા',
    subtitle: '૨ માંથી પગલું ૧',
    description: 'તમે જે સમુદાય અથવા ટ્રસ્ટના સભ્ય છો તે પસંદ કરો. ત્યાર બાદ નોંધણી અથવા લોગિન કરો.',
    search: 'નામ અથવા શહેરથી શોધો',
    empty: 'કોઈ સમુદાય મળ્યો નથી.',
    noMatch: 'તમારી શોધ મુજબ કોઈ સમુદાય નથી.',
    retry: 'ફરી પ્રયાસ કરો',
    current: 'છેલ્લે વપરાયેલ',
    available: 'ઉપલબ્ધ સમુદાયો',
  },
};

interface Props {
  notice: string | null;
  currentCommunityId: string | null;
  onSelect: (community: SelectedCommunity) => void;
  /** Set when opened via "Change": returns to the current community without switching. */
  onCancel?: () => void;
}

export function CommunityPickerScreen({ notice, currentCommunityId, onSelect, onCancel }: Props) {
  const { language } = useAppPreferences();
  const t = copy[language === 'gu' ? 'gu' : 'en'];
  const [communities, setCommunities] = useState<SelectedCommunity[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setError(null);
    setCommunities(null);
    try {
      setCommunities(await fetchCommunities());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load communities.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = [...(communities ?? [])].sort((a, b) =>
      a.id === currentCommunityId ? -1 : b.id === currentCommunityId ? 1 : 0,
    );
    if (!query) {
      return list;
    }
    return list.filter((community) => `${community.name} ${community.city ?? ''}`.toLowerCase().includes(query));
  }, [communities, currentCommunityId, search]);

  return (
    <>
      <StatusBar style="dark" />
      <AppSafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View pointerEvents="none" style={styles.backgroundAccentTop} />
        <View pointerEvents="none" style={styles.backgroundAccentBottom} />
        <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.content}>
            {onCancel ? (
              <Pressable accessibilityRole="button" onPress={onCancel} hitSlop={12} style={styles.back}>
                <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text.primary} />
                <Text style={styles.backText}>{t.back}</Text>
              </Pressable>
            ) : null}
            <View style={styles.header}>
              <View style={styles.logoShell}>
                <Image source={APP_LOGO} style={styles.logo} contentFit="contain" />
              </View>
              <Text style={styles.brand}>{communityConfig.brandName || 'Samudaay'}</Text>
              <Text style={styles.stepLabel}>{t.subtitle}</Text>
              <Text style={styles.title}>{onCancel ? t.changeTitle : t.title}</Text>
              <Text style={styles.subtitle}>{t.description}</Text>
            </View>

            {notice ? <Text style={styles.notice}>{notice}</Text> : null}

            <View style={styles.searchBox}>
              <MaterialCommunityIcons name="magnify" size={20} color={colors.text.muted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={t.search}
                placeholderTextColor={colors.text.disabled}
                style={styles.searchInput}
                autoCorrect={false}
                returnKeyType="search"
              />
            </View>

            {communities === null && !error ? (
              <ActivityIndicator style={styles.state} size="large" color={colors.primary.DEFAULT} />
            ) : error ? (
              <View style={styles.state}>
                <Text style={styles.stateText}>{error}</Text>
                <Pressable style={styles.retry} onPress={() => void load()}>
                  <Text style={styles.retryText}>{t.retry}</Text>
                </Pressable>
              </View>
            ) : (
              <FlatList
                data={rows}
                keyExtractor={(item) => item.id}
                style={styles.listScroller}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                  rows.length ? (
                    <View style={styles.listHeader}>
                      <Text style={styles.listHeaderTitle}>{t.available}</Text>
                      <View style={styles.listHeaderCount}>
                        <Text style={styles.listHeaderCountText}>{rows.length}</Text>
                      </View>
                    </View>
                  ) : null
                }
                ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={[styles.stateText, styles.state]}>{communities?.length ? t.noMatch : t.empty}</Text>
                }
                renderItem={({ item }) => {
                  const selected = item.id === currentCommunityId;
                  const initial = item.name.trim().charAt(0).toUpperCase() || 'S';

                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${item.name}${item.city ? `, ${item.city}` : ''}`}
                      style={({ pressed }) => [
                        styles.rowPressable,
                        selected && styles.rowSelected,
                        pressed && styles.rowPressed,
                      ]}
                      onPress={() => onSelect(item)}
                    >
                      <View style={styles.rowContent}>
                        <View style={[styles.rowIcon, selected && styles.rowIconSelected]}>
                          <Text style={[styles.rowInitial, selected && styles.rowInitialSelected]}>{initial}</Text>
                        </View>
                        <View style={styles.rowText}>
                          <Text numberOfLines={2} style={styles.rowTitle}>{item.name}</Text>
                          <View style={styles.rowMeta}>
                            <MaterialCommunityIcons name="map-marker-outline" size={14} color={colors.text.muted} />
                            <Text numberOfLines={1} style={styles.rowSubtitle}>{item.city || communityConfig.brandName || 'Samudaay'}</Text>
                          </View>
                        </View>
                        <View style={selected ? styles.checkSelected : styles.checkIdle}>
                          <MaterialCommunityIcons
                            name={selected ? 'check' : 'chevron-right'}
                            size={selected ? 18 : 22}
                            color={selected ? colors.text.inverse : colors.text.muted}
                          />
                        </View>
                      </View>
                    </Pressable>
                  );
                }}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </AppSafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
    overflow: 'hidden',
  },
  backgroundAccentTop: {
    position: 'absolute',
    top: -110,
    right: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.primary.subtle,
  },
  backgroundAccentBottom: {
    position: 'absolute',
    bottom: -120,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.background.elevated,
  },
  keyboard: { flex: 1 },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    zIndex: 1,
    minHeight: 0,
  },
  back: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 16, paddingTop: 12 },
  backText: { marginLeft: 6, fontFamily: fontFamily.medium, fontSize: 15, color: colors.text.primary },
  header: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 14 },
  logoShell: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  logo: { width: 64, height: 64 },
  brand: { fontFamily: fontFamily.semibold, fontSize: 14, color: colors.primary.DEFAULT, marginBottom: 4 },
  stepLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: { fontFamily: fontFamily.bold, fontSize: 24, color: colors.text.primary, textAlign: 'center' },
  subtitle: { fontFamily: fontFamily.regular, fontSize: 14, color: colors.text.secondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  notice: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff4e5',
    color: '#7a4b00',
    fontFamily: fontFamily.medium,
    fontSize: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    backgroundColor: colors.background.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, fontFamily: fontFamily.regular, fontSize: 15, color: colors.text.primary },
  listScroller: {
    flex: 1,
    marginTop: 2,
    minHeight: 0,
  },
  list: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
  },
  listSeparator: {
    height: 10,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    paddingBottom: 12,
  },
  listHeaderTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: colors.text.secondary,
  },
  listHeaderCount: {
    minWidth: 28,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.primary.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeaderCountText: {
    color: colors.primary.DEFAULT,
    fontFamily: fontFamily.semibold,
    fontSize: 12,
  },
  rowPressable: {
    minHeight: 76,
    borderRadius: 16,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    overflow: 'hidden',
  },
  rowContent: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowSelected: {
    borderColor: colors.primary.DEFAULT,
    backgroundColor: '#f1fbf7',
  },
  rowPressed: { backgroundColor: colors.primary.subtle },
  rowIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowIconSelected: { backgroundColor: colors.primary.DEFAULT },
  rowInitial: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.primary.DEFAULT,
  },
  rowInitialSelected: { color: colors.text.inverse },
  rowText: { flex: 1, minWidth: 0 },
  rowTitle: { fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 21, color: colors.text.primary },
  rowMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  rowSubtitle: { flex: 1, marginLeft: 3, fontFamily: fontFamily.regular, fontSize: 13, color: colors.text.muted },
  checkIdle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSelected: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 12,
    backgroundColor: colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  state: { marginTop: 40, alignItems: 'center', paddingHorizontal: 24 },
  stateText: { fontFamily: fontFamily.regular, fontSize: 14, color: colors.text.secondary, textAlign: 'center' },
  retry: { marginTop: 12, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: colors.primary.DEFAULT },
  retryText: { fontFamily: fontFamily.semibold, color: colors.text.inverse },
});
