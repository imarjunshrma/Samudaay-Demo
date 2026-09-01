import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

import { apiQueryClient } from '@/src/services/api/query-client';

export function AppQueryProvider({ children }: PropsWithChildren) {
  return <QueryClientProvider client={apiQueryClient}>{children}</QueryClientProvider>;
}

