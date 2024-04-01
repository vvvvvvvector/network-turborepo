import { axiosApiInstance } from '@/axios';

export const CHATS_ROUTE = '/chats';

const initiateChat = async (addresseeUsername: string) => {
  const { data: id } = await axiosApiInstance.post<string>(`${CHATS_ROUTE}`, {
    addresseeUsername
  });

  return id;
};

const getChatIdByAddresseeUsername = async (addresseeUsername: string) => {
  const { data: id } = await axiosApiInstance.get<string>(
    `${CHATS_ROUTE}/between-users-chat-id?addressee=${addresseeUsername}`
  );

  return id;
};

export { initiateChat, getChatIdByAddresseeUsername };
