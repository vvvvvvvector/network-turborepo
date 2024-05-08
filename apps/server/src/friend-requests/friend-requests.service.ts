import * as _ from "lodash";
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { FriendRequest } from "./entities/friend-request.entity";

import { UsersService } from "src/users/users.service";

import {
  RequestHasAlreadyBeenCreatedException,
  MyselfFriendRequestException,
  NotReceiverRejectException,
  NotReceiverAcceptException,
} from "./exceptions";

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestsRepository: Repository<FriendRequest>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}

  async networkUsersUsernames(
    signedInUserId: number,
    pageFromQuery: string,
    usernameFromQuery: string
  ) {
    let users = (await this.usersService.getAllUsersUsernamesWithIds()).filter(
      (user) => user.id !== signedInUserId
    );

    if (usernameFromQuery) {
      users = users.filter((user) =>
        user.username
          .toLowerCase()
          .includes(usernameFromQuery.toLocaleLowerCase())
      );
    }

    const requests = await this.friendRequestsRepository.find({
      relations: {
        sender: true,
        receiver: true,
      },
      select: {
        status: true,
        sender: {
          id: true,
        },
        receiver: {
          id: true,
        },
      },
    });

    const page = +pageFromQuery || 1;
    const usersPerPage = 4;

    return {
      limit: usersPerPage,
      pages: Math.ceil(users.length / usersPerPage),
      users: users
        .slice((page - 1) * usersPerPage, usersPerPage * page)
        .map((user) => {
          let requestStatus = "none";

          for (let i = 0; i < requests.length; i++) {
            if (
              (requests[i].receiver.id === user.id &&
                requests[i].sender.id === signedInUserId) ||
              (requests[i].receiver.id === signedInUserId &&
                requests[i].sender.id === user.id)
            )
              requestStatus = requests[i].status;
          }

          return {
            ..._.pick(user, ["username", "profile.avatar"]),
            requestStatus,
          };
        }),
    };
  }

  async acceptedFriendRequests(
    signedInUserId: number,
    signedInUserUsername: string
  ) {
    const accepted = await this.friendRequestsRepository.find({
      relations: {
        sender: {
          profile: {
            avatar: true,
          },
        },
        receiver: {
          profile: {
            avatar: true,
          },
        },
      },
      select: {
        createdAt: true,
        sender: {
          username: true,
          profile: {
            createdAt: true,
            avatar: {
              url: true,
            },
          },
        },
        receiver: {
          username: true,
          profile: {
            createdAt: true,
            avatar: {
              url: true,
            },
          },
        },
      },
      where: [
        {
          sender: {
            id: signedInUserId,
          },
          status: "accepted",
        },
        {
          receiver: {
            id: signedInUserId,
          },
          status: "accepted",
        },
      ],
    });

    return accepted.map(({ sender, receiver }) =>
      sender.username === signedInUserUsername
        ? _.pick(receiver, ["username", "profile.avatar"])
        : _.pick(sender, ["username", "profile.avatar"])
    );
  }

  async incomingFriendRequests(signedInUserId: number) {
    const incoming = await this.friendRequestsRepository.find({
      relations: {
        sender: {
          profile: {
            avatar: true,
          },
        },
      },
      select: {
        createdAt: true,
        sender: {
          username: true,
          profile: {
            createdAt: true,
            avatar: {
              url: true,
            },
          },
        },
      },
      where: {
        receiver: {
          id: signedInUserId,
        },
        status: "pending",
      },
    });

    return incoming.map(({ sender }) =>
      _.pick(sender, ["username", "profile.avatar"])
    );
  }

  async sentFriendRequests(signedInUserId: number) {
    const sent = await this.friendRequestsRepository.find({
      relations: {
        receiver: {
          profile: { avatar: true },
        },
      },
      select: {
        createdAt: true,
        receiver: {
          username: true,
          profile: {
            createdAt: true,
            avatar: {
              url: true,
            },
          },
        },
      },
      where: {
        sender: {
          id: signedInUserId,
        },
        status: In(["pending", "rejected"]),
      },
    });

    return sent.map(({ receiver }) =>
      _.pick(receiver, ["username", "profile.avatar"])
    );
  }

  async rejectedFriendRequests(signedInUserId: number) {
    const rejected = await this.friendRequestsRepository.find({
      relations: {
        sender: {
          profile: {
            avatar: true,
          },
        },
      },
      select: {
        createdAt: true,
        sender: {
          username: true,
          profile: {
            createdAt: true,
            avatar: {
              url: true,
            },
          },
        },
      },
      where: {
        receiver: {
          id: signedInUserId,
        },
        status: "rejected",
      },
    });

    return rejected.map(({ sender }) =>
      _.pick(sender, ["username", "profile.avatar"])
    );
  }

  async accept(signedInUserUsername: string, requestSenderUsername: string) {
    try {
      const friendRequest = await this.friendRequestsRepository.findOne({
        where: {
          sender: {
            username: requestSenderUsername,
          },
          receiver: {
            username: signedInUserUsername,
          },
        },
      });

      friendRequest.status = "accepted";

      return this.friendRequestsRepository.save(friendRequest);
    } catch (error) {
      throw new NotReceiverAcceptException();
    }
  }

  async reject(signedInUserUsername: string, requestSenderUsername: string) {
    try {
      const friendRequest = await this.friendRequestsRepository.findOneOrFail({
        where: {
          sender: {
            username: requestSenderUsername,
          },
          receiver: {
            username: signedInUserUsername,
          },
        },
      });

      friendRequest.status = "rejected";

      return this.friendRequestsRepository.save(friendRequest);
    } catch (error) {
      throw new NotReceiverRejectException();
    }
  }

  async unfriend(senderId: number, receiverUsername: string) {
    const receiverId =
      await this.usersService.findUserIdByUsername(receiverUsername);

    const friendRequest = await this.friendRequestsRepository.findOne({
      relations: {
        receiver: true,
        sender: true,
      },
      where: [
        {
          sender: {
            id: senderId,
          },
          receiver: {
            id: receiverId,
          },
        },
        {
          sender: {
            id: receiverId,
          },
          receiver: {
            id: senderId,
          },
        },
      ],
    });

    friendRequest.sender.id = receiverId;
    friendRequest.receiver.id = senderId;
    friendRequest.status = "rejected";

    return this.friendRequestsRepository.save(friendRequest);
  }

  async cancel(signedInUserUsername: string, receiverUsername: string) {
    const friendRequest = await this.friendRequestsRepository.findOne({
      relations: {
        receiver: true,
        sender: true,
      },
      where: [
        {
          sender: {
            username: signedInUserUsername,
          },
          receiver: {
            username: receiverUsername,
          },
        },
      ],
    });

    return this.friendRequestsRepository.remove(friendRequest);
  }

  async create(senderId: number, receiverUsername: string) {
    const receiverId =
      await this.usersService.findUserIdByUsername(receiverUsername);

    if (senderId === receiverId) throw new MyselfFriendRequestException();

    const alreadyFriends = await this.alreadyFriends(senderId, receiverId);

    if (alreadyFriends) throw new RequestHasAlreadyBeenCreatedException();

    const friendRequest = this.friendRequestsRepository.create({
      sender: {
        id: senderId,
      },
      receiver: {
        id: receiverId,
      },
      status: "pending",
    });

    return this.friendRequestsRepository.save(friendRequest);
  }

  async alreadyFriends(senderId: number, receiverId: number) {
    return this.friendRequestsRepository.findOne({
      relations: {
        receiver: true,
        sender: true,
      },
      select: {
        id: true,
        status: true,
        sender: {
          id: true,
        },
        receiver: {
          id: true,
        },
      },
      where: [
        {
          sender: {
            id: senderId,
          },
          receiver: {
            id: receiverId,
          },
        },
        {
          sender: {
            id: receiverId,
          },
          receiver: {
            id: senderId,
          },
        },
      ],
    });
  }
}
