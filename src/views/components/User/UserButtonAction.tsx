"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/views/components/ui/dropdown-menu";
import { Button } from "@/src/views/components/ui/button";
import { MoreHorizontal, User2Icon } from "lucide-react";

import EditForm from "./EditForm";
import DeleteUserForm from "./DeleteUser";
import { useUser } from "@/src/context/UserContext";
import { User } from "@/src/types";

const UserButtonAction = ({ selectedUser }: { selectedUser: User }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const { setUser } = useUser();

  console.log({selectedUser});

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer">
            <MoreHorizontal className="h-3.5 w-3.5" />
            <span className="sr-only">Menu aksi</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="text-xs">
          <DropdownMenuItem
            onClick={() => {
              if (selectedUser) {
                setUser(selectedUser);
                setIsOpen((prev) => !prev);
              }
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-destructive"
            onClick={() => {
              if (selectedUser) {
                setUser(selectedUser);
                setIsDelete((prev) => !prev);
              }
            }}
          >
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditForm isOpen={isOpen} setIsOpen={setIsOpen} />
      <DeleteUserForm isOpen={isDelete} setIsOpen={setIsDelete} />

    </>
  );
};

export default UserButtonAction;
