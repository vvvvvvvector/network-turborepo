import { useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { signOut } from '@/app/server';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';

import { Icons } from '@/components/icons';
import { getThemeIcon } from '@/components/header';

import { PAGES } from '@/lib/constants';
import { capitalize, cn } from '@/lib/utils';

import { useCommandMenuStore } from '@/zustand/command-menu.store';

interface Props {
  className?: string;
}

export const CommandMenu = ({ className }: Props) => {
  const { commandMenuOpened, toogleCmdMenuOpenState, setCommandMenuOpened } =
    useCommandMenuStore();

  const { setTheme, themes } = useTheme();

  const { push } = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        toogleCmdMenuOpenState();
      }
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, []);

  // eslint-disable-next-line
  const runCommand = useCallback((command: (...args: any) => unknown) => {
    setCommandMenuOpened(false);

    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setCommandMenuOpened(true)}
        className={cn(
          'flex w-full items-center justify-between rounded-lg text-sm text-muted-foreground',
          className
        )}
      >
        <span>Search...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 dark:bg-neutral-900 md:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog
        open={commandMenuOpened}
        onOpenChange={setCommandMenuOpened}
      >
        <CommandInput placeholder="Search for pages or commands..." />
        <CommandEmpty>No results found 🥲</CommandEmpty>
        <CommandList>
          <CommandGroup heading="Pages">
            <CommandItem
              onSelect={() => runCommand(() => push(PAGES.MY_PROFILE))}
            >
              <Icons.myProfile type="command-menu" />
              <span>My profile</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => push(PAGES.NEWS))}>
              <Icons.news type="command-menu" />
              <span>News</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => push(PAGES.MESSENGER))}
            >
              <Icons.messenger type="command-menu" />
              <span>Messenger</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => push(`${PAGES.FRIENDS}?tab=all`))
              }
            >
              <Icons.friends type="command-menu" />
              <span>Friends</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => push(PAGES.PHOTOS))}>
              <Icons.photos type="command-menu" />
              <span>Photos</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Friends">
            <CommandItem
              onSelect={() =>
                runCommand(() => push(`${PAGES.FRIENDS_FIND}?page=1`))
              }
            >
              <Icons.searchUser type="command-menu" />
              <span>Find</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  push(`${PAGES.FRIENDS_REQUESTS}?type=incoming`)
                )
              }
            >
              <Icons.requests type="command-menu" />
              <span>Requests</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => push(`${PAGES.FRIENDS}?tab=all`))
              }
            >
              <Icons.friends type="command-menu" />
              <span>All</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => push(`${PAGES.FRIENDS}?tab=online`))
              }
            >
              <Icons.online type="command-menu" />
              <span>Online</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Friend Requests">
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  push(`${PAGES.FRIENDS_REQUESTS}?type=incoming`)
                )
              }
            >
              <Icons.incomingRequests type="command-menu" />
              <span>Incoming</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  push(`${PAGES.FRIENDS_REQUESTS}?type=outgoing`)
                )
              }
            >
              <Icons.outgoingRequests type="command-menu" />
              <span>Outgoing</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  push(`${PAGES.FRIENDS_REQUESTS}?type=rejected`)
                )
              }
            >
              <Icons.rejectUser type="command-menu" />
              <span>Rejected</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            {themes.map((theme) => (
              <CommandItem
                key={theme}
                onSelect={() => runCommand(() => setTheme(theme))}
              >
                {getThemeIcon(theme, 'command-menu')}
                <span>{capitalize(theme)}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <Icons.settings type="command-menu" />
              <span>Settings</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  signOut();

                  toast.success('You have successfully signed out.');

                  push(PAGES.SIGN_IN);
                })
              }
            >
              <Icons.signOut type="command-menu" />
              <span>Sign out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
