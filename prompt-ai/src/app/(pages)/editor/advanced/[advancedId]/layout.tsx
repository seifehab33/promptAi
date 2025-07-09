import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PromptSmith Advanced Editor",
  description:
    "Advanced AI prompt editor with markdown support, PDF export, and enhanced features. Edit, format, and manage your prompts with professional tools and detailed customization options.",
  openGraph: {
    title: "PromptSmith Advanced Editor",
    description:
      "Advanced AI prompt editor with markdown support, PDF export, and enhanced features. Edit, format, and manage your prompts with professional tools and detailed customization options.",
  },
};

export default function AdvancedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
