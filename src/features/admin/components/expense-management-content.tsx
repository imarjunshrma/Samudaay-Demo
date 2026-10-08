import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormikProvider } from 'formik';
import { DrawerActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, KeyboardAvoidingView, Modal, Platform, TextInput, TouchableOpacity, View } from 'react-native';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppBottomBar, AppFormSkeleton, AppHeader, AppSkeletonBlock, Button, DateField, Dialog, FileUpload, FilterChips, FilterSheet, FormScreenLayout, InfiniteScrollList, SelectField, Text, TextField } from '@/src/components';
import { SkeletonListItem } from '@/src/components/ui/skeleton';
import { useAppForm } from '@/src/hooks/useForm';
import { colors, spacing, typography } from '@/src/theme';
import { formSchemas } from '@/src/components/forms/validation';
import { AdminExpenseRow } from './admin-expense-blocks';
import { AdminQuickInsightsSection } from './admin-quick-insights-section';
import { expenseService, type ExpenseFilterKey, type ExpenseItem, type ExpenseSummary } from '../services/expense-service';
import type { FileValue } from '@/src/types';
import { useTranslations } from '@/src/i18n/use-translations';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { getBackendSessionContext } from '@/src/features/auth/services/backend-session';
import { formatAuditActor } from '@/src/core/audit/audit-payload';
import { getVisibleAdminBottomBarItems } from '@/src/core/navigation/admin-shell';
import { useSession } from '@/src/core/providers/session-provider';
import { isPdfDownloadCancelledError } from '@/src/services/files/pdf-file';
import { eventService, type EventSelectOption } from '@/src/features/events/services/event-service';

type ExpenseFormValues = {
  title: string;
  amount: string;
  category: 'event' | 'travel' | 'food' | 'misc' | 'marketing' | 'catering' | 'venue';
  expenseDate?: Date;
  eventLink: string;
  paymentMode: 'cash' | 'bank' | 'cheque';
  receipt?: FileValue | null;
  description: string;
};
type ExpenseListItem = ExpenseItem | { id: string; __skeleton: true };

