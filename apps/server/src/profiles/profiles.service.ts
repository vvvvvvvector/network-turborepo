import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Profile } from './entities/profile.entity';
import { Avatar } from './entities/avatar.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
  ) {}

  async updateBio(id: number, bio: string) {
    const profile = await this.getProfileByUserId(id);

    if (!bio) profile.bio = null;
    else profile.bio = bio;

    return this.profilesRepository.save(profile);
  }

  async removeAvatar(id: number) {
    const profile = await this.getProfileByUserId(id);

    profile.avatar.url = null;
    profile.avatar.likes = null;

    return this.profilesRepository.save(profile);
  }

  async saveAvatar(id: number, url: string) {
    const profile = await this.getProfileByUserId(id);

    if (!profile.avatar) {
      const avatar = new Avatar();

      avatar.url = url;
      avatar.likes = 0;

      profile.avatar = avatar;
    } else {
      profile.avatar.url = url;
      profile.avatar.likes = 0;
    }

    return this.profilesRepository.save(profile);
  }

  async updateAvatar(id: number, url: string) {
    const profile = await this.getProfileByUserId(id);

    profile.avatar.url = url;
    profile.avatar.likes = 0;

    return this.profilesRepository.save(profile);
  }

  async activateProfile(uuid: string) {
    try {
      const profile = await this.profilesRepository.findOneOrFail({
        where: { uuid },
      });

      profile.isActivated = true;

      return this.profilesRepository.save(profile);
    } catch (error) {
      throw new BadRequestException('Profile not found.');
    }
  }

  private async getProfileByUserId(id: number) {
    try {
      const profile = await this.profilesRepository.findOneOrFail({
        where: { user: { id } },
        relations: ['user', 'avatar'],
        select: {
          user: {
            id: true,
            username: true,
          },
        },
      });

      return profile;
    } catch (error) {
      throw new BadRequestException('Profile not found.');
    }
  }
}
