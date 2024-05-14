import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const contract = c.router({
  getMyFriends: {
    method: "GET",
    path: "/friend-requests/accepted",
    responses: {
      201: z
        .object({
          username: z.string(),
          profile: z.object({
            avatar: z
              .object({
                url: z.string(),
              })
              .nullable(),
          }),
        })
        .array(),
    },
  },
});
