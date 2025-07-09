import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PromptSmith Sign Up",
  description:
    "Create an account to access all features of PromptSmith. Sign up now and start creating AI prompts with ease.",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
