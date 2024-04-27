import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Avatar } from '@/components/avatar';
import { Icons } from '@/components/icons';

import { useCommonActions } from '@/hooks/use-common-actions';
import { useRequestsMutations } from '@/hooks/use-requests-mutations';
import { useTab } from '@/hooks/use-tab';

import { type UserFromListOfUsers } from '@/lib/types';
import {
  DROPDOWN_MENU_ICON_STYLES,
  ICON_INSIDE_BUTTON_SIZE
} from '@/lib/constants';

import { tabs } from '@/components/friends/friends';

interface Props {
  friends: UserFromListOfUsers[];
  connectionsInformation: {
    [username: string]: 'online' | 'offline';
  };
}

export const FriendsList = ({ friends, connectionsInformation }: Props) => {
  const { unfriend } = useRequestsMutations();

  const { writeMessage } = useCommonActions();

  const tab = useTab<typeof tabs>('tab');

  const users =
    tab === 'all'
      ? friends
      : friends.filter(
          (user) => connectionsInformation[user.username] === 'online'
        );

  if (!users.length) {
    return (
      <span className="my-7 text-center">
        {tab === 'all'
          ? "You don't have any friends yet."
          : 'None of your friends are online.'}
      </span>
    );
  }

  return (
    <ul className="flex flex-col gap-5">
      {users.map((user) => (
        <li
          className="flex items-center justify-between py-2"
          key={user.username}
        >
          <div className="flex items-center gap-3">
            <Link href={`/${user.username}`}>
              <div className="relative">
                <Avatar
                  size="medium"
                  username={user.username}
                  avatar={user.profile.avatar?.url}
                />
                {connectionsInformation[user.username] === 'online' && (
                  <span className="absolute bottom-0 right-0 size-4 rounded-full border-[2px] border-background bg-emerald-400 transition-[background-color] group-hover:border-neutral-200 group-hover:dark:border-neutral-700" />
                )}
              </div>
            </Link>
            <Link href={`/${user.username}`}>
              <span className="cursor-pointer hover:underline">
                {user.username}
              </span>
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icons.moreHorizontal className={ICON_INSIDE_BUTTON_SIZE} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={writeMessage(user.username)}>
                <Icons.writeMessage className={DROPDOWN_MENU_ICON_STYLES} />
                <span>Write message</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={unfriend(user.username)}>
                <Icons.unfriend className={DROPDOWN_MENU_ICON_STYLES} />
                <span>Unfriend</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      ))}
    </ul>
  );
};
