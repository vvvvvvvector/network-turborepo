import { axiosApiInstance } from "@/axios";

const ROUTE = "/profiles";

// vvv ------------------mutations------------------ vvv

const updateBio = async (bio: string) => {
  await axiosApiInstance.put(`${ROUTE}/bio`, {
    bio,
  });
};

const uploadAvatar = async (avatar: File) => {
  try {
    const res = await fetch(
      `/api/avatar/upload?filename=${encodeURIComponent(avatar.name)}`,
      {
        method: "POST",
        body: avatar,
      }
    );
    console.log(await res.json());
  } catch (error) {
    throw new Error("Error while uploading avatar!");
  }
};

const deleteAvatar = async (avatarUrl: string) => {
  try {
    const res = await fetch(`/api/avatar/delete`, {
      method: "DELETE",
      body: JSON.stringify({
        avatarUrl,
      }),
    });
    console.log(await res.json());
  } catch (error) {
    throw new Error("Error while deleting avatar!");
  }
};

const updateAvatar = async (newAvatar: File, oldAvatarUrl: string) => {
  await deleteAvatar(oldAvatarUrl);
  await uploadAvatar(newAvatar);
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
  toogleAuthorisedUserEmailPrivacy,
};
