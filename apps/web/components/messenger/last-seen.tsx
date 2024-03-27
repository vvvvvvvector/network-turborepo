import { useState, useEffect } from 'react';

import { prettifyLastSeenDate } from '@/lib/utils';

export const LastSeen = ({ lastSeen }: { lastSeen: string }) => {
  const [state, setState] = useState(prettifyLastSeenDate(lastSeen));

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prettifyLastSeenDate(lastSeen)); // setting the same value will not trigger a re-render if state is a primitive
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  return <span>{`last seen ${state}`}</span>;
};
