import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PromptSmith Forget Password",
  description:
    "Forgot your PromptSmith password? Enter your email to receive a password reset link.",
};

export default function ForgetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
