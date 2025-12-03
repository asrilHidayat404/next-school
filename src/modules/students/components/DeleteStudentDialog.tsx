"use client";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { DropdownMenuItem } from "@/src/views/components/ui/dropdown-menu";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/src/views/components/ui/alert";
import { Input } from "@/src/views/components/ui/input";
import { Trash, Delete } from "lucide-react";
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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DeleteStudentAction } from "../action/StudentAction";

export function DeleteStudentDialog({
  student_name,
  student_id,
  openDeleteDialog,
  setOpenDeleteDialog,
}: {
  student_name: string;
  student_id: string;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const [confirmationText, setConfirmationText] = useState("");

  const isConfirmed = confirmationText.trim() === student_name.trim();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleDelete = () => {
    startTransition(async () => {
      const res = await DeleteStudentAction(student_id);
      if (res.status == 200) {
        toast.success(res.message || "Data berhasi dihapus");
        router.refresh();
      } else {
        toast.error(res.message || "Something went wrong");
      }
    });
  };

  return (
    <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
          <AlertDialogDescription>
            Siswa <b>{student_name}</b> akan dihapus secara permanen dan tidak
            dapat dikembalikan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <main className="my-3">
          <Alert variant="destructive">
            <Trash className="h-5 w-5" />
            <AlertTitle>Konfirmasi Penghapusan</AlertTitle>
            <AlertDescription>
              <p className="mb-2 text-[10px]">
                Untuk melanjutkan, ketik nama siswa berikut:
                <span className="font-semibold"> {student_name}</span>
              </p>
              <Input
                type="text"
                name="deleteConfirmation"
                placeholder={`${student_name}`}
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
}
