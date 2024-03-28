'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function QueryProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient()); // https://tkdodo.eu/blog/react-query-fa-qs#2-the-queryclient-is-not-stable

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
