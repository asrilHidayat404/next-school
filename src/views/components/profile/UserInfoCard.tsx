"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import toast, { LoaderIcon } from "react-hot-toast";
import { UpdateProfile } from "@/src/action/AuthenticatedUserAction";
import { Pen } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateInfoFormValues, updateInfoSchema } from "@/src/schemas/UpdateUserProfileSchema";


export default function UserInfoCard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: session, update } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateInfoFormValues>({
    resolver: zodResolver(updateInfoSchema),
    defaultValues: {
      full_name: session?.user?.fullName || "",
      email: session?.user?.email || "",
    },
  });

  // sync form ketika session berubah
  useEffect(() => {
    reset({
      full_name: session?.user?.fullName || "",
      email: session?.user?.email || "",
    });
  }, [session, reset]);

  const onSubmit = async (data: UpdateInfoFormValues) => {

    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("email", data.email);

    const res = await UpdateProfile(formData);

    if (res?.success) {
      await update(); // refresh session
      toast.success("Profile Updated");
      setDialogOpen(false);
    } else {
      toast.error(res?.error ?? "Failed to Update Profile!");
    }

  };

  return (
    <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
            Personal Information
          </h4>

          <div
            className={`grid ${
              session?.user.role !== "Mahasiswa" ? "grid-cols-1" : "grid-cols-2"
            } place-content-between pt-3 gap-4 lg:gap-7 2xl:gap-x-32`}
          >
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Full Name
              </p>
              {!session?.user ? (
                <Skeleton className="h-6 w-full" />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {session?.user?.fullName}
                </p>
              )}
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Role
              </p>
              {!session?.user ? (
                <Skeleton className="h-6 w-full" />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90 capitalize">
                  {session?.user.role}
                </p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              {!session?.user ? (
                <Skeleton className="h-6 w-full" />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {session?.user.email}
                </p>
              )}
            </div>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Pen />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[425px] lg:w-[769px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    type="text"
                    {...register("full_name")}
                  />
                  {errors.full_name && (
                    <p className="text-[9px] text-sm text-red-500">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-[9px] text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter className="mt-3">
                <DialogClose asChild>
                  <Button variant="destructive">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <LoaderIcon className="animate-spin h-5 w-5" />}
                  <span>{isSubmitting ? "Updating..." : "Update"}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
