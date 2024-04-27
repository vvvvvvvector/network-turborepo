'use client';

import { useState } from 'react';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';

export default function QueryProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              toast.error(`${error.response?.data.message}`);
            }

            if (error instanceof Error) {
              toast.error(error.message);
            }
          }
        })
      })
  ); // https://tkdodo.eu/blog/react-query-fa-qs#2-the-queryclient-is-not-stable

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
