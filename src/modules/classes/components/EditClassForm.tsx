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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/src/views/components/ui/dropdown-menu";
import { EditClassAction } from "../action/ClassAction";

type EditClassFormProps = {
  class_id: string;
  class_name: string;
   openEditDialog:boolean;
    setOpenEditDialog: Dispatch<SetStateAction<boolean>>
};

type FormData = {
  class_name: string;
};

const EditClassForm = ({ class_id, class_name, openEditDialog,
  setOpenEditDialog }: EditClassFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      class_name,
    },
  });
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("class_name", data.class_name);
    formData.append("class_id", class_id);
    // Contoh: panggil server action atau API endpoint
    const res = await EditClassAction(formData);

    if (res.status == 200) {
      toast.success(res.message || "Data berhasi diupdate");
      router.refresh()
      setOpenEditDialog(false)
    } else {
      toast.error(res.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Kelas</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 flex flex-col justify-end">
          <div>
            <Label className="mb-3 block">Nama Kelas</Label>
            <Input
              type="text"
              placeholder="Masukkan nama kelas"
              {...register("class_name", {
                required: "Nama kelas wajib diisi",
              })}
            />
            {errors.class_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.class_name.message}
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

export default EditClassForm;
