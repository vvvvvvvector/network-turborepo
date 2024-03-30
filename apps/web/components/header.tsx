'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { Icons } from '@/components/icons';
import { Avatar } from '@/components/avatar';
import { CommandMenu } from '@/components/command-menu';
import { MobileNav } from '@/components/mobile-nav';

import { signOut } from '@/app/server';
import { getAuthorisedUserUsernameAndAvatar } from '@/axios/users';

import { DROPDOWN_MENU_ICON_STYLES, PAGES } from '@/lib/constants';
import { capitalize } from '@/lib/utils';

export const getThemeIcon = (theme: string | undefined) => {
  switch (theme) {
    case 'light':
      return <Icons.lightMode className={DROPDOWN_MENU_ICON_STYLES} />;
    case 'dark':
      return <Icons.darkMode className={DROPDOWN_MENU_ICON_STYLES} />;
    case 'system':
      return <Icons.systemMode className={DROPDOWN_MENU_ICON_STYLES} />;
    default:
      return <Icons.alertTriangle className={DROPDOWN_MENU_ICON_STYLES} />;
  }
};

const ThemeSelector = () => {
  const { theme, setTheme, themes } = useTheme();

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      {getThemeIcon(theme)}
      <div className="flex flex-1 justify-between">
        <span>Theme:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="mr-2 flex items-center">
              <span>{theme && capitalize(theme)}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {themes.map((theme) => (
              <DropdownMenuItem
                key={theme}
                onClick={() => {
                  setTheme(theme);
                }}
              >
                {getThemeIcon(theme)}
                <span>{capitalize(theme)}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </DropdownMenuItem>
  );
};

const Header = () => {
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);

  const { push } = useRouter();

  const { data } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['username', 'and', 'avatar'],
    queryFn: getAuthorisedUserUsernameAndAvatar
  });

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-center border-b border-b-muted bg-background">
      <div className="flex h-14 w-full max-w-authorised items-center px-5">
        <ul className="flex size-full items-center justify-between gap-2 md:gap-0">
          <li className="md:hidden">
            <MobileNav />
          </li>
          <li className="flex flex-1">
            <div
              onClick={() => push(PAGES.NEWS)}
              className="mr-14 hidden cursor-pointer items-center gap-3 md:flex"
            >
              <Icons.appLogo />
              <span className="text-2xl font-bold">Network</span>
            </div>
            <CommandMenu className="md:max-w-[320px]" />
          </li>
          <li className="h-full">
            <Dialog>
              <DropdownMenu
                open={dropdownMenuOpen}
                defaultOpen={dropdownMenuOpen}
                onOpenChange={setDropdownMenuOpen}
              >
                <DropdownMenuTrigger asChild>
                  <div
                    onClick={() => setDropdownMenuOpen(true)}
                    className="flex h-full w-[80px] cursor-pointer items-center justify-center gap-2 transition-[background-color] hover:bg-accent md:w-[100px]"
                  >
                    <Avatar
                      username={data?.username || 'Unknown'}
                      avatar={data?.avatar?.name}
                    />
                    <Icons.arrowDown className="size-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-52">
                  <DropdownMenuLabel>
                    <div className="flex gap-2">
                      <span>Profile: </span>
                      <span
                        onClick={() => {
                          push(PAGES.MY_PROFILE);

                          setDropdownMenuOpen(false);
                        }}
                        className="cursor-pointer hover:underline"
                      >
                        {data?.username || 'Unknown'}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Icons.settings className={DROPDOWN_MENU_ICON_STYLES} />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <ThemeSelector />
                  <DropdownMenuSeparator />
                  <DialogTrigger className="w-full">
                    <DropdownMenuItem>
                      <Icons.signOut className={DROPDOWN_MENU_ICON_STYLES} />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent className="max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Please, confirm your intention</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to sign out?
                  </DialogDescription>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={() => {
                        signOut();

                        toast.success('You have successfully signed out.');

                        push(PAGES.SIGN_IN);
                      }}
                    >
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </div>
    </header>
  );
};

export { Header };
