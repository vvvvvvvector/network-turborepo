import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { Chat } from "./entities/chat.entity";

import { UsersService } from "src/users/users.service";

import { ChatAlreadyExistsException } from "./exceptions/chat-already-exists";
import { ChatWithYourselfException } from "./exceptions/chat-with-yourself";
import { ChatNotFoundException } from "./exceptions/chat-not-found";

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    private readonly usersService: UsersService
  ) {}

  async updateChatLastMessage(
    id: string,
    content: string,
    lastMessageSentAt: Date
  ) {
    try {
      const chat = await this.chatsRepository.findOneOrFail({
        where: {
          id,
        },
      });

      chat.lastMessageContent = content;
      chat.lastMessageSentAt = lastMessageSentAt;

      return this.chatsRepository.save(chat);
    } catch (error) {
      throw new ChatNotFoundException();
    }
  }

  async getChatIdByAddresseeUsername(
    authorisedUserId: number,
    addresseeUsername: string
  ) {
    const chat = await this.chatsRepository.findOne({
      where: [
        {
          initiator: {
            id: authorisedUserId,
          },
          addressee: {
            username: addresseeUsername,
          },
        },
        {
          initiator: {
            username: addresseeUsername,
          },
          addressee: {
            id: authorisedUserId,
          },
        },
      ],
    });

    return chat ? chat.id : "";
  }

  async getChatData(authorisedUserUsername: string, id: string) {
    try {
      const chat = await this.chatsRepository.findOneOrFail({
        select: {
          id: true,
          messages: {
            id: true,
            content: true,
            createdAt: true,
            sender: {
              username: true,
            },
          },
          initiator: {
            username: true,
            lastSeen: true,
            profile: {
              isActivated: true,
              avatar: {
                url: true,
              },
            },
          },
          addressee: {
            username: true,
            lastSeen: true,
            profile: {
              isActivated: true,
              avatar: {
                url: true,
              },
            },
          },
        },
        relations: {
          initiator: {
            profile: {
              avatar: true,
            },
          },
          addressee: {
            profile: {
              avatar: true,
            },
          },
          messages: {
            sender: true,
          },
        },
        where: {
          id,
        },
        order: {
          messages: {
            createdAt: "ASC",
          },
        },
      });

      return {
        id: chat.id,
        messages: chat.messages,
        friendUsername:
          chat.initiator.username === authorisedUserUsername
            ? chat.addressee.username
            : chat.initiator.username,
        friendAvatar:
          chat.initiator.username === authorisedUserUsername
            ? chat.addressee.profile.avatar?.url || null
            : chat.initiator.profile.avatar?.url || null,
        friendLastSeen:
          chat.initiator.username === authorisedUserUsername
            ? chat.addressee.lastSeen
            : chat.initiator.lastSeen,
        authorisedUserUsername,
      };
    } catch (error) {
      throw new ChatNotFoundException();
    }
  }

  async initiateChat(signedInUserId: number, addresseeUsername: string) {
    const addresseeId =
      await this.usersService.findUserIdByUsername(addresseeUsername);

    if (signedInUserId === addresseeId) throw new ChatWithYourselfException();

    const existingChat = await this.chatsRepository.findOne({
      where: [
        {
          initiator: {
            id: signedInUserId,
          },
          addressee: {
            id: addresseeId,
          },
        },
        {
          initiator: {
            id: addresseeId,
          },
          addressee: {
            id: signedInUserId,
          },
        },
      ],
    });

    if (existingChat) throw new ChatAlreadyExistsException();

    const chat = this.chatsRepository.create({
      initiator: {
        id: signedInUserId,
      },
      addressee: {
        id: addresseeId,
      },
      lastMessageSentAt: null,
      lastMessageContent: null,
    });

    const { id } = await this.chatsRepository.save(chat);

    return id;
  }

  async getAllAuthorisedUserChats(signedInUserId: number) {
    const chats = await this.chatsRepository.find({
      relations: {
        initiator: {
          profile: {
            avatar: true,
          },
        },
        addressee: {
          profile: {
            avatar: true,
          },
        },
      },
      select: {
        id: true,
        lastMessageSentAt: true,
        lastMessageContent: true,
        addressee: {
          id: true,
          username: true,
          profile: {
            uuid: true,
            avatar: {
              url: true,
            },
          },
        },
        initiator: {
          id: true,
          username: true,
          profile: {
            uuid: true,
            avatar: {
              url: true,
            },
          },
        },
      },
      where: [
        {
          addressee: {
            id: signedInUserId,
          },
        },
        {
          initiator: {
            id: signedInUserId,
          },
        },
      ],
      order: {
        lastMessageSentAt: {
          direction: "DESC",
          nulls: "LAST",
        },
      },
    });

    return chats.map((chat) => ({
      id: chat.id,
      friendUsername:
        chat.initiator.id === signedInUserId
          ? chat.addressee.username
          : chat.initiator.username,
      friendAvatar:
        chat.initiator.id === signedInUserId
          ? chat.addressee.profile.avatar?.url || null
          : chat.initiator.profile.avatar?.url || null,
      lastMessageContent: chat.lastMessageContent,
      lastMessageSentAt: chat.lastMessageSentAt,
    }));
  }
}
