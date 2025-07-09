import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PromptSmith Editor",
  description:
    "Create and edit AI prompts with our advanced editor. Customize your prompts with ease and get the best results from your AI workflow.",
};
export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
