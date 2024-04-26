import { axiosApiInstance } from '@/axios';

const ROUTE = '/profiles';

// vvv ------------------mutations------------------ vvv

const updateBio = async (bio: string) => {
  await axiosApiInstance.put(`${ROUTE}/bio`, {
    bio
  });
};

const uploadAvatar = async (avatar: File) => {
  await fetch(
    `/api/avatar/upload?filename=${encodeURIComponent(avatar.name)}`,
    {
      method: 'POST',
      body: avatar
    }
  );
};

const updateAvatar = async (avatar: File) => {
  const formData = new FormData();

  formData.append('file', avatar);

  await axiosApiInstance.put(`${ROUTE}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const deleteAvatar = async (avatarUrl: string) => {
  await fetch(`/api/avatar/delete`, {
    method: 'DELETE',
    body: JSON.stringify({
      avatarUrl
    })
  });
};

const toogleAuthorisedUserEmailPrivacy = async () => {
  return (
    await axiosApiInstance.patch<{
      email: {
        isPublic: boolean;
      };
    }>(`/users/me/contacts/email/privacy`)
  ).data; // todo(refactor): users route -> profiles route
};

// ^^^ ------------------mutations------------------ ^^^

export {
  updateBio,
  uploadAvatar,
  updateAvatar,
  deleteAvatar,
  toogleAuthorisedUserEmailPrivacy
};
