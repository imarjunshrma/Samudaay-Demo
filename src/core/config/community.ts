const configuredTenantId = process.env.EXPO_PUBLIC_TENANT_ID?.trim();
const configuredTenantSlug = process.env.EXPO_PUBLIC_TENANT_SLUG?.trim();
const configuredTenantName = process.env.EXPO_PUBLIC_TENANT_NAME?.trim();
const configuredTenantNameGujarati = process.env.EXPO_PUBLIC_TENANT_NAME_GU?.trim();
const configuredTenantBrand = process.env.EXPO_PUBLIC_TENANT_BRAND?.trim();
const configuredTenantTagline = process.env.EXPO_PUBLIC_TENANT_TAGLINE?.trim();
const configuredTenantTaglineGujarati = process.env.EXPO_PUBLIC_TENANT_TAGLINE_GU?.trim();
const configuredTenantHeader = process.env.EXPO_PUBLIC_TENANT_HEADER?.trim();
const configuredAllowCommunitySwitch = process.env.EXPO_PUBLIC_ALLOW_COMMUNITY_SWITCH?.trim()?.toLowerCase();
const configuredCommunitySelection = process.env.EXPO_PUBLIC_COMMUNITY_SELECTION?.trim()?.toLowerCase();
const envTenantKey = configuredTenantSlug || configuredTenantId || '';

const parseBoolean = (value: string | undefined) => value === '1' || value === 'true' || value === 'yes';

/**
 * Samudaay mode: the tenant is chosen by the user at runtime (community picker) instead of being
 * fixed by EXPO_PUBLIC_TENANT_SLUG. Dedicated builds leave EXPO_PUBLIC_COMMUNITY_SELECTION unset.
 */
export const COMMUNITY_SELECTION_ENABLED = parseBoolean(configuredCommunitySelection);

/** Community picked in the Samudaay community selector (from /community/auth/communities). */
export interface SelectedCommunity {
  id: string;
  slug: string;
  name: string;
  city?: string | null;
}

/** Public per-community configuration from GET /community/:slug/app-config (no secrets). */
export interface CommunityAppConfig {
  community: { id: string; slug: string; name: string; city: string | null; status: string };
  general: {
    trustName: string;
    trustNameLocal: string | null;
    shortName: string | null;
    tagline: string | null;
    taglineLocal: string | null;
    address: string | null;
    addressLocal: string | null;
    phoneNumber: string | null;
    gstNumber: string | null;
    registrationNumber: string | null;
    panNumber: string | null;
    registration80GNumber: string | null;
  };
  branding: {
    primaryLogoUrl: string | null;
    appStartLogoUrl: string | null;
    idCardLogoUrl: string | null;
    receiptLogoUrl: string | null;
    reportLogoUrl: string | null;
    receiptQrUrl: string | null;
    authorizedSignatureUrl: string | null;
  };
  theme: { themePreset: string | null; primaryColor: string | null; secondaryColor: string | null };
  bank: {
    bankAccountName: string | null;
    bankName: string | null;
    bankBranch: string | null;
    bankIfscCode: string | null;
    bankAccountNumber: string | null;
  };
  payments: { razorpay: { enabled: boolean; keyId: string | null } };
  features: Record<string, unknown>;
}

interface CommunityState {
  selected: SelectedCommunity | null;
  appConfig: CommunityAppConfig | null;
}

let state: CommunityState = { selected: null, appConfig: null };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export const communityStore = {
  getState: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setSelected(selected: SelectedCommunity | null) {
    state = { selected, appConfig: selected && state.appConfig?.community.id === selected.id ? state.appConfig : null };
    emit();
  },
  setAppConfig(appConfig: CommunityAppConfig | null) {
    state = { ...state, appConfig };
    emit();
  },
};

const selected = () => (COMMUNITY_SELECTION_ENABLED ? state.selected : null);
const general = () => (COMMUNITY_SELECTION_ENABLED ? state.appConfig?.general ?? null : null);

// Getters so every read reflects the currently selected community.
export const communityConfig = {
  get tenantId() {
    return selected()?.id || configuredTenantId || envTenantKey;
  },
  get tenantSlug() {
    return selected()?.slug || configuredTenantSlug || envTenantKey;
  },
  get tenantName() {
    return general()?.trustName || selected()?.name || configuredTenantName || '';
  },
  get tenantNameGu() {
    const community = general();
    return community?.trustNameLocal || community?.trustName || selected()?.name || configuredTenantNameGujarati || configuredTenantName || '';
  },
  /** Product brand ("Samudaay"); not community specific. */
  brandName: configuredTenantBrand || '',
  get tagline() {
    return general()?.tagline || configuredTenantTagline || '';
  },
  get taglineGu() {
    const community = general();
    return community?.taglineLocal || community?.tagline || configuredTenantTaglineGujarati || configuredTenantTagline || '';
  },
  apiTenantHeader: configuredTenantHeader || (configuredTenantSlug || COMMUNITY_SELECTION_ENABLED ? 'x-tenant-slug' : 'x-tenant-id'),
  allowCommunitySwitch: parseBoolean(configuredAllowCommunitySwitch) || false,
  communitySelectionEnabled: COMMUNITY_SELECTION_ENABLED,
};

export function getActiveTenantRequestHeaders() {
  if (COMMUNITY_SELECTION_ENABLED) {
    const community = state.selected;
    // Public endpoints (community list) are called before a community is picked.
    if (!community) {
      return {} as Record<string, string>;
    }
    return {
      [communityConfig.apiTenantHeader]: communityConfig.apiTenantHeader === 'x-tenant-id' ? community.id : community.slug,
    } as Record<string, string>;
  }

  if (!envTenantKey) {
    throw new Error('EXPO_PUBLIC_TENANT_SLUG or EXPO_PUBLIC_TENANT_ID is required.');
  }
  return {
    [communityConfig.apiTenantHeader]: envTenantKey,
  } as Record<string, string>;
}
