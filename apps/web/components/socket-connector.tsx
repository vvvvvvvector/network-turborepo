'use client';

import { useEffect } from 'react';
import { parseCookies } from 'nookies';

import { TOKEN_NAME } from '@/lib/constants';

import { useSocketStore } from '@/zustand/socket.store';

export const SocketConnector = ({ children }: { children: React.ReactNode }) => {
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    connect(parseCookies()[TOKEN_NAME]);

    return () => {
      disconnect();
    };
  }, []);

  return <div className="flex min-h-screen flex-col">{children}</div>;
};
