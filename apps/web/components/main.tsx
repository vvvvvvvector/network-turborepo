'use client';

import { useEffect } from 'react';
import { parseCookies } from 'nookies';

import { TOKEN_NAME } from '@/lib/constants';

import { useSocketStore } from '@/zustand/socket.store';

export const Main = ({ children }: { children: React.ReactNode }) => {
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    connect(parseCookies()[TOKEN_NAME]);

    return () => {
      disconnect();
    };
  }, []);

  return <main>{children}</main>;
};
