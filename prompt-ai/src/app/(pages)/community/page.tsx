"use client";
import AuthNav from "@/components/AuthNav/AuthNav";
import Image from "next/image";
import React, { useState } from "react";
import person from "@/assets/images/unknown-person.png";
import { Clock, Copy, ThumbsUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetPublicPrompt, useLikePrompt } from "@/api/useGetPublicPrompt";
import { PublicPrompt } from "@/types/type";
import { formatDate } from "@/lib/utils";
function Page() {
  const { PublicPrompts, isLoading, isError } = useGetPublicPrompt(1, 10);
  const { LikePrompt } = useLikePrompt(PublicPrompts[0]?.id || 0);
  const [showMoreStates, setShowMoreStates] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleShowMore = (promptId: string) => {
    setShowMoreStates((prev) => ({
      ...prev,
      [promptId]: !prev[promptId],
    }));
  };

  const handleLike = () => {
    LikePrompt();
  };
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      {/* AuthNav */}
      <AuthNav />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="title-community-container mb-4">
          <div className="title-community">
            <h1 className="text-4xl font-bold text-white">
              Welcome in PromptSmith Community
            </h1>
          </div>
          <div className="description-community">
            <p className="text-gray-500 text-sm">
              PromptSmith Community is a place where you can see the prompts of
              other users
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3  gap-4">
          {PublicPrompts?.map((prompt: PublicPrompt) => (
            <div
              key={prompt.id}
              className="person-prompt max-h-fit bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg max-w-2xl p-3"
            >
              <div className="person-info flex items-center justify-between">
                <div className="person-name flex items-center gap-2">
                  <Image
                    src={person}
                    alt="person"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="person-name-info text-white text-sm">
                    <p className="font-bold text-xl capitalize">
                      {prompt.user.name}
                    </p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />{" "}
                      <span>{formatDate(prompt.createdAt)}</span>
                    </p>
                  </div>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Copy className="w-6 h-6 cursor-pointer" color="white" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-white text-sm">Copy</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <hr className="my-2 border-t border-gray-600" />
              <div className="person-prompt-itself mt-3 mb-5">
                <div className="person-prompt-title mb-8">
                  <p className="text-white text-sm capitalize">
                    <span className="font-bold">Title : </span>
                    {prompt.promptTitle}
                  </p>
                </div>
                <div className="person-prompt-content">
                  <p className="text-white text-sm">
                    <span className="font-bold">Content : </span>
                    <span
                      className={`${
                        showMoreStates[String(prompt.id)]
                          ? "line-clamp-none"
                          : "line-clamp-3"
                      }`}
                    >
                      {prompt.promptDescription}
                    </span>
                    {prompt.promptDescription.length > 100 && (
                      <span
                        className="text-gray-200   text-bold cursor-pointer text-sm"
                        onClick={() => toggleShowMore(String(prompt.id))}
                      >
                        {showMoreStates[String(prompt.id)]
                          ? "Read Less..."
                          : "Read More..."}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div
                className="
           prompt-tags mb-5 flex items-center gap-2 *:bg-promptsmith-purple *:px-2 *:w-fit *:text-white *:rounded-xl *:text-sm"
              >
                {prompt.promptTags.map((tag: string) => (
                  <p key={tag}>{tag}</p>
                ))}
                {prompt.promptTags.length === 0 && <p>No Tags</p>}
              </div>
              <hr className="my-2 border-t border-gray-600" />
              <div className="like-prompt flex items-center justify-between">
                <div className="like-prompt-info flex items-center gap-2">
                  <ThumbsUp
                    className="w-4 h-4 cursor-pointer"
                    color="white"
                    onClick={handleLike}
                  />
                  <p className="text-white text-sm">{prompt.likes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Page;
