"use client";
import {
  CreateTeacherAction,
  EditTeacherAction,
} from "@/src/modules/teachers/action/TeacherAction";
import {
  createTeacherSchema,
  CreateTeacherSchema,
} from "@/src/modules/teachers/schemas/CreateTeacherSchema";
import { Button } from "@/src/views/components/ui/button";
import { Input } from "@/src/views/components/ui/input";
import { Label } from "@/src/views/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/views/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon, Map, Phone, User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  editTeacherSchema,
  EditTeacherSchema,
} from "../schemas/EditTeacherSchema";

export const EditTeacherForm = ({ teacherData }: { teacherData: any }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditTeacherSchema>({
    resolver: zodResolver(editTeacherSchema),
    defaultValues: {
      full_name: teacherData.user.full_name,
      email: teacherData.user.email,
      nip: teacherData.nip,
      address: teacherData.user.address,
      gender: teacherData.user.gender,
      phone_number: teacherData.user.phone_number,
      password: "",
      password_confirmation: "",
    },
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const selectedgender = watch("gender");

  const onSubmit = async (data: EditTeacherSchema) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("teacher_id", teacherData.id_teacher);
      formData.append("full_name", data.full_name);
      formData.append("email", data.email);
      formData.append("nip", data.nip);
      formData.append("address", data.address);
      formData.append("gender", data.gender);
      formData.append("phone_number", data.phone_number);
      if (data.password) {
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation ?? "");
      }
      const res = await EditTeacherAction(formData);
      if (res.success) {
        toast.success(res.message || "✅ Guru berhasil diupdate");
        reset();
        setIsLoading(false);
        router.push(`/dashboard/guru`);
      } else {
        setIsLoading(false);

        toast.error(`❌ ${res.error}`);
      }
    } catch (err: any) {
      setIsLoading(false);

      toast.error(err?.message || "Something went wrong");
    }
  };
  console.log({ isLoading });

  return (
    <div>
      Halaman Edit guru
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4"
      >
        {/* Full Name */}
        <div className="grid gap-2">
          <Label htmlFor="full_name">Nama Lengkap</Label>
          <Input
            id="full_name"
            {...register("full_name")}
            placeholder="John Doe"
          />
          {errors.full_name && (
            <p className="text-xs text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* NIP */}
        <div className="grid gap-2">
          <Label htmlFor="nip">NIP</Label>
          <Input
            id="nip"
            type="string"
            {...register("nip")}
            placeholder="NIP"
          />
          {errors.nip && (
            <p className="text-xs text-red-500">{errors.nip.message}</p>
          )}
        </div>

        {/* Jenis Kelasmin */}
        <div className="space-y-2">
          <Label htmlFor="birth" className="flex items-center gap-2">
            <User2Icon className="h-4 w-4" />
            Jenis Kelamin
          </Label>
          <Select
            value={selectedgender}
            onValueChange={(value) => {
              setValue("gender", value);
            }}
          >
            <SelectTrigger id="gender" className="w-full">
              <SelectValue placeholder="Pilih Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent>
              {["laki-laki", "perempuan"].map((g, i) => (
                <SelectItem key={i} value={g} className="capitalize">
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-xs text-destructive">{errors.gender.message}</p>
          )}
        </div>

        {/* Nama alamat */}
        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Alamat
          </Label>
          <Input
            id="address"
            {...register("address")}
            placeholder="contoh: kapedi, bluto"
          />
        </div>

        {/* NOmor hp */}
        <div className="space-y-2">
          <Label htmlFor="phone_number" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Nomor Telepon
          </Label>
          <Input
            id="phone_number"
            {...register("phone_number")}
            placeholder="0812xxxxx"
          />
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="grid gap-2">
          <Label htmlFor="password_confirmation">Confirm Password</Label>
          <Input
            id="password_confirmation"
            type={showPassword ? "text" : "password"}
            {...register("password_confirmation")}
          />
          {errors.password_confirmation && (
            <p className="text-xs text-red-500">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        {/* Show Password */}
        <div className="flex items-center gap-2">
          <Input
            id="showPassword"
            type="checkbox"
            onChange={() => setShowPassword((prev) => !prev)}
            className="h-4 w-4 cursor-pointer"
          />
          <Label htmlFor="showPassword" className="text-sm">
            Show Password
          </Label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2"
        >
          {isLoading && <LoaderIcon className="animate-spin h-4 w-4" />}
          <span>{isLoading ? "Saving..." : "Save"}</span>
        </Button>
      </form>
    </div>
  );
};
