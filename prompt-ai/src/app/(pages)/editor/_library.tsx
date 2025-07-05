"use client";
import { useGetPopularPrompts } from "@/api/useGetPopularPrompts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Prompt } from "@/types/type";
import { Tag, UsersRound, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function Library() {
  const { PopularPrompts, isLoading, isError } = useGetPopularPrompts();
  const router = useRouter();
  const GoToCommunity = () => {
    router.push("/community");
  };
  if (isError) return <div>Error</div>;
  return (
    <div className="mt-4">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-promptsmith-purple/30 backdrop-blur-md border border-white/10 shadow-md flex items-center justify-center">
              <UsersRound className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">
              Community Library
            </span>
          </div>
          <p className="text-gray-300 mb-6 text-sm">
            Discover popular prompts from the community and get inspired by
            creative AI interactions.
          </p>
          <div className="space-y-4">
            {isLoading
              ? // Skeleton loading states
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="p-4 border-white/10 bg-white/5">
                    <Skeleton className="h-5 w-3/4 bg-white/20 mb-2" />
                    <Skeleton className="h-4 w-full bg-white/10 mb-1" />
                    <Skeleton className="h-4 w-2/3 bg-white/10 mb-3" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3 bg-white/10" />
                      <Skeleton className="h-3 w-24 bg-white/10" />
                      <div className="ml-auto flex items-center">
                        <Skeleton className="h-3 w-3 mr-1 bg-white/10" />
                        <Skeleton className="h-3 w-6 bg-white/10" />
                      </div>
                    </div>
                  </Card>
                ))
              : PopularPrompts?.map((item: Prompt) => (
                  <Card
                    key={item.id}
                    className="p-4 hover:bg-white/10 cursor-pointer transition-all duration-200 border-white/10 bg-white/5"
                  >
                    <div className="font-medium text-white">
                      {item.promptTitle}
                    </div>
                    <div className="text-sm text-gray-300 mt-1 line-clamp-4">
                      {item.promptDescription}
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <Tag className="h-3 w-3" />
                      {item.promptTags.length === 0 ? (
                        <span>No tags</span>
                      ) : (
                        <span>{item.promptTags.join(", ")}</span>
                      )}
                      <span className="ml-auto flex items-center">
                        <ThumbsUp
                          className="h-3 w-3 mr-1"
                          fill="currentColor"
                        />
                        <span>{item.likes.length}</span>
                      </span>
                    </div>
                  </Card>
                ))}
            <Button
              variant="outline"
              onClick={GoToCommunity}
              className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400 text-white hover:from-purple-500/30 hover:to-pink-500/30"
            >
              Browse Library
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Library;
