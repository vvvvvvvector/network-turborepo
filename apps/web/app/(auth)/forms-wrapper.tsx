"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";

import { PAGES } from "@/lib/constants";

export function FormsWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isSignInPage = pathname === PAGES.SIGN_IN;

  return (
    <div className="grid size-full place-items-center dark:bg-neutral-900">
      <div className="w-full max-w-[350px] space-y-7">
        <h3 className="text-center text-lg font-medium">{`${
          isSignInPage ? "Hello 👋" : "Create your account"
        }`}</h3>
        {children}
        <Separator />
        <div className="space-x-4 text-center text-sm text-muted-foreground">
          <span>{`${
            isSignInPage ? "Don't have an account?" : "Already have an account?"
          }`}</span>
          <Link
            href={isSignInPage ? PAGES.SIGN_UP : PAGES.SIGN_IN}
            className="hover:text-foreground hover:underline dark:hover:text-foreground"
          >
            {`${isSignInPage ? "Sign up" : "Sign in"}`}
          </Link>
        </div>
      </div>
    </div>
  );
}
