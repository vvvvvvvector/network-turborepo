import { type Metadata } from "next";

import { AuthorisedProfile } from "@/components/profiles/authorised-profile";

import { getAuthorisedUserData } from "@/app/(authorised)/profile/api";
import { auth } from "@/app/(auth)/auth";

export const metadata: Metadata = {
  title: "Authorised / My Profile",
};

export default async function ProfilePage() {
  await auth();

  return <AuthorisedProfile user={await getAuthorisedUserData()} />;
}
