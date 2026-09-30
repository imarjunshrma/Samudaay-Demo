import * as FileSystem from 'expo-file-system/legacy';

import {
  communityStore,
  type CommunityAppConfig,
  type SelectedCommunity,
} from '@/src/core/config/community';
import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { resolveBackendMediaUrl } from '@/src/services/api/media-url';
import { getSecureItem, removeSecureItem, setSecureItem } from '@/src/services/secure-storage';

const SELECTED_COMMUNITY_KEY = 'samudaay-selected-community';
const PICK_EVERY_LAUNCH_KEY = 'samudaay-pick-community-every-launch';

export const COMMUNITY_UNAVAILABLE_MESSAGE = 'Tenant is not active.';

type CommunitiesResponse =
  | SelectedCommunity[]
  | {
      communities?: SelectedCommunity[];
      items?: SelectedCommunity[];
      results?: SelectedCommunity[];
      data?: SelectedCommunity[];
    };

function normalizeCommunitiesResponse(responseData: CommunitiesResponse | null | undefined): SelectedCommunity[] {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (!responseData) {
    return [];
  }

  return responseData.communities ?? responseData.items ?? responseData.results ?? responseData.data ?? [];
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

export async function readStoredCommunity(): Promise<SelectedCommunity | null> {
  try {
    const raw = await getSecureItem(SELECTED_COMMUNITY_KEY);
    const parsed = raw ? (JSON.parse(raw) as SelectedCommunity) : null;
    return parsed?.id && parsed?.slug ? parsed : null;
  } catch {
    return null;
  }
}

export async function writeStoredCommunity(community: SelectedCommunity | null) {
  if (!community) {
    await removeSecureItem(SELECTED_COMMUNITY_KEY).catch(() => undefined);
    return;
  }
  await setSecureItem(SELECTED_COMMUNITY_KEY, JSON.stringify(community));
}

/** Super admins choose a community on every launch; normal users keep the stored one. */
export async function readPickEveryLaunch() {
  return (await getSecureItem(PICK_EVERY_LAUNCH_KEY).catch(() => null)) === '1';
}

export async function writePickEveryLaunch(value: boolean) {
  await setSecureItem(PICK_EVERY_LAUNCH_KEY, value ? '1' : '0').catch(() => undefined);
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

export async function fetchCommunities(search = ''): Promise<SelectedCommunity[]> {
  const params = new URLSearchParams({ channel: 'samudaay' });
  if (search.trim()) {
    params.set('q', search.trim());
  }
  const response = await apiClient<{ data: CommunitiesResponse }>(`${apiEndpoints.publicCommunities}?${params.toString()}`);
  return normalizeCommunitiesResponse(response.data);
}

export async function fetchCommunityAppConfig(community: SelectedCommunity): Promise<CommunityAppConfig> {
  const response = await apiClient<{ data: CommunityAppConfig }>(
    `/api/v1/community/${encodeURIComponent(community.slug)}/app-config`,
  );
  return response.data;
}

// ---------------------------------------------------------------------------
// Print assets: receipts and reports are rendered by expo-print, so community logos are embedded
// as data URIs instead of remote URLs.
// ---------------------------------------------------------------------------

interface CommunityPrintAssets {
  receiptLogo: string | null;
  reportLogo: string | null;
  receiptQr: string | null;
}

let printAssets: CommunityPrintAssets = { receiptLogo: null, reportLogo: null, receiptQr: null };
const dataUriCache = new Map<string, string>();

async function toDataUri(url: string | null) {
  const absolute = resolveBackendMediaUrl(url);
  if (!absolute) {
    return null;
  }
  if (absolute.startsWith('data:')) {
    return absolute;
  }
  const cached = dataUriCache.get(absolute);
  if (cached) {
    return cached;
  }

  try {
    const extension = absolute.split('?')[0].split('.').pop()?.toLowerCase() || 'png';
    const target = `${FileSystem.cacheDirectory}community-asset-${dataUriCache.size}-${Date.now()}.${extension}`;
    const download = await FileSystem.downloadAsync(absolute, target);
    if (download.status !== 200) {
      return null;
    }
    const base64 = await FileSystem.readAsStringAsync(download.uri, { encoding: FileSystem.EncodingType.Base64 });
    const mime = extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : extension === 'webp' ? 'image/webp' : 'image/png';
    const dataUri = `data:${mime};base64,${base64}`;
    dataUriCache.set(absolute, dataUri);
    return dataUri;
  } catch {
    return null;
  }
}

export async function preparePrintAssets(config: CommunityAppConfig | null) {
  if (!config) {
    printAssets = { receiptLogo: null, reportLogo: null, receiptQr: null };
    return;
  }
  const [receiptLogo, reportLogo, receiptQr] = await Promise.all([
    toDataUri(config.branding.receiptLogoUrl),
    toDataUri(config.branding.reportLogoUrl),
    toDataUri(config.branding.receiptQrUrl),
  ]);
  printAssets = { receiptLogo, reportLogo, receiptQr };
}

export function getPrintAssets() {
  return printAssets;
}

/** Applies a community: stores it, loads its app config and print assets. */
export async function activateCommunity(community: SelectedCommunity) {
  communityStore.setSelected(community);
  const config = await fetchCommunityAppConfig(community);
  communityStore.setAppConfig(config);
  await writeStoredCommunity({
    id: config.community.id,
    slug: config.community.slug,
    name: config.community.name,
    city: config.community.city,
  });
  void preparePrintAssets(config);
  return config;
}
