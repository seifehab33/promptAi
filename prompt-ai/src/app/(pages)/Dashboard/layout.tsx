import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PromptSmith Dashboard",
  description:
    "Manage your AI prompts, track your usage, and access your dashboard to stay on top of your AI workflow.",
};
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
