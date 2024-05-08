"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { PAGES } from "@/lib/constants";

export const FriendsOrRequestsNav = () => {
  const pathname = usePathname();

  return (
    <div className="rounded-lg bg-background p-5">
      <ul className="flex flex-col gap-2">
        <Link
          href={{
            pathname: PAGES.FRIENDS,
            query: {
              tab: "all",
            },
          }}
        >
          <li
            className={cn(
              "cursor-pointer rounded p-2 text-sm transition-[background-color] hover:bg-accent",
              {
                "bg-accent": pathname === PAGES.FRIENDS,
              }
            )}
          >
            My friends
          </li>
        </Link>
        <Link
          href={{
            pathname: PAGES.FRIENDS_REQUESTS,
            query: {
              type: "incoming",
            },
          }}
        >
          <li
            className={cn(
              "cursor-pointer rounded p-2 text-sm transition-[background-color] hover:bg-accent",
              {
                "bg-accent": pathname === PAGES.FRIENDS_REQUESTS,
              }
            )}
          >
            Friend requests
          </li>
        </Link>
      </ul>
    </div>
  );
};
