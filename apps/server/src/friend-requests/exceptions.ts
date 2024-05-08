import { HttpException, HttpStatus } from "@nestjs/common";

export class MyselfFriendRequestException extends HttpException {
  constructor() {
    super("You cannot send friend request to yourself.", HttpStatus.FORBIDDEN);
  }
}

export class NotReceiverAcceptException extends HttpException {
  constructor() {
    super(
      "You can't accept this request because you aren't the receiver. Receiver decides to accept or to reject this friend request.",
      HttpStatus.FORBIDDEN
    );
  }
}

export class NotReceiverRejectException extends HttpException {
  constructor() {
    super(
      "You can't reject this request because you aren't the receiver. Receiver decides to accept or to reject this friend request.",
      HttpStatus.FORBIDDEN
    );
  }
}

export class RequestHasAlreadyBeenCreatedException extends HttpException {
  constructor() {
    super(
      "Friend request with this user has already been created.",
      HttpStatus.FORBIDDEN
    );
  }
}
