type AuthExpirationListener = (message?: string) => void;

const listeners = new Set<AuthExpirationListener>();

export function subscribeToAuthExpiration(listener: AuthExpirationListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function notifyAuthExpired(message?: string) {
  listeners.forEach((listener) => {
    listener(message);
  });
}

export function isAuthExpirationError(status: number, message: string, hasAuthToken = false) {
  const normalizedMessage = message.trim().toLowerCase();

  return (
    (hasAuthToken && status === 401) ||
    normalizedMessage.includes('jwt expired') ||
    normalizedMessage.includes('token expired') ||
    normalizedMessage.includes('session expired')
  );
}
