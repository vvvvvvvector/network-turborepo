import { type Metadata } from 'next';

import { getChatData } from '@/app/(authorised)/messenger/api';
import { auth } from '@/app/(auth)/auth';

import { Chat } from '@/components/messenger/chat';

interface Props {
  params: {
    chatId: string;
  };
}

export const metadata: Metadata = {
  title: 'Messenger / Chat'
};

export default async function ChatPage({ params }: Props) {
  await auth();

  return (
    <div className="flex h-[calc(100vh-3.5rem-0.8rem-0.8rem)] flex-col gap-2 rounded-lg bg-background p-4">
      <Chat chat={await getChatData(params.chatId)} />
    </div>
  );
}
