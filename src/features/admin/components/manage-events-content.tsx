import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { FormikProvider, getIn } from 'formik';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, TouchableOpacity, View } from 'react-native';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useSession } from '@/src/core/providers/session-provider';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { formSchemas } from '@/src/components/forms/validation';
import { useCountryStateCityOptions } from '@/src/features/registration/hooks/use-country-state-city-options';
import { useAppForm } from '@/src/hooks/useForm';
import { translateLocationText } from '@/src/services/location/location-label-translation';
import { getPaginationTotal } from '@/src/utils/pagination';

import {
  AppFormSkeleton,
  AppHeader,
  AppHeaderSearch,
  Button,
  DateField,
  FilterSheet,
  FilterChips,
  FormScreenLayout,
  InfiniteScrollList,
  LocationMapPreview,
  SearchInput,
  SelectField,
  Text,
  TextField,
} from "@/src/components";
import { SkeletonBlock } from "@/src/components/ui/skeleton";
import { useTranslations } from "@/src/i18n/use-translations";
import { colors, radius, spacing, typography } from "@/src/theme";
import {
  AdminCreateAddOnCard,
  AdminCreateStepHeading,
} from "./admin-blocks";
import { AdminQuickInsightsSection } from "./admin-quick-insights-section";
import { AdminEventRow } from "./admin-events-blocks";
import { eventService, type EventLocationSuggestion } from "@/src/features/events/services/event-service";

type ManageEventsMode = "list" | "create" | "edit";

type ManageEventsContentProps = {
  mode?: ManageEventsMode;
};

type EventIconName = React.ComponentProps<typeof MaterialIcons>["name"];

type ManagedEventStatus = "Upcoming" | "Past" | "Draft";
type ManageEventsFilterKey = "all" | "upcoming" | "past" | "drafts";
type ManageEventsPeriodFilterKey = "all" | "thisMonth" | "next30Days" | "past";

type ManagedEventItem = {
  id: string;
  title: string;
  status: ManagedEventStatus;
  isPublished: boolean;
  date: string;
  time: string;
  location: string;
  icon: EventIconName;
  muted?: boolean;
  city?: string;
  startAt?: string | null;
  endAt?: string | null;
};

const MANAGE_EVENTS_PAGE_SIZE = 12;

function ManagedEventSkeleton() {
  return (
    <View style={{ backgroundColor: colors.background.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border.light, padding: spacing[4], gap: spacing[3] }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] }}>
        <SkeletonBlock width={48} height={48} radiusSize={radius.lg} />
        <View style={{ flex: 1, gap: spacing[2] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[2] }}>
            <SkeletonBlock width="52%" height={16} radiusSize={radius.sm} />
            <SkeletonBlock width={68} height={22} radiusSize={radius.full} />
          </View>
          <SkeletonBlock width="32%" height={12} radiusSize={radius.sm} />
          <SkeletonBlock width="42%" height={12} radiusSize={radius.sm} />
          <SkeletonBlock width="72%" height={12} radiusSize={radius.sm} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[2] }}>
        <SkeletonBlock width="38%" height={34} radiusSize={radius.full} />
        <SkeletonBlock width="28%" height={34} radiusSize={radius.full} />
        <SkeletonBlock width="28%" height={34} radiusSize={radius.full} />
      </View>
    </View>
  );
}

type EventFormState = {
  title: string;
  description: string;
  eventType: string;
  type: "free" | "paid";
  fee: string;
  date?: Date;
  startTime?: Date;
  endTime?: Date;
  venueName: string;
  address: string;
  addressLine2: string;
  area: string;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
  city: string;
  state: string;
  country: string;
  pincode: string;
  googlePlaceId: string;
  lat?: number | null;
  lng?: number | null;
  locationUrl: string;
  youtubeUrl: string;
  maxAttendees: string;
  addOns: { id: string; title: string; price: string; limit: string }[];
};

const EVENT_ADD_ON_LIMIT = 6;

function sanitizeIntegerInput(value: string, maxLength = 6) {
  return value.replace(/[^\d]/g, '').slice(0, maxLength);
}

function sanitizeDecimalInput(value: string) {
  const normalized = value.replace(/[^0-9.]/g, '');
  const [whole = '', ...fractionParts] = normalized.split('.');
  const fraction = fractionParts.join('');
  return fraction.length > 0 ? `${whole}.${fraction.slice(0, 2)}` : whole;
}

function createAddOnRow() {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: "",
    price: "",
    limit: "",
  };
}

function createInitialEventFormState(): EventFormState {
  return {
    title: "",
    description: "",
    eventType: "Community",
    type: "free",
    fee: "",
    date: undefined,
    startTime: undefined,
    endTime: undefined,
    venueName: "",
    address: "",
    addressLine2: "",
    area: "",
    status: "DRAFT",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    googlePlaceId: "",
    lat: null,
    lng: null,
    locationUrl: "",
    youtubeUrl: "",
    maxAttendees: "",
    addOns: [createAddOnRow(), createAddOnRow()],
  };
}

