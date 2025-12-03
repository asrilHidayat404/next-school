"use client";
import React from "react";
import { CreateClassAction } from "@/src/modules/classes/action/ClassAction";
import { Button } from "@/src/views/components/ui/button";
import { Input } from "@/src/views/components/ui/input";
import { Label } from "@/src/views/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/views/components/ui/select";
import {
  createSubjectSchema,
  CreateSubjectSchema,
} from "../schemas/CreateSubjectSchema";
import { Badge, School as SchoolIcon, University } from "lucide-react";
import { School, SchoolClass } from "@prisma/client";
import { CreateSubjectAction } from "../action/SubjectAction";

interface SchoolWithClass extends School {
  classes: SchoolClass[];
}

const CreateSubjectForm = ({
  schoolOption = [],
}: {
  schoolOption: SchoolWithClass[];
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateSubjectSchema>({
    resolver: zodResolver(createSubjectSchema),
  });

  const router = useRouter();

  const selectedSchool = watch("school_id");
  const selectedClass = watch("class_id");

  // 🔹 Ambil kelas yang sesuai sekolah terpilih
  const selectedSchoolData = schoolOption.find(
    (s) => s.id_school === selectedSchool
  );
  const filteredClass = selectedSchoolData?.classes ?? [];

const onSubmit = async (data: CreateSubjectSchema) => {
  try {
    const formData = new FormData();
    formData.append("subject_name", data.subject_name);
    if (data.school_id) formData.append("school_id", data.school_id);
    formData.append("class_id", data.class_id);

    const res = await CreateSubjectAction(formData);
    
    if (res.success) {
      toast.success(res.message || "✅ Mata pelajaran berhasil dibuat");
      reset();
      router.push(`/dashboard/mata-pelajaran`);
    } else {
      toast.error(res.message || "❌ Gagal membuat mata pelajaran");
    }
  } catch (err: any) {
    toast.error(err?.message || "Gagal membuat mata pelajaran");
  }
};


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-4"
    >
      {/* Nama Mata Pelajaran */}
      <div className="grid gap-2">
        <Label htmlFor="subject_name">Nama Mata Pelajaran</Label>
        <Input
          id="subject_name"
          {...register("subject_name")}
          placeholder="Contoh: Matematika"
        />
        {errors.subject_name && (
          <p className="text-xs text-red-500">
            {errors.subject_name.message}
          </p>
        )}
      </div>

      {/* Pilihan Sekolah */}
      <div className="space-y-2">
        <Label htmlFor="school_id" className="flex items-center gap-2">
          <SchoolIcon className="h-4 w-4" />
          Madrasah
        </Label>
        <Select
          value={selectedSchool}
          onValueChange={(value) => {
            setValue("school_id", value);
            setValue("class_id", "");
          }}
        >
          <SelectTrigger
            id="school_id"
            className={errors.school_id ? "border-destructive" : "w-full"}
          >
            <SelectValue placeholder="Pilih Madrasah" />
          </SelectTrigger>
          <SelectContent>
            {schoolOption.map((s) => (
              <SelectItem key={s.id_school} value={s.id_school}>
                {s.school_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.school_id && (
          <p className="text-xs text-destructive">
            {errors.school_id.message}
          </p>
        )}
      </div>

      {/* Pilihan Kelas */}
      {selectedSchool && (
        <div className="space-y-2">
          <Label htmlFor="class_id" className="flex items-center gap-2">
            <University className="h-4 w-4" />
            Kelas
            {filteredClass.length > 0 && (
              <Badge className="text-xs">
                {filteredClass.length} kelas tersedia
              </Badge>
            )}
          </Label>
          <Select
            value={selectedClass}
            onValueChange={(value) => setValue("class_id", value)}
          >
            <SelectTrigger
              id="class_id"
              className={errors.class_id ? "border-destructive" : "w-full"}
            >
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent>
              {filteredClass.length > 0 ? (
                filteredClass.map((kelas) => (
                  <SelectItem key={kelas.id_class} value={kelas.id_class}>
                    {kelas.class_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="no-class">
                  Tidak ada kelas di madrasah ini
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.class_id && (
            <p className="text-xs text-destructive">
              {errors.class_id.message}
            </p>
          )}
        </div>
      )}

      <Button type="submit" className="w-full">
        Simpan
      </Button>
    </form>
  );
};

export default CreateSubjectForm;
