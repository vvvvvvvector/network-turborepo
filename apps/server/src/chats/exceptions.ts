import { HttpException, HttpStatus } from "@nestjs/common";

export class ChatAlreadyExistsException extends HttpException {
  constructor() {
    super("The chat already exists", HttpStatus.FORBIDDEN);
  }
}

export class ChatNotFoundException extends HttpException {
  constructor() {
    super("Chat not found.", HttpStatus.NOT_FOUND);
  }
}

export class ChatWithYourselfException extends HttpException {
  constructor() {
    super("You can't initiate chat with yourself.", HttpStatus.FORBIDDEN);
  }
}
