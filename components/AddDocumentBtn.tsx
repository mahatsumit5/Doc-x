"use client";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { createDocuments } from "@/lib/actions/rooms.actions";
import { useRouter } from "next/navigation";

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();
  const addDocumenthandler = async () => {
    try {
      const room = await createDocuments({ userId, email });
      router.push(`/documents/${room.id}`);
      //   if (room)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      onClick={addDocumenthandler}
      className="gradient-blue flex gap-1 shadow-md"
    >
      <Image src={"/assets/icons/add.svg"} alt="asdf" height={24} width={24} />
      <p className="hidden sm:block ">Start a blank document</p>
    </Button>
  );
};

export default AddDocumentBtn;
