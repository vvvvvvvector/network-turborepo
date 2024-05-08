import { ApiProperty } from "@nestjs/swagger";

export class SendMessageDto {
  @ApiProperty({ default: "chat uuid" })
  chatId: string;

  @ApiProperty({ default: "someone' username" })
  receiver: string;

  @ApiProperty({ default: "hello world!" })
  content: string;
}
