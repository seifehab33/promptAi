"use client";
import AuthNav from "@/components/AuthNav/AuthNav";
import Image from "next/image";
import React, { useState } from "react";
import person from "@/assets/images/unknown-person.png";
import { Clock, Copy, ThumbsUp } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublicPrompt, useLikePrompt } from "@/api/useGetPublicPrompt";
import { PublicPrompt } from "@/types/type";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useUser } from "@/context/userContext";

function Page() {
  const [page, setPage] = useState(1);
  const { PublicPrompts, meta, isLoading, isError } = useGetPublicPrompt(
    page,
    10
  );
  const { LikePrompt } = useLikePrompt(PublicPrompts[0]?.id || 0);
  const { user } = useUser();
  const userName = user?.name;
  const [showMoreStates, setShowMoreStates] = useState<{
    [key: string]: boolean;
  }>({});
  const toggleShowMore = (promptId: string) => {
    setShowMoreStates((prev) => ({
      ...prev,
      [promptId]: !prev[promptId],
    }));
  };
  const loadMore = () => {
    setPage((prev) => prev + 1);
  };
  const handleLike = () => {
    LikePrompt();
  };
  const handleCopy = (promptDescription: string) => {
    navigator.clipboard.writeText(promptDescription);
    toast.success("Copied to clipboard", {
      style: {
        backgroundColor: "#008000",
        color: "white",
      },
    });
  };
  // Check if there are more pages to load
  const hasMorePages = meta && page < meta.totalPages;

  if (isError) return <div>Error</div>;

  console.log(PublicPrompts);
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
        {isLoading ? (
          // Skeleton loading states
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="person-prompt max-h-fit bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg max-w-2xl p-3"
              >
                <div className="person-info flex items-center justify-between">
                  <div className="person-name flex items-center gap-2">
                    <Skeleton className="w-10 h-10 rounded-full bg-white/20" />
                    <div className="person-name-info text-white text-sm">
                      <Skeleton className="h-6 w-24 bg-white/20 mb-1" />
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <Skeleton className="h-3 w-20 bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="my-2 border-t border-gray-600" />
                <div className="person-prompt-itself mt-3 mb-5">
                  <div className="person-prompt-title mb-8">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-bold">
                        Title :{" "}
                      </span>
                      <Skeleton className="h-4 w-32 bg-white/20" />
                    </div>
                  </div>
                  <div className="person-prompt-content">
                    <div className="text-white text-sm">
                      <div className="flex items-center gap-2 justify-between mb-2">
                        <span className="font-bold">Content : </span>
                        <Skeleton className="w-4 h-4 bg-white/20" />
                      </div>
                      <Skeleton className="h-4 w-full bg-white/10 mb-1" />
                      <Skeleton className="h-4 w-3/4 bg-white/10 mb-1" />
                      <Skeleton className="h-4 w-1/2 bg-white/10" />
                    </div>
                  </div>
                </div>
                <div className="prompt-tags mb-5 flex items-center gap-2">
                  <Skeleton className="h-6 w-16 bg-promptsmith-purple/50 rounded-xl" />
                  <Skeleton className="h-6 w-20 bg-promptsmith-purple/50 rounded-xl" />
                  <Skeleton className="h-6 w-14 bg-promptsmith-purple/50 rounded-xl" />
                </div>
                <hr className="my-2 border-t border-gray-600" />
                <div className="like-prompt flex items-center justify-between">
                  <div className="like-prompt-info flex items-center gap-2">
                    <Skeleton className="w-4 h-4 bg-white/20" />
                    <Skeleton className="h-4 w-16 bg-white/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : PublicPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-dvh gap-4">
            <div className="text-white text-center text-2xl font-bold flex items-center justify-center ">
              No One Has Shared Any Prompts Yet, Be the First to Share a Prompt
            </div>
            <div className="text-white text-center text-2xl font-bold flex items-center justify-center">
              <Link
                href="/dashboard"
                className="text-promptsmith-purple hover:bg-promptsmith-purple hover:border-promptsmith-purple  hover:text-white border-white border border-solid px-4 py-2 rounded-md transition-colors duration-300"
              >
                Create a Prompt
              </Link>
            </div>
          </div>
        ) : (
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
                        {prompt.user.name === userName
                          ? "You"
                          : prompt.user.name}
                      </p>
                      <p className="text-gray-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        <span>{formatDate(prompt.createdAt)}</span>
                      </p>
                    </div>
                  </div>
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
                    <div className="text-white text-sm">
                      <div className="flex items-center gap-2 justify-between">
                        <span className="font-bold">Content : </span>{" "}
                        <Tooltip>
                          <TooltipTrigger
                            asChild
                            onClick={() => handleCopy(prompt.promptDescription)}
                          >
                            <Copy
                              className="w-4 h-4 cursor-pointer"
                              color="white"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-white text-sm">Copy</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span
                        className={`${
                          showMoreStates[String(prompt.id)]
                            ? "line-clamp-none whitespace-pre-wrap"
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
                    </div>
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
                    <p className="text-white text-sm">
                      {prompt.likes?.length || 0} Likes
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {hasMorePages && (
          <div className="flex items-center justify-center my-5">
            <button
              onClick={loadMore}
              className="bg-promptsmith-purple text-white px-4 py-2 rounded-md transition-colors  duration-300 hover:bg-promptsmith-purple/80 ease-in-out cursor-pointer"
            >
              Load More
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Page;
