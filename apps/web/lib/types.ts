type CreateAvatar<T> = {
  avatar: T | null;
};

type CreateProfile<T> = {
  profile: T;
};

export type BaseFriendRequestStatus = "rejected" | "accepted" | "pending";

export type ExtendedFriendRequestStatus =
  | "friend"
  | "pending:sender"
  | "pending:receiver"
  | "rejected:sender"
  | "none";

export type UserFromListOfUsers = Pick<User, "username"> &
  ProfileWithAvatarWithoutLikes;

export type NetworkUser = NetworkUserProfile &
  NetworkUserContacts &
  User & {
    extendedFriendRequestStatus: ExtendedFriendRequestStatus;
  };

export type AuthorisedUser = AuthorisedUserProfile &
  AuthorisedUserContacts &
  User;

export type User = {
  username: string;
  lastSeen: string;
};

export type Avatar = {
  url: string;
  likes: number;
};

type Profile = {
  uuid: string;
  isActivated: boolean;
  createdAt: string;
  bio: string | null;
};

export type AvatarWithoutLikes = CreateAvatar<Pick<Avatar, "url">>;

export type ProfileWithAvatarWithoutLikes = CreateProfile<AvatarWithoutLikes>;

type NetworkUserProfile = CreateProfile<
  Omit<Profile, "uuid"> & CreateAvatar<Avatar>
>;

type AuthorisedUserProfile = CreateProfile<Profile & CreateAvatar<Avatar>>;

type Contacts<TEmail> = {
  contacts: {
    email: TEmail;
  };
};

type NetworkUserContacts = Contacts<
  | {
      isPublic: true;
      contact: string;
    }
  | {
      isPublic: false;
    }
>;

type AuthorisedUserContacts = Contacts<{
  isPublic: boolean;
  contact: string;
}>;

export type ChatFromListOfChats = {
  id: string;
  friendUsername: string;
  friendAvatar: string | null;
  lastMessageContent: string | null;
  lastMessageSentAt: string | null;
};

export type Message = {
  id: number;
  content: string;
  createdAt: string;
  sender: {
    username: string;
  };
};

export type Chat = {
  id: string;
  authorisedUserUsername: string;
  friendUsername: string;
  friendAvatar: string | null;
  friendLastSeen: string;
  messages: Array<Message>;
};
