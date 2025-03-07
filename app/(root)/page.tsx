import AddDocumentBtn from "@/components/AddDocumentBtn";
import Header from "@/components/Header";
import { getAllDocuments } from "@/lib/actions/rooms.actions";
import { dateConverter } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Home = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");
  const documents = await getAllDocuments(
    clerkUser.emailAddresses[0].emailAddress
  );
  console.log(documents);
  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          Notification
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
      {documents.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold ">All documents</h3>
            <AddDocumentBtn
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
          <ul className="document-ul">
            {documents.data.map(({ id, metadata, createdAt }: any) => {
              return (
                <li key={id} className="document-list-item">
                  <Link
                    href={`/documents/${id}`}
                    className="fle flex-1 gap-4 items-center"
                  >
                    <div className=" hidden rounded-md bg-500 p-2 sm:block">
                      <Image
                        src={"/assets/icons/doc.svg"}
                        alt="file"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="line-clamp-1  text-lg">{metadata.title}</p>
                      <p className="text-sm font-light text-blue-100 ">
                        {dateConverter(createdAt)}
                        Created About
                      </p>
                    </div>
                  </Link>
                  {/* todo delete button */}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="document-list-empty">
          <Image
            src={"/assets/icons/doc.svg"}
            alt="document"
            width={40}
            height={40}
          />
          <AddDocumentBtn
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
};

export default Home;
