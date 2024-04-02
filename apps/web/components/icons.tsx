import {
  MessageCircle,
  Users,
  UserCircle,
  Newspaper,
  Image,
  Sun,
  MoonStar,
  Monitor,
  Network,
  LogOut,
  Settings,
  AlertTriangle,
  ChevronDown,
  Menu,
  Loader2,
  UserMinus,
  MessageSquare,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Check,
  Undo2,
  X,
  MoreVertical,
  SendHorizonal,
  Paperclip,
  Upload,
  Trash2,
  Pencil,
  Heart,
  UserPlus,
  UserCheck,
  Search,
  SearchSlash,
  Mailbox,
  UserSearch,
  UserX,
  ArrowUpRight,
  ArrowDownLeft,
  MonitorSmartphone
} from 'lucide-react';

import * as React from 'react';
import { cn } from '@/lib/utils';

type LucideIconProps = {
  type?: 'command-menu' | 'dropdown-menu' | 'nav';
} & (typeof UserCircle)['defaultProps'];

const Icon = ({
  type,
  children,
  ...props
}: React.PropsWithChildren<LucideIconProps> & {
  commandMenu?: boolean;
}) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(
        'size-4',
        props.className,
        {
          'mr-2': type === 'command-menu' || type === 'dropdown-menu'
        },
        {
          'mr-1 size-5': type === 'nav'
        }
      ),
      ...props
    });
  }
};

export const Icons = {
  myProfile: (props: LucideIconProps) => (
    <Icon {...props}>
      <UserCircle />
    </Icon>
  ),
  news: (props: LucideIconProps) => (
    <Icon {...props}>
      <Newspaper />
    </Icon>
  ),
  photos: (props: LucideIconProps) => (
    <Icon {...props}>
      <Image />
    </Icon>
  ),
  messenger: (props: LucideIconProps) => (
    <Icon {...props}>
      <MessageCircle />
    </Icon>
  ),
  friends: (props: LucideIconProps) => (
    <Icon {...props}>
      <Users />
    </Icon>
  ),
  lightMode: (props: LucideIconProps) => (
    <Icon {...props}>
      <Sun />
    </Icon>
  ),
  darkMode: (props: LucideIconProps) => (
    <Icon {...props}>
      <MoonStar />
    </Icon>
  ),
  systemMode: (props: LucideIconProps) => (
    <Icon {...props}>
      <Monitor />
    </Icon>
  ),
  appLogo: (props: LucideIconProps) => (
    <Icon {...props}>
      <Network />
    </Icon>
  ),
  signOut: (props: LucideIconProps) => (
    <Icon {...props}>
      <LogOut />
    </Icon>
  ),
  settings: (props: LucideIconProps) => (
    <Icon {...props}>
      <Settings />
    </Icon>
  ),
  alertTriangle: (props: LucideIconProps) => (
    <Icon {...props}>
      <AlertTriangle />
    </Icon>
  ),
  arrowDown: (props: LucideIconProps) => (
    <Icon {...props}>
      <ChevronDown />
    </Icon>
  ),
  arrowLeft: (props: LucideIconProps) => (
    <Icon {...props}>
      <ChevronLeft />
    </Icon>
  ),
  arrowRight: (props: LucideIconProps) => (
    <Icon {...props}>
      <ChevronRight />
    </Icon>
  ),
  mobileMenu: (props: LucideIconProps) => (
    <Icon {...props}>
      <Menu />
    </Icon>
  ),
  spinner: (props: LucideIconProps) => (
    <Icon {...props}>
      <Loader2 />
    </Icon>
  ),
  unfriend: (props: LucideIconProps) => (
    <Icon {...props}>
      <UserMinus />
    </Icon>
  ),
  writeMessage: (props: LucideIconProps) => (
    <Icon {...props}>
      <MessageSquare />
    </Icon>
  ),
  moreHorizontal: (props: LucideIconProps) => (
    <Icon {...props}>
      <MoreHorizontal />
    </Icon>
  ),
  moreVertical: (props: LucideIconProps) => (
    <Icon {...props}>
      <MoreVertical />
    </Icon>
  ),
  accept: (props: LucideIconProps) => (
    <Icon {...props}>
      <Check />
    </Icon>
  ),
  undo: (props: LucideIconProps) => (
    <Icon {...props}>
      <Undo2 />
    </Icon>
  ),
  reject: (props: LucideIconProps) => (
    <Icon {...props}>
      <X />
    </Icon>
  ),
  sendMessage: (props: LucideIconProps) => (
    <Icon {...props}>
      <SendHorizonal />
    </Icon>
  ),
  attach: (props: LucideIconProps) => (
    <Icon {...props}>
      <Paperclip />
    </Icon>
  ),
  upload: (props: LucideIconProps) => (
    <Icon {...props}>
      <Upload />
    </Icon>
  ),
  trash: (props: LucideIconProps) => (
    <Icon {...props}>
      <Trash2 />
    </Icon>
  ),
  edit: (props: LucideIconProps) => (
    <Icon {...props}>
      <Pencil />
    </Icon>
  ),
  heart: (props: LucideIconProps) => (
    <Icon {...props}>
      <Heart />
    </Icon>
  ),
  addUser: (props: LucideIconProps) => (
    <Icon {...props}>
      <UserPlus />
    </Icon>
  ),
  acceptUser: (props: LucideIconProps) => (
    <Icon {...props}>
      <UserCheck />
    </Icon>
  ),
  searchUser: (props: LucideIconProps) => (
    <Icon {...props}>
      <UserSearch />
    </Icon>
  ),
  rejectUser: (props: LucideIconProps) => (
    <Icon {...props}>
      <UserX />
    </Icon>
  ),
  search: (props: LucideIconProps) => (
    <Icon {...props}>
      <Search />
    </Icon>
  ),
  resetSearch: (props: LucideIconProps) => (
    <Icon {...props}>
      <SearchSlash />
    </Icon>
  ),
  requests: (props: LucideIconProps) => (
    <Icon {...props}>
      <Mailbox />
    </Icon>
  ),
  outgoingRequests: (props: LucideIconProps) => (
    <Icon {...props}>
      <ArrowUpRight />
    </Icon>
  ),
  incomingRequests: (props: LucideIconProps) => (
    <Icon {...props}>
      <ArrowDownLeft />
    </Icon>
  ),
  online: (props: LucideIconProps) => (
    <Icon {...props}>
      <MonitorSmartphone />
    </Icon>
  )
};
