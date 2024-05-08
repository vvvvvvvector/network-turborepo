import { ApiProperty } from "@nestjs/swagger";
import { MaxLength } from "class-validator";

export class UploadAvatarDto {
  @ApiProperty({ default: "https://avatar-url-public.com/image.jpg" })
  url: string;
}

export class UpdateBioDto {
  @ApiProperty({ default: "hello world!" })
  @MaxLength(40)
  bio: string;
}
