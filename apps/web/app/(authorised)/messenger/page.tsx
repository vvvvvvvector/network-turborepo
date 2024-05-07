import { type Metadata } from "next";

import { Separator } from "@/components/ui/separator";

import { ListOfChats } from "@/components/messenger/list-of-chats";

import { getAutorisedUserChats } from "@/app/(authorised)/messenger/api";
import { auth } from "@/app/(auth)/auth";

export const metadata: Metadata = {
  title: "Authorised / Messenger",
};

export default async function MessengerPage() {
  await auth();

  const chats = await getAutorisedUserChats();

  return (
    <div className="rounded-lg bg-background">
      <div className="p-5">
        <span>{`Chats [${chats.length}]`}</span>
        <Separator className="mt-5" />
      </div>
      <ListOfChats chats={chats} />
    </div>
  );
}
