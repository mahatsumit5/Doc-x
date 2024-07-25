import React from "react";
import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocuments } from "@/lib/actions/rooms.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");
  const room = await getDocuments({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });
  if (!room) redirect("/");

  // todo:asess the permission of the users to access the documents
  return (
    <main className="flex w-full items-center flex-col">
      <CollaborativeRoom roomId={id} roomMetadata={room.metadata} />
    </main>
  );
};

export default Document;
