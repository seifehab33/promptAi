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
import { useState } from "react";
import useForgetPass from "@/api/useForgetPass";
function ForgetPassword() {
  const [email, setEmail] = useState("");
  const { ReqForgetPass, isPending } = useForgetPass();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ReqForgetPass(email);
  };

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
            Forget Password
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email to reset your password
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Forget Password</CardTitle>
            <CardDescription>
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                {isPending ? "Sending..." : "Reset Password"}
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

export default ForgetPassword;
