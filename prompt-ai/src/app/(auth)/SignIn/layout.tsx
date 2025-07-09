import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PromptSmith Sign In",
  description:
    "Sign in to your PromptSmith account to access all features. Sign in now and start creating AI prompts with ease.",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
