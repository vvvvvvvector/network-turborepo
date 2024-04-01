import { axiosApiInstance } from '@/axios';

const ROUTE = '/profiles';

// vvv ------------------mutations------------------ vvv

const updateBio = async (bio: string) => {
  await axiosApiInstance.put(`${ROUTE}/bio`, {
    bio
  });
};

const uploadAvatar = async (avatar: File) => {
  const formData = new FormData();

  formData.append('file', avatar);

  await axiosApiInstance.post(`${ROUTE}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
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

const deleteAvatar = async () => {
  await axiosApiInstance.delete(`${ROUTE}/avatar`);
};

const toogleAuthorisedUserEmailPrivacy = async () => {
  await axiosApiInstance.patch<{
    email: {
      isPublic: boolean;
    };
  }>(`/users/me/contacts/email/privacy`); // todo(refactor): users route -> profiles route
};

// ^^^ ------------------mutations------------------ ^^^

export {
  updateBio,
  uploadAvatar,
  updateAvatar,
  deleteAvatar,
  toogleAuthorisedUserEmailPrivacy
};
