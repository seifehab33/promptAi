import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PromptSmith Community ",
  description:
    "Join the PromptSmith Community to discover, share, and like AI prompts from creators worldwide. Explore public prompts, get inspired, and build your prompt library with our collaborative platform.",
};
export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
