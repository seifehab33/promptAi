"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import useResetPassword from "@/api/useResetPassword";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import useValidateTokenForgetPass from "@/api/useValidateTokenForgetPass";

function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { ReqResetPassword, isPending } = useResetPassword();
  const { isLoading, error } = useValidateTokenForgetPass(token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      toast.error("No reset token found");
      router.replace("/forget-password");
      return;
    }

    if (error) {
      toast.error("Invalid or expired reset token");
      router.replace("/forget-password");
    }
  }, [error, router, token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    ReqResetPassword({ token, newPassword });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-promptsmith-purple mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Validating reset token...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Invalid Token
          </h2>
          <p className="text-muted-foreground mb-4">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forget-password"
            className="inline-block bg-promptsmith-purple hover:bg-promptsmith-purple/90 text-white font-bold py-2 px-4 rounded"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center">
            <div className="h-12 w-12 rounded-full bg-promptsmith-purple flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
          </Link>
          <h1 className="mt-4 text-3xl font-bold gradient-text">
            Reset Password
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter your new password to reset your password
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your new password to reset your password
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    className="pl-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button
                className="w-full mb-4"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Resetting..." : "Reset Password"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Back to Sign In{" "}
                <Link
                  href="/SignIn"
                  className="text-promptsmith-purple hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default ResetPassword;
