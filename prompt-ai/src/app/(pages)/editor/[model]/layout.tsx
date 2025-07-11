import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { model: string };
}): Promise<Metadata> {
  const { model } = params;

  return {
    title: `PromptSmith Editor - ${model}`,
    description:
      "Create and edit AI prompts with our advanced editor. Customize your prompts with ease and get the best results from your AI workflow.",
    openGraph: {
      title: `PromptSmith Editor - ${model}`,
      description:
        "Create and edit AI prompts with our advanced editor. Customize your prompts with ease and get the best results from your AI workflow.",
    },
  };
}

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
