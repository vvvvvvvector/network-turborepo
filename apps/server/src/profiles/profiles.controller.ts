import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ROUTES, SWAGGER_API_TAGS } from 'src/utils/constants';

import { ProfilesService } from './profiles.service';

import { UpdateBioDto } from './dtos/bio.dto';
import { AvatarUrlDto } from './dtos/avatar-url.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags(SWAGGER_API_TAGS.PROFILES)
@Controller(ROUTES.PROFILES)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Put('/bio')
  async updateBio(@Req() req, @Body() dto: UpdateBioDto) {
    return this.profilesService.updateBio(req.user.id, dto.bio);
  }

  @Post('/avatar')
  async uploadAvatar(@Req() req, @Body() dto: AvatarUrlDto) {
    return this.profilesService.saveAvatar(req.user.id, dto.url);
  }

  @Put('/avatar')
  async updateAvatar(@Req() req, @Body() dto: AvatarUrlDto) {
    return this.profilesService.updateAvatar(req.user.id, dto.url);
  }

  @Delete('/avatar')
  async removeAvatar(@Req() req) {
    return this.profilesService.removeAvatar(req.user.id);
  }
}
