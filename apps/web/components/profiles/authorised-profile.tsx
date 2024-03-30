'use client';

import { useState } from 'react';

import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Input } from '@/components/ui/input';

import { Avatar } from '@/components/avatar';
import { Icons } from '@/components/icons';

import { useProfileMutations } from '@/hooks/use-profile-mutations';
import { useCommonActions } from '@/hooks/use-common-actions';

import type { AuthorisedUser } from '@/lib/types';
import { DROPDOWN_MENU_ICON_STYLES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

import { toogleAuthorisedUserEmailPrivacy } from '@/axios/users';

export const AuthorisedProfile = (user: AuthorisedUser) => {
  const [open, setOpen] = useState(false);

  const [bio, setBio] = useState('');

  const { openPhoto } = useCommonActions();

  const { updateAvatar, uploadAvatar, deleteAvatar } = useProfileMutations();

  return (
    <div className="rounded-lg bg-background p-5">
      <div className="flex items-center gap-5">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger>
            <div className="relative">
              <Avatar
                size="large"
                username={user.username}
                avatar={user.profile.avatar?.name}
              />
              <span className="absolute bottom-2 right-2 size-6 rounded-full border-[3px] border-background bg-emerald-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {user.profile.avatar && (
              <DropdownMenuItem onClick={openPhoto(user.profile.avatar.name)}>
                <Icons.photos className={DROPDOWN_MENU_ICON_STYLES} />
                <span>{`Open photo`}</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <input
                id="avatar"
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                hidden
                onChange={(e) => {
                  if (e.target.files instanceof FileList) {
                    const file = e.target.files[0];

                    const callbacks = {
                      onSuccess: () => setOpen(false),
                      onSettled: () => (e.target.value = '')
                    };

                    user.profile.avatar
                      ? updateAvatar.mutate({ file }, { ...callbacks })
                      : uploadAvatar.mutate({ file }, { ...callbacks });
                  }
                }}
              />
              <label
                htmlFor="avatar"
                className="flex cursor-pointer items-center"
              >
                {user.profile.avatar ? (
                  <>
                    {updateAvatar.isPending ? (
                      <>
                        <Icons.spinner
                          className={`${DROPDOWN_MENU_ICON_STYLES} animate-spin`}
                        />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Icons.edit className={DROPDOWN_MENU_ICON_STYLES} />
                        <span>Update photo</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {uploadAvatar.isPending ? (
                      <>
                        <Icons.spinner
                          className={`${DROPDOWN_MENU_ICON_STYLES} animate-spin`}
                        />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Icons.upload className={DROPDOWN_MENU_ICON_STYLES} />
                        <span>Upload photo</span>
                      </>
                    )}
                  </>
                )}
              </label>
            </DropdownMenuItem>
            {user.profile.avatar && (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();

                  deleteAvatar.mutate(undefined, {
                    onSuccess: () => setOpen(false)
                  });
                }}
              >
                {deleteAvatar.isPending ? (
                  <>
                    <>
                      <Icons.spinner
                        className={`${DROPDOWN_MENU_ICON_STYLES} animate-spin`}
                      />
                      <span>Deleting...</span>
                    </>
                  </>
                ) : (
                  <>
                    <Icons.trash
                      color="hsl(0 84.2% 60.2%)"
                      className={DROPDOWN_MENU_ICON_STYLES}
                    />
                    <span>Delete photo</span>
                  </>
                )}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative top-3 flex flex-col">
          <span className="mb-4 text-2xl font-semibold">{`${user.username}`}</span>
          <Dialog onOpenChange={() => setBio(user.profile.bio || '')}>
            <DialogTrigger>
              <span className="cursor-pointer">{`bio: ${
                user.profile.bio ?? 'no bio yet 😔'
              }`}</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit bio</DialogTitle>
                <DialogDescription>
                  Make changes to your bio here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <Input onChange={(e) => setBio(e.target.value)} value={bio} />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>{bio ? 'Save' : 'Empty bio'}</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Separator className="my-4" />
      <ul className="flex flex-col gap-5">
        <li>{`Your avatar likes: ${
          user.profile.avatar?.likes ?? 'no photo yet'
        } ❤️`}</li>
        <li>{`is profile activated: ${user.profile.isActivated}`}</li>
        <li>
          joined on:
          <time suppressHydrationWarning>
            {` ${formatDate(user.profile.createdAt)}`}
          </time>
        </li>
        <li>{`email: ${user.contacts.email.contact}`}</li>
        <li className="flex items-center gap-3">
          <span>{`email privacy [${
            user.contacts.email.isPublic ? 'public' : 'private'
          }]`}</span>
          <div className="flex items-center gap-3">
            <Switch
              checked={!user.contacts.email.isPublic}
              onCheckedChange={async () => {
                await toogleAuthorisedUserEmailPrivacy();
                // refresh();
              }}
            />
          </div>
        </li>
        <li>{`for instance only for authorised user profile info here...`}</li>
      </ul>
    </div>
  );
};
