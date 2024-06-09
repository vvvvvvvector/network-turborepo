"use client";

import { useState } from "react";
import {
  DefaultOptions,
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "sonner";
import axios from "axios";

const queriesOptions = {
  retry: 10,
  retryDelay: (attempt) => attempt * 1000,
} satisfies DefaultOptions["queries"];

const mutationsOptions = {
  retry: 10,
  retryDelay: (attempt) => attempt * 1000,
} satisfies DefaultOptions["mutations"];

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: queriesOptions,
          mutations: mutationsOptions,
        },
        mutationCache: new MutationCache({
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              toast.error(`${error.response?.data.message}`);
            } else if (error instanceof Error) {
              toast.error(error.message);
            }
          },
        }),
      })
  ); // https://tkdodo.eu/blog/react-query-fa-qs#2-the-queryclient-is-not-stable

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
