import Link from "next/link";

import { Separator } from "@/components/ui/separator";

import { RequestsList } from "@/components/friends/requests-list";

import { auth } from "@/app/(auth)/auth";
import {
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  getRejectedFriendRequests,
} from "@/app/(authorised)/friends/api";

import { PAGES } from "@/lib/constants";
import { capitalize, cn } from "@/lib/utils";

const types = ["incoming", "outgoing", "rejected"] as const;

interface Props {
  searchParams: {
    type: (typeof types)[number];
  };
}

export function generateMetadata({ searchParams }: Props) {
  return {
    title: `Requests ${searchParams.type && `/ ${capitalize(searchParams.type)}`}`,
  };
}

export default async function RequestsPage({ searchParams }: Props) {
  await auth();

  const [incoming, outgoing, rejected] = await Promise.all([
    getIncomingFriendRequests(),
    getOutgoingFriendRequests(),
    getRejectedFriendRequests(),
  ]);

  const getLength = (type: (typeof types)[number]) => {
    switch (type) {
      case "incoming":
        return incoming.length;
      case "outgoing":
        return outgoing.length;
      case "rejected":
        return rejected.length;
    }
  };

  return (
    <>
      <div className="text-sm">
        <ul className="flex gap-7">
          {types.map((type) => (
            <Link key={type} href={`${PAGES.FRIENDS_REQUESTS}?type=${type}`}>
              <li
                className={cn(
                  "cursor-pointer rounded p-2 px-[1rem] py-[0.5rem] transition-[background-color] hover:bg-accent",
                  {
                    "bg-accent": searchParams.type === type,
                  }
                )}
              >
                {`${capitalize(type)} [${getLength(type)}]`}
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <Separator className="my-4" />
      <RequestsList
        requests={{
          incoming,
          outgoing,
          rejected,
        }}
      />
    </>
  );
}
