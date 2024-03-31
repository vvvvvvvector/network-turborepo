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
      revalidate();

      toast.success('Avatar was successfully updated.');
    }
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: ({ file }: { file: File }) => uploadAvatar(file),
    onSuccess: () => {
      revalidate();

      toast.success('Avatar was successfully uploaded.');
    }
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: () => deleteAvatar(),
    onSuccess: () => {
      revalidate();

      toast.success('Avatar was successfully deleted.');
    }
  });

  const updateBioMutation = useMutation({
    mutationFn: ({ bio }: { bio: string }) => updateBio(bio.trim()),
    onSuccess: () => {
      router.refresh();

      toast.success('Bio was successfully updated.');
    }
  });

  return {
    updateAvatar: updateAvatarMutation,
    uploadAvatar: uploadAvatarMutation,
    deleteAvatar: deleteAvatarMutation,
    updateBio: updateBioMutation
  };
};
