import { z } from "zod";
import { cookies } from "next/headers";
import { del } from "@vercel/blob";

import { TOKEN_NAME } from "@/lib/constants";

export const runtime = "edge";

const bodySchema = z.object({
  avatarUrl: z.string(),
});

export async function DELETE(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());

    const cookiesStore = cookies();
    const token = cookiesStore.get(TOKEN_NAME);

    await del(body.avatarUrl);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/avatar`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    return Response.json({
      message: "Avatar was successfully deleted!",
    });
  } catch (error) {
    return new Response(`Error while deleting avatar!`, {
      status: 500,
    });
  }
}
