import { type Metadata } from "next";

import { auth } from "@/app/(auth)/auth";

export const metadata: Metadata = {
  title: "Authorised / News",
};

export default async function NewsPage() {
  await auth();

  return <div className="rounded-lg bg-background p-5">News</div>;
}
