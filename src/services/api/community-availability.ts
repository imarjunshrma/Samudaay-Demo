// The backend tenant resolver answers 403 "Tenant is not active." when a community is disabled.
const COMMUNITY_UNAVAILABLE_MESSAGE = 'tenant is not active.';

type Listener = () => void;
const listeners = new Set<Listener>();

export function isCommunityUnavailableError(status: number, message: string) {
  return status === 403 && message.trim().toLowerCase() === COMMUNITY_UNAVAILABLE_MESSAGE;
}

export function notifyCommunityUnavailable() {
  listeners.forEach((listener) => listener());
}

export function subscribeToCommunityUnavailable(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
