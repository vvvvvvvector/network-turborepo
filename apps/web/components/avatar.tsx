import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import {
  Avatar as AvatarFromUI,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const avatarVariants = cva("", {
  variants: {
    size: {
      small: "size-10",
      medium: "size-[4.5rem]",
      large: "size-36",
    },
  },
  defaultVariants: {
    size: "small",
  },
});

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  username: string;
  avatar: string | undefined; // TODO: rename it later
  className?: string;
}

export const Avatar = ({ size, username, avatar, className }: AvatarProps) => {
  const uppercaseFirstLetterFallback = username[0].toLocaleUpperCase();

  return (
    <AvatarFromUI className={cn(avatarVariants({ size }), className)}>
      <AvatarImage src={avatar} />
      <AvatarFallback>{uppercaseFirstLetterFallback}</AvatarFallback>
    </AvatarFromUI>
  );
};
