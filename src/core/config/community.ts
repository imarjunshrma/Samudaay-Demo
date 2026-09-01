const configuredTenantId = process.env.EXPO_PUBLIC_TENANT_ID?.trim();
const configuredTenantSlug = process.env.EXPO_PUBLIC_TENANT_SLUG?.trim();
const configuredTenantName = process.env.EXPO_PUBLIC_TENANT_NAME?.trim();
const configuredTenantNameGujarati = process.env.EXPO_PUBLIC_TENANT_NAME_GU?.trim();
const configuredTenantBrand = process.env.EXPO_PUBLIC_TENANT_BRAND?.trim();
const configuredTenantTagline = process.env.EXPO_PUBLIC_TENANT_TAGLINE?.trim();
const configuredTenantTaglineGujarati = process.env.EXPO_PUBLIC_TENANT_TAGLINE_GU?.trim();
const configuredTenantHeader = process.env.EXPO_PUBLIC_TENANT_HEADER?.trim();
const configuredAllowCommunitySwitch = process.env.EXPO_PUBLIC_ALLOW_COMMUNITY_SWITCH?.trim()?.toLowerCase();
const activeTenantKey = configuredTenantSlug || configuredTenantId || '';

const parseBoolean = (value: string | undefined) => value === '1' || value === 'true' || value === 'yes';
const requireTenantKey = () => {
  if (!activeTenantKey) {
    throw new Error('EXPO_PUBLIC_TENANT_SLUG or EXPO_PUBLIC_TENANT_ID is required.');
  }
  return activeTenantKey;
};

export const communityConfig = {
  tenantId: configuredTenantId || activeTenantKey,
  tenantSlug: configuredTenantSlug || activeTenantKey,
  tenantName: configuredTenantName || '',
  tenantNameGu: configuredTenantNameGujarati || configuredTenantName || '',
  brandName: configuredTenantBrand || '',
  tagline: configuredTenantTagline || '',
  taglineGu: configuredTenantTaglineGujarati || configuredTenantTagline || '',
  apiTenantHeader: configuredTenantHeader || (configuredTenantSlug ? 'x-tenant-slug' : 'x-tenant-id'),
  allowCommunitySwitch: parseBoolean(configuredAllowCommunitySwitch) || false,
} as const;

export function getActiveTenantRequestHeaders() {
  return {
    [communityConfig.apiTenantHeader]: requireTenantKey(),
  } as Record<string, string>;
}
