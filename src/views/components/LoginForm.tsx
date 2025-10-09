"use client";
import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { ArrowLeftCircle, ArrowRightCircle, LoaderIcon, Lock } from "lucide-react";
import { Card, CardContent } from "@/src/views/components/ui/card";
import { Label } from "@/src/views/components/ui/label";
import { Input } from "@/src/views/components/ui/input";
import { Button } from "@/src/views/components/ui/button";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signInSchema, SignInSchemaValues } from "@/src/schemas/SignInSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchemaValues>({
    resolver: zodResolver(signInSchema),
  });
  const router = useRouter();
  const handleSignIn = async (data: SignInSchemaValues) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      toast.error("Invalid credentials");
    } else {
      toast.success("Authentication Success!");
      router.push("/dashboard");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(handleSignIn)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">NEXT GEN'Z</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-[9px] text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-[9px] text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    id="showPassword"
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => {
                      setShowPassword((prev) => !prev);
                    }}
                    className="h-4 w-4 cursor-pointer"
                  />
                  <Label htmlFor="showPassword" className="text-sm">
                    Show Password
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/forgot-password"
                    className="text-sm flex items-center gap-2 hover:underline"
                  >
                    <Lock className="w-4 h-4" />
                    Forgot Password
                  </Link>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting && (
                  <LoaderIcon className="animate-spin h-5 w-5" />
                )}
                <span>{isSubmitting ? "Authenticating..." : "Login"}</span>
              </Button>

              {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div> */}
            </div>
            <footer className="flex justify-between mt-4">
              {/* Back button */}
              <Link
                href="/"
                className="text-sm flex items-center gap-2 hover:underline"
              >
                <ArrowLeftCircle className="w-4 h-4" />
                Back
              </Link>

              {/* Register button */}
              <Link
                href="/sign-up"
                className="text-sm flex items-center gap-2 hover:underline"
              >
                Register
                <ArrowRightCircle className="w-4 h-4" />
              </Link>
            </footer>
          </form>
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
              src="/illustrations/login-bg.png"
              alt="Login Background"
              fill
              className="object-contain dark:brightness-[0.7] dark:grayscale scaling"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
