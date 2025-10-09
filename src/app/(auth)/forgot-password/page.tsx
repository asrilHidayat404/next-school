"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Label } from "@/src/views/components/ui/label";
import { Input } from "@/src/views/components/ui/input";
import { Button } from "@/src/views/components/ui/button";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import { ForgotPassword } from "@/src/action/ResetPasswordAction";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      const res = await ForgotPassword(formData);

      if (res?.success) {
        toast.success("Check your email to reset your password!");
      } else {
        toast.error("Failed to send reset email");
      }
    } catch (err) {
      toast.error("Server error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 md:p-10">
        <h1 className="text-2xl font-bold text-center">Reset Your Password</h1>
        <p className="text-sm text-center mt-2">
          Enter your account email and we will send you instructions to reset
          your password.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 mt-2"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm flex items-center gap-2 hover:underline"
          >
            <ArrowLeftCircle className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
