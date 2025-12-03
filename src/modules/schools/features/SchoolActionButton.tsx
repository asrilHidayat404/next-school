"use client";

import { MoreHorizontal, Building, Edit, Trash2, Users } from "lucide-react";
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
import EditSchoolForm from "../components/EditSchoolForm";
import DeleteSchoolButton from "../components/DeleteSchoolButton";
import { useState } from "react";

// =======================================================
// 🏫 School Action Dropdown - Professional Version
// =======================================================
export function SchoolActionButton({
  school_id,
  school_name,
}: {
  school_id: string;
  school_name: string;
}) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
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
              <span className="font-semibold text-sm">Aksi Sekolah</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {school_name}
            </p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Group: Management Actions */}
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer py-2" onClick={(e) => {
                e.preventDefault();
                setOpenEditDialog(true);
              }}>
              <div className="flex items-center gap-2 w-full">
                <Edit className="h-4 w-4 text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Edit Sekolah</span>
                  <span className="text-xs text-muted-foreground">
                    Ubah informasi sekolah
                  </span>
                </div>
              </div>
            </DropdownMenuItem>

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
                  <span className="text-sm font-medium">Hapus Sekolah</span>
                  <span className="text-xs text-muted-foreground">
                    Hapus permanen
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteSchoolButton
        school_id={school_id}
        school_name={school_name}
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />
      <EditSchoolForm school_id={school_id} school_name={school_name} openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog} />
    </>
  );
}
