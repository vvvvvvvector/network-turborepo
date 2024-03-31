import { useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  updateAvatar,
  uploadAvatar,
  deleteAvatar,
  updateBio
} from '@/axios/profiles';

import { TOKEN_NAME } from '@/lib/constants';

export const useProfileMutations = () => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const revalidate = () => {
    // update an avatar in the header
    queryClient.invalidateQueries({
      queryKey: [parseCookies()[TOKEN_NAME], 'username', 'and', 'avatar'] // Is it a good idea to put the token in queryKey? 🧐
    });

    // update an avatar on the profile page
    router.refresh();
  };

  const updateAvatarMutation = useMutation({
    mutationFn: ({ file }: { file: File }) => updateAvatar(file),
    onSuccess: () => {
      toast.success('Avatar was successfully updated.');
    },
    onSettled: () => revalidate()
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: ({ file }: { file: File }) => uploadAvatar(file),
    onSuccess: () => {
      toast.success('Avatar was successfully uploaded.');
    },
    onSettled: () => revalidate()
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: () => deleteAvatar(),
    onSuccess: () => {
      toast.success('Avatar was successfully deleted.');
    },
    onSettled: () => revalidate()
  });

  const [updateBioIsPending, startUpdateBioTransition] = useTransition();

  const updateBioMutation = useMutation({
    mutationFn: ({ bio }: { bio: string }) => updateBio(bio.trim()),
    onSuccess: () => {
      toast.success('Bio was successfully updated.');
    },
    onSettled: () => startUpdateBioTransition(() => router.refresh())
  });

  return {
    updateAvatar: updateAvatarMutation,
    uploadAvatar: uploadAvatarMutation,
    deleteAvatar: deleteAvatarMutation,
    updateBio: {
      mutation: updateBioMutation,
      transition: updateBioIsPending
    }
  };
};
