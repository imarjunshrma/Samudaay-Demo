import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';

import { AppHeader, Button, InfiniteScrollList, SearchInput, Text, TextField } from '@/src/components';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { directoryService, type DirectoryMemberItem } from '@/src/features/directory/services/directory-service';
import {
  eventService,
  type EventRegistrationAdminRecord,
  type EventRegistrationsPageResponse,
} from '@/src/features/events/services/event-service';
import { EventAddOnCard } from '@/src/features/events/components/event-shared-blocks';
import { colors, radius, spacing, typography } from '@/src/theme';

type RegistrationAddOn = {
  key: string;
  title: string;
  amount: number;
  quantity: number;
  selected: boolean;
};

type AdhocRegistrationFormState = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  attendees: string;
  paymentReferenceId: string;
};

const PAGE_SIZE = 20;
const initialForm: AdhocRegistrationFormState = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  attendees: '1',
  paymentReferenceId: '',
};

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ flex: 1, minWidth: 144, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border.light, backgroundColor: colors.background.surface, padding: spacing[3], gap: spacing[1] }}>
      <Text variant="caption" style={{ color: colors.text.secondary }}>{label}</Text>
      <Text variant="h3" style={{ color: colors.text.primary }}>{Number(value || 0).toLocaleString('en-IN')}</Text>
    </View>
  );
}

function RegistrationSkeleton() {
  return (
    <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border.light, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3] }}>
      <SkeletonBlock width="55%" height={18} radiusSize={radius.sm} />
      <SkeletonBlock width="80%" height={12} radiusSize={radius.sm} />
      <SkeletonBlock width="42%" height={12} radiusSize={radius.sm} />
    </View>
  );
}

