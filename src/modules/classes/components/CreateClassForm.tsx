"use client";
import React from "react";
import { CreateClassAction } from "@/src/modules/classes/action/ClassAction";
import {
  createClassSchema,
  CreateClassSchema,
} from "@/src/modules/classes/schemas/CreateClassSchema";
import { Button } from "@/src/views/components/ui/button";
import { Input } from "@/src/views/components/ui/input";
import { Label } from "@/src/views/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/views/components/ui/select";
import { School } from "@prisma/client";

const CreateClassForm = ({schoolOption}: {schoolOption: School[]}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateClassSchema>({
    resolver: zodResolver(createClassSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: CreateClassSchema) => {
    try {
      const formData = new FormData();
      formData.append("class_name", data.class_name);
      formData.append("school_id", data.school_id);

      const res = await CreateClassAction(formData);
      console.log(res);
      
      if (res.success) {
        toast.success(res.message || "✅ Kelas berhasil dibuat");
        reset();
        router.push(`/dashboard/kelas`);
      } else {
        toast.error(`${res.message}`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Gagal membuat kelas");
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4"
      >
        {/* Full Name */}
        <div className="grid gap-2">
          <Label htmlFor="full_name">Nama Kelas</Label>
          <Input
            id="class_name"
            {...register("class_name")}
            placeholder="John Doe"
          />
          {errors.class_name && (
            <p className="text-xs text-red-500">{errors.class_name.message}</p>
          )}
        </div>

        {/* Sekolah */}
        <div className="grid gap-2">
          <Label htmlFor="password_confirmation">Pilih Madrasah</Label>
          <Select
            onValueChange={(value) =>
              setValue("school_id", value)
            }
          >
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="Pilih Madrasah" />
            </SelectTrigger>
            <SelectContent>
              {schoolOption?.map((s) => {
                return (
                  <SelectItem
                    key={s.school_name}
                    value={s.id_school}
                    className="capitalize"
                  >
                    {s.school_name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.school_id && (
            <p className="text-xs text-red-500">{errors.school_id.message}</p>
          )}
        </div>

        {/* Submit */}
        {/* <Button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2"
          >
            {isPending && <LoaderIcon className="animate-spin h-4 w-4" />}
            <span>{isPending ? "Saving..." : "Save"}</span>
          </Button> */}
        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2"
        >
          <span>Simpan</span>
        </Button>
      </form>
    </div>
  );
};

export default CreateClassForm;
