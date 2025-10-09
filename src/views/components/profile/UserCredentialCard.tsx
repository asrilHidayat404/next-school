"use client";

import { Pen } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import toast, { LoaderIcon } from "react-hot-toast";
import { UpdatePasswordAction } from "@/src/action/AuthenticatedUserAction";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordSchema, UpdatePasswordValues } from "@/src/schemas/UpdateUserProfileSchema";


export default function UserCredentialCard() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: UpdatePasswordValues) => {
    const formData = new FormData();
    formData.append("current_password", data.current_password);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);

    const res = await UpdatePasswordAction(formData);

    if (res.success) {
      toast.success("Password Updated");
      setDialogOpen(false);
      reset(); // kosongkan input
    } else {
      toast.error(res.error ?? "Failed to Update Password");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
            Password
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Current Password: *******
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Pen /> Edit
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter Current and New Password. Click Save to Update.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="current_password">Current Password</Label>
                <Input id="current_password" type="password" {...register("current_password")} />
                {errors.current_password && (
                  <p className="text-[10px] text-red-500">
                    {errors.current_password.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && (
                  <p className="text-[10px] text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input id="password_confirmation" type="password" {...register("password_confirmation")} />
                {errors.password_confirmation && (
                  <p className="text-[10px] text-red-500">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              <DialogFooter className="mt-3">
                <DialogClose asChild>
                  <Button variant="destructive">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <LoaderIcon className="animate-spin h-5 w-5" />}
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
