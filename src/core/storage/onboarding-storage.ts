import { storageService } from '@/src/services/storage.service';

const ONBOARDING_SEEN_KEY = 'stitch-community-onboarding-seen';

export async function hasSeenOnboarding() {
  return (await storageService.getItem(ONBOARDING_SEEN_KEY)) === '1';
}

export async function markOnboardingSeen() {
  await storageService.setItem(ONBOARDING_SEEN_KEY, '1');
}

export async function clearOnboardingSeen() {
  await storageService.removeItem(ONBOARDING_SEEN_KEY);
}
