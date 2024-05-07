import { Friends } from "@/components/friends/friends";

import { getMyFriends } from "@/app/(authorised)/friends/api";
import { auth } from "@/app/(auth)/auth";

import { capitalize } from "@/lib/utils";

interface Props {
  searchParams: {
    tab: "all" | "online";
  };
}

export function generateMetadata({ searchParams }: Props) {
  return {
    title: `Friend ${searchParams.tab && `/ ${capitalize(searchParams.tab)}`}`,
  };
}

export default async function FriendsPage() {
  await auth();

  return <Friends users={await getMyFriends()} />;
}
