"use client";

import { useState } from "react";
import { z } from "zod";
import { Controller } from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Avatar } from "@/components/avatar";
import { Icons } from "@/components/icons";

import { useProfileMutations } from "@/hooks/use-profile-mutations";
import { useCommonActions } from "@/hooks/use-common-actions";
import { useZodForm } from "@/hooks/use-zod-form";

import { DROPDOWN_MENU_ICON_STYLES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

import { getAuthorisedUserData } from "@/app/(authorised)/profile/api";

const schema = z.object({
  bio: z.string(),
  emailPrivacy: z.boolean(),
});

export const AuthorisedProfile = ({
  user,
}: {
  user: Awaited<ReturnType<typeof getAuthorisedUserData>>;
}) => {
  const [bioDialogOpen, setBioDialogOpen] = useState(false);
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);

  const form = useZodForm(schema, {
    defaultValues: {
      bio: user.profile.bio ?? "",
      emailPrivacy: !user.contacts.email.isPublic,
    },
  });

  const bio = form.watch("bio");

  const { openPhoto } = useCommonActions();

  const {
    updateAvatar,
    uploadAvatar,
    deleteAvatar,
    updateBio,
    toogleEmailPrivacy,
  } = useProfileMutations();

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
                avatar={user.profile.avatar?.url}
              />
              <span className="absolute bottom-2 right-2 size-6 rounded-full border-[3px] border-background bg-emerald-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {user.profile.avatar && (
              <DropdownMenuItem onClick={openPhoto(user.profile.avatar.url)}>
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
                      onSettled: () => (e.target.value = ""),
                    };

                    user.profile.avatar
                      ? updateAvatar.mutation.mutate(
                          {
                            newAvatar: file,
                            oldAvatarUrl: user.profile.avatar.url,
                          },
                          { ...callbacks }
                        )
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
                {user.profile.avatar
                  ? updateAvatarButton[
                      updateAvatar.mutation.isPending ? "pending" : "default"
                    ]
                  : uploadAvatarButton[
                      uploadAvatar.mutation.isPending ? "pending" : "default"
                    ]}
              </label>
            </DropdownMenuItem>
            {user.profile.avatar && (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();

                  deleteAvatar.mutation.mutate(
                    { avatarUrl: user.profile.avatar!.url },
                    {
                      onSuccess: () => setDropdownMenuOpen(false),
                    }
                  );
                }}
              >
                {
                  deleteAvatarButton[
                    deleteAvatar.mutation.isPending ? "pending" : "default"
                  ]
                }
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

              form.resetField("bio", {
                defaultValue: user.profile.bio ?? "",
              });
            }}
          >
            <DialogTrigger>
              <span className="cursor-pointer">{`bio: ${
                updateBio.mutation.isPending || updateBio.transitionIsPending
                  ? updateBio.mutation.variables?.bio.length !== 0
                    ? updateBio.mutation.variables?.bio
                    : "no bio yet 👀"
                  : user.profile.bio ?? "no bio yet 👀"
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
              <Input {...form.register("bio")} />
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
                  {bio ? "Save" : "Empty bio"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Separator className="my-4" />
      <ul className="flex flex-col gap-5">
        <li>{`Your avatar likes: ${
          user.profile.avatar?.likes ?? "no photo yet"
        } ❤️`}</li>
        <li>{`is profile activated: ${user.profile.isActivated}`}</li>
        <li>
          joined on:
          <time suppressHydrationWarning>
            {` ${formatDate(user.profile.createdAt)}`}
          </time>
        </li>
        <li className="flex justify-between">
          <span>{`email: ${user.contacts.email.contact}`}</span>
          <span className="flex items-center gap-3">
            <Controller
              name="emailPrivacy"
              control={form.control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => {
                    onChange(checked);
                    toogleEmailPrivacy.mutation.mutate();
                  }}
                />
              )}
            />
            <span>make private</span>
          </span>
        </li>
        <li>{`for instance only for authorised user profile info here...`}</li>
      </ul>
    </div>
  );
};

type AvatarControlsButtonState = "default" | "pending";

const updateAvatarButton: Record<AvatarControlsButtonState, React.JSX.Element> =
  {
    default: (
      <>
        <Icons.edit className={DROPDOWN_MENU_ICON_STYLES} />
        <span>Update photo</span>
      </>
    ),
    pending: (
      <>
        <Icons.spinner
          className={`${DROPDOWN_MENU_ICON_STYLES} animate-spin`}
        />
        <span>Updating...</span>
      </>
    ),
  };

const uploadAvatarButton: Record<AvatarControlsButtonState, React.JSX.Element> =
  {
    default: (
      <>
        <Icons.upload className={DROPDOWN_MENU_ICON_STYLES} />
        <span>Upload photo</span>
      </>
    ),
    pending: (
      <>
        <Icons.spinner
          className={`${DROPDOWN_MENU_ICON_STYLES} animate-spin`}
        />
        <span>Uploading...</span>
      </>
    ),
  };

const deleteAvatarButton: Record<AvatarControlsButtonState, React.JSX.Element> =
  {
    default: (
      <>
        <Icons.trash
          color="hsl(0 84.2% 60.2%)"
          className={DROPDOWN_MENU_ICON_STYLES}
        />
        <span>Delete photo</span>
      </>
    ),
    pending: (
      <>
        <Icons.spinner
          className={`${DROPDOWN_MENU_ICON_STYLES} animate-spin`}
        />
        <span>Deleting...</span>
      </>
    ),
  };
