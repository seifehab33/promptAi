import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PromptSmith Reset Password",
  description:
    "Reset your PromptSmith password. Enter your email to receive a password reset link.",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