export function EventRegistrationsContent() {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const params = useLocalSearchParams<{
    eventId?: string | string[];
    returnTo?: string | string[];
    scanName?: string | string[];
    scanPhone?: string | string[];
    scanEmail?: string | string[];
    scanAddress?: string | string[];
    scanCity?: string | string[];
    scanState?: string | string[];
    scanCountry?: string | string[];
    scanMemberId?: string | string[];
  }>();
  const eventId = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;
  const returnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;
  const [items, setItems] = useState<EventRegistrationAdminRecord[]>([]);
  const [eventInfo, setEventInfo] = useState<EventRegistrationsPageResponse['event'] | null>(null);
  const [summary, setSummary] = useState<EventRegistrationsPageResponse['summary']>({ registeredUsers: 0, registeredAttendees: 0, attended: 0, pending: 0 });
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [search, setSearch] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [personSearch, setPersonSearch] = useState('');
  const [personResults, setPersonResults] = useState<DirectoryMemberItem[]>([]);
  const [isSearchingPeople, setIsSearchingPeople] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistrationAdminRecord | null>(null);
  const [isScanningPassId, setIsScanningPassId] = useState<string | null>(null);
  const [addOns, setAddOns] = useState<RegistrationAddOn[]>([]);
  const hasLoadedOnceRef = useRef(false);
  const appliedScanRef = useRef<string | null>(null);

  const pageTitle = eventInfo?.title || 'Event Registrations';
  const eventFee = Number(eventInfo?.fee || 0);
  const attendeeCount = Math.max(1, Math.trunc(Number(form.attendees || 1) || 1));
  const cashAmountDue = eventFee * attendeeCount + addOns.reduce((sum, item) => {
    if (!item.selected) return sum;
    return sum + item.amount * item.quantity;
  }, 0);
  const addOnSummary = addOns.filter((item) => item.selected).map((item) => `${item.title} x${item.quantity}`).join(', ');

  const loadPage = useCallback(async ({ nextPage, append = false, refresh = false }: { nextPage: number; append?: boolean; refresh?: boolean }) => {
    if (!eventId) return;
    if (refresh) {
      setIsRefreshing(true);
    } else if (append) {
      setIsLoadingMore(true);
    } else if (!hasLoadedOnceRef.current) {
      setIsInitialLoading(true);
    } else {
      setIsSearchLoading(true);
    }

    try {
      const response = await eventService.loadEventRegistrationsPage(eventId, {
        page: nextPage,
        limit: PAGE_SIZE,
        q: search.trim() || undefined,
      });
      setEventInfo(response.event);
      setAddOns((previous) => {
        const previousByTitle = new Map(previous.map((item) => [item.title, item]));
        return (response.event?.addOns ?? []).map((item) => {
          const previousItem = previousByTitle.get(item.title);
          return {
            key: item.id || item.title,
            title: item.title,
            amount: Number(item.amount || 0),
            quantity: previousItem?.quantity ?? 1,
            selected: previousItem?.selected ?? false,
          };
        });
      });
      setSummary(response.summary);
      setPage(response.pagination?.page ?? nextPage);
      setHasNextPage(Boolean(response.pagination?.hasNextPage));
      setItems((previous) => {
        if (!append) return response.items;
        const existingIds = new Set(previous.map((item) => item.id));
        return [...previous, ...response.items.filter((item) => !existingIds.has(item.id))];
      });
      hasLoadedOnceRef.current = true;
      setLoadError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load event registrations.';
      setLoadError(message);
      if (!append) {
        setItems([]);
      }
    } finally {
      setIsInitialLoading(false);
      setIsSearchLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [eventId, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadPage({ nextPage: 1 });
    }, search.trim() ? 250 : 0);
    return () => clearTimeout(timer);
  }, [loadPage, search]);

  useEffect(() => {
    if (!sheetVisible) return undefined;
    const query = personSearch.trim();
    if (query.length < 2) {
      setPersonResults([]);
      setIsSearchingPeople(false);
      return undefined;
    }
    let active = true;
    setIsSearchingPeople(true);
    const timer = setTimeout(() => {
      directoryService.loadMembersPage({ q: query, userType: 'all', page: 1, limit: 5 })
        .then((response) => {
          if (active) setPersonResults(response.items);
        })
        .catch(() => {
          if (active) setPersonResults([]);
        })
        .finally(() => {
          if (active) setIsSearchingPeople(false);
        });
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [personSearch, sheetVisible]);

  useEffect(() => {
    const scanName = Array.isArray(params.scanName) ? params.scanName[0] : params.scanName;
    const scanPhone = Array.isArray(params.scanPhone) ? params.scanPhone[0] : params.scanPhone;
    const scanKey = `${scanName || ''}:${scanPhone || ''}:${Array.isArray(params.scanMemberId) ? params.scanMemberId[0] : params.scanMemberId || ''}`;
    if (!scanName && !scanPhone) return;
    if (appliedScanRef.current === scanKey) return;

    appliedScanRef.current = scanKey;
    setForm((current) => ({
      ...current,
      name: scanName || current.name,
      phone: scanPhone || current.phone,
      email: (Array.isArray(params.scanEmail) ? params.scanEmail[0] : params.scanEmail) || current.email,
      address: (Array.isArray(params.scanAddress) ? params.scanAddress[0] : params.scanAddress) || current.address,
      city: (Array.isArray(params.scanCity) ? params.scanCity[0] : params.scanCity) || current.city,
      state: (Array.isArray(params.scanState) ? params.scanState[0] : params.scanState) || current.state,
      country: (Array.isArray(params.scanCountry) ? params.scanCountry[0] : params.scanCountry) || current.country,
    }));
    setPersonSearch(scanName || (Array.isArray(params.scanMemberId) ? params.scanMemberId[0] : params.scanMemberId) || '');
    setPersonResults([]);
    setFormError(null);
    setSheetVisible(true);
  }, [params.scanAddress, params.scanCity, params.scanCountry, params.scanEmail, params.scanMemberId, params.scanName, params.scanPhone, params.scanState]);

  const closeSheet = useCallback(() => {
    if (isSubmitting) return;
    setSheetVisible(false);
    setForm(initialForm);
    setAddOns((current) => current.map((item) => ({ ...item, quantity: 1, selected: false })));
    setFormError(null);
    setPersonSearch('');
    setPersonResults([]);
  }, [isSubmitting]);

  const selectPerson = useCallback((person: DirectoryMemberItem) => {
    setForm((current) => ({
      ...current,
      name: person.title || current.name,
      phone: person.phone || current.phone || personSearch,
      email: person.email || current.email,
      city: person.city || current.city,
      state: person.state || current.state,
    }));
    setPersonSearch(person.title || person.memberId || '');
    setPersonResults([]);
  }, [personSearch]);

  const updateForm = useCallback((field: keyof AdhocRegistrationFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError(null);
  }, []);

  const updateAddOn = useCallback((key: string, updater: (current: RegistrationAddOn) => RegistrationAddOn) => {
    setAddOns((current) => current.map((item) => (item.key === key ? updater(item) : item)));
  }, []);

  const submitRegistration = useCallback(async () => {
    if (!eventId || isSubmitting) return;
    const name = form.name.trim();
    const phone = form.phone.trim();
    const attendees = Number(form.attendees || 1);
    if (!name || !phone) {
      setFormError('Name and phone are required.');
      return;
    }
    if (!Number.isFinite(attendees) || attendees < 1) {
      setFormError('Attendees must be at least 1.');
      return;
    }
    try {
      setIsSubmitting(true);
      await eventService.createAdhocRegistration(eventId, {
        name,
        phone,
        email: form.email.trim() || null,
        address: form.address.trim() || null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        country: form.country.trim() || null,
        attendees: Math.trunc(attendees),
        addOn: addOnSummary || null,
        amountPaid: cashAmountDue,
        paymentProvider: cashAmountDue > 0 ? 'CASH' : null,
        paymentReferenceId: form.paymentReferenceId.trim() || null,
        remarks: addOnSummary || (cashAmountDue > 0 ? 'Cash collected by event manager' : null),
      });
      closeSheet();
      await loadPage({ nextPage: 1, refresh: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create registration.';
      setFormError(message);
      Alert.alert('Registration failed', message);
    } finally {
      setIsSubmitting(false);
    }
  }, [addOnSummary, cashAmountDue, closeSheet, eventId, form, isSubmitting, loadPage]);

  const scanPass = useCallback(async (pass: NonNullable<EventRegistrationAdminRecord['passes']>[number]) => {
    if (isScanningPassId || !eventId) return;
    try {
      setIsScanningPassId(pass.id);
      await eventService.scanEventPass(pass.qrToken, pass.passType === 'add_on' ? 'addons' : 'attendance');
      await loadPage({ nextPage: 1, refresh: true });
      const refreshed = await eventService.loadEventRegistrationsPage(eventId || '', { page: 1, limit: PAGE_SIZE, q: search.trim() || undefined });
      const updated = refreshed.items.find((item) => item.id === selectedRegistration?.id) ?? null;
      setSelectedRegistration(updated);
    } catch (error) {
      Alert.alert('Scan failed', error instanceof Error ? error.message : 'Unable to scan this pass.');
    } finally {
      setIsScanningPassId(null);
    }
  }, [eventId, isScanningPassId, loadPage, search, selectedRegistration?.id]);

  const header = useMemo(() => (
    <View style={{ gap: spacing[4], marginBottom: spacing[4] }}>
      <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border.light, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[2] }}>
        <Text variant="h2">{pageTitle}</Text>
        <Text variant="bodySmall" style={{ color: colors.text.secondary }}>
          {[eventInfo?.venueName || eventInfo?.city, eventInfo?.startAt ? new Date(eventInfo.startAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : null].filter(Boolean).join(' • ')}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
        <StatPill label="Registered Users" value={summary.registeredUsers} />
        <StatPill label="Registered Attendees" value={summary.registeredAttendees} />
        <StatPill label="Attended" value={summary.attended} />
        <StatPill label="Pending" value={summary.pending} />
      </View>
      <Button
        variant="outline"
        fullWidth
        leftIcon={<MaterialIcons name="qr-code-scanner" size={18} color={colors.primary.DEFAULT} />}
        onPress={() =>
          router.push({
            pathname: '/events/qr-scanner',
            params: { returnTo: `/admin/event-registrations?eventId=${eventId || ''}&returnTo=/admin/manage-events` },
          } as never)
        }>
        Scan Pass
      </Button>
      <Button
        variant="outline"
        fullWidth
        leftIcon={<MaterialIcons name="badge" size={18} color={colors.primary.DEFAULT} />}
        onPress={() =>
          router.push({
            pathname: '/events/qr-scanner',
            params: {
              scanMode: 'member-registration',
              returnTo: `/admin/event-registrations?eventId=${eventId || ''}&returnTo=/admin/manage-events`,
            },
          } as never)
        }>
        Scan Member QR
      </Button>
      <SearchInput value={search} onChangeText={setSearch} placeholder="Search attendee by name, phone, email, member ID" />
    </View>
  ), [eventId, eventInfo, pageTitle, router, search, summary]);

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <AppHeader title="Event Registrations" onBackPress={() => (returnTo ? router.push(returnTo as never) : navigateBack())} />
      <View style={{ flex: 1 }}>
        <InfiniteScrollList
          data={items}
          loadingInitial={isInitialLoading && !hasLoadedOnceRef.current}
          loadingSearch={isSearchLoading}
          loadingMore={isLoadingMore}
          refreshing={isRefreshing}
          onRefresh={() => void loadPage({ nextPage: 1, refresh: true })}
          preserveHeaderOnInitialLoad
          renderSkeletonItem={() => <RegistrationSkeleton />}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={header}
          hasNextPage={hasNextPage}
          onLoadMore={() => {
            if (!isLoadingMore && hasNextPage) {
              void loadPage({ nextPage: page + 1, append: true });
            }
          }}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: 96 }}
          emptyTitle="No registrations found"
          emptyDescription="Add a registration or change the search."
          errorMessage={loadError}
          onRetry={() => void loadPage({ nextPage: 1 })}
          renderItem={({ item }) => (
            <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border.light, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3] }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing[3] }}>
                <View style={{ flex: 1 }}>
                  <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>{item.memberName}</Text>
                  <Text variant="caption" style={{ color: colors.text.secondary }}>
                    {[item.memberId, item.phone, item.email, item.city].filter(Boolean).join(' • ')}
                  </Text>
                </View>
                <View style={{ borderRadius: radius.full, backgroundColor: colors.primary.subtle, paddingHorizontal: spacing[2], paddingVertical: 4 }}>
                  <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>{item.attendanceStatus}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
                <Text variant="caption" style={{ color: colors.text.secondary }}>Registered: {item.registeredAttendees}</Text>
                <Text variant="caption" style={{ color: colors.text.secondary }}>Attended: {item.attendedAttendees}</Text>
                <Text variant="caption" style={{ color: colors.text.secondary }}>Paid: {formatCurrency(item.amountPaid)}</Text>
                {item.addOn ? <Text variant="caption" style={{ color: colors.text.secondary }}>Add-on: {item.addOn}</Text> : null}
                {item.registeredAt ? <Text variant="caption" style={{ color: colors.text.secondary }}>Date: {item.registeredAt}</Text> : null}
              </View>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<MaterialIcons name="qr-code-2" size={16} color={colors.primary.DEFAULT} />}
                onPress={() => setSelectedRegistration(item)}>
                View QR / Passes
              </Button>
            </View>
          )}
        />
        <View pointerEvents="box-none" style={{ position: 'absolute', right: spacing[4], bottom: spacing[4] }}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setSheetVisible(true)}
            style={{ width: 56, height: 56, borderRadius: 999, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
            <MaterialIcons name="person-add" size={26} color={colors.text.inverse} />
          </Pressable>
        </View>
      </View>

      <Modal visible={sheetVisible} transparent animationType="slide" onRequestClose={closeSheet}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,23,42,0.42)' }}>
          <Pressable style={{ flex: 1 }} onPress={closeSheet} />
          <View style={{ maxHeight: '88%', borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: colors.background.DEFAULT, paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing[3], marginBottom: spacing[4] }}>
              <View style={{ flex: 1 }}>
                <Text variant="h3">Add Registration</Text>
                <Text variant="bodySmall" style={{ color: colors.text.secondary }}>{pageTitle}</Text>
              </View>
              <Pressable accessibilityRole="button" onPress={closeSheet} style={{ width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.surface }}>
                <MaterialIcons name="close" size={22} color={colors.text.primary} />
              </Pressable>
            </View>
            <KeyboardAwareScrollView bottomOffset={112} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing[4], paddingBottom: spacing[4] }}>
              <View style={{ borderRadius: 20, borderWidth: 1, borderColor: colors.border.muted, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3] }}>
                <SearchInput value={personSearch} onChangeText={setPersonSearch} placeholder="Search existing person" />
                {isSearchingPeople ? (
                  <View style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
                    <Text variant="bodySmall" style={{ color: colors.text.secondary }}>Searching...</Text>
                  </View>
                ) : null}
                {personResults.map((person) => (
                  <Pressable key={person.id} accessibilityRole="button" onPress={() => selectPerson(person)} style={{ flexDirection: 'row', gap: spacing[3], alignItems: 'center', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border.light, padding: spacing[3] }}>
                    <MaterialIcons name="person" size={18} color={colors.primary.DEFAULT} />
                    <View style={{ flex: 1 }}>
                      <Text variant="bodySmall" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>{person.title}</Text>
                      <Text variant="caption" style={{ color: colors.text.secondary }}>{[person.memberId, person.phone, person.email, person.city].filter(Boolean).join(' • ')}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
              <View style={{ borderRadius: 20, borderWidth: 1, borderColor: colors.border.muted, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3] }}>
                {formError ? <Text variant="bodySmall" style={{ color: colors.status.error }}>{formError}</Text> : null}
                <TextField label="Name" value={form.name} onChangeText={(value) => updateForm('name', value)} required variant="compact" />
                <TextField label="Phone" value={form.phone} onChangeText={(value) => updateForm('phone', value)} keyboardType="phone-pad" required variant="compact" />
                <TextField label="Email" value={form.email} onChangeText={(value) => updateForm('email', value)} keyboardType="email-address" autoCapitalize="none" variant="compact" />
                <TextField label="Address" value={form.address} onChangeText={(value) => updateForm('address', value)} multiline numberOfLines={3} variant="compact" />
                <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                  <View style={{ flex: 1 }}><TextField label="City" value={form.city} onChangeText={(value) => updateForm('city', value)} variant="compact" /></View>
                  <View style={{ flex: 1 }}><TextField label="State" value={form.state} onChangeText={(value) => updateForm('state', value)} variant="compact" /></View>
                </View>
                <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                  <View style={{ flex: 1 }}><TextField label="Country" value={form.country} onChangeText={(value) => updateForm('country', value)} variant="compact" /></View>
                  <View style={{ flex: 1 }}><TextField label="Attendees" value={form.attendees} onChangeText={(value) => updateForm('attendees', value)} keyboardType="number-pad" variant="compact" /></View>
                </View>
                {addOns.length ? (
                  <View
                    style={{
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: 'rgba(242,120,13,0.1)',
                      backgroundColor: 'rgba(242,120,13,0.05)',
                      padding: spacing[4],
                      gap: spacing[4],
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                      <MaterialIcons name="add-circle" size={22} color={colors.primary.DEFAULT} />
                      <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                        Add-ons
                      </Text>
                    </View>
                    {addOns.map((item) => (
                      <EventAddOnCard
                        key={item.key}
                        title={item.title}
                        subtitle={formatCurrency(item.amount)}
                        quantity={item.quantity}
                        selected={item.selected}
                        onToggle={() => updateAddOn(item.key, (current) => ({ ...current, selected: !current.selected }))}
                        onIncrement={() => updateAddOn(item.key, (current) => ({ ...current, quantity: current.quantity + 1, selected: true }))}
                        onDecrement={() =>
                          updateAddOn(item.key, (current) => ({
                            ...current,
                            quantity: Math.max(1, current.quantity - 1),
                          }))
                        }
                      />
                    ))}
                  </View>
                ) : null}
                {cashAmountDue > 0 ? (
                  <View style={{ borderRadius: radius.lg, backgroundColor: colors.primary.subtle, padding: spacing[3], gap: spacing[2] }}>
                    <Text variant="bodySmall" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                      Cash to collect: {formatCurrency(cashAmountDue)}
                    </Text>
                    <Text variant="caption" style={{ color: colors.text.secondary }}>
                      This will be saved as a cash payment for the event registration.
                    </Text>
                    <TextField
                      label="Cash reference"
                      value={form.paymentReferenceId}
                      onChangeText={(value) => updateForm('paymentReferenceId', value)}
                      placeholder="Optional receipt / UPI / note"
                      variant="compact"
                    />
                  </View>
                ) : null}
              </View>
            </KeyboardAwareScrollView>
            <KeyboardStickyView>
              <View style={{ flexDirection: 'row', gap: spacing[3], paddingTop: spacing[2], paddingBottom: spacing[6], backgroundColor: colors.background.DEFAULT }}>
                <View style={{ flex: 1 }}><Button variant="outline" fullWidth disabled={isSubmitting} onPress={closeSheet}>Cancel</Button></View>
                <View style={{ flex: 1 }}><Button fullWidth loading={isSubmitting} onPress={submitRegistration}>Create</Button></View>
              </View>
            </KeyboardStickyView>
          </View>
        </View>
      </Modal>

      <Modal visible={Boolean(selectedRegistration)} transparent animationType="slide" onRequestClose={() => setSelectedRegistration(null)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,23,42,0.42)' }}>
          <Pressable style={{ flex: 1 }} onPress={() => setSelectedRegistration(null)} />
          <View style={{ maxHeight: '88%', borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: colors.background.DEFAULT, paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing[3], marginBottom: spacing[4] }}>
              <View style={{ flex: 1 }}>
                <Text variant="h3">Passes / QR</Text>
                <Text variant="bodySmall" style={{ color: colors.text.secondary }}>{selectedRegistration?.memberName || ''}</Text>
              </View>
              <Pressable accessibilityRole="button" onPress={() => setSelectedRegistration(null)} style={{ width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.surface }}>
                <MaterialIcons name="close" size={22} color={colors.text.primary} />
              </Pressable>
            </View>
            <KeyboardAwareScrollView bottomOffset={32} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing[4], paddingBottom: spacing[6] }}>
              {selectedRegistration?.passes?.length ? selectedRegistration.passes.map((pass) => {
                const isScanned = Boolean(pass.scannedAt);
                return (
                  <View key={pass.id} style={{ borderRadius: 20, borderWidth: 1, borderColor: colors.border.muted, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3], alignItems: 'center' }}>
                    <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>{pass.passLabel}</Text>
                    {pass.qrImage ? (
                      <Image source={{ uri: pass.qrImage }} style={{ width: 220, height: 220, borderRadius: radius.lg }} resizeMode="contain" />
                    ) : (
                      <View style={{ width: 220, height: 220, borderRadius: radius.lg, backgroundColor: colors.background.muted, alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialIcons name="qr-code-2" size={48} color={colors.text.muted} />
                      </View>
                    )}
                    <Text variant="caption" style={{ color: isScanned ? colors.status.success : colors.text.secondary }}>
                      {isScanned ? `Scanned: ${pass.scannedAt}` : 'Not scanned'}
                    </Text>
                    <Button
                      fullWidth
                      variant={isScanned ? 'outline' : 'primary'}
                      loading={isScanningPassId === pass.id}
                      disabled={Boolean(isScanningPassId)}
                      leftIcon={<MaterialIcons name={pass.passType === 'add_on' ? 'restaurant' : 'how-to-reg'} size={16} color={isScanned ? colors.primary.DEFAULT : colors.text.inverse} />}
                      onPress={() => void scanPass(pass)}>
                      {pass.passType === 'add_on' ? (isScanned ? 'Add-on already consumed' : 'Mark add-on consumed') : (isScanned ? 'Attendance already marked' : 'Mark attendance')}
                    </Button>
                  </View>
                );
              }) : (
                <View style={{ borderRadius: 20, borderWidth: 1, borderColor: colors.border.muted, backgroundColor: colors.background.surface, padding: spacing[4] }}>
                  <Text variant="body" style={{ color: colors.text.secondary }}>No passes available for this registration.</Text>
                </View>
              )}
            </KeyboardAwareScrollView>
          </View>
        </View>
      </Modal>
    </AppSafeAreaView>
  );
}
