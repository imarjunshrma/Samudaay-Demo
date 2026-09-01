export interface ApiInterceptorContext {
  token?: string;
}

export function withAuthHeaders(headers: HeadersInit, context?: ApiInterceptorContext) {
  if (!context?.token) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${context.token}`,
  };
}
