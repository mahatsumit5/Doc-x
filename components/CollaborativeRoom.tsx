"use client";
import React, { useEffect, useRef, useState } from "react";
import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import Header from "./Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Editor } from "./editor/Editor";
import ActiveCollaborator from "./ui/ActiveCollaborator";
import { Input } from "./ui/input";
import Image from "next/image";
import { updateDocuments } from "@/lib/actions/rooms.actions";
import Loader from "./Loader";
const CollaborativeRoom = ({
  roomId,
  roomMetadata,
}: CollaborativeRoomProps) => {
  const currentUserType = "editor";
  const [editing, setEditing] = useState(false);
  const [loading, setloading] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const containerRef = useRef<HTMLDivElement>(null);
  const InputRef = useRef<HTMLDivElement>(null);

  const updataTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setloading(true);
    }
    try {
      if (documentTitle !== roomMetadata.title) {
        const updatedDocument = await updateDocuments(roomId, documentTitle);
        if (updatedDocument) {
          setEditing(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setloading(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setEditing(false);
        updateDocuments(roomId, documentTitle);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [roomId, documentTitle]);

  useEffect(() => {
    if (editing && InputRef.current) {
      InputRef.current.focus();
    }
  }, [editing]);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            <div
              ref={containerRef}
              className="flex w-fit items-center justify-center gap-2"
            >
              {editing && !loading ? (
                <Input
                  type="text"
                  value={documentTitle}
                  ref={InputRef}
                  placeholder="Enter Title"
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onKeyDown={updataTitleHandler}
                  disabled={!editing}
                  className="document-title-input"
                />
              ) : (
                <>
                  <p className="document-title">{documentTitle}</p>
                </>
              )}

              {currentUserType === "editor" && !editing && (
                <Image
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  height={24}
                  width={24}
                  onClick={() => setEditing(true)}
                  className="pointer"
                />
              )}
              {currentUserType !== "editor" && !editing && (
                <p className="view-only-tag">view only</p>
              )}
            </div>
            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
              <ActiveCollaborator />
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </Header>
          <Editor />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
