'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { FriendsList } from '@/components/friends/friends-list';

import { type UserFromListOfUsers } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PAGES } from '@/lib/constants';

import { useTab } from '@/hooks/use-tab';
import { useConnectionsInformation } from '@/hooks/use-connections-information';

export const tabs = ['all', 'online'] as const;

export const Friends = ({ users }: { users: Array<UserFromListOfUsers> }) => {
  const router = useRouter();

  const tab = useTab<typeof tabs>('tab');

  useEffect(() => {
    switch (tab) {
      case 'all':
        router.replace(`${PAGES.FRIENDS}?tab=${tab}`);
        break;
      case 'online':
        router.replace(`${PAGES.FRIENDS}?tab=${tab}`);
        break;
      default:
        router.replace(`${PAGES.FRIENDS}?tab=all`);
    }
  }, [router]);

  const connectionsInformation = useConnectionsInformation(
    users.reduce(
      (accumulator, currentValue) =>
        Object.assign(accumulator, {
          [currentValue.username]: 'offline'
        }),
      {}
    )
  );

  return (
    <>
      <div className="flex items-center justify-between text-sm">
        <ul className="flex gap-3 sm:gap-7">
          <li
            onClick={() => router.replace(`${PAGES.FRIENDS}?tab=all`)}
            className={cn(
              `cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] hover:bg-accent`,
              {
                'bg-accent': tab === 'all'
              }
            )}
          >
            <span className="flex sm:hidden">{`All [${users.length}]`}</span>
            <span className="hidden sm:flex">{`All friends [${users.length}]`}</span>
          </li>
          <li
            onClick={() => router.replace(`${PAGES.FRIENDS}?tab=online`)}
            className={cn(
              `cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] hover:bg-accent`,
              {
                'bg-accent': tab === 'online'
              }
            )}
          >
            {`Online [${
              Object.values(connectionsInformation).filter(
                (val) => val === 'online'
              ).length
            }]`}
          </li>
        </ul>
        <Button onClick={() => router.replace(`${PAGES.FRIENDS_FIND}?page=1`)}>
          <span className="flex sm:hidden">Find</span>
          <span className="hidden sm:flex">Find friends</span>
        </Button>
      </div>
      <Separator className="my-4" />
      <FriendsList
        friends={users}
        connectionsInformation={connectionsInformation}
      />
    </>
  );
};
