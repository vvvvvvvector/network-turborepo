import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty } from "class-validator";

export class RequestActionDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
}
