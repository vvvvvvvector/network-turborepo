import { useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

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

import { PAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';

import { useCommandMenuStore } from '@/zustand/command-menu.store';

const COMMAND_ITEM_ICON_STYLE = 'mr-2 size-4';

interface Props {
  className?: string;
}

export const CommandMenu = ({ className }: Props) => {
  const { commandMenuOpened, toogleCmdMenuOpenState, setCommandMenuOpened } =
    useCommandMenuStore();

  const { setTheme } = useTheme();

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
        <CommandList>
          <CommandEmpty>No results found 🥲</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem
              onSelect={() => runCommand(() => push(PAGES.MY_PROFILE))}
            >
              <Icons.myProfile className={COMMAND_ITEM_ICON_STYLE} />
              <span>My profile</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => push(PAGES.NEWS))}>
              <Icons.news className={COMMAND_ITEM_ICON_STYLE} />
              <span>News</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => push(PAGES.MESSENGER))}
            >
              <Icons.messenger className={COMMAND_ITEM_ICON_STYLE} />
              <span>Messenger</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => push(`${PAGES.FRIENDS}?tab=all`))
              }
            >
              <Icons.friends className={COMMAND_ITEM_ICON_STYLE} />
              <span>Friends</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => push(PAGES.PHOTOS))}>
              <Icons.photos className={COMMAND_ITEM_ICON_STYLE} />
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
              <Icons.searchUser className={COMMAND_ITEM_ICON_STYLE} />
              <span>Find</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  push(`${PAGES.FRIENDS_REQUESTS}?type=incoming`)
                )
              }
            >
              <Icons.requests className={COMMAND_ITEM_ICON_STYLE} />
              <span>Requests</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => push(`${PAGES.FRIENDS}?tab=all`))
              }
            >
              <Icons.friends className={COMMAND_ITEM_ICON_STYLE} />
              <span>All</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => push(`${PAGES.FRIENDS}?tab=online`))
              }
            >
              <Icons.online className={COMMAND_ITEM_ICON_STYLE} />
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
              <Icons.incomingRequests className={COMMAND_ITEM_ICON_STYLE} />
              <span>Incoming</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  push(`${PAGES.FRIENDS_REQUESTS}?type=outgoing`)
                )
              }
            >
              <Icons.outgoingRequests className={COMMAND_ITEM_ICON_STYLE} />
              <span>Outgoing</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  push(`${PAGES.FRIENDS_REQUESTS}?type=rejected`)
                )
              }
            >
              <Icons.rejectUser className={COMMAND_ITEM_ICON_STYLE} />
              <span>Rejected</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <Icons.lightMode className={COMMAND_ITEM_ICON_STYLE} />
              <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <Icons.darkMode className={COMMAND_ITEM_ICON_STYLE} />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <Icons.systemMode className={COMMAND_ITEM_ICON_STYLE} />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <Icons.settings className={COMMAND_ITEM_ICON_STYLE} />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
