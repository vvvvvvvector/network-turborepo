import { User } from "./entities/user.entity";

export const parseUserContacts = (user: User) => {
  const { contacts, ...profileAndUsername } = user;

  // eslint-disable-next-line
  const { id, ...rest } = profileAndUsername;

  return contacts.email.isPublic
    ? {
        ...rest,
        contacts: {
          email: contacts.email,
        },
      }
    : {
        ...rest,
        contacts: {
          email: {
            isPublic: contacts.email.isPublic,
          },
        },
      };
};
