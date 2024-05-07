import { type SetStateAction, useState } from "react";
import Link, { type LinkProps } from "next/link";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { Icons } from "@/components/icons";

import { MAIN_NAV_PAGES as pages } from "@/lib/constants";
import { capitalize } from "@/lib/utils";

export const icon = (type: (typeof pages)[number], size: number) => {
  switch (type) {
    case "/profile":
      return <Icons.myProfile size={size} />;
    case "/news":
      return <Icons.news size={size} />;
    case "/messenger":
      return <Icons.messenger size={size} />;
    case "/friends":
      return <Icons.friends size={size} />;
    case "/photos":
      return <Icons.photos size={size} />;
    default:
      const _: never = type; // eslint-disable-line
      throw "Not all cases are covered";
  }
};

export const menuItemName = (type: (typeof pages)[number]) => {
  const pathname = type.slice(1);

  switch (type) {
    case "/profile":
      return `My ${pathname}`;
    default:
      return capitalize(pathname);
  }
};

export const query = (type: (typeof pages)[number]) => {
  switch (type) {
    case "/friends":
      return {
        tab: "all",
      };
    default:
      return undefined;
  }
};

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen} defaultOpen={open}>
      <SheetTrigger asChild>
        <Button
          className="hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-1 focus-visible:ring-offset-0"
          variant="ghost"
          size="icon"
        >
          <Icons.mobileMenu />
          <span className="sr-only">open mobile menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-7" side="left">
        <MobileLink
          href="news"
          onOpenChange={setOpen}
          className="flex items-center"
        >
          {/* <Icons.appLogo className='mr-3 size-7' /> */}
          <span className="ml-8 text-2xl font-bold">Network</span>
        </MobileLink>
        <div className="flex flex-col gap-10 pl-8">
          {pages.map((page) => (
            <MobileLink
              key={page}
              className="flex items-center"
              href={{
                pathname: page,
                query: query(page),
              }}
              onOpenChange={setOpen}
            >
              {icon(page, 20)}
              <span className="ml-2">{menuItemName(page)}</span>
            </MobileLink>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface MobileLinkProps extends LinkProps {
  onOpenChange: React.Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  className?: string;
}

const MobileLink = ({
  className,
  onOpenChange,
  children,
  ...props
}: MobileLinkProps) => {
  return (
    <Link
      className={className}
      onClick={() => {
        onOpenChange(false);
      }}
      {...props}
    >
      {children}
    </Link>
  );
};

export { MobileNav };
