function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function extractMessageCandidate(value: unknown, depth = 0): string | null {
  if (depth > 4 || value == null) {
    return null;
  }

  if (typeof value === 'string') {
    const normalized = value.trim();
    if (!normalized) {
      return null;
    }

    if ((normalized.startsWith('{') && normalized.endsWith('}')) || (normalized.startsWith('[') && normalized.endsWith(']'))) {
      try {
        return extractMessageCandidate(JSON.parse(normalized), depth + 1) || normalized;
      } catch {
        return normalized;
      }
    }

    return normalized;
  }

  if (value instanceof Error) {
    return extractMessageCandidate(value.message, depth + 1);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const candidate = extractMessageCandidate(item, depth + 1);
      if (candidate) {
        return candidate;
      }
    }
    return null;
  }

  if (!isRecord(value)) {
    return null;
  }

  const preferredKeys = ['message', 'error', 'description', 'reason', 'detail', 'title', 'details'];
  for (const key of preferredKeys) {
    if (!(key in value)) {
      continue;
    }
    const candidate = extractMessageCandidate(value[key], depth + 1);
    if (candidate) {
      return candidate;
    }
  }

  if ('errors' in value) {
    const candidate = extractMessageCandidate(value.errors, depth + 1);
    if (candidate) {
      return candidate;
    }
  }

  if ('data' in value) {
    const candidate = extractMessageCandidate(value.data, depth + 1);
    if (candidate) {
      return candidate;
    }
  }

  return null;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return extractMessageCandidate(error) || fallback;
}

function isBrokenPaymentMessage(message: string) {
  const normalized = message.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return (
    normalized === '[object object]' ||
    normalized.includes('undefined') ||
    normalized.includes('null') && normalized.includes('description') ||
    normalized.includes('description undefined') ||
    normalized.includes('reason undefined')
  );
}

export function getRazorpayPaymentErrorMessage(error: unknown, fallback = 'Payment failed. Please try again.'): string {
  const record = isRecord(error) ? error : {};
  const code = String(record.code || '').trim().toUpperCase();
  const rawMessage = getErrorMessage(error, fallback);
  const normalizedMessage = rawMessage.toLowerCase();

  if (
    code === 'PAYMENT_CANCELLED' ||
    code === 'USER_CANCELLED' ||
    normalizedMessage.includes('cancel') ||
    normalizedMessage.includes('dismiss') ||
    normalizedMessage.includes('close')
  ) {
    return 'Payment was cancelled before completion.';
  }

  if (
    code === 'NETWORK_ERROR' ||
    normalizedMessage.includes('network') ||
    normalizedMessage.includes('timeout') ||
    normalizedMessage.includes('timed out') ||
    normalizedMessage.includes('internet')
  ) {
    return 'Payment could not be completed because of a network issue. Please try again.';
  }

  if (normalizedMessage === 'payment was cancelled or failed.') {
    return fallback;
  }

  if (isBrokenPaymentMessage(rawMessage)) {
    return fallback;
  }

  return rawMessage;
}
