"use client";

import Link from "next/link";
import {
  Building,
  Edit,
  LucideEye,
  MoreHorizontal,
  Trash2,
  User2Icon,
  Users,
  Users2,
} from "lucide-react";
import { Button } from "@/src/views/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/views/components/ui/dropdown-menu";
import { SetHomeroomTeacherDialog } from "../components/SetHomeRoomTeacherDialog";
import { DeleteClassDialog } from "../components/DeleteClassDialog";
import { useState } from "react";
import EditClassForm from "../components/EditClassForm";

// =======================================================
// 3️⃣ Komponen Utama: Dropdown Aksi
// =======================================================
export function ClassActionButton({
  class_id,
  class_name,
  teacher_choices,
  school_name,
}: {
  class_id: string;
  class_name: string;
  teacher_choices: any[];
  school_name: string;
}) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openHomeroomDIalog, setOpenHomeroomDialog] = useState(false);
  console.log(teacher_choices);
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 data-[state=open]:bg-muted cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Menu aksi</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {/* Header dengan info sekolah */}
          <DropdownMenuLabel className="flex flex-col p-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-sm">
                Aksi Kelas {class_name}
              </span>
            </div>
            {/* <p className="text-xs text-muted-foreground mt-1 truncate">
                {class_name}
              </p> */}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Group: Management Actions */}
          <DropdownMenuGroup>
            <DropdownMenuItem
              asChild
              className="cursor-pointer py-2"
              onClick={(e) => {
                e.preventDefault();
                setOpenEditDialog(true);
              }}
            >
              <div className="flex items-center gap-2 w-full">
                <Edit className="h-4 w-4 text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Edit Kelas</span>
                  <span className="text-xs text-muted-foreground">
                    Ubah informasi Kelas
                  </span>
                </div>
              </div>
            </DropdownMenuItem>

            {/* <Link href={`/dashboard/kelas/${encodeURIComponent(`${class_name}-${class_id}`)}`}> */}
            <Link
              href={{
                pathname: `/dashboard/kelas/${encodeURIComponent(
                  `${class_name}`
                )}`,
                query: { class_id: class_id },
              }}
            >
              <DropdownMenuItem asChild className="cursor-pointer py-2">
                <div className="flex items-center gap-2 w-full">
                  <Users className="h-4 w-4 text-green-600" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Lihat Detail</span>
                    <span className="text-xs text-muted-foreground">
                      Kelas dan siswa
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem
              asChild
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setOpenHomeroomDialog(true);
              }}
            >
              <div className="flex items-center gap-2 w-full">
                <User2Icon className="h-4 w-4 text-green-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Pilih Wali Kelas</span>
                  <span className="text-xs text-muted-foreground">
                    Wali Kelas siswa
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Group: Danger Zone */}
          <DropdownMenuGroup>
            <DropdownMenuItem
              asChild
              className="cursor-pointer py-2 text-destructive focus:text-destructive"
              onClick={(e) => {
                e.preventDefault();
                setOpenDeleteDialog(true);
              }}
            >
              <div className="flex items-center gap-2 w-full">
                <Trash2 className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Hapus Kelas</span>
                  <span className="text-xs text-muted-foreground">
                    Hapus permanen
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <SetHomeroomTeacherDialog
        class_id={class_id}
        class_name={class_name}
        school_name={school_name}
        teacher_choices={teacher_choices}
        openHomeroomDialog={openHomeroomDIalog}
        setOpenHomeroomDialog={setOpenHomeroomDialog}
      />
      <DeleteClassDialog
        class_id={class_id}
        class_name={class_name}
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />

      <EditClassForm
        class_id={class_id}
        class_name={class_name}
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
      />
    </>
  );
}
