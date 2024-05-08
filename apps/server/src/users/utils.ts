import { FriendRequest } from "src/friend-requests/entities/friend-request.entity";

export async function getExtendedFriendRequestStatus(
  friendRequest: FriendRequest,
  signedInUserId: number
) {
  switch (friendRequest?.status) {
    case "accepted":
      return "friend";
    case "pending":
      return friendRequest.sender.id === signedInUserId
        ? "pending:receiver"
        : "pending:sender";
    case "rejected":
      return friendRequest.sender.id === signedInUserId
        ? "pending:receiver"
        : "rejected:sender";
    default:
      return "none";
  }
}
