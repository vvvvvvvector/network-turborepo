import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { getChatIdByAddresseeUsername, initiateChat } from "@/axios/chats";

import { PAGES } from "@/lib/constants";

export const useCommonActions = () => {
  const { push } = useRouter();

  const onClickGoToProfile = (username: string) => () => {
    push(`/${username}`);
  };

  const onClickOpenPhoto = (avatarUrl: string | undefined) => () => {
    if (avatarUrl) location.href = avatarUrl;
  };

  const onClickWriteMessage = (username: string) => async () => {
    try {
      const existingChatId = await getChatIdByAddresseeUsername(username); // Object.is(existingChatId, '') -> true

      if (existingChatId) {
        push(`${PAGES.MESSENGER}/${existingChatId}`);
      } else {
        const newlyInitiatedChatId = await initiateChat(username);

        push(`${PAGES.MESSENGER}/${newlyInitiatedChatId}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`${error.response?.data.message}`);
      }
    }
  };

  return {
    goToProfile: onClickGoToProfile,
    writeMessage: onClickWriteMessage,
    openPhoto: onClickOpenPhoto,
  };
};
