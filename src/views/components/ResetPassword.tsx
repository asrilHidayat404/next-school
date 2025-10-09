// components/ResetPasswordEmail.tsx
import { Button } from "@/src/views/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/views/components/ui/card";

interface ResetPasswordEmailProps {
  firstName: string;
  token: string;
}

export function ResetPasswordEmail({ firstName, token }: ResetPasswordEmailProps) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.5,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        padding: "2rem",
      }}
    >
      <Card className="max-w-md w-full shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">
            Hi {firstName || "User"},
          </CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            You requested to reset your password. Click the button below to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 mt-4">
          <Button
            asChild
            className="w-full py-2"
            variant="secondary"
            style={{ backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: 500 }}
          >
            <a href={resetUrl} target="_blank" rel="noopener noreferrer">
              Reset Password
            </a>
          </Button>
          <p className="text-sm text-gray-500">
            This link is valid for <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.
          </p>
          <p className="text-sm text-gray-500">
            Thanks,<br />
            Your App Team
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
