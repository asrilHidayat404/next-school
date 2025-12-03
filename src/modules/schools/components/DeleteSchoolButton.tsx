"use client";
import { Button } from "@/src/views/components/ui/button";
import React, { Dispatch, SetStateAction, useState, useTransition } from "react";
import { DeleteSchoolAction } from "../action/SchoolAction";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/views/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/src/views/components/ui/dropdown-menu";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/views/components/ui/alert";
import { Delete, Trash } from "lucide-react";
import { Input } from "@/src/views/components/ui/input";

const DeleteSchoolButton = ({
  school_id,
  school_name,
  openDeleteDialog,
  setOpenDeleteDialog
}: {
  school_id: string;
  school_name: string;
  openDeleteDialog:boolean;
  setOpenDeleteDialog: Dispatch<SetStateAction<boolean>>
}) => {
  const [confirmationText, setConfirmationText] = useState("");

  const isConfirmed = confirmationText.trim() === school_name.trim();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleDelete = () => {
    startTransition(async () => {
      const res = await DeleteSchoolAction(school_id);
      if (res.status == 200) {
        toast.success(res.message || "Data berhasi diupdate");
        router.refresh();
      } else {
        toast.error(res.message || "Something went wrong");
      }
    });
  };
  return (
    <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
      <AlertDialogTrigger asChild>
          Hapus
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
          <AlertDialogDescription>
            <b>{school_name}</b> akan dihapus secara permanen dan tidak dapat
            dikembalikan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <main className="my-3">
          <Alert variant="destructive">
            <Trash className="h-5 w-5" />
            <AlertTitle>Konfirmasi Penghapusan</AlertTitle>
            <AlertDescription>
              <p className="mb-2 text-[10px]">
                Untuk melanjutkan, ketik nama kelas berikut:
                <span className="font-semibold"> {school_name}</span>
              </p>
              <Input
                type="text"
                name="deleteConfirmation"
                placeholder={`${school_name}`}
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
              />
            </AlertDescription>
          </Alert>
        </main>

        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (isConfirmed) {
                handleDelete();
                setConfirmationText("");
                setOpenDeleteDialog(false);
              }
            }}
            disabled={!isConfirmed}
            className={!isConfirmed ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSchoolButton;
