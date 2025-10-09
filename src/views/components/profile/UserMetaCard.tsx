"use client";

import { Camera, LoaderIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { UpdateAvatar } from "@/src/action/AuthenticatedUserAction";

function UserMetaCard() {
  const [preview, setPreview] = useState<string>(""); // preview lokal
  const [loading, setLoading] = useState(false);
  const imgInput = useRef<HTMLInputElement>(null);


  const { data: session, update } = useSession()
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgInput.current?.files?.[0]) return;

    setLoading(true)
    const formData = new FormData();
    formData.append("avatar", imgInput.current.files[0]);

    const res = await UpdateAvatar(formData);

    if (res?.success) {
      update()
      toast.success("Avatar berhasil diperbarui 🎉");
      setPreview(""); // reset preview
      setLoading(false)
    } else {
    setLoading(false)
      toast.error(res?.error ?? "Gagal update avatar");
    }
  };


  const handlePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPreview(ev.target.result as string); // simpan preview
      }
    };
    reader.readAsDataURL(file);
  };

  // Tentukan source avatar

  const avatarSrc = preview
    ? preview // preview lokal
    : session?.user?.avatar
      ? `/storage/${session.user?.avatar}` // dari DB
      : "/illustrations/login-bg.png"; // fallback default

  return (
    <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
      <form
        className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="flex w-full flex-col items-center gap-6 xl:flex-row">
          <div className="relative">
            {!session?.user ? (
              <Skeleton className="h-20 w-20 rounded-full" />
            ) : (
              <img
                src={avatarSrc}
                alt="avatar"
                className="h-20 w-20 rounded-full object-cover"
              />
            )}
            <input
              type="file"
              id="avatar"
              name="avatar"
              ref={imgInput}
              accept="image/*"
              className="hidden"
              onChange={handlePreview}
            />

            <label
              htmlFor="avatar"
              className="absolute right-0 bottom-0 flex items-center justify-center rounded-full border border-muted bg-muted-foreground p-1 text-muted dark:border-muted-foreground dark:bg-muted dark:text-muted-foreground cursor-pointer w-9 h-9"
            >
              <Camera size={20} />
            </label>
          </div>

          <div className="order-3 xl:order-2">
            {!session?.user ? (
             <Skeleton className="h-4 w-40 rounded-md" />
            ) :(
            <h4 className="mb-2 text-center text-lg font-semibold text-gray-800 xl:text-left dark:text-white/90">
              {session?.user.fullName}
            </h4>
            )}
            <div className="flex flex-col items-center gap-2 text-center xl:flex-row xl:gap-4 xl:text-left">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">

                <span>Role</span>
                <span className="h-3.5 w-px bg-gray-300 dark:bg-gray-700" />
                {!session?.user ? (
             <Skeleton className="h-6 w-full" />
            ) :(
                <span className="capitalize">
                  {session.user.role}
                </span>)}
              </div>
            </div>
          </div>
        </div>

        {preview && (
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="animate-spin h-5 w-5" />}
            {loading ? "Updating..." : "Update"}
          </Button>
        )}
      </form>
    </div>
  );
}

export default UserMetaCard;
