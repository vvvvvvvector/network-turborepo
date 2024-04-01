'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from 'react-hook-form';

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

const schema = z.object({
  bio: z.string(),
  emailPrivacy: z.boolean()
});

export const AuthorisedProfile = ({ user }: { user: AuthorisedUser }) => {
  const [bioDialogOpen, setBioDialogOpen] = useState(false);
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      bio: user.profile.bio ?? '',
      emailPrivacy: user.contacts.email.isPublic
    }
  });

  const bio = form.watch('bio');

  const { openPhoto } = useCommonActions();

  const { updateAvatar, uploadAvatar, deleteAvatar, updateBio } =
    useProfileMutations();

  return (
    <div className="rounded-lg bg-background p-5">
      <div className="flex items-center gap-5">
        <DropdownMenu
          open={dropdownMenuOpen}
          onOpenChange={setDropdownMenuOpen}
        >
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
                <span>Open photo</span>
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
                      onSuccess: () => setDropdownMenuOpen(false),
                      onSettled: () => (e.target.value = '')
                    };

                    user.profile.avatar
                      ? updateAvatar.mutation.mutate({ file }, { ...callbacks })
                      : uploadAvatar.mutation.mutate(
                          { file },
                          { ...callbacks }
                        );
                  }
                }}
              />
              <label
                htmlFor="avatar"
                className="flex cursor-pointer items-center"
              >
                {user.profile.avatar ? (
                  <>
                    {updateAvatar.mutation.isPending ? (
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
                    {uploadAvatar.mutation.isPending ? (
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

                  deleteAvatar.mutation.mutate(undefined, {
                    onSuccess: () => setDropdownMenuOpen(false)
                  });
                }}
              >
                {deleteAvatar.mutation.isPending ? (
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
          <Dialog
            open={bioDialogOpen}
            onOpenChange={(state) => {
              setBioDialogOpen(state);

              form.resetField('bio', {
                defaultValue: user.profile.bio ?? ''
              });
            }}
          >
            <DialogTrigger>
              <span className="cursor-pointer">{`bio: ${
                updateBio.mutation.isPending || updateBio.transitionIsPending
                  ? updateBio.mutation.variables?.bio.length !== 0
                    ? updateBio.mutation.variables?.bio
                    : 'no bio yet 👀'
                  : user.profile.bio ?? 'no bio yet 👀'
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
              <Input {...form.register('bio')} />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    updateBio.mutation.mutate({ bio });

                    setBioDialogOpen(false);
                  }}
                >
                  {bio ? 'Save' : 'Empty bio'}
                </Button>
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
            <Controller
              name="emailPrivacy"
              control={form.control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => {
                    onChange(checked);

                    // toogleAuthorisedUserEmailPrivacy mutation
                  }}
                />
              )}
            />
          </div>
        </li>
        <li>{`for instance only for authorised user profile info here...`}</li>
      </ul>
    </div>
  );
};
