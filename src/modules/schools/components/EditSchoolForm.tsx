"use client";

import { Button } from "@/src/views/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/views/components/ui/dialog";
import { Input } from "@/src/views/components/ui/input";
import { Label } from "@/src/views/components/ui/label";
import { Edit, Pen } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { EditSchoolAction } from "../action/SchoolAction";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/src/views/components/ui/dropdown-menu";

type EditSchoolFormProps = {
  school_id: string;
  school_name: string;
   openEditDialog:boolean;
    setOpenEditDialog: Dispatch<SetStateAction<boolean>>
};

type FormData = {
  school_name: string;
};

const EditSchoolForm = ({ school_id, school_name, openEditDialog,
  setOpenEditDialog }: EditSchoolFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      school_name,
    },
  });
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("school_name", data.school_name);
    formData.append("school_id", school_id);
    // Contoh: panggil server action atau API endpoint
    const res = await EditSchoolAction(formData);

    if (res.status == 200) {
      toast.success(res.message || "Data berhasi diupdate");
      router.refresh()
    } else {
      toast.error(res.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Sekolah</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 flex flex-col justify-end">
          <div>
            <Label className="mb-3 block">Nama Sekolah</Label>
            <Input
              type="text"
              placeholder="Masukkan nama sekolah"
              {...register("school_name", {
                required: "Nama sekolah wajib diisi",
              })}
            />
            {errors.school_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.school_name.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSchoolForm;