function formatEventDate(value?: string | null) {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatEventTime(value?: string | null) {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(parsed);
}

function formatEventTimeRange(startAt?: string | null, endAt?: string | null) {
  const start = formatEventTime(startAt);
  const end = formatEventTime(endAt);

  if (start && end && start !== end) {
    return `${start} - ${end}`;
  }

  return start || end;
}

function normalizeEventStatus(status?: string | null, startAt?: string | null, endAt?: string | null): ManagedEventStatus {
  const upper = String(status || "").trim().toUpperCase();
  if (upper === "DRAFT") return "Draft";
  if (upper === "CANCELLED" || upper === "COMPLETED") return "Past";

  const endDate = endAt ? new Date(endAt) : null;
  if (endDate && !Number.isNaN(endDate.getTime()) && endDate.getTime() < Date.now()) {
    return "Past";
  }

  const startDate = startAt ? new Date(startAt) : null;
  if (startDate && !Number.isNaN(startDate.getTime()) && startDate.getTime() < Date.now()) {
    return "Past";
  }

  return "Upcoming";
}

function eventItemFromRecord(
  record: {
    id?: string;
    title: string;
    status?: string | null;
    startAt?: string | null;
    endAt?: string | null;
    city?: string | null;
    subtitle?: string | null;
    meta?: string | null;
  },
  index: number,
  labels: { communityEvent: string; communityVenue: string },
): ManagedEventItem {
  const rawStatus = String(record.status || 'DRAFT').trim().toUpperCase();
  const status = normalizeEventStatus(rawStatus, record.startAt, record.endAt);
  const metaParts = (record.meta || "").split("•").map((part) => part.trim()).filter(Boolean);
  const date = formatEventDate(record.startAt) || metaParts[0] || labels.communityEvent;
  const time = formatEventTimeRange(record.startAt, record.endAt) || metaParts[1] || "";

  return {
    id: record.id ?? `event-${index}`,
    title: record.title,
    status,
    isPublished: rawStatus !== 'DRAFT',
    date,
    time,
    location: record.subtitle || record.city || labels.communityVenue,
    icon: (index % 2 === 0 ? "event" : "calendar-month") as EventIconName,
    muted: status === "Past",
    city: record.city || record.subtitle || labels.communityVenue,
    startAt: record.startAt || null,
    endAt: record.endAt || null,
  };
}

function formatDateInput(value?: string | null) {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function formatInsightCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function buildEventFormTouched(values: EventFormState) {
  return {
    title: true,
    description: true,
    eventType: true,
    type: true,
    fee: true,
    date: true,
    startTime: true,
    endTime: true,
    venueName: true,
    address: true,
    addressLine2: true,
    area: true,
    status: true,
    city: true,
    state: true,
    country: true,
    pincode: true,
    googlePlaceId: true,
    lat: true,
    lng: true,
    locationUrl: true,
    youtubeUrl: true,
    maxAttendees: true,
    addOns: values.addOns.map(() => ({
      id: true,
      title: true,
      price: true,
      limit: true,
    })),
  };
}

function getEventStatusFilterLabel(filter: ManageEventsFilterKey, t: (key: string) => string) {
  switch (filter) {
    case "upcoming":
      return t('filters.upcoming');
    case "past":
      return t('filters.past');
    case "drafts":
      return t('filters.drafts');
    default:
      return t('filters.all');
  }
}

function getEventPeriodFilterLabel(filter: ManageEventsPeriodFilterKey, t: (key: string) => string) {
  switch (filter) {
    case "thisMonth":
      return t('filters.thisMonth');
    case "next30Days":
      return t('filters.next30Days');
    case "past":
      return t('filters.past');
    default:
      return t('filters.anyTime');
  }
}

export function ManageEventsContent({
  mode = "list",
}: ManageEventsContentProps) {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const { safeBack } = useSafeNavigation();
  const { language } = useAppPreferences();
  const { session } = useSession();
  const t = useTranslations('admin.manage-events');
  const params = useLocalSearchParams<{ eventId?: string | string[] }>();
  const editingEventId =
    mode === 'edit'
      ? Array.isArray(params.eventId)
        ? params.eventId[0]
        : params.eventId
      : undefined;
  const formReturnPath = '/admin/manage-events' as const;
  const [activeFilter, setActiveFilter] = useState<ManageEventsFilterKey>("all");
  const [isLoadingMoreEvents, setIsLoadingMoreEvents] = useState(false);
  const [isRefreshingEvents, setIsRefreshingEvents] = useState(false);
  const [eventsPage, setEventsPage] = useState(1);
  const [eventsHasNextPage, setEventsHasNextPage] = useState(false);
  const [eventsTotalCount, setEventsTotalCount] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInHeader, setSearchInHeader] = useState(false);
  const [activePeriodFilter, setActivePeriodFilter] = useState<ManageEventsPeriodFilterKey>("all");
  const [activeLocationFilter, setActiveLocationFilter] = useState("all");
  const [draftFilter, setDraftFilter] = useState<ManageEventsFilterKey>("all");
  const [draftPeriodFilter, setDraftPeriodFilter] = useState<ManageEventsPeriodFilterKey>("all");
  const [draftLocationFilter, setDraftLocationFilter] = useState("all");
  const [eventItems, setEventItems] = useState<ManagedEventItem[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isSearchingEvents, setIsSearchingEvents] = useState(false);
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<EventLocationSuggestion[]>([]);
  const [isSearchingLocations, setIsSearchingLocations] = useState(false);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [locationSearchError, setLocationSearchError] = useState<string | null>(null);
  const [initialCreateForm, setInitialCreateForm] = useState<EventFormState>(createInitialEventFormState);
  const hasLoadedEventsRef = useRef(false);
  const createForm = useAppForm<EventFormState>({
    initialValues: initialCreateForm,
    enableReinitialize: true,
    validationSchema: formSchemas.manageEvent,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);

      const title = values.title.trim();
      const description = values.description.trim();
      const hasFeeValue = values.fee.trim().length > 0;
      const fee = values.type === "paid" && hasFeeValue ? Number(values.fee) : 0;
      const addOns = values.addOns
        .map((item, index) => ({
          title: item.title.trim(),
          amount: Number(item.price || 0),
          quantityLimit: item.limit ? Number(item.limit) : null,
          sortOrder: index,
        }))
        .filter((item) => item.title.length > 0);

      const startAt =
        values.date && values.startTime
          ? new Date(
              values.date.getFullYear(),
              values.date.getMonth(),
              values.date.getDate(),
              values.startTime.getHours(),
              values.startTime.getMinutes(),
              0,
              0,
            ).toISOString()
          : values.date
            ? values.date.toISOString()
            : null;
      const endAt =
        values.date && values.endTime
          ? new Date(
              values.date.getFullYear(),
              values.date.getMonth(),
              values.date.getDate(),
              values.endTime.getHours(),
              values.endTime.getMinutes(),
              0,
              0,
            ).toISOString()
          : values.endTime
            ? values.endTime.toISOString()
            : null;

      try {
        setIsSubmittingEvent(true);
        const payload = {
          title,
          description: description || null,
          eventType: values.eventType || null,
          startAt,
          endAt,
          fee: values.type === "paid" ? fee : null,
          status: values.status,
          venueName: values.venueName || null,
          address: values.address || null,
          addressLine2: values.addressLine2 || null,
          area: values.area || null,
          city: values.city || null,
          state: values.state || null,
          country: "India",
          pincode: values.pincode || null,
          googlePlaceId: values.googlePlaceId || null,
          lat: values.lat ?? null,
          lng: values.lng ?? null,
          locationUrl: values.locationUrl?.trim() || null,
          youtubeUrl: values.youtubeUrl?.trim() || null,
          maxAttendees: values.maxAttendees ? Number(values.maxAttendees) : null,
          addOns,
        };

        if (editingEventId) {
          await eventService.updateEvent(editingEventId, payload);
        } else {
          await eventService.createEvent(payload);
        }

        safeBack(formReturnPath);
      } catch (error) {
        const message = error instanceof Error ? error.message : t('errors.saveFailedMessage');
        helpers.setStatus({ error: message });
        Alert.alert(t('errors.saveFailedTitle'), message);
      } finally {
        helpers.setSubmitting(false);
        setIsSubmittingEvent(false);
      }
    },
  });
  const {
    countryOptions,
    stateOptions,
    cityOptions,
    isLoadingCountries,
    isLoadingStates,
    isLoadingCities,
  } = useCountryStateCityOptions({
    countryName: createForm.values.country || 'India',
    stateName: createForm.values.state || '',
  });
  const eventLabels = useMemo(
    () => ({
      communityEvent: t('form.eventLocation'),
      communityVenue: t('form.eventLocation'),
    }),
    [t],
  );
  const effectivePermissions = useMemo(
    () => Array.from(new Set([...(session?.user.permissions ?? []), ...(session?.user.communityPermissions ?? [])])),
    [session],
  );
  const canManageEvents = useMemo(
    () =>
      session?.user.role === 'admin' ||
      effectivePermissions.includes('events.manage'),
    [effectivePermissions, session],
  );
  const canScanEventPasses = useMemo(
    () =>
      canManageEvents ||
      effectivePermissions.includes('events.attendance'),
    [canManageEvents, effectivePermissions],
  );
  const canViewAnalytics = useMemo(
    () =>
      session?.user.role === 'admin' ||
      effectivePermissions.includes('analytics.view'),
    [effectivePermissions, session],
  );
  const eventQueryFilters = useMemo(() => {
    const timeframe =
      activePeriodFilter !== 'all'
        ? activePeriodFilter === 'thisMonth'
          ? 'this_month'
          : activePeriodFilter === 'next30Days'
            ? 'next_30_days'
            : 'past'
        : activeFilter === 'upcoming'
          ? 'upcoming'
          : activeFilter === 'past'
            ? 'past'
            : 'all';

    return {
      status: activeFilter === 'drafts' ? 'DRAFT' : undefined,
      city: activeLocationFilter === 'all' ? undefined : activeLocationFilter,
      timeframe,
      search,
    } as const;
  }, [activeFilter, activeLocationFilter, activePeriodFilter, search]);

  useEffect(() => {
    if (mode === 'create' && !editingEventId) {
      setLocationSearch('');
      setLocationSuggestions([]);
      setLocationSearchError(null);
      setIsSearchingLocations(false);
      setIsResolvingLocation(false);
    }
  }, [editingEventId, mode]);

  useEffect(() => {
    const query = locationSearch.trim();
    const selectedAddress = createForm.values.address.trim();

    if (!query || query.length < 2 || query === selectedAddress) {
      setLocationSuggestions([]);
      setLocationSearchError(null);
      setIsSearchingLocations(false);
      return;
    }

    let active = true;
    setIsSearchingLocations(true);
    setLocationSearchError(null);

    const timer = setTimeout(() => {
      eventService.searchEventLocations(query)
        .then((results) => {
          if (!active) return;
          setLocationSuggestions(results);
        })
        .catch((error) => {
          if (!active) return;
          setLocationSuggestions([]);
          setLocationSearchError(error instanceof Error ? error.message : t('errors.locationSearchFailedMessage'));
        })
        .finally(() => {
          if (active) {
            setIsSearchingLocations(false);
          }
        });
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [createForm.values.address, locationSearch, t]);

  const refreshManagedEvents = useCallback(async ({
    page,
    append = false,
    refresh = false,
    showLoading = true,
  }: {
    page: number;
    append?: boolean;
    refresh?: boolean;
    showLoading?: boolean;
  }) => {
    if (refresh) {
      setIsRefreshingEvents(true);
    } else if (append) {
      setIsLoadingMoreEvents(true);
    } else if (showLoading) {
      if (!hasLoadedEventsRef.current) {
        setIsLoadingEvents(true);
      } else {
        setIsSearchingEvents(true);
      }
    }

    try {
      const response = await eventService.loadManageEventsPage({
        page,
        limit: MANAGE_EVENTS_PAGE_SIZE,
        search: eventQueryFilters.search,
        status: eventQueryFilters.status,
        city: eventQueryFilters.city,
        timeframe: eventQueryFilters.timeframe,
      });
      const baseIndex = append ? (page - 1) * MANAGE_EVENTS_PAGE_SIZE : 0;
      const mappedItems = response.items.map((record, index) =>
        eventItemFromRecord(record, baseIndex + index, eventLabels),
      );
      setEventItems((previous) => (append ? [...previous, ...mappedItems] : mappedItems));
      setEventsPage(response.pagination?.page ?? page);
      setEventsHasNextPage(Boolean(response.pagination?.hasNextPage));
      setEventsTotalCount(getPaginationTotal(response.pagination, baseIndex + mappedItems.length));
      hasLoadedEventsRef.current = true;
    } catch {
      if (!append) {
        setEventItems([]);
        setEventsTotalCount(0);
      }
      setEventsHasNextPage(false);
    } finally {
      setIsLoadingEvents(false);
      setIsSearchingEvents(false);
      setIsLoadingMoreEvents(false);
      setIsRefreshingEvents(false);
    }
  }, [eventLabels, eventQueryFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void refreshManagedEvents({ page: 1 });
    }, search.trim() ? 250 : 0);

    return () => {
      clearTimeout(timer);
    };
  }, [refreshManagedEvents, search]);

  useFocusEffect(
    useCallback(() => {
      if (mode === 'create') {
        setIsLoadingEvent(false);
        const nextInitialForm = createInitialEventFormState();
        setInitialCreateForm(nextInitialForm);
        setLocationSearch('');
        setLocationSuggestions([]);
        setLocationSearchError(null);
        setIsSearchingLocations(false);
        setIsResolvingLocation(false);
        return undefined;
      }

      if (mode !== 'list') {
        return undefined;
      }

      let active = true;
      void refreshManagedEvents({ page: 1, showLoading: false }).finally(() => {
        if (!active) {
          return;
        }
      });

      return () => {
        active = false;
      };
    }, [mode, refreshManagedEvents]),
  );

  useEffect(() => {
    if (mode === 'edit' && !editingEventId) {
      setIsLoadingEvent(true);
      return;
    }

    if (!editingEventId) {
      setIsLoadingEvent(false);
      setInitialCreateForm(createInitialEventFormState());
      setLocationSearch('');
      setLocationSuggestions([]);
      setLocationSearchError(null);
      setIsSearchingLocations(false);
      setIsResolvingLocation(false);
      return;
    }

    let active = true;
    setIsLoadingEvent(true);
    eventService.loadEvent(editingEventId).then((record) => {
      if (!active) return;
      if (!record) {
        setIsLoadingEvent(false);
        Alert.alert(t('errors.loadEventFailedTitle'), t('errors.loadEventFailedMessage'));
        safeBack(formReturnPath);
        return;
      }

      setInitialCreateForm({
        title: record.title || "",
        description: record.description || "",
        eventType: record.eventType || "Community",
        type: record.fee && Number(record.fee) > 0 ? "paid" : "free",
        fee: record.fee !== null && record.fee !== undefined ? String(record.fee) : "",
        date: formatDateInput(record.startAt),
        startTime: formatDateInput(record.startAt),
        endTime: formatDateInput(record.endAt),
        venueName: record.venueName || "",
        address: record.address || "",
        addressLine2: record.addressLine2 || "",
        area: record.area || "",
        status: (String(record.status || "DRAFT").toUpperCase() as EventFormState["status"]),
        city: record.city || "",
        state: record.state || "",
        country: "India",
        pincode: record.pincode || "",
        googlePlaceId: record.googlePlaceId || "",
        lat: record.lat ?? null,
        lng: record.lng ?? null,
        locationUrl: record.locationUrl || "",
        youtubeUrl: record.youtubeUrl || "",
        maxAttendees: record.maxAttendees !== undefined && record.maxAttendees !== null ? String(record.maxAttendees) : "",
        addOns: (record.addOns || []).length
          ? record.addOns!.map((addOn) => ({
              id: addOn.id,
              title: addOn.title,
              price: String(addOn.amount ?? ""),
              limit: addOn.quantityLimit !== undefined && addOn.quantityLimit !== null ? String(addOn.quantityLimit) : "",
            }))
          : [createAddOnRow(), createAddOnRow()],
      });
      setLocationSearch(record.address || record.venueName || "");
      setIsLoadingEvent(false);
    }).catch(() => {
      if (active) {
        setIsLoadingEvent(false);
        Alert.alert(t('errors.loadEventFailedTitle'), t('errors.loadEventFailedMessage'));
        safeBack(formReturnPath);
      }
    });

    return () => {
      active = false;
      setLocationSuggestions([]);
      setLocationSearchError(null);
      setIsSearchingLocations(false);
      setIsResolvingLocation(false);
    };
  }, [editingEventId, formReturnPath, mode, safeBack, t]);
  const sourceItems = eventItems;
  const filteredItems = sourceItems;
  const locationFilterOptions = useMemo(() => {
    const cities = Array.from(new Set(sourceItems.map((item) => item.city || item.location).filter(Boolean))).map((value) => ({ key: value, label: translateLocationText(String(value), language) || String(value) }));

    return [{ key: "all", label: t('filters.allLocations') }, ...cities];
  }, [language, sourceItems, t]);
  const appliedFilterCount = useMemo(
    () => [activeFilter, activePeriodFilter, activeLocationFilter].filter((value) => value !== "all").length,
    [activeFilter, activeLocationFilter, activePeriodFilter],
  );
  const appliedFilters = useMemo(() => {
    const filters: { key: string; label: string; onRemove: () => void }[] = [];

    if (activeFilter !== "all") {
      filters.push({
        key: `status-${activeFilter}`,
        label: getEventStatusFilterLabel(activeFilter, t),
        onRemove: () => {
          setActiveFilter("all");
        },
      });
    }

    if (activePeriodFilter !== "all") {
      filters.push({
        key: `time-${activePeriodFilter}`,
        label: getEventPeriodFilterLabel(activePeriodFilter, t),
        onRemove: () => {
          setActivePeriodFilter("all");
        },
      });
    }

    if (activeLocationFilter !== "all") {
      filters.push({
        key: `location-${activeLocationFilter}`,
        label: activeLocationFilter,
        onRemove: () => {
          setActiveLocationFilter("all");
        },
      });
    }

    return filters;
  }, [activeFilter, activeLocationFilter, activePeriodFilter, t]);
  const openFilters = useCallback(() => {
    setDraftFilter(activeFilter);
    setDraftPeriodFilter(activePeriodFilter);
    setDraftLocationFilter(activeLocationFilter);
    setFilterVisible(true);
  }, [activeFilter, activeLocationFilter, activePeriodFilter]);
  const quickInsightItems = useMemo(
    () => [
      {
        id: "total",
        label: t('insights.totalEvents'),
        value: formatInsightCount(eventsTotalCount),
        caption: t('insights.totalCaption'),
        icon: "event" as const,
        iconColor: colors.primary.DEFAULT,
        iconBackgroundColor: colors.primary.subtle || 'rgba(242,120,13,0.12)',
      },
      {
        id: "upcoming",
        label: t('insights.upcomingEvents'),
        value: formatInsightCount(sourceItems.filter((item) => item.status === "Upcoming").length),
        caption: t('insights.upcomingCaption'),
        icon: "schedule" as const,
        iconColor: colors.status.info,
        iconBackgroundColor: colors.status.infoLight,
      },
      {
        id: "drafts",
        label: t('insights.draftEvents'),
        value: formatInsightCount(sourceItems.filter((item) => item.status === "Draft").length),
        caption: t('insights.draftsCaption'),
        icon: "edit-note" as const,
        iconColor: colors.status.warning,
        iconBackgroundColor: colors.status.warningLight,
      },
    ],
    [eventsTotalCount, sourceItems, t],
  );
  const isFormScreen = mode === "create" || mode === "edit";

  useEffect(() => {
    if (isFormScreen) {
      setSearchInHeader(false);
    }
  }, [isFormScreen]);

  async function handleDeleteEvent(eventId: string) {
    Alert.alert(t('errors.deleteTitle'), t('errors.deleteMessage'), [
      { text: t('actions.cancel'), style: "cancel" },
      {
        text: t('actions.delete'),
        style: "destructive",
        onPress: async () => {
          try {
            await eventService.deleteEvent(eventId);
            await refreshManagedEvents({ page: 1, showLoading: false });
          } catch (error) {
            Alert.alert(t('errors.deleteFailedTitle'), error instanceof Error ? error.message : t('errors.deleteFailedMessage'));
          }
        },
      },
    ]);
  }

  async function handleTogglePublish(eventId: string, nextStatus: EventFormState["status"]) {
    if (nextStatus === 'DRAFT') {
      Alert.alert(t('confirm.moveToDraftTitle'), t('confirm.moveToDraftMessage'), [
        { text: t('actions.cancel'), style: 'cancel' },
        {
          text: t('actions.moveToDraft'),
          onPress: () => {
            void applyTogglePublish(eventId, nextStatus);
          },
        },
      ]);
      return;
    }

    await applyTogglePublish(eventId, nextStatus);
  }

  async function applyTogglePublish(eventId: string, nextStatus: EventFormState["status"]) {
    try {
      const existingEvent = await eventService.loadEvent(eventId);
      if (!existingEvent) {
        Alert.alert(t('errors.publishFailedTitle'), t('errors.publishLoadFailedMessage'));
        return;
      }

      await eventService.updateEvent(eventId, {
        title: existingEvent.title,
        description: existingEvent.description || null,
        eventType: existingEvent.eventType || null,
        startAt: existingEvent.startAt || null,
        endAt: existingEvent.endAt || null,
        fee: existingEvent.fee ?? null,
        status: nextStatus,
        venueName: existingEvent.venueName || null,
        address: existingEvent.address || null,
        addressLine2: existingEvent.addressLine2 || null,
        area: existingEvent.area || null,
        city: existingEvent.city || null,
        state: existingEvent.state || null,
        country: "India",
        pincode: existingEvent.pincode || null,
        googlePlaceId: existingEvent.googlePlaceId || null,
        lat: existingEvent.lat ?? null,
        lng: existingEvent.lng ?? null,
        locationUrl: existingEvent.locationUrl || null,
        youtubeUrl: existingEvent.youtubeUrl || null,
        maxAttendees: existingEvent.maxAttendees ?? null,
        addOns: (existingEvent.addOns || []).map((addOn) => ({
          title: addOn.title,
          amount: Number(addOn.amount || 0),
          quantityLimit: addOn.quantityLimit ?? null,
        })),
      });

      await refreshManagedEvents({ page: 1, showLoading: false });
    } catch (error) {
      Alert.alert(t('errors.publishFailedTitle'), error instanceof Error ? error.message : t('errors.publishFailedMessage'));
    }
  }

  function updateAddOnAt(index: number, patch: Partial<EventFormState["addOns"][number]>) {
    createForm.setFieldValue(
      'addOns',
      createForm.values.addOns.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    );
  }

  function appendAddOn() {
    if (createForm.values.addOns.length >= EVENT_ADD_ON_LIMIT) {
      Alert.alert(t('errors.addOnLimitTitle'), t('errors.addOnLimitMessage').replace('{count}', String(EVENT_ADD_ON_LIMIT)));
      return;
    }

    createForm.setFieldValue('addOns', [...createForm.values.addOns, createAddOnRow()]);
  }

  function removeAddOn(index: number) {
    const next = createForm.values.addOns.filter((_, itemIndex) => itemIndex !== index);
    createForm.setFieldValue('addOns', next.length ? next : [createAddOnRow()]);
  }

  async function handleEventFormSubmit() {
    const errors = await createForm.validateForm();
    createForm.setTouched(buildEventFormTouched(createForm.values), true);

    if (Object.keys(errors).length > 0) {
      return;
    }

    await createForm.submitForm();
  }

  const hasMapCoordinates =
    Number.isFinite(createForm.values.lat ?? NaN) && Number.isFinite(createForm.values.lng ?? NaN);
  async function applyLocationSelection(suggestion: EventLocationSuggestion) {
    const existingLocationUrl = createForm.values.locationUrl.trim();
    setIsResolvingLocation(true);
    setLocationSearch(suggestion.description || suggestion.title);
    setLocationSuggestions([]);
    setLocationSearchError(null);
    createForm.setValues({
      ...createForm.values,
      venueName: suggestion.title || createForm.values.venueName,
      address: suggestion.description || createForm.values.address,
      addressLine2: '',
      area: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      googlePlaceId: suggestion.placeId,
      lat: null,
      lng: null,
      locationUrl: existingLocationUrl,
    });

    try {
      const selection = await eventService.loadEventLocationSelection(suggestion.placeId);
      createForm.setValues({
        ...createForm.values,
        venueName: selection.venueName || suggestion.title || createForm.values.venueName,
        address: selection.address || suggestion.description || createForm.values.address,
        addressLine2: '',
        area: '',
        city: selection.city || '',
        state: selection.state || '',
        country: selection.country || 'India',
        pincode: selection.pincode || '',
        googlePlaceId: selection.googlePlaceId || suggestion.placeId,
        lat: selection.lat ?? null,
        lng: selection.lng ?? null,
        locationUrl: existingLocationUrl || selection.locationUrl || '',
      });
      setLocationSearch(selection.address || suggestion.description || suggestion.title);
    } catch (error) {
      setLocationSearchError(error instanceof Error ? error.message : t('errors.locationSelectionFailedMessage'));
    } finally {
      setIsResolvingLocation(false);
    }
  }

  if (isFormScreen) {
    return (
      <FormScreenLayout
        header={
          <AppHeader
            title={editingEventId ? t('form.editTitle') : t('form.createTitle')}
            variant="back-inline"
            onLeftPress={() => safeBack(formReturnPath)}
          />
        }
        footer={
          isLoadingEvent ? (
            <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
              <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center' }}>
                <AppFormSkeleton fields={0} />
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
              <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', flexDirection: 'row', gap: spacing[3] }}>
                <View style={{ flex: 1 }}>
                  <Button variant="outline" fullWidth onPress={navigateBack}>
                    {t('actions.cancel')}
                  </Button>
                </View>
                <View style={{ flex: 2 }}>
                  <Button fullWidth onPress={() => void handleEventFormSubmit()} disabled={isSubmittingEvent || createForm.isSubmitting} loading={isSubmittingEvent || createForm.isSubmitting}>
                    {editingEventId ? t('actions.save') : t('actions.create')}
                  </Button>
                </View>
              </View>
            </View>
          )
        }>
        {isLoadingEvent ? (
          <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[5], backgroundColor: colors.background.DEFAULT }}>
            <AppFormSkeleton fields={14} showFooter={false} />
          </View>
        ) : (
        <FormikProvider value={createForm}>
          <View
            style={{
              maxWidth: 672,
              width: "100%",
              alignSelf: "center",
              paddingHorizontal: spacing[4],
              paddingTop: spacing[2],
              paddingBottom: spacing[5],
              gap: spacing[8],
              backgroundColor: colors.background.DEFAULT,
            }}
          >
              <View style={{ gap: spacing[4] }}>
                <AdminCreateStepHeading
                  step="1"
                  title={t('sections.basicInfo')}
                  subtitle={t('steps.basic')}
                />
                <TextField
                  name="title"
                  label={t('form.title')}
                  placeholder={t('form.title.placeholder')}
                  variant="registration"
                  labelVariant="default"
                  required
                />
                <TextField
                  name="description"
                  label={t('form.description')}
                  placeholder={t('form.description.placeholder')}
                  variant="registration"
                  labelVariant="default"
                  multiline
                  numberOfLines={4}
                />
                <SelectField
                  name="eventType"
                  label={t('form.eventType')}
                  placeholder={t('form.eventType.placeholder')}
                  options={[
                    { label: t('form.eventType.community'), value: 'Community' },
                    { label: t('form.eventType.matrimony'), value: 'Matrimony' },
                    { label: t('form.eventType.education'), value: 'Education' },
                    { label: t('form.eventType.festival'), value: 'Festival' },
                    { label: t('form.eventType.religious'), value: 'Religious' },
                    { label: t('form.eventType.other'), value: 'Other' },
                  ]}
                  variant="registration"
                  labelVariant="default"
                  required
                />
                <SelectField
                  label={t('form.type')}
                  placeholder={t('form.type.placeholder')}
                  value={createForm.values.type}
                  onSelect={(type) => {
                    createForm.setFieldValue('type', type);
                    createForm.setFieldTouched('type', true, false);
                    if (type !== 'paid') {
                      createForm.setFieldValue('fee', '');
                      createForm.setFieldTouched('fee', false, false);
                    }
                  }}
                  options={[
                    { label: t('form.type.free'), value: "free" },
                    { label: t('form.type.paid'), value: "paid" },
                  ]}
                  variant="registration"
                  labelVariant="default"
                  error={createForm.touched.type ? createForm.errors.type : undefined}
                  required
                />
                <SelectField
                  name="status"
                  label={t('form.status')}
                  placeholder={t('form.status.placeholder')}
                  options={[
                    { label: t('form.status.draft'), value: 'DRAFT' },
                    { label: t('form.status.published'), value: 'PUBLISHED' },
                    { label: t('form.status.cancelled'), value: 'CANCELLED' },
                    { label: t('form.status.completed'), value: 'COMPLETED' },
                  ]}
                  variant="registration"
                  labelVariant="default"
                  required
                />
                {createForm.values.type === 'paid' ? (
                  <TextField
                    label={t('form.price')}
                    placeholder={t('form.price.placeholder')}
                    value={createForm.values.fee}
                    onChangeText={(fee) => {
                      createForm.setFieldValue('fee', sanitizeDecimalInput(fee));
                      createForm.setFieldTouched('fee', true, false);
                    }}
                    onBlur={() => createForm.setFieldTouched('fee', true, false)}
                    variant="registration"
                    labelVariant="default"
                    keyboardType="decimal-pad"
                    error={createForm.touched.fee ? createForm.errors.fee : undefined}
                    required
                  />
                ) : null}
              </View>

              <View style={{ gap: spacing[4] }}>
                <AdminCreateStepHeading step="2" title={t('sections.dateTime')} subtitle={t('steps.datetime')} />
                <DateField
                  name="date"
                  label={t('form.date')}
                  placeholder={t('form.date.placeholder')}
                  variant="registration"
                  labelVariant="default"
                  required
                />
                <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                  <View style={{ flex: 1 }}>
                    <DateField
                      name="startTime"
                      label={t('form.startTime')}
                      placeholder={t('form.startTime.placeholder')}
                      variant="registration"
                      labelVariant="default"
                      mode="time"
                      required
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <DateField
                      name="endTime"
                      label={t('form.endTime')}
                      placeholder={t('form.endTime.placeholder')}
                      variant="registration"
                      labelVariant="default"
                      mode="time"
                      required
                    />
                  </View>
                </View>
              </View>

              <View style={{ gap: spacing[4] }}>
                <AdminCreateStepHeading step="3" title={t('sections.location')} subtitle={t('steps.location')} />
                <View style={{ gap: spacing[2] }}>
                  <SearchInput
                    value={locationSearch}
                    onChangeText={(value) => {
                      setLocationSearch(value);
                      setLocationSearchError(null);
                      if (!value.trim()) {
                        setLocationSuggestions([]);
                      }
                    }}
                    label={t('form.locationSearch')}
                    placeholder={t('form.locationSearch.placeholder')}
                    error={locationSearchError || undefined}
                  />
                  {isSearchingLocations ? (
                    <Text variant="caption" color={colors.text.muted}>
                      {t('form.locationSearch.loading')}
                    </Text>
                  ) : null}
                  {isResolvingLocation ? (
                    <Text variant="caption" color={colors.text.muted}>
                      {t('form.locationSearch.resolving')}
                    </Text>
                  ) : null}
                  {locationSuggestions.length ? (
                    <View
                      style={{
                        borderRadius: radius.xl,
                        borderWidth: 1,
                        borderColor: colors.primary.borderLight,
                        backgroundColor: colors.background.surface,
                        overflow: 'hidden',
                      }}>
                      {locationSuggestions.map((suggestion, index) => (
                        <TouchableOpacity
                          key={suggestion.placeId}
                          accessibilityRole="button"
                          activeOpacity={0.85}
                          onPress={() => {
                            void applyLocationSelection(suggestion);
                          }}
                          style={{
                            paddingHorizontal: spacing[4],
                            paddingVertical: spacing[3],
                            borderTopWidth: index === 0 ? 0 : 1,
                            borderTopColor: colors.border.light,
                            gap: spacing[1],
                          }}>
                          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.semibold }}>
                            {suggestion.title}
                          </Text>
                          <Text variant="caption" color={colors.text.muted}>
                            {suggestion.subtitle || suggestion.description}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : null}
                </View>
                <TextField
                  name="venueName"
                  label={t('form.venueName')}
                  placeholder={t('form.venueName.placeholder')}
                  variant="registration"
                  labelVariant="default"
                  required
                />
                <TextField
                  name="address"
                  label={t('form.address')}
                  placeholder={t('form.address.placeholder')}
                  variant="registration"
                  labelVariant="default"
                  multiline
                  numberOfLines={3}
                  required
                />
                <TextField
                  name="addressLine2"
                  label={t('form.addressLine2')}
                  placeholder={t('form.addressLine2.placeholder')}
                  variant="registration"
                  labelVariant="default"
                />
                <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                  <View style={{ flex: 1 }}>
                    <TextField
                      name="area"
                      label={t('form.area')}
                      placeholder={t('form.area.placeholder')}
                      variant="registration"
                      labelVariant="default"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextField
                      label={t('form.pincode')}
                      placeholder={t('form.pincode.placeholder')}
                      value={createForm.values.pincode}
                      onChangeText={(pincode) => {
                        createForm.setFieldValue('pincode', sanitizeIntegerInput(pincode));
                        createForm.setFieldTouched('pincode', true, false);
                      }}
                      onBlur={() => createForm.setFieldTouched('pincode', true, false)}
                      variant="registration"
                      labelVariant="default"
                      keyboardType="number-pad"
                      maxLength={6}
                      error={createForm.touched.pincode ? createForm.errors.pincode : undefined}
                      required
                    />
                  </View>
                </View>
                <SelectField
                  label={t('form.country')}
                  placeholder={isLoadingCountries ? t('form.country.loading') : t('form.country.placeholder')}
                  value={createForm.values.country}
                  onSelect={(country) => {
                    createForm.setFieldTouched('country', true, false);
                    createForm.setFieldTouched('state', false, false);
                    createForm.setFieldTouched('city', false, false);
                    createForm.setValues({
                      ...createForm.values,
                      country,
                      state: '',
                      city: '',
                    });
                  }}
                  options={countryOptions}
                  variant="registration"
                  labelVariant="default"
                  disabled={isLoadingCountries}
                  error={createForm.touched.country ? createForm.errors.country : undefined}
                  required
                />
                <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('form.state')}
                      placeholder={createForm.values.country ? (isLoadingStates ? t('form.state.loading') : t('form.state.placeholder')) : t('form.state.first')}
                      value={createForm.values.state}
                      onSelect={(state) => {
                        createForm.setFieldTouched('state', true, false);
                        createForm.setFieldTouched('city', false, false);
                        createForm.setValues({
                          ...createForm.values,
                          state,
                          city: createForm.values.state === state ? createForm.values.city : '',
                        });
                      }}
                      options={createForm.values.country ? stateOptions : []}
                      variant="registration"
                      labelVariant="default"
                      disabled={!createForm.values.country || isLoadingStates}
                      error={createForm.touched.state ? createForm.errors.state : undefined}
                      required
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <SelectField
                      label={t('form.city')}
                      placeholder={createForm.values.state ? (isLoadingCities ? t('form.city.loading') : t('form.city.placeholder')) : t('form.city.first')}
                      value={createForm.values.city}
                      onSelect={(city) => {
                        createForm.setFieldValue('city', city);
                        createForm.setFieldTouched('city', true, false);
                      }}
                      options={createForm.values.state ? cityOptions : []}
                      variant="registration"
                      labelVariant="default"
                      disabled={!createForm.values.state || isLoadingCities}
                      error={createForm.touched.city ? createForm.errors.city : undefined}
                      required
                    />
                  </View>
                </View>
                <TextField
                  name="locationUrl"
                  label={t('form.googleMapLink')}
                  placeholder={t('form.googleMapLink.placeholder')}
                  variant="registration"
                  labelVariant="default"
                />
                <TextField
                  name="youtubeUrl"
                  label={t('form.youtubeLink')}
                  placeholder={t('form.youtubeLink.placeholder')}
                  variant="registration"
                  labelVariant="default"
                />
                <TextField
                  label={t('form.maxAttendees')}
                  placeholder={t('form.maxAttendees.placeholder')}
                  value={createForm.values.maxAttendees}
                  onChangeText={(maxAttendees) => {
                    createForm.setFieldValue('maxAttendees', sanitizeIntegerInput(maxAttendees));
                    createForm.setFieldTouched('maxAttendees', true, false);
                  }}
                  onBlur={() => createForm.setFieldTouched('maxAttendees', true, false)}
                  variant="registration"
                  labelVariant="default"
                  keyboardType="number-pad"
                  error={createForm.touched.maxAttendees ? createForm.errors.maxAttendees : undefined}
                />
                {hasMapCoordinates ? (
                  <LocationMapPreview
                    latitude={Number(createForm.values.lat)}
                    longitude={Number(createForm.values.lng)}
                    label={createForm.values.venueName || createForm.values.title || t('form.eventLocation')}
                    address={createForm.values.address || undefined}
                  />
                ) : (
                  <View style={{ height: 160, borderRadius: 20, borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: colors.background.muted, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing[4], gap: spacing[2] }}>
                    <MaterialIcons name="map" size={30} color={colors.primary.DEFAULT} />
                    <Text style={{ color: colors.text.secondary, textAlign: 'center' }}>
                      {t('form.mapPreview')}
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ gap: spacing[4] }}>
                <AdminCreateStepHeading step="4" title={t('sections.addOns')} subtitle={t('steps.addons')} />
                <Text style={{ color: colors.text.secondary }}>
                  {t('form.addOn.helper')}
                </Text>
                {createForm.values.addOns.map((addOn, index) => (
                  <AdminCreateAddOnCard
                    key={addOn.id}
                    title={addOn.title}
                    price={addOn.price}
                    limit={addOn.limit}
                    titleError={getIn(createForm.touched, `addOns.${index}.title`) ? getIn(createForm.errors, `addOns.${index}.title`) : undefined}
                    priceError={getIn(createForm.touched, `addOns.${index}.price`) ? getIn(createForm.errors, `addOns.${index}.price`) : undefined}
                    limitError={getIn(createForm.touched, `addOns.${index}.limit`) ? getIn(createForm.errors, `addOns.${index}.limit`) : undefined}
                    onTitleChange={(value) => {
                      updateAddOnAt(index, { title: value });
                      createForm.setFieldTouched(`addOns.${index}.title`, true, false);
                    }}
                    onPriceChange={(value) => {
                      updateAddOnAt(index, { price: sanitizeDecimalInput(value) });
                      createForm.setFieldTouched(`addOns.${index}.price`, true, false);
                    }}
                    onLimitChange={(value) => {
                      updateAddOnAt(index, { limit: sanitizeIntegerInput(value) });
                      createForm.setFieldTouched(`addOns.${index}.limit`, true, false);
                    }}
                    onDelete={() => removeAddOn(index)}
                  />
                ))}
                <TouchableOpacity
                  accessibilityRole="button"
                  activeOpacity={0.85}
                  onPress={appendAddOn}
                  style={{
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: colors.primary.borderLight,
                    borderStyle: "dashed",
                    paddingVertical: spacing[4],
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: spacing[2],
                    backgroundColor: colors.background.surface,
                  }}
                >
                  <MaterialIcons
                    name="add-circle"
                    size={20}
                    color={colors.primary.DEFAULT}
                  />
                  <Text
                    style={{
                      color: colors.primary.DEFAULT,
                      fontFamily: typography.fontFamily.bold,
                    }}
                  >
                    {t('actions.addAnotherOption')}
                  </Text>
                </TouchableOpacity>
                {createForm.status?.error ? (
                  <Text style={{ color: colors.status.error }}>
                    {createForm.status.error}
                  </Text>
                ) : null}
              </View>
          </View>
        </FormikProvider>
        )}
      </FormScreenLayout>
    );
  }

  return (
    <AppSafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}
    >
      <View style={{ flex: 1, position: 'relative' }}>
        <AppHeaderSearch
          title={t('title')}
          placeholder={t('search.placeholder')}
          searchValue={search}
          onSearchValueChange={setSearch}
          searchActive={searchInHeader}
          onSearchPress={() => setSearchInHeader(true)}
          onCloseSearch={() => {
            setSearch('');
            setSearchInHeader(false);
          }}
          onBackPress={navigateBack}
        />

        <InfiniteScrollList
          data={filteredItems}
          loadingInitial={isLoadingEvents && !hasLoadedEventsRef.current}
          loadingSearch={isSearchingEvents}
          loadingMore={isLoadingMoreEvents}
          refreshing={isRefreshingEvents}
          onRefresh={() => {
            void refreshManagedEvents({ page: 1, refresh: true });
          }}
          preserveHeaderOnInitialLoad
          keyExtractor={(item) => item.id}
          renderSkeletonItem={() => <ManagedEventSkeleton />}
          renderItem={({ item }) => (
            <AdminEventRow
              {...item}
              onAnalyticsPress={
                canViewAnalytics && item.isPublished
                  ? (eventId) =>
                      router.push({
                        pathname: '/admin/event-analytics',
                        params: { eventId, returnTo: '/admin/manage-events' },
                      } as never)
                  : undefined
              }
              onEditPress={(eventId) =>
                router.push({
                  pathname: '/admin/manage-events/edit/[eventId]',
                  params: { eventId },
                } as never)
              }
              onAdhocRegistrationPress={
                canManageEvents
                  ? (eventId) =>
                      router.push({
                        pathname: '/admin/event-registrations',
                        params: { eventId, returnTo: '/admin/manage-events' },
                      } as never)
                  : undefined
              }
              onDeletePress={handleDeleteEvent}
              onTogglePublishPress={handleTogglePublish}
            />
          )}
          hasNextPage={eventsHasNextPage}
          onLoadMore={() => {
            if (isLoadingMoreEvents || !eventsHasNextPage) return;
            void refreshManagedEvents({ page: eventsPage + 1, append: true, showLoading: false });
          }}
          ListHeaderComponent={
            <View style={{ gap: spacing[3], marginBottom: spacing[4] }}>
              {canScanEventPasses ? (
                <Button
                  fullWidth
                  variant="outline"
                  onPress={() => router.push('/events/qr-scanner' as never)}
                  leftIcon={<MaterialIcons name="qr-code-scanner" size={18} color={colors.primary.DEFAULT} />}>
                  {t('actions.scanPass')}
                </Button>
              ) : null}
              <AdminQuickInsightsSection
                title={t('insights.title')}
                periodLabel={t('insights.periodLabel')}
                actionLabel={t('insights.viewAnalytics')}
                onActionPress={() => router.push('/admin/analytics' as never)}
                compactAction
                items={quickInsightItems}
              />
              <FilterChips
                scrollable
                showIcons
                activeKey={activeFilter}
                items={[
                  {
                    key: 'filters',
                    label: appliedFilterCount > 0 ? `${t('filters.filters')} (${appliedFilterCount})` : t('filters.filters'),
                    icon: 'tune',
                  },
                  { key: 'all', label: t('filters.all'), icon: 'apps' },
                  { key: 'upcoming', label: t('filters.upcoming'), icon: 'event' },
                  { key: 'past', label: t('filters.past'), icon: 'history' },
                  { key: 'drafts', label: t('filters.drafts'), icon: 'edit-note' },
                ]}
                onPress={(key) => {
                  if (key === 'filters') {
                    openFilters();
                    return;
                  }
                  setActiveFilter(key as ManageEventsFilterKey);
                }}
              />
              {appliedFilters.length ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
                  {appliedFilters.map((filter) => (
                    <TouchableOpacity
                      key={filter.key}
                      accessibilityRole="button"
                      activeOpacity={0.85}
                      onPress={filter.onRemove}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: spacing[1],
                        borderRadius: radius.full,
                        borderWidth: 1,
                        borderColor: colors.primary.border,
                        backgroundColor: colors.primary.subtle,
                        paddingHorizontal: spacing[3],
                        paddingVertical: spacing[2],
                      }}>
                      <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.medium }}>
                        {filter.label}
                      </Text>
                      <MaterialIcons name="close" size={14} color={colors.primary.DEFAULT} />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>
          }
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: 88 }}
          emptyTitle={search.trim() || activeFilter !== 'all' || activePeriodFilter !== 'all' || activeLocationFilter !== 'all' ? 'No events match these filters' : 'No events created yet'}
          emptyDescription={search.trim() || activeFilter !== 'all' || activePeriodFilter !== 'all' || activeLocationFilter !== 'all' ? 'Try clearing filters or adjusting your search.' : 'Create your first event to see it listed here.'}
        />

        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            right: spacing[4],
            bottom: spacing[4],
            gap: spacing[3],
          }}>
          {canManageEvents ? (
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.9}
              onPress={() => router.push('/admin/manage-events/create' as never)}
              style={{
                width: 56,
                height: 56,
                borderRadius: 999,
                backgroundColor: colors.primary.DEFAULT,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: colors.primary.DEFAULT,
                shadowOpacity: 0.25,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 6,
              }}>
              <MaterialIcons name="add" size={28} color={colors.text.inverse} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

        <FilterSheet
          visible={filterVisible}
          title={t('filters.filtersGroup')}
          subtitle={t('filters.subtitle')}
          sections={[
            {
              title: t('filters.status'),
              icon: 'event',
              activeKey: draftFilter,
              items: [
                { key: "all", label: t('filters.all') },
                { key: "upcoming", label: t('filters.upcoming') },
                { key: "past", label: t('filters.past') },
                { key: "drafts", label: t('filters.drafts') },
              ],
              onSelect: (key) => setDraftFilter(key as ManageEventsFilterKey),
            },
            {
              title: t('filters.time'),
              icon: 'schedule',
              activeKey: draftPeriodFilter,
              items: [
                { key: "all", label: t('filters.anyTime') },
                { key: "thisMonth", label: t('filters.thisMonth') },
                { key: "next30Days", label: t('filters.next30Days') },
                { key: "past", label: t('filters.past') },
              ],
              onSelect: (key) => setDraftPeriodFilter(key as ManageEventsPeriodFilterKey),
            },
            {
              title: t('filters.location'),
              icon: 'place',
              activeKey: draftLocationFilter,
              items: locationFilterOptions,
              onSelect: setDraftLocationFilter,
            },
          ]}
          onClose={() => {
            setDraftFilter(activeFilter);
            setDraftPeriodFilter(activePeriodFilter);
            setDraftLocationFilter(activeLocationFilter);
            setFilterVisible(false);
          }}
          onApply={() => {
            setActiveFilter(draftFilter);
            setActivePeriodFilter(draftPeriodFilter);
            setActiveLocationFilter(draftLocationFilter);
            setFilterVisible(false);
          }}
          onReset={() => {
            setDraftFilter("all");
            setDraftPeriodFilter("all");
            setDraftLocationFilter("all");
          }}
          applyLabel={t('actions.applyFilters')}
          resetLabel={t('actions.resetFilters')}
        />
    </AppSafeAreaView>
  );
}
