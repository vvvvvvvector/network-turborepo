import { FriendProfile } from "@/components/profiles/friend-profile";
import { DefaultProfile } from "@/components/profiles/default-profile";

import { getNetworkUserPubliclyAvailableData } from "@/app/(authorised)/[username]/api";

export const NetworkUserProfile = ({
  user,
}: {
  user: Awaited<ReturnType<typeof getNetworkUserPubliclyAvailableData>>;
}) => {
  const intersectingProps = {
    username: user.username,
    profile: user.profile,
    lastSeen: user.lastSeen,
    contacts: user.contacts,
  };

  return user.extendedFriendRequestStatus === "friend" ? (
    <FriendProfile {...intersectingProps} />
  ) : (
    <DefaultProfile
      extendedFriendRequestStatus={user.extendedFriendRequestStatus}
      {...intersectingProps}
    />
  );
};
