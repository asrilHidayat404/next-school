"use client";

import Link from "next/link";
import {
  Building,
  Edit,
  LucideEye,
  MoreHorizontal,
  Trash2,
  User,
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
import { useState } from "react";
import { DeleteStudentDialog } from "../components/DeleteStudentDialog";

// =======================================================
// 3️⃣ Komponen Utama: Dropdown Aksi
// =======================================================
export function StudentActionButton({
  student_id,
  student_name,
}: {
  student_id: string;
  student_name: string;
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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
                Aksi Siswa {student_name}
              </span>
            </div>
            {/* <p className="text-xs text-muted-foreground mt-1 truncate">
                {class_name}
              </p> */}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Group: Management Actions */}
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer py-2">
              <Link
                href={{
                  pathname: "/dashboard/siswa/edit-siswa",
                  query: { student_id: student_id },
                }}
                className="flex items-center gap-2 w-full"
              >
                <Edit className="h-4 w-4 text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Edit Siswa</span>
                  <span className="text-xs text-muted-foreground">
                    Ubah informasi Kelas
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>

            {/* <Link href={`/dashboard/kelas/${encodeURIComponent(`${class_name}-${class_id}`)}`}> */}

            <DropdownMenuItem asChild className="cursor-pointer py-2">
              <Link
                href={{
                  pathname: "/dashboard/siswa/profil",
                  query: { student_id: student_id },
                }}
                className="flex items-center gap-2 w-full"
              >
                <User className="h-4 w-4 text-green-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Lihat Profil</span>
                  <span className="text-xs text-muted-foreground">
                    Profil siswa
                  </span>
                </div>
              </Link>
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
                  <span className="text-sm font-medium">Hapus Siswa</span>
                  <span className="text-xs text-muted-foreground">
                    Hapus permanen
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteStudentDialog
        student_id={student_id}
        student_name={student_name}
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
    </>
  );
}
