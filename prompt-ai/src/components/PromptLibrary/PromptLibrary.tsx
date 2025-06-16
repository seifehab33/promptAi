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
import { Edit, Trash2 } from "lucide-react";
import useDeletePrompt from "@/api/useDeletePrompt";
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
  const router = useRouter();
  const isLoading = isLoadingPrompts || isLoadingFilter;
  const error = promptsError || filterError;
  const displayPrompts = search ? FilteredData || [] : Prompts || [];

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Loading your prompts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  if (!displayPrompts || displayPrompts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          {search
            ? "No prompts found matching your search."
            : "No saved prompts yet. Create a prompt and save it to build your library."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayPrompts.map((prompt: Prompt) => (
        <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">
              {prompt.promptTitle || "Untitled Prompt"}
            </CardTitle>
            <CardDescription>
              {prompt.promptContext ? (
                <p className="line-clamp-2">{prompt.promptContext}</p>
              ) : (
                <p className="text-muted-foreground">No context provided</p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm line-clamp-3">{prompt.promptDescription}</p>
              {prompt.promptTags && prompt.promptTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {prompt.promptTags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/editor/advanced/${prompt.id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => DeletePrompt(prompt.id)}
                  disabled={isPending}
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
  );
}

export default PromptLibrary;
