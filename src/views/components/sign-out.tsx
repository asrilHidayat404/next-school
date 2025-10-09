"use client";
import { Button } from "@/src/views/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const res = await signOut({
        redirect: false, // ⬅️ biar kita yang handle redirect
      });

      if (res?.url) {
        toast.success("Successfully signed out!");
         router.push("/sign-in");// ⬅️ redirect manual
      } else {
        toast.error("Something went wrong during sign out.");
      }
    } catch (error) {
      toast.error("Sign out failed.");
    }
  };

  return (
    <div className="flex justify-center">
      <Button variant="destructive" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
};

export { SignOut };
