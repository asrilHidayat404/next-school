"use client"
import { CreateSchoolAction } from '@/src/modules/schools/action/SchoolAction';
import { createSchoolSchema, CreateSchoolSchema } from '@/src/modules/schools/schemas/CreateSchoolSchema';
import { CreateTeacherAction } from '@/src/modules/teachers/action/TeacherAction';
import { Button } from '@/src/views/components/ui/button';
import { Input } from '@/src/views/components/ui/input';
import { Label } from '@/src/views/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';

const page = () => {
      const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
      } = useForm<CreateSchoolSchema>({
        resolver: zodResolver(createSchoolSchema),
      });
    
      const router = useRouter()
    
      const onSubmit = async (data: CreateSchoolSchema) => {
          try {
            const formData = new FormData();
            formData.append("school_name", data.school_name);
    
            const res = await CreateSchoolAction(formData);
            if (res.success) {
              toast.success(res.message ||"✅ Sekolah berhasil dibuat");
              reset();
              router.push(`/dashboard/madrasah`)
            } else {
              toast.error(`${res.message}`);
            }
          } catch (err: any) {
            toast.error(err?.message || "Gagal membuat sekolah");
          }
      };
  return (
    <div>
      Halaman Tambah guru
         <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
          {/* Full Name */}
          <div className="grid gap-2">
            <Label htmlFor="school_name">Nama Lengkap</Label>
            <Input
              id="school_name"
              {...register("school_name")}
              placeholder="Madrasah 1"
            />
            {errors.school_name && (
              <p className="text-xs text-red-500">{errors.school_name.message}</p>
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
  )
}

export default page

// model School {
//   id_school   String @id @default(cuid())
//   school_name String @unique

//   classes   SchoolClass[]
//   createdAt DateTime      @default(now())
//   updatedAt DateTime      @updatedAt

//   @@map("schools")
// }

