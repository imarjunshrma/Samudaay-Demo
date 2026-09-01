import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import { apiConfig } from '@/src/constants/apiConfig';
import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';
import { storageService } from '@/src/services/storage.service';
import type { FileValue } from '@/src/types';
import { birthdayManagedTemplates, type BirthdayTemplateManagementItem } from '../constants';

export type BirthdayTemplateInput = Omit<BirthdayTemplateManagementItem, 'id' | 'sentCount'> & {
  id?: string;
  sentCount?: number;
};

type BirthdayTemplateListener = () => void;
type BirthdayTemplatesPage = {
  items: BirthdayTemplateManagementItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
};

const TEMPLATE_STORAGE_KEY = 'stitch-birthday-templates';

let templates: BirthdayTemplateManagementItem[] = birthdayManagedTemplates.map((template) => ({ ...template }));
const listeners = new Set<BirthdayTemplateListener>();
let webHydrated = false;
let asyncHydrationStarted = false;
let localRevision = 0;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: BirthdayTemplateListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return templates;
}

function setTemplates(nextTemplates: BirthdayTemplateManagementItem[]) {
  templates = nextTemplates;
  emitChange();
}

function createTemplateId(title: string) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${base || 'birthday-template'}-${Date.now()}`;
}

function isTemplate(value: unknown): value is BirthdayTemplateManagementItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const template = value as Partial<BirthdayTemplateManagementItem>;

  return (
    typeof template.id === 'string' &&
    typeof template.title === 'string' &&
    typeof template.categoryKey === 'string' &&
    typeof template.category === 'string' &&
    typeof template.image === 'string' &&
    typeof template.defaultMessage === 'string' &&
    typeof template.active === 'boolean' &&
    typeof template.sentCount === 'number'
  );
}

function getWebStorage() {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return null;
  }

  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function persistTemplates() {
  const storage = getWebStorage();
  const serializedTemplates = JSON.stringify(templates);

  if (!storage) {
    storageService.setItem(TEMPLATE_STORAGE_KEY, serializedTemplates).catch(() => {
      return;
    });
    return;
  }

  try {
    storage.setItem(TEMPLATE_STORAGE_KEY, serializedTemplates);
  } catch {
    // Ignore storage failures; the in-memory store still reflects the latest change.
  }

  storageService.setItem(TEMPLATE_STORAGE_KEY, serializedTemplates).catch(() => {
    return;
  });
}

function resolveBackendMediaUrl(fileUrl?: string | null) {
  if (!fileUrl) {
    return '';
  }

  if (/^https?:\/\//i.test(fileUrl) || fileUrl.startsWith('file:') || fileUrl.startsWith('data:')) {
    return fileUrl;
  }

  return `${apiConfig.baseUrl}${fileUrl}`;
}

function normalizeBackendImageForSave(image: string) {
  const trimmedImage = image.trim();
  if (apiConfig.isConfigured && trimmedImage.startsWith(`${apiConfig.baseUrl}/public/`)) {
    return trimmedImage.slice(apiConfig.baseUrl.length);
  }

  return trimmedImage;
}

function isImageFileValue(file: FileValue) {
  return file.mimeType?.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp|heic)$/i.test(file.name) || /\.(png|jpe?g|webp|gif|bmp|heic)$/i.test(file.uri);
}

function isRenderableTemplateImage(image: string) {
  const trimmedImage = image.trim();
  if (!trimmedImage || /^(file|content|ph):/i.test(trimmedImage)) {
    return false;
  }

  return !/\.(pdf|docx?|xlsx?|pptx?|txt)(?:[?#].*)?$/i.test(trimmedImage);
}

function mapTemplateForDisplay(template: BirthdayTemplateManagementItem): BirthdayTemplateManagementItem {
  return {
    ...template,
    image: resolveBackendMediaUrl(template.image),
  };
}

function getRenderableActiveFallbackTemplates() {
  const currentActiveTemplates = templates.filter((template) => template.active && isRenderableTemplateImage(template.image));
  if (currentActiveTemplates.length) {
    return currentActiveTemplates.map(mapTemplateForDisplay);
  }

  return birthdayManagedTemplates
    .filter((template) => template.active && isRenderableTemplateImage(template.image))
    .map(mapTemplateForDisplay);
}

function mergeTemplates(storedTemplates: BirthdayTemplateManagementItem[], { overwriteCurrent = true } = {}) {
  if (!storedTemplates.length) {
    return;
  }

  const existingIds = new Set(templates.map((template) => template.id));
  const missingStoredTemplates = storedTemplates.filter((template) => !existingIds.has(template.id));
  const updatedCurrentTemplates = overwriteCurrent
    ? templates.map((template) => storedTemplates.find((storedTemplate) => storedTemplate.id === template.id) ?? template)
    : templates;

  setTemplates([...missingStoredTemplates, ...updatedCurrentTemplates]);
}

function hydrateTemplates() {
  if (!webHydrated) {
    webHydrated = true;
    const storage = getWebStorage();

    if (storage) {
      try {
        const rawTemplates = storage.getItem(TEMPLATE_STORAGE_KEY);
        if (rawTemplates) {
          const parsedTemplates = JSON.parse(rawTemplates);
          if (Array.isArray(parsedTemplates)) {
            mergeTemplates(parsedTemplates.filter(isTemplate));
          }
        }
      } catch {
        // Keep default templates when local storage cannot be read.
      }
    }
  }

  if (asyncHydrationStarted) {
    return;
  }

  asyncHydrationStarted = true;
  const revisionAtHydrationStart = localRevision;
  storageService.getItem(TEMPLATE_STORAGE_KEY)
    .then((rawTemplates) => {
      if (!rawTemplates) {
        return;
      }

      const parsedTemplates = JSON.parse(rawTemplates);
      if (Array.isArray(parsedTemplates)) {
        mergeTemplates(parsedTemplates.filter(isTemplate), {
          overwriteCurrent: revisionAtHydrationStart === localRevision,
        });
      }
    })
    .catch(() => {
      return;
    });
}

async function getBackendSession() {
  if (!isBackendApiConfigured()) {
    return null;
  }

  return getBackendSessionContext();
}

async function fetchTemplatesPage(includeInactive = true, page = 1, limit = 12): Promise<BirthdayTemplatesPage> {
  const backendSession = await getBackendSession();
  if (!backendSession) {
    return {
      items: includeInactive ? templates : getRenderableActiveFallbackTemplates(),
      pagination: null,
    };
  }

  const response = await apiClient<{ data: BirthdayTemplateManagementItem[]; pagination?: BirthdayTemplatesPage['pagination'] }>(
    apiEndpoints.communityBirthdayTemplates(backendSession.tenantId, includeInactive, page, limit),
    { token: backendSession.token },
  );
  const backendItems = Array.isArray(response.data) ? response.data : [];

  const displayItems = backendItems.map(mapTemplateForDisplay);
  const fallbackItems = page === 1 && displayItems.length === 0
    ? (includeInactive ? templates : getRenderableActiveFallbackTemplates())
    : [];

  return {
    items: includeInactive
      ? (displayItems.length ? displayItems : fallbackItems)
      : (displayItems.length ? displayItems : fallbackItems).filter((template) => template.active && isRenderableTemplateImage(template.image)),
    pagination: response.pagination ?? null,
  };
}

async function syncTemplatesFromBackend(includeInactive = true) {
  const response = await fetchTemplatesPage(includeInactive, 1, 12);

  if (response.items.length) {
    setTemplates(response.items);
    persistTemplates();
  }

  return templates;
}

function hydrateBackendTemplates() {
  syncTemplatesFromBackend(true).catch(() => {
    return;
  });
}

export const birthdayTemplateService = {
  list() {
    hydrateTemplates();
    hydrateBackendTemplates();
    return templates;
  },

  getById(templateId?: string | string[]) {
    hydrateTemplates();
    hydrateBackendTemplates();
    const resolvedId = Array.isArray(templateId) ? templateId[0] : templateId;
    return templates.find((template) => template.id === resolvedId) ?? null;
  },

  async refresh(includeInactive = true) {
    hydrateTemplates();
    return syncTemplatesFromBackend(includeInactive);
  },

  async loadPage({ includeInactive = true, page = 1, limit = 12 } = {}) {
    hydrateTemplates();
    const result = await fetchTemplatesPage(includeInactive, page, limit);
    if (page === 1 && result.items.length) {
      setTemplates(result.items);
      persistTemplates();
    } else if (result.items.length) {
      const existingIds = new Set(templates.map((template) => template.id));
      setTemplates([...templates, ...result.items.filter((template) => !existingIds.has(template.id))]);
      persistTemplates();
    }

    return result;
  },

  async upsert(input: BirthdayTemplateInput) {
    hydrateTemplates();
    let nextTemplate: BirthdayTemplateManagementItem = {
      id: input.id ?? createTemplateId(input.title),
      title: input.title.trim(),
      categoryKey: input.categoryKey,
      category: input.category,
      image: normalizeBackendImageForSave(input.image),
      defaultMessage: input.defaultMessage.trim(),
      active: input.active,
      sentCount: input.sentCount ?? 0,
    };

    const backendSession = await getBackendSession();
    if (backendSession) {
      const response = await apiClient<{ data: BirthdayTemplateManagementItem }>(
        input.id
          ? apiEndpoints.communityBirthdayTemplate(backendSession.tenantId, input.id)
          : apiEndpoints.communityBirthdayTemplates(backendSession.tenantId, true),
        {
          method: input.id ? 'PATCH' : 'POST',
          token: backendSession.token,
          body: JSON.stringify({
            title: nextTemplate.title,
            categoryKey: nextTemplate.categoryKey,
            category: nextTemplate.category,
            image: nextTemplate.image,
            defaultMessage: nextTemplate.defaultMessage,
            active: nextTemplate.active,
          }),
        },
      );

      nextTemplate = mapTemplateForDisplay(response.data);
    }

    const existingIndex = templates.findIndex((template) => template.id === nextTemplate.id);
    localRevision += 1;
    setTemplates(
      existingIndex >= 0
        ? templates.map((template) => (template.id === nextTemplate.id ? nextTemplate : template))
        : [nextTemplate, ...templates],
    );

    persistTemplates();
    return nextTemplate;
  },

  async uploadImage(file: FileValue) {
    if (!isImageFileValue(file)) {
      throw new Error('Choose a JPG, PNG, WebP, or other image file.');
    }

    const backendSession = await getBackendSession();
    if (!backendSession) {
      throw new Error('Session not available.');
    }

    const formData = new FormData();
    formData.append('image', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || 'image/jpeg',
    } as never);

    const response = await apiClient<{ data: { path?: string | null } }>(
      apiEndpoints.communityBirthdayTemplateImageUpload(backendSession.tenantId),
      {
        method: 'POST',
        token: backendSession.token,
        body: formData,
      },
    );

    if (!response.data?.path) {
      throw new Error('Image upload failed.');
    }

    return resolveBackendMediaUrl(response.data.path);
  },

  async remove(templateId: string) {
    hydrateTemplates();

    const backendSession = await getBackendSession();
    if (backendSession) {
      await apiClient(
        apiEndpoints.communityBirthdayTemplate(backendSession.tenantId, templateId),
        {
          method: 'DELETE',
          token: backendSession.token,
        },
      );
    }

    localRevision += 1;
    setTemplates(templates.filter((template) => template.id !== templateId));
    persistTemplates();
  },
};

export function useBirthdayTemplates() {
  useEffect(() => {
    hydrateTemplates();
    hydrateBackendTemplates();
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function usePaginatedBirthdayTemplates({ includeInactive = true, limit = 12 } = {}) {
  const storeTemplates = useBirthdayTemplates();
  const [items, setItems] = useState<BirthdayTemplateManagementItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastPageItemCount, setLastPageItemCount] = useState(0);
  const [hasPagination, setHasPagination] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPage = useCallback(async (nextPage: number, mode: 'initial' | 'more' = 'initial') => {
    if (mode === 'initial') {
      setLoadingInitial(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const result = await birthdayTemplateService.loadPage({ includeInactive, page: nextPage, limit });
      setLastPageItemCount(result.items.length);
      setExhausted(mode === 'more' && result.items.length === 0);
      setItems((current) => {
        if (nextPage === 1) {
          setExhausted(false);
          return result.items;
        }

        const existingIds = new Set(current.map((template) => template.id));
        return [...current, ...result.items.filter((template) => !existingIds.has(template.id))];
      });
      setPage(nextPage);
      setHasPagination(Boolean(result.pagination));
      setTotalPages(result.pagination?.totalPages || 1);
    } finally {
      setLoadingInitial(false);
      setLoadingMore(false);
    }
  }, [includeInactive, limit]);

  useEffect(() => {
    loadPage(1).catch(() => {
      setLoadingInitial(false);
    });
  }, [loadPage]);

  useEffect(() => {
    const nextStoreItems = (includeInactive
      ? storeTemplates
      : storeTemplates.filter((template) => template.active && isRenderableTemplateImage(template.image)));

    setItems((current) => {
      if (!current.length) {
        return nextStoreItems.slice(0, limit);
      }

      const currentIds = new Set(current.map((template) => template.id));
      const updatedCurrentItems = current
        .map((template) => nextStoreItems.find((item) => item.id === template.id) ?? template)
        .filter((template) => includeInactive || (template.active && isRenderableTemplateImage(template.image)));
      const prependedNewItems = nextStoreItems.filter((template) => !currentIds.has(template.id));

      return [...prependedNewItems, ...updatedCurrentItems];
    });
  }, [includeInactive, limit, storeTemplates]);

  const hasNextPage = !exhausted && (hasPagination ? page < totalPages : lastPageItemCount >= limit);

  return {
    templates: items,
    hasNextPage,
    loadingInitial,
    loadingMore,
    loadMore: () => {
      if (!hasNextPage || loadingMore) {
        return;
      }

      loadPage(page + 1, 'more').catch(() => {
        setLoadingMore(false);
      });
    },
    refresh: () => loadPage(1),
  };
}
