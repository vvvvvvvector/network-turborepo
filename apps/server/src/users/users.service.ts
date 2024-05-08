import * as _ from "lodash";
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { parseUserContacts } from "./utils";

import { User } from "./entities/user.entity";

import { SignUpUserDto } from "./dtos";

import { Profile } from "src/profiles/entities/profile.entity";
import { FriendRequestsService } from "src/friend-requests/friend-requests.service";
import { Avatar } from "src/profiles/entities/avatar.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => FriendRequestsService))
    private readonly friendRequestsService: FriendRequestsService
  ) {}

  async getMyUsernameById(id: number) {
    try {
      const { username } = await this.usersRepository.findOneOrFail({
        where: { id },
      });

      return {
        username,
      };
    } catch (error) {
      throw new BadRequestException("User not found.");
    }
  }

  async getUserById(id: number) {
    try {
      const data = await this.usersRepository.findOneOrFail({
        where: { id },
        relations: {
          profile: {
            avatar: true,
          },
          contacts: {
            email: true,
          },
        },
        select: {
          id: true,
          username: true,
          profile: {
            uuid: true,
            isActivated: true,
            bio: true,
            createdAt: true,
            avatar: {
              url: true,
              likes: true,
            },
          },
          contacts: {
            id: true,
            email: {
              contact: true,
              isPublic: true,
            },
          },
        },
      });

      return _.pick(data, ["username", "profile", "contacts.email"]);
    } catch (error) {
      throw new BadRequestException("User not found.");
    }
  }

  async getUserAvatarAndUsername(id: number) {
    try {
      // eslint-disable-next-line
      const { password, ...user } = await this.usersRepository.findOneOrFail({
        where: { id },
        relations: {
          profile: {
            avatar: true,
          },
        },
      });

      return {
        username: user.username,
        avatar: user.profile.avatar.url
          ? { url: user.profile.avatar.url }
          : null,
      };
    } catch (error) {
      throw new BadRequestException("User not found.");
    }
  }

  async isProfileActivated(id: number) {
    const { profile } = await this.getUserById(id);

    return profile.isActivated;
  }

  async createUser(dto: SignUpUserDto) {
    const profile = new Profile();

    profile.createdAt = new Date();
    profile.avatar = new Avatar();

    const user = this.usersRepository.create({
      username: dto.username,
      password: dto.password,
      profile,
      contacts: {
        email: {
          contact: dto.email,
        },
      },
    });

    const newUser = await this.usersRepository.save(user);

    return {
      uuid: newUser.profile.uuid,
      email: newUser.contacts.email.contact,
    };
  }

  async findUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        contacts: {
          email: {
            contact: email,
          },
        },
      },
    });
  }

  async findUserIdByUsername(username: string) {
    try {
      const { id } = await this.usersRepository.findOneOrFail({
        where: {
          username,
        },
      });

      return id;
    } catch (error) {
      throw new BadRequestException("User not found.");
    }
  }

  async findUserByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { username },
      relations: {
        profile: true,
      },
    });
  }

  async getAllUsersUsernamesWithIds() {
    return this.usersRepository.find({
      relations: {
        profile: {
          avatar: true,
        },
      },
      select: {
        id: true,
        username: true,
        profile: {
          uuid: true,
          avatar: {
            url: true,
          },
        },
      },
    });
  }

  async getUserPublicAvailableData(signedInUserId: number, username: string) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        relations: {
          profile: {
            avatar: true,
          },
          contacts: {
            email: true,
          },
        },
        select: {
          id: true,
          username: true,
          lastSeen: true,
          profile: {
            isActivated: true,
            createdAt: true,
            bio: true,
            avatar: {
              url: true,
              likes: true,
            },
          },
          contacts: {
            id: true,
            email: {
              contact: true,
              isPublic: true,
            },
          },
        },
        where: {
          username,
        },
      });

      const friendRequest = await this.friendRequestsService.alreadyFriends(
        signedInUserId,
        user.id
      );

      let extendedFriendRequestStatus = "";

      switch (friendRequest?.status) {
        case "accepted":
          extendedFriendRequestStatus = "friend";

          break;
        case "pending":
          extendedFriendRequestStatus =
            friendRequest.sender.id === signedInUserId
              ? "pending:receiver"
              : "pending:sender";

          break;
        case "rejected":
          extendedFriendRequestStatus =
            friendRequest.sender.id === signedInUserId
              ? "pending:receiver"
              : "rejected:sender";

          break;
        default:
          extendedFriendRequestStatus = "none";

          break;
      }

      return { extendedFriendRequestStatus, ...parseUserContacts(user) };
    } catch (error) {
      throw new BadRequestException("User not found.");
    }
  }

  async toogleEmailPrivacy(id: number) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { id },
        relations: {
          contacts: {
            email: true,
          },
        },
      });

      user.contacts.email.isPublic = !user.contacts.email.isPublic;

      const newUser = await this.usersRepository.save(user);

      return {
        email: {
          isPublic: newUser.contacts.email.isPublic,
        },
      };
    } catch (error) {
      throw new BadRequestException("User not found.");
    }
  }

  async updateLastSeenDateAndTime(id: number) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { id },
      });

      user.lastSeen = new Date();

      return this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException("User not found.");
    }
  }
}
