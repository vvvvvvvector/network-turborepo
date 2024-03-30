import { type ChangeEvent } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useQueryClient } from '@tanstack/react-query';

import {
  updateBio,
  deleteAvatar,
  updateAvatar,
  uploadAvatar
} from '@/axios/profiles';

import { TOKEN_NAME } from '@/lib/constants';

export const useProfileActions = (
  controlDropdown?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();

  const { refresh } = useRouter();

  const revalidate = () => {
    // update an avatar in the header
    queryClient.invalidateQueries({
      queryKey: [parseCookies()[TOKEN_NAME], 'username', 'and', 'avatar'] // Is it a good idea to put the token in queryKey? 🧐
    });

    // update an avatar on the profile page
    refresh();

    controlDropdown && controlDropdown(false);
  };

  const onAvatarUpdate = () => {
    return async (e: ChangeEvent<HTMLInputElement>) => {
      try {
        if (e.target.files instanceof FileList) {
          await updateAvatar(e.target.files[0]);
        }

        toast.success('An avatar was successfully updated.');

        e.target.value = '';

        revalidate();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(`${error.response?.data.message}`);
        }
      }
    };
  };

  const onAvatarUpload = () => {
    return async (e: ChangeEvent<HTMLInputElement>) => {
      try {
        if (e.target.files instanceof FileList) {
          await uploadAvatar(e.target.files[0]);
        }

        toast.success('An avatar was successfully uploaded.');

        e.target.value = '';

        revalidate();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(`${error.response?.data.message}`);
        }
      }
    };
  };

  const onAvatarDelete = () => {
    return async () => {
      try {
        await deleteAvatar();

        toast.success('An avatar was successfully deleted.');

        revalidate();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(`${error.response?.data.message}`);
        }
      }
    };
  };

  const onUpdateBio = (bio: string) => {
    return async () => {
      try {
        await updateBio(bio);

        toast.success('Bio was successfully updated.');

        refresh();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(`${error.response?.data.message}`);
        }
      }
    };
  };

  return {
    updateAvatar: onAvatarUpdate,
    uploadAvatar: onAvatarUpload,
    deleteAvatar: onAvatarDelete,
    updateBio: onUpdateBio
  };
};
