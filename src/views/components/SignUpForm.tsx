"use client";

import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { ArrowLeftCircle, LoaderIcon } from "lucide-react";
import { Card, CardContent } from "@/src/views/components/ui/card";
import { Label } from "@/src/views/components/ui/label";
import { Input } from "@/src/views/components/ui/input";
import { Button } from "@/src/views/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { signUp } from "@/src/action/AuthenticationAction";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpSchemaValues } from "@/src/schemas/SignUpSchema";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpSchemaValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpSchemaValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("passwordConfirmation", data.passwordConfirmation);

      const res = await signUp(formData);
      if (res.success) {
        toast.success("Account Created");
        router.push("/sign-in");
        reset();
      } else {
        toast.error(`❌ ${res.error}`);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to Create Account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div
            className="relative hidden md:block"
            style={{
              backgroundImage:
                "linear-gradient(45deg, transparent 25%, rgba(68,68,68,.2) 50%, transparent 75%, transparent 100%)",
              backgroundSize: "250% 250%, 100% 100%",
              backgroundRepeat: "no-repeat",
              animation: "shineMove 2s linear infinite",
              backgroundPosition: "-100% 0, 0 0",
            }}
          >
            <Image
              src="/illustrations/sign-up-bg.png"
              alt="Login Background"
              fill
              className="object-contain dark:brightness-[0.7] dark:grayscale bounce"
            />
          </div>
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">NEXT GEN'Z</h1>
                <p className="text-muted-foreground text-balance">
                  Create an Account
                </p>
              </div>

              {/* Full Name */}
              <div className="grid gap-3">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="grid gap-3">
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

              {/* Show Password Toggle */}
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
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading && <LoaderIcon className="animate-spin h-5 w-5" />}
                <span>{loading ? "Creating Account..." : "Register"}</span>
              </Button>
            </div>

            <footer className="flex justify-between mt-4">
              <Link
                href="/sign-in"
                className="text-sm flex items-center gap-2 hover:underline"
              >
                <ArrowLeftCircle className="w-4 h-4" />
                Back to Login
              </Link>
            </footer>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