function formatExpenseAmount(amount: string | number) {
  const numeric = Number(amount);
  if (Number.isFinite(numeric)) {
    return `₹${numeric.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `₹${String(amount)}`;
}

function formatExpenseDate(date?: string | null, fallbackRecently = 'Recently') {
  if (!date) {
    return fallbackRecently;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return fallbackRecently;
  }

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function mapExpenseNote(expense: ExpenseItem, recentlyLabel: string, communityExpenseLabel: string) {
  if (expense.description) {
    return expense.description;
  }

  return expense.expenseDate ? formatExpenseDate(expense.expenseDate, recentlyLabel) : communityExpenseLabel;
}

function getExpenseAuditNote(expense: ExpenseItem) {
  const latestReview = [...(expense.reviews ?? [])]
    .filter((review) => review.reviewer || review.reviewedAt)
    .sort((left, right) => new Date(right.reviewedAt || 0).getTime() - new Date(left.reviewedAt || 0).getTime())[0];

  if (latestReview?.reviewer) {
    return `${String(latestReview.status || expense.status).replace(/_/g, ' ')} by ${formatAuditActor(latestReview.reviewer)}${latestReview.reviewedAt ? ` • ${formatExpenseDate(latestReview.reviewedAt)}` : ''}`;
  }

  if (expense.approver) {
    return `${String(expense.status || 'Reviewed').replace(/_/g, ' ')} by ${formatAuditActor(expense.approver)}${expense.approvedAt ? ` • ${formatExpenseDate(expense.approvedAt)}` : ''}`;
  }

  return undefined;
}

function normalizeExpenseStatus(status: string) {
  return String(status || '').toUpperCase();
}

function normalizeExpenseCategory(category: string) {
  const value = String(category || '').toLowerCase();
  if (value.includes('cater')) return 'catering';
  if (value.includes('event')) return 'event';
  if (value.includes('travel')) return 'travel';
  if (value.includes('food') || value.includes('meal')) return 'food';
  if (value.includes('misc') || value.includes('other')) return 'misc';
  if (value.includes('marketing')) return 'marketing';
  if (value.includes('venue')) return 'venue';
  return 'misc';
}

function isRemoteFileUri(value?: string | null) {
  if (!value) {
    return false;
  }

  return /^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:') || value.startsWith('/');
}

function getExpenseCategoryLabel(
  category: ExpenseFormValues['category'],
  t: ReturnType<typeof useTranslations>,
) {
  switch (category) {
    case 'event':
      return t('form.category.event');
    case 'travel':
      return t('form.category.travel');
    case 'food':
      return t('form.category.food');
    case 'misc':
      return t('form.category.misc');
    case 'marketing':
      return t('form.category.marketing');
    case 'catering':
      return t('form.category.catering');
    case 'venue':
      return t('form.category.venue');
    default:
      return t('form.category.misc');
  }
}

function getExpenseFilterLabel(filter: ExpenseFilterKey, t: ReturnType<typeof useTranslations>) {
  switch (filter) {
    case 'draft':
      return t('status.draft');
    case 'submitted':
      return t('status.pendingApproval');
    case 'approved':
      return t('status.approved');
    case 'rejected':
      return t('status.rejected');
    case 'paid':
      return t('status.paid');
    case 'marketing':
      return t('form.category.marketing');
    case 'catering':
      return t('form.category.catering');
    case 'venue':
      return t('form.category.venue');
    default:
      return t('filters.all');
  }
}

function buildCreateFormValues(): ExpenseFormValues {
  return {
    title: '',
    amount: '',
    category: 'marketing',
    expenseDate: undefined,
    eventLink: '',
    paymentMode: 'cash',
    receipt: null,
    description: '',
  };
}

function firstParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0] || '';
  }

  return value || '';
}

function parseExpenseDateParam(value?: string | string[]) {
  const raw = firstParam(value);
  if (!raw) {
    return undefined;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}

function ExpenseHeaderSkeleton() {
  return (
    <View style={{ gap: spacing[4], paddingBottom: spacing[4] }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
        <View style={{ flex: 1, minWidth: 158, height: 104, borderRadius: 20, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight }} />
        <View style={{ flex: 1, minWidth: 158, height: 104, borderRadius: 20, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight }} />
      </View>
      <View style={{ gap: spacing[3] }}>
        <AppSkeletonBlock width="28%" height={16} radiusSize={12} />
        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
          <AppSkeletonBlock width={88} height={36} radiusSize={18} />
          <AppSkeletonBlock width={92} height={36} radiusSize={18} />
          <AppSkeletonBlock width={96} height={36} radiusSize={18} />
        </View>
      </View>
      <View style={{ gap: spacing[2] }}>
        <AppSkeletonBlock width="32%" height={16} radiusSize={12} />
        <AppSkeletonBlock width={104} height={12} radiusSize={12} />
      </View>
    </View>
  );
}

export function ExpenseManagementContent({
  mode = 'list',
  submissionMode = 'admin',
  viewMode = 'admin',
}: {
  mode?: 'list' | 'create';
  submissionMode?: 'admin' | 'member';
  viewMode?: 'admin' | 'member';
}) {
  const router = useRouter();
  const navigateBack = useBackNavigation();
  const { session } = useSession();
  const navigation = useNavigation();
  const t = useTranslations('admin.manage-expenses');
  const params = useLocalSearchParams<{
    expenseId?: string | string[];
    status?: string | string[];
  }>();
  const isMemberSubmission = submissionMode === 'member';
  const isMemberView = viewMode === 'member';
  const editingExpenseId = firstParam(params.expenseId);
  const editingExpenseStatus = firstParam(params.status).toUpperCase();
  const isEditingExpense = mode === 'create' && Boolean(editingExpenseId);
  const isRejectedExpense = editingExpenseStatus === 'REJECTED';
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<ExpenseFilterKey>(() => mode === 'list' && firstParam(params.status).toLowerCase() === 'submitted' ? 'submitted' : 'all');
  const [draftFilter, setDraftFilter] = useState<ExpenseFilterKey>('all');
  const [period, setPeriod] = useState({ month: '', year: '', sort: 'latest' as 'latest' | 'oldest' });
  const [draftPeriod, setDraftPeriod] = useState(period);
  const [filterVisible, setFilterVisible] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [rejectDialogVisible, setRejectDialogVisible] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [pendingRejectExpenseId, setPendingRejectExpenseId] = useState<string | null>(null);
  const [actioningExpenseId, setActioningExpenseId] = useState<string | null>(null);
  const [receiptDialog, setReceiptDialog] = useState<{
    visible: boolean;
    variant: 'success' | 'error';
    title: string;
    description: string;
  }>({
    visible: false,
    variant: 'success',
    title: '',
    description: '',
  });
  const [isLoadingEditingExpense, setIsLoadingEditingExpense] = useState(false);
  const [eventOptions, setEventOptions] = useState<EventSelectOption[]>([]);
  const initialReceiptUriRef = useRef<string | null>(null);
  const actioningExpenseIdRef = useRef<string | null>(null);
  const hasLoadedOnceRef = useRef(false);
  const refreshInFlightRef = useRef(false);

  const loadExpensePage = useCallback(async (pageOffset: number) => {
    const result = await expenseService.loadExpenses(pageOffset, 20, activeFilter, {
      ...period,
      mine: isMemberView,
      excludeMine: !isMemberView,
    });
    if (!result) {
      throw new Error(t('errors.unableToLoad'));
    }

    return result;
  }, [activeFilter, isMemberView, period, t]);
  const loadExpenseSummary = useCallback(async () => {
    const result = await expenseService.loadExpenses(0, 1, 'all', {
      ...period,
      mine: isMemberView,
      excludeMine: !isMemberView,
    });
    if (!result) {
      throw new Error(t('errors.unableToLoad'));
    }

    return result.summary;
  }, [isMemberView, period, t]);
  const currentExpensePageLoader = useRef(loadExpensePage);
  currentExpensePageLoader.current = loadExpensePage;

  useEffect(() => {
    let active = true;
    getBackendSessionContext()
      .then((context) => {
        if (!active) return;
        setCurrentUserId(context?.userId ?? null);
        setCurrentUserRole(context?.session.user.role ?? null);
      })
      .catch(() => {
        if (!active) return;
        setCurrentUserId(null);
        setCurrentUserRole(null);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (mode !== 'create') {
      return;
    }

    let active = true;

    eventService.loadEventOptions()
      .then((options) => {
        if (!active) {
          return;
        }

        setEventOptions(options);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setEventOptions([]);
      });

    return () => {
      active = false;
    };
  }, [mode]);

  useEffect(() => {
    if (!isEditingExpense) {
      initialReceiptUriRef.current = null;
    }
  }, [isEditingExpense]);

  const reloadFirstExpensePage = useCallback(async ({ showRefreshControl = false }: { showRefreshControl?: boolean } = {}) => {
    if (refreshInFlightRef.current) {
      return;
    }

    refreshInFlightRef.current = true;
    if (showRefreshControl) {
      setIsRefreshing(true);
    }
    try {
      const [result, nextSummary] = await Promise.all([
        loadExpensePage(0),
        loadExpenseSummary(),
      ]);
      if (currentExpensePageLoader.current !== loadExpensePage) return;
      setExpenses(result.items);
      setSummary(nextSummary);
      setOffset(result.pagination.nextOffset);
      setHasNextPage(result.pagination.hasNextPage);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('errors.unableToLoad'));
    } finally {
      refreshInFlightRef.current = false;
      if (showRefreshControl) {
        setIsRefreshing(false);
      }
    }
  }, [loadExpensePage, loadExpenseSummary, t]);

  const handleRefresh = useCallback(async () => {
    if (isLoadingInitial) {
      return;
    }

    await reloadFirstExpensePage({ showRefreshControl: true });
  }, [isLoadingInitial, reloadFirstExpensePage]);

  useFocusEffect(
    useCallback(() => {
      if (mode !== 'list' || !hasLoadedOnceRef.current) {
        return;
      }

      void reloadFirstExpensePage();
    }, [mode, reloadFirstExpensePage]),
  );

  useEffect(() => {
    if (mode !== 'list') {
      return;
    }

    let active = true;
    const shouldShowInitialSkeleton = !hasLoadedOnceRef.current;
    setHasNextPage(false);
    setOffset(0);
    if (shouldShowInitialSkeleton) {
      setIsLoadingInitial(true);
    }
    setError(null);

    Promise.all([
      loadExpensePage(0),
      loadExpenseSummary(),
    ])
      .then(([result, nextSummary]) => {
        if (!active) return;
        setExpenses(result.items);
        setSummary(nextSummary);
        setOffset(result.pagination.nextOffset);
        setHasNextPage(result.pagination.hasNextPage);
        hasLoadedOnceRef.current = true;
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : t('errors.unableToLoad'));
        hasLoadedOnceRef.current = true;
      })
      .finally(() => {
        if (!active) return;
        setIsLoadingInitial(false);
      });

    return () => {
      active = false;
    };
  }, [activeFilter, mode, loadExpensePage, loadExpenseSummary, t]);

  const createForm = useAppForm<ExpenseFormValues>({
    initialValues: buildCreateFormValues(),
    validationSchema: formSchemas.expense,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);
      try {
        const payload = {
          title: values.title.trim(),
          amount: values.amount.trim(),
          category: values.category,
          expenseDate: values.expenseDate ? values.expenseDate.toISOString() : null,
          eventLink: values.eventLink.trim() || null,
          paymentMode: values.paymentMode,
          proofFile: values.receipt && !isRemoteFileUri(values.receipt.uri)
            ? {
                uri: values.receipt.uri,
                name: values.receipt.name,
                mimeType: values.receipt.mimeType,
              }
            : null,
          clearProofFile: Boolean(initialReceiptUriRef.current && !values.receipt),
          description: values.description.trim(),
        };

        if (isEditingExpense && editingExpenseId) {
          await expenseService.updateExpense(editingExpenseId, {
            ...payload,
            submitForApproval: isRejectedExpense,
            saveAsDraft: !isRejectedExpense,
          });
        } else {
          await expenseService.createExpense({
            ...payload,
            submitForApproval: false,
            saveAsDraft: true,
          });
        }
        navigateBack(isMemberSubmission ? '/finance/expenses' : '/admin/invoices');
      } catch (submitError) {
        helpers.setStatus({
          error: submitError instanceof Error ? submitError.message : t('errors.unableToSave'),
        });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!isEditingExpense) {
      return;
    }

    let active = true;
    setIsLoadingEditingExpense(true);

    expenseService.loadExpense(editingExpenseId)
      .then((expense) => {
        if (!active || !expense) {
          return;
        }

        initialReceiptUriRef.current = expense.attachmentFileUrl || null;

        createForm.setValues({
          title: expense.title || '',
          amount: expense.amount || '',
          category: normalizeExpenseCategory(expense.category) as ExpenseFormValues['category'],
          expenseDate: expense.expenseDate ? parseExpenseDateParam(expense.expenseDate) : undefined,
          eventLink: expense.eventLink || '',
          paymentMode: (expense.paymentMode as ExpenseFormValues['paymentMode']) || 'cash',
          receipt: expense.attachmentFileUrl
            ? {
                uri: expense.attachmentFileUrl,
                name: expense.attachmentFileName || 'expense-attachment',
                mimeType: expense.attachmentMimeType || undefined,
                size: expense.attachmentFileSizeBytes ?? undefined,
              }
            : null,
          description: expense.description || '',
        });
      })
      .finally(() => {
        if (active) {
          setIsLoadingEditingExpense(false);
        }
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingExpenseId, isEditingExpense]);

  const paymentModeItems = useMemo(
    () => [
      { key: 'cash' as const, label: t('form.paymentMode.cash'), icon: 'payments' as const },
      { key: 'bank' as const, label: t('form.paymentMode.bank'), icon: 'account-balance' as const },
      { key: 'cheque' as const, label: t('form.paymentMode.cheque'), icon: 'receipt-long' as const },
    ],
    [t],
  );

  const linkedEventOptions = useMemo(() => {
    const currentValue = createForm.values.eventLink.trim();
    const options = [...eventOptions];

    if (currentValue && !options.some((option) => option.value === currentValue)) {
      options.unshift({
        label: currentValue,
        value: currentValue,
      });
    }

    return options;
  }, [createForm.values.eventLink, eventOptions]);

  const expenseFilterItems = useMemo(
    () => (isMemberView
      ? [
          { key: 'all' as const, label: `${t('filters.all')} (${summary?.totalCount ?? 0})`, icon: 'receipt-long' as const },
          { key: 'draft' as const, label: `${t('status.draft')} (${summary?.draftCount ?? 0})`, icon: 'edit' as const },
          { key: 'submitted' as const, label: `${t('status.pendingApproval')} (${summary?.pendingCount ?? 0})`, icon: 'schedule' as const },
          { key: 'approved' as const, label: `${t('status.approved')} (${summary?.paidCount ?? 0})`, icon: 'verified' as const },
          { key: 'rejected' as const, label: `${t('status.rejected')} (${summary?.rejectedCount ?? 0})`, icon: 'cancel' as const },
        ]
        : [
          { key: 'all' as const, label: `${t('filters.all')} (${summary?.totalCount ?? 0})`, icon: 'receipt-long' as const },
          { key: 'submitted' as const, label: `${t('status.pendingApproval')} (${summary?.pendingCount ?? 0})`, icon: 'schedule' as const },
          { key: 'approved' as const, label: `${t('status.approved')} (${summary?.paidCount ?? 0})`, icon: 'verified' as const },
          { key: 'rejected' as const, label: `${t('status.rejected')} (${summary?.rejectedCount ?? 0})`, icon: 'cancel' as const },
        ]),
    [isMemberView, summary, t],
  );
  const appliedFilterCount = Number(activeFilter !== 'all') + Number(Boolean(period.month)) + Number(Boolean(period.year)) + Number(period.sort !== 'latest');
  const openFilters = useCallback(() => {
    setDraftFilter(activeFilter);
    setDraftPeriod(period);
    setFilterVisible(true);
  }, [activeFilter, period]);

  const quickInsightItems = useMemo(
    () => [
      {
        id: 'draft',
        label: t('queue.draft'),
        value: String(summary?.draftCount ?? 0),
        icon: 'edit' as const,
        iconColor: '#4b5563',
        iconBackgroundColor: '#f3f4f6',
      },
      {
        id: 'submitted',
        label: t('queue.submitted'),
        value: String(summary?.pendingCount ?? 0),
        icon: 'schedule' as const,
        iconColor: colors.primary.DEFAULT,
        iconBackgroundColor: colors.primary.subtle,
      },
      {
        id: 'approved',
        label: t('queue.approved'),
        value: String(summary?.paidCount ?? 0),
        icon: 'verified' as const,
        iconColor: '#047857',
        iconBackgroundColor: '#ecfdf5',
      },
      {
        id: 'rejected',
        label: t('queue.rejected'),
        value: String(summary?.rejectedCount ?? 0),
        icon: 'cancel' as const,
        iconColor: '#b91c1c',
        iconBackgroundColor: '#fef2f2',
      },
    ],
    [summary, t],
  );

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasNextPage) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const result = await loadExpensePage(offset);
      if (currentExpensePageLoader.current !== loadExpensePage) return;
      setExpenses((current) => [...current, ...result.items]);
      setOffset(result.pagination.nextOffset);
      setHasNextPage(result.pagination.hasNextPage);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleApprove = useCallback(async (expenseId: string) => {
    if (actioningExpenseIdRef.current) {
      return;
    }

    actioningExpenseIdRef.current = expenseId;
    setActioningExpenseId(expenseId);
    try {
      await expenseService.updateExpenseStatus(expenseId, 'APPROVED');
      const [result, nextSummary] = await Promise.all([
        loadExpensePage(0),
        loadExpenseSummary(),
      ]);
      setExpenses(result.items);
      setSummary(nextSummary);
      setOffset(result.pagination.nextOffset);
      setHasNextPage(result.pagination.hasNextPage);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('errors.unableToUpdate');
      Alert.alert(t('errors.unableToApproveTitle'), message);
    } finally {
      actioningExpenseIdRef.current = null;
      setActioningExpenseId(null);
    }
  }, [loadExpensePage, loadExpenseSummary, t]);

  const openRejectDialog = useCallback((expenseId: string) => {
    setPendingRejectExpenseId(expenseId);
    setRejectRemarks('');
    setRejectDialogVisible(true);
  }, []);

  const confirmReject = useCallback(async () => {
    if (!pendingRejectExpenseId) {
      return;
    }

    if (actioningExpenseIdRef.current) {
      return;
    }

    actioningExpenseIdRef.current = pendingRejectExpenseId;
    setActioningExpenseId(pendingRejectExpenseId);
    try {
      await expenseService.updateExpenseStatus(pendingRejectExpenseId, 'REJECTED', rejectRemarks.trim() || undefined);
      const [result, nextSummary] = await Promise.all([
        loadExpensePage(0),
        loadExpenseSummary(),
      ]);
      setExpenses(result.items);
      setSummary(nextSummary);
      setOffset(result.pagination.nextOffset);
      setHasNextPage(result.pagination.hasNextPage);
      setRejectDialogVisible(false);
      setPendingRejectExpenseId(null);
      setRejectRemarks('');
    } catch (error) {
      const message = error instanceof Error ? error.message : t('errors.unableToUpdate');
      Alert.alert(t('errors.unableToRejectTitle'), message);
    } finally {
      actioningExpenseIdRef.current = null;
      setActioningExpenseId(null);
    }
  }, [loadExpensePage, loadExpenseSummary, pendingRejectExpenseId, rejectRemarks, t]);

  const handleSubmitDraft = useCallback(async (expenseId: string) => {
    try {
      await expenseService.updateExpenseStatus(expenseId, 'SUBMITTED');
      const [result, nextSummary] = await Promise.all([
        loadExpensePage(0),
        loadExpenseSummary(),
      ]);
      setExpenses(result.items);
      setSummary(nextSummary);
      setOffset(result.pagination.nextOffset);
      setHasNextPage(result.pagination.hasNextPage);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('errors.unableToUpdate');
      Alert.alert(t('errors.unableToSubmitTitle'), message);
    }
  }, [loadExpensePage, loadExpenseSummary, t]);

  const handleOpenEditExpense = useCallback((expense: ExpenseItem) => {
    router.push({
      pathname: '/finance/expenses/create',
      params: {
        expenseId: expense.id,
        status: expense.status,
      },
    } as never);
  }, [router]);

  const handleDownloadReceipt = useCallback(async (expenseId: string, receiptNo?: string | null) => {
    try {
      const result = await expenseService.downloadExpenseReceipt(expenseId, receiptNo);
      if (result?.method === 'download' || result?.method === 'saf' || result?.method === 'share' || result?.method === 'persist') {
        setReceiptDialog({
          visible: true,
          variant: 'success',
          title: t('messages.receiptDownloadedTitle'),
          description: result.method === 'share'
            ? 'The receipt PDF is ready to share.'
            : t('messages.receiptDownloadedDescription'),
        });
      }
    } catch (error) {
      if (isPdfDownloadCancelledError(error)) {
        return;
      }
      const message = error instanceof Error ? error.message : t('errors.unableToDownloadReceipt');
      setReceiptDialog({
        visible: true,
        variant: 'error',
        title: t('errors.unableToDownloadReceiptTitle'),
        description: message,
      });
    }
  }, [t]);

  const expenseCategoryOptions = useMemo(
    () => [
      { label: t('form.category.event'), value: 'event' as const },
      { label: t('form.category.travel'), value: 'travel' as const },
      { label: t('form.category.food'), value: 'food' as const },
      { label: t('form.category.misc'), value: 'misc' as const },
      { label: t('form.category.marketing'), value: 'marketing' as const },
      { label: t('form.category.catering'), value: 'catering' as const },
      { label: t('form.category.venue'), value: 'venue' as const },
    ],
    [t],
  );
  const showInitialSkeleton = isLoadingInitial && !expenses.length;
  const listData = useMemo<ExpenseListItem[]>(
    () => (showInitialSkeleton
      ? Array.from({ length: 4 }, (_, index) => ({ id: `skeleton-${index}`, __skeleton: true as const }))
      : expenses),
    [expenses, showInitialSkeleton],
  );

  if (mode === 'create') {
    return (
      <FormScreenLayout
        header={
          <AppHeader
            title={
              isEditingExpense
                ? t('title.edit')
                : isMemberSubmission
                  ? t('title.memberCreate')
                  : t('title.create')
            }
            variant="back-inline"
            onLeftPress={navigateBack}
          />
        }
        footer={
          isLoadingEditingExpense ? (
            <View style={{ flex: 1, backgroundColor: 'rgba(248,247,245,0.96)', borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
              <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center' }}>
                <AppFormSkeleton fields={0} />
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, backgroundColor: 'rgba(248,247,245,0.96)', borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
              <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', flexDirection: 'row', gap: spacing[3] }}>
                <View style={{ flex: 1 }}>
                  <Button variant="outline" fullWidth onPress={navigateBack}>
                    {t('actions.cancel')}
                  </Button>
                </View>
                <View style={{ flex: 2 }}>
                  <Button fullWidth onPress={() => createForm.submitForm()} loading={createForm.isSubmitting} disabled={createForm.isSubmitting}>
                    {isEditingExpense && isRejectedExpense ? t('actions.resubmit') : t('actions.save')}
                  </Button>
                </View>
              </View>
            </View>
          )
        }>
        <FormikProvider value={createForm}>
          <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[5], gap: spacing[5], backgroundColor: colors.background.DEFAULT }}>
            {isLoadingEditingExpense ? (
              <AppFormSkeleton fields={8} showFooter={false} />
            ) : null}
            <View style={[{ gap: spacing[4] }, isLoadingEditingExpense ? { display: 'none' } : undefined]}>
              <TextField
                name="amount"
                label={t('form.amount')}
                placeholder={t('form.amount.placeholder')}
                keyboardType="decimal-pad"
                variant="registration"
                labelVariant="default"
                required
                leftIcon={<Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold }}>₹</Text>}
              />

              <TextField
                name="title"
                label={t('form.vendor')}
                placeholder={t('form.vendor.placeholder')}
                variant="registration"
                labelVariant="default"
                required
              />

              <DateField
                name="expenseDate"
                label={t('form.date')}
                placeholder={t('form.date.placeholder')}
                variant="registration"
                labelVariant="default"
                required
              />

              <SelectField
                name="category"
                label={t('form.category')}
                variant="registration"
                labelVariant="default"
                placeholder={t('form.category.placeholder')}
                options={expenseCategoryOptions}
                required
              />

              <SelectField
                name="eventLink"
                label={t('form.eventLink')}
                placeholder={eventOptions.length ? t('form.eventLink.placeholder') : 'No events available'}
                variant="registration"
                labelVariant="default"
                options={linkedEventOptions}
              />

              <View style={{ gap: spacing[2] }}>
                <Text variant="caption" color={colors.text.secondary} style={{ textTransform: 'uppercase', letterSpacing: 1, fontFamily: typography.fontFamily.bold }}>
                  {t('form.paymentMode')}
                </Text>
                <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                  {paymentModeItems.map((mode) => {
                    const active = createForm.values.paymentMode === mode.key;
                    return (
                      <TouchableOpacity
                        key={mode.key}
                        accessibilityRole="button"
                        activeOpacity={0.9}
                        onPress={() => createForm.setFieldValue('paymentMode', mode.key)}
                        style={{
                          flex: 1,
                          borderRadius: 22,
                          borderWidth: 1,
                          borderColor: active ? colors.primary.border : colors.primary.borderLight,
                          backgroundColor: active ? colors.primary.muted : colors.background.surface,
                          alignItems: 'center',
                          gap: spacing[2],
                          paddingVertical: spacing[4],
                        }}>
                        <MaterialIcons name={mode.icon} size={22} color={active ? colors.primary.DEFAULT : '#64748b'} />
                        <Text variant="caption" color={active ? colors.primary.DEFAULT : colors.text.secondary} style={{ fontFamily: typography.fontFamily.bold }}>
                          {mode.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <TextField
                name="description"
                label={t('form.description')}
                placeholder={t('form.description.placeholder')}
                variant="registration"
                labelVariant="default"
                multiline
                numberOfLines={4}
              />

              <FileUpload
                name="receipt"
                label={t('form.receipt')}
                variant="dashed"
                emptyTitle={t('form.receipt.emptyTitle')}
                emptyDescription={t('form.receipt.emptyDescription')}
              />

              {createForm.status?.error ? (
                <Text variant="caption" color={colors.status.error}>
                  {createForm.status.error}
                </Text>
              ) : null}
            </View>
          </View>
        </FormikProvider>
      </FormScreenLayout>
    );
  }

  const listHeader = (
    showInitialSkeleton ? <ExpenseHeaderSkeleton /> : (
    <View style={{ gap: spacing[4], paddingBottom: spacing[4] }}>
      {error ? (
        <View style={{ padding: spacing[4], borderRadius: 20, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight }}>
          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
            {t('errors.loadFailed')}
          </Text>
          <Text style={{ color: colors.text.muted, marginTop: spacing[1] }}>
            {error}
          </Text>
        </View>
      ) : null}

      <AdminQuickInsightsSection
        title={isMemberView ? t('member.queueTitle') : t('queue.title')}
        periodLabel={period.year ? [period.month ? t(`filters.month.${period.month}`) : '', period.year].filter(Boolean).join(' ') : isMemberView ? t('member.queuePeriodLabel') : t('queue.periodLabel')}
        actionLabel={isMemberView ? undefined : t('queue.actionLabel')}
        onActionPress={isMemberView ? undefined : () => router.push('/admin/my-expenses' as never)}
        items={quickInsightItems}
      />

      <View style={{ gap: spacing[3], paddingTop: spacing[2] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
            {t('filters.title')}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() => { setActiveFilter('all'); setPeriod({ month: '', year: '', sort: 'latest' }); }}>
            <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.semibold, fontSize: 13 }}>
              {t('actions.clearAll')}
            </Text>
          </TouchableOpacity>
        </View>
        <FilterChips
          scrollable
          showIcons
          showChevron
          activeKey={activeFilter}
          items={[
            {
              key: 'filters',
              label: appliedFilterCount > 0 ? `${t('filters.title')} (${appliedFilterCount})` : t('filters.title'),
              icon: 'tune' as const,
            },
            ...expenseFilterItems,
          ]}
          onPress={(key) => {
            if (key === 'filters') {
              openFilters();
              return;
            }
            setActiveFilter(key as ExpenseFilterKey);
          }}
        />
        {activeFilter !== 'all' ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={() => setActiveFilter('all')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[1],
                borderRadius: 999,
                borderWidth: 1,
                borderColor: colors.primary.border,
                backgroundColor: colors.primary.subtle,
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[2],
              }}>
              <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.medium }}>
                {getExpenseFilterLabel(activeFilter, t)}
              </Text>
              <MaterialIcons name="close" size={14} color={colors.primary.DEFAULT} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing[2] }}>
        <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
          {isMemberView ? t('member.recentRequests') : t('queue.recentRequests')}
        </Text>
        {!isMemberView ? (
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() => router.push('/admin/my-expenses' as never)}>
            <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
              {t('admin.myExpensesCta')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {summary ? (
        <Text style={{ color: colors.text.muted, fontSize: 12 }}>
          {t('list.entries').replace('{count}', String(summary.totalCount))}
        </Text>
      ) : (
        <AppSkeletonBlock width={96} height={12} radiusSize={12} />
      )}
    </View>
    )
  );

  const handleTabChange = (key: string) => {
    switch (key) {
      case 'home':
        navigation.dispatch(DrawerActions.jumpTo('dashboard'));
        break;
      case 'clients':
        navigation.dispatch(DrawerActions.jumpTo('manage-directory'));
        break;
      case 'invoices':
        navigation.dispatch(DrawerActions.jumpTo('invoices'));
        break;
      case 'profile':
        navigation.dispatch(DrawerActions.jumpTo('profile'));
        break;
    }
  };

  return (
    <AppSafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        {isMemberView ? (
          <AppHeader
            title={t('title.memberList')}
            variant="back-inline"
            onLeftPress={navigateBack}
          />
        ) : (
          <AppHeader
            title={t('title.approvals')}
            variant="menu-notification"
            onLeftPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            onRightPress={() => router.push('/admin/notification-inbox' as never)}
          />
        )}

        <View style={{ flex: 1, position: 'relative' }}>
          <InfiniteScrollList
            data={listData}
            loadingMore={isLoadingMore}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            hasNextPage={showInitialSkeleton ? false : hasNextPage}
            onLoadMore={handleLoadMore}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              ('__skeleton' in item ? <SkeletonListItem /> : (() => {
                const normalizedStatus = normalizeExpenseStatus(item.status);
                const isPendingApproval = normalizedStatus === 'SUBMITTED' || normalizedStatus === 'PENDING_APPROVAL';
                const canEditOwnedExpense = Boolean(
                  isMemberView &&
                    currentUserId &&
                    item.creator?.id === currentUserId &&
                    currentUserRole &&
                    currentUserRole === 'admin',
                );
                const statusLabel = normalizedStatus === 'APPROVED'
                ? t('status.approved')
                : normalizedStatus === 'REJECTED'
                  ? t('status.rejected')
                  : normalizedStatus === 'DRAFT'
                    ? t('status.draft')
                  : normalizedStatus === 'PAID'
                    ? t('status.paid')
                      : isPendingApproval
                        ? t('status.pendingApproval')
                        : t('status.pending');
                const categoryKey = normalizeExpenseCategory(item.category);
                const categoryLabel = getExpenseCategoryLabel(categoryKey, t);
                const canDownloadReceipt = normalizedStatus === 'APPROVED' || normalizedStatus === 'PAID';
                const auditNote = normalizedStatus === 'APPROVED' || normalizedStatus === 'REJECTED' || normalizedStatus === 'PAID'
                  ? getExpenseAuditNote(item)
                  : undefined;
                const canEditRejected = isMemberView && normalizedStatus === 'REJECTED';
                const actions = isMemberView && normalizedStatus === 'DRAFT'
                  ? [
                      {
                        key: 'submit',
                        label: t('actions.submitForApproval'),
                        onPress: () => void handleSubmitDraft(item.id),
                        variant: 'primary' as const,
                        leftIcon: <MaterialIcons name="send" size={16} color={colors.text.inverse} />,
                        disabled: actioningExpenseId === item.id,
                      },
                    ]
                  : canEditRejected
                    ? []
                    : !isMemberView && (isPendingApproval || normalizedStatus === 'REJECTED')
                      ? [
                          {
                            key: 'approve',
                            label: t('actions.approve'),
                            onPress: () => void handleApprove(item.id),
                            variant: 'primary' as const,
                            leftIcon: <MaterialIcons name="check" size={16} color={colors.text.inverse} />,
                            disabled: actioningExpenseId === item.id,
                            loading: actioningExpenseId === item.id,
                          },
                          ...(normalizedStatus === 'REJECTED'
                            ? []
                            : [
                                {
                                  key: 'reject',
                                  label: t('actions.reject'),
                                  onPress: () => openRejectDialog(item.id),
                                  variant: 'outline' as const,
                                  leftIcon: <MaterialIcons name="close" size={16} color={colors.status.error} />,
                                  disabled: actioningExpenseId === item.id,
                                },
                              ]),
                        ]
                      : [];
                const headerRight = canDownloadReceipt ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Download expense receipt"
                    activeOpacity={0.85}
                    onPress={() => void handleDownloadReceipt(item.id, item.receiptNo)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 999,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.primary.subtle,
                      borderWidth: 1,
                      borderColor: colors.primary.borderLight,
                    }}>
                    <MaterialIcons name="picture-as-pdf" size={20} color={colors.primary.DEFAULT} />
                  </TouchableOpacity>
                ) : canEditRejected || canEditOwnedExpense ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={canEditRejected ? 'Edit rejected expense' : 'Edit expense'}
                    activeOpacity={0.85}
                    onPress={() => handleOpenEditExpense(item)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 999,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.primary.subtle,
                      borderWidth: 1,
                      borderColor: colors.primary.borderLight,
                    }}>
                    <MaterialIcons name="edit" size={20} color={colors.primary.DEFAULT} />
                  </TouchableOpacity>
                ) : null;
                return (
                  <AdminExpenseRow
                    title={item.title}
                    category={categoryLabel}
                    date={formatExpenseDate(item.expenseDate, t('notes.recently'))}
                    requestedBy={!isMemberView && (item.creator?.name || item.creator?.email) ? `${t('queue.requestedBy')} ${item.creator?.name || item.creator?.email}` : undefined}
                    note={auditNote || mapExpenseNote(item, t('notes.recently'), t('notes.communityExpense'))}
                    amount={formatExpenseAmount(item.amount)}
                    statusLabel={statusLabel}
                    status={item.status}
                    actions={actions}
                    headerRight={headerRight}
                    icon={
                      item.category.toLowerCase().includes('marketing')
                        ? 'campaign'
                        : item.category.toLowerCase().includes('cater')
                          ? 'restaurant'
                          : 'location-on'
                    }
                    iconBackground={
                      item.category.toLowerCase().includes('marketing')
                        ? 'rgba(255,237,213,1)'
                        : item.category.toLowerCase().includes('cater')
                          ? 'rgba(219,234,254,1)'
                          : 'rgba(243,232,255,1)'
                    }
                  />
                );
              })())
            )}
            emptyTitle={t('list.emptyTitle')}
            emptyDescription={t('list.emptyDescription')}
            contentContainerStyle={{ paddingTop: spacing[4], paddingHorizontal: spacing[4], paddingBottom: spacing[4] }}
            ListHeaderComponent={<View style={{ gap: spacing[4] }}>{listHeader}</View>}
          />

          {isRefreshing ? (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                paddingTop: spacing[4],
                paddingHorizontal: spacing[4],
                backgroundColor: 'rgba(253,252,251,0.72)',
              }}>
              <View style={{ gap: spacing[3] }}>
                <SkeletonListItem />
                <SkeletonListItem />
                <SkeletonListItem />
              </View>
            </View>
          ) : null}
        </View>

        <Modal
          visible={rejectDialogVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {
            if (!actioningExpenseId) {
              setRejectDialogVisible(false);
            }
          }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', justifyContent: 'center', padding: spacing[4] }}>
              <View style={{ borderRadius: 24, backgroundColor: colors.background.surface, padding: spacing[4], gap: spacing[3] }}>
                <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 18 }}>
                  {t('actions.reject')}
                </Text>
                <Text style={{ color: colors.text.muted }}>
                  Add a short remark before rejecting the expense.
                </Text>
                <TextInput
                  value={rejectRemarks}
                  onChangeText={setRejectRemarks}
                  placeholder="Rejection remark"
                  placeholderTextColor="#94a3b8"
                  multiline
                  style={{
                    minHeight: 110,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: colors.border.muted,
                    padding: spacing[3],
                    textAlignVertical: 'top',
                    color: colors.text.primary,
                  }}
                />
                <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      accessibilityRole="button"
                      activeOpacity={0.85}
                      disabled={Boolean(actioningExpenseId)}
                      onPress={() => {
                        setRejectDialogVisible(false);
                        setPendingRejectExpenseId(null);
                      }}
                      style={{
                        borderRadius: 18,
                        borderWidth: 1,
                        borderColor: colors.border.muted,
                        paddingVertical: spacing[3],
                        alignItems: 'center',
                      }}>
                      <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                        {t('actions.cancel')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      variant="danger"
                      loading={actioningExpenseId === pendingRejectExpenseId}
                      disabled={Boolean(actioningExpenseId)}
                      onPress={() => void confirmReject()}
                    >
                      {t('actions.reject')}
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {isMemberView ? (
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            onPress={() => router.push('/finance/expenses/create' as never)}
            style={{
              position: 'absolute',
              right: spacing[4],
              bottom: 88,
              width: 56,
              height: 56,
              borderRadius: 999,
              backgroundColor: colors.primary.DEFAULT,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
              shadowColor: '#000',
              shadowOpacity: 0.18,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 8,
            }}>
            <MaterialIcons name="add" size={28} color={colors.text.inverse} />
          </TouchableOpacity>
        ) : null}

        <FilterSheet
          visible={filterVisible}
          title={t('filters.title')}
          subtitle={isMemberView ? t('member.queuePeriodLabel') : t('queue.periodLabel')}
          sections={[
            {
              title: t('filters.title'),
              icon: 'tune',
              activeKey: draftFilter,
              items: expenseFilterItems.map((item) => ({ key: item.key, label: item.label })),
              onSelect: (key) => setDraftFilter(key as ExpenseFilterKey),
            },
            {
              title: t('filters.year'), icon: 'calendar-today', activeKey: draftPeriod.year,
              items: [{ key: '', label: t('filters.allYears') }, ...Array.from({ length: Math.max(0, new Date().getFullYear() - 2026 + 1) }, (_, index) => {
                const year = String(new Date().getFullYear() - index);
                return { key: year, label: year };
              })],
              onSelect: (year) => setDraftPeriod((value) => ({ ...value, year, month: year ? value.month : '' })),
            },
            {
              title: t('filters.month'), icon: 'date-range', activeKey: draftPeriod.month,
              items: [{ key: '', label: t('filters.allMonths') }, ...Array.from({ length: 12 }, (_, index) => ({ key: String(index + 1), label: t(`filters.month.${index + 1}`) }))],
              onSelect: (month) => setDraftPeriod((value) => ({ ...value, month, year: month ? value.year || String(new Date().getFullYear()) : value.year })),
            },
            {
              title: t('filters.sort'), icon: 'sort', activeKey: draftPeriod.sort,
              items: [{ key: 'latest', label: t('filters.latest') }, { key: 'oldest', label: t('filters.oldest') }],
              onSelect: (sort) => setDraftPeriod((value) => ({ ...value, sort: sort === 'oldest' ? 'oldest' : 'latest' })),
            },
          ]}
          onClose={() => {
            setDraftFilter(activeFilter);
            setFilterVisible(false);
          }}
          onApply={() => {
            setActiveFilter(draftFilter);
            setPeriod(draftPeriod);
            setFilterVisible(false);
          }}
          onReset={() => { setDraftFilter('all'); setDraftPeriod({ month: '', year: '', sort: 'latest' }); }}
          applyLabel={t('actions.save')}
          resetLabel={t('actions.clearAll')}
        />

      </View>

      <Dialog
        visible={receiptDialog.visible}
        variant={receiptDialog.variant}
        title={receiptDialog.title}
        description={receiptDialog.description}
        onConfirm={() => setReceiptDialog((current) => ({ ...current, visible: false }))}
      />
    </AppSafeAreaView>
  );
}
