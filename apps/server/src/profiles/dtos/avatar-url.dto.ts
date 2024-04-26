import { ApiProperty } from '@nestjs/swagger';

export class AvatarUrlDto {
  @ApiProperty({ default: 'https://avatar-url-public.com/image.jpg' })
  url: string;
}
