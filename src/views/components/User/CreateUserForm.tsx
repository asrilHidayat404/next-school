"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/views/components/ui/dialog";
import { Input } from "@/src/views/components/ui/input";
import { Label } from "@/src/views/components/ui/label";
import { Button } from "@/src/views/components/ui/button";
import { LoaderIcon, PlusCircleIcon } from "lucide-react";
import { CreateUserAction, signUp } from "@/src/action/AuthenticationAction";
import { createUserSchema, CreateUserSchema } from "@/src/schemas/CreateUserSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";

export function CreateUserForm({roleChoices} : {
  roleChoices: {
    id: number,
    role_name: string
  }[]
}) {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  });

  const router = useRouter()

  const onSubmit = (data: CreateUserSchema) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("role", data.role);
        formData.append("password", data.password);
        formData.append("passwordConfirmation", data.passwordConfirmation);

        const res = await CreateUserAction(formData);
        if (res.success) {
          toast.success("✅ User berhasil dibuat");
          reset();
          router.push(`/dashboard/users/${res.role}`)
        } else {
          toast.error(`❌ ${res.error}`);
        }
      } catch (err: any) {
        toast.error(err?.message || "Gagal membuat user");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <PlusCircleIcon className="h-4 w-4" />
          Create User
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
          {/* Full Name */}
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              {...register("fullName")}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
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

          {/* Role */}
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            {/* <select
              id="role"
              {...register("role")}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Role --</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select> */}
            {/* {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>} */}
            <Select
              onValueChange={(value) =>
                setValue("role", value as "superadmin" | "admin" | "staff" | "teacher" | "student")
              }
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {
                  roleChoices?.map(r => {
                    return (
                      <SelectItem key={r.role_name} value={r.role_name} className="capitalize">{r.role_name}</SelectItem>
                    )
                  })
                }
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
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
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
            <Input
              id="passwordConfirmation"
              type={showPassword ? "text" : "password"}
              {...register("passwordConfirmation")}
            />
            {errors.passwordConfirmation && (
              <p className="text-xs text-red-500">
                {errors.passwordConfirmation.message}
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
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2"
          >
            {isPending && <LoaderIcon className="animate-spin h-4 w-4" />}
            <span>{isPending ? "Saving..." : "Save"}</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
