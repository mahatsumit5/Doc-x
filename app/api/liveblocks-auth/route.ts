import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { redirect } from "next/navigation";

const liveblocks = new Liveblocks({
  secret:
    "sk_dev_z0iE6bWUH7MMQ6WPmXyfgvo5fTpSJ8Jc-8Yqp8Uo_SWLoKu3bQzRHzH6Wj_keEZp",
});

export async function POST(request: Request) {
  const clerkuser = await currentUser();
  // Get the current user from your database
  if (!clerkuser) redirect("/sign-in");

  const { id, firstName, lastName, imageUrl, emailAddresses } = clerkuser;
  const user = {
    id,
    info: {
      id,
      name: `${firstName} ${lastName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      color: getUserColor(id),
    },
  };

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.id,
      groupIds: [],
    },
    { userInfo: user.info }
  );

  return new Response(body, { status });
}
