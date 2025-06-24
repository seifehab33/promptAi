import useGetPrompts from "@/api/useGetPrompts";
import useFilterPrompt from "@/api/useFilterPrompt";
import { Prompt } from "@/types/type";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Loader2,
  Tag,
  Sparkles,
  Calendar,
  Share,
  X,
  Edit,
} from "lucide-react";
import useDeletePrompt from "@/api/useDeletePrompt";
import { useSharePrompt, useUnSharePrompt } from "@/api/useSharePrompt";
import { useRouter } from "next/navigation";

function PromptLibrary({ search }: { search: string }) {
  const {
    Prompts,
    isLoading: isLoadingPrompts,
    error: promptsError,
  } = useGetPrompts();
  const {
    FilteredData,
    isLoading: isLoadingFilter,
    error: filterError,
  } = useFilterPrompt(search);
  const { DeletePrompt, isPending } = useDeletePrompt();
  const { sharePrompt, isPending: isSharing } = useSharePrompt();
  const { unSharePrompt, isPending: isUnSharing } = useUnSharePrompt();
  const router = useRouter();
  const isLoading = isLoadingPrompts || isLoadingFilter;
  const error = promptsError || filterError;
  const displayPrompts = search ? FilteredData || [] : Prompts || [];

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          <p className="text-gray-300 text-lg">Loading your prompts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-400 text-lg">Error: {error.message}</p>
      </div>
    );
  }

  if (!displayPrompts || displayPrompts.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">
            {search ? "No prompts found" : "Your Prompt Library"}
          </h3>
        </div>
        <p className="text-gray-300 text-lg">
          {search
            ? "No prompts found matching your search."
            : "No saved prompts yet. Create a prompt and save it to build your library."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {(isPending || isSharing || isUnSharing) && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            <p className="text-white text-sm">
              {isPending
                ? "Deleting prompt..."
                : isSharing
                ? "Sharing prompt..."
                : "Unsharing prompt..."}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPrompts.map((prompt: Prompt) => (
          <Card
            key={prompt.id}
            className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/15 group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-white font-semibold line-clamp-1">
                    {prompt.promptTitle || "Untitled Prompt"}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-300">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(prompt.createdAt).toLocaleDateString()}
                    </span>
                    {prompt.isPublic && (
                      <span className="px-2 py-1 bg-green-500/20 border border-green-400 text-green-200 rounded-full text-xs">
                        Public
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <CardDescription className="text-gray-300 mt-2">
                {prompt.promptContext ? (
                  <p className="line-clamp-2 text-sm">{prompt.promptContext}</p>
                ) : (
                  <p className="text-gray-400 text-sm italic">
                    No context provided
                  </p>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                  <p className="text-sm text-white line-clamp-3 leading-relaxed">
                    {prompt.promptDescription}
                  </p>
                </div>

                {prompt.promptTags && prompt.promptTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {prompt.promptTags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400 text-purple-200 rounded-full text-xs flex items-center gap-1 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200"
                      >
                        <Tag className="h-3 w-3" />
                        <span className="text-xs font-medium">{tag}</span>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                  {prompt.isPublic ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => unSharePrompt(Number(prompt.id))}
                      disabled={isUnSharing || isSharing}
                      className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400 text-red-200 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-200"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Unshare
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sharePrompt(Number(prompt.id))}
                      disabled={isSharing || isUnSharing}
                      className="bg-gradient-to-r from-green-500/20 to-green-400/20 border-green-400 text-green-200 hover:from-green-500/30 hover:to-green-400/30 transition-all duration-200"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/editor/advanced/${prompt.id}`)}
                    disabled={isPending || isSharing || isUnSharing}
                    className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400 text-white hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-200"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400 text-red-200 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-200"
                    onClick={() => DeletePrompt(prompt.id)}
                    disabled={isPending || isSharing || isUnSharing}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PromptLibrary;
