"use client";
import React, { useEffect, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useForm } from "react-hook-form";
import { useUser } from "@/src/context/UserContext";
import { Button } from "../ui/button";
import { updateUserCredentials } from "@/src/action/AuthenticatedUserAction";
import toast from "react-hot-toast";
import { EditUserSchema } from "@/src/schemas/UpdateCredentialsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

type EditUserFormValues = {
  full_name: string;
  email: string;
  password?: string;
  role_id: string;
};

export function EditForm({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user, setUser } = useUser();
   const [isPending, startTransition] = useTransition()


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      full_name: user?.full_name ?? "",
      email: user?.email ?? "",
      password: "",
      role_id: user?.role_id ? String(user.role_id) : "2",
    },
  });

  // Sync default values ketika user berubah
  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name ?? "",
        email: user.email ?? "",
        password: "",
        role_id: String(user.role_id ?? "2"),
      });
    }
  }, [user, reset]);

  const onSubmit = (data: EditUserFormValues) => {
    if (!user?.id) {
        return
    }
    startTransition(async () => {
      const res = await updateUserCredentials(user.id, data)
      if (res.success) {
        // setUser((prev) =>
        //   prev ? { ...prev, ...data, role_id: Number(data.role_id) } : prev
        // )
         toast.success("User Updated");
        setIsOpen(false)
      } else {
        toast.error(res.message || "Failed to update user");
        console.error(res.errors || res.message)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit profile {user?.full_name}</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            {/* Full name */}
            <div className="grid gap-3">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                {...register("full_name", {
                  required: "Full name is required",
                })}
              />
              {errors.full_name && (
                <p className="text-xs text-red-500">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
            </div>

            {/* Role */}
            <div className="grid gap-3">
              <Label htmlFor="role_id">Role</Label>
              <Select
                defaultValue={String(user?.role_id ?? 2)}
                onValueChange={(value) => setValue("role_id", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="1">Admin</SelectItem>
                    <SelectItem value="2">User</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button" >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
                {
                    isPending ? <Loader2 className="animate-spin" /> : null
                }
                {
                    isPending ? "Saving..." : "Save"
                }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(EditForm);
