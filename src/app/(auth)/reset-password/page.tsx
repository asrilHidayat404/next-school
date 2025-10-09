"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/views/components/ui/card";
import { Input } from "@/src/views/components/ui/input";
import { Label } from "@/src/views/components/ui/label";
import { Button } from "@/src/views/components/ui/button";
import { Lock } from "lucide-react";
import { resetPasswordSchema } from "@/src/schemas/ResetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPassword } from "@/src/action/ResetPasswordAction";

interface FormValues {
  password: string;
  password_confirmation: string;
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema)
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    if (data.password !== data.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }
    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);

    setLoading(true);

    const res = await ResetPassword(formData)

    setLoading(false);

    if (res?.success) {
      toast.success("Password reset successfully!");
      router.push("/sign-in");
    } else {
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below. Make sure it's strong and secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="password" className="flex items-center gap-1">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                {...register("password")}
              />
               {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
            </div>

            <div className="flex flex-col gap-4">
              <Label htmlFor="password_confirmation" className="flex items-center gap-1">
                Confirm Password
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Confirm new password"
                {...register("password_confirmation")}
              />
               {errors.password_confirmation && (
                  <p className="text-xs text-red-500">
                    {errors.password_confirmation.message}
                  </p>
                )}
            </div>

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
