import { HttpException, HttpStatus } from "@nestjs/common";

export class EmailExistsException extends HttpException {
  constructor() {
    super("User with this email already exists.", HttpStatus.FORBIDDEN);
  }
}

export class ProfileNotActivatedException extends HttpException {
  constructor() {
    super("This profile is not activated.", HttpStatus.UNAUTHORIZED);
  }
}

export class UsernameExistsException extends HttpException {
  constructor() {
    super("User with this username already exists.", HttpStatus.FORBIDDEN);
  }
}
