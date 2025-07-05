import { CreatePromptData, ErrorResponse } from "@/types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import api from "./axios";

const savePrompt = async (data: CreatePromptData) => {
  // Use the provided title or generate a default
  const title =
    data.promptTitle?.trim() ||
    `AI Prompt - ${data.promptModel || "Unknown Model"}`;

  const requestData = {
    ...data,
    promptContent: data.promptContent || "",
    promptTitle: title,
    promptTags: data.promptTags || [],
    isPublic: data.isPublic || false,
    promptModel: data.promptModel || "gpt-4o-mini",
  };

  // Always check for existing prompt first
  try {
    const response = await api.post(`/prompts/check-exists`, {
      promptTitle: title,
      promptModel: requestData.promptModel,
      promptContent: requestData.promptContent,
      promptDescription: requestData.promptDescription,
      promptContext: requestData.promptContext,
      promptTags: requestData.promptTags,
      isPublic: requestData.isPublic,
    });

    if (response.data && response.data.exists) {
      if (response.data.updated) {
        // Backend already updated the prompt with grouping logic

        return {
          ...response.data,
          isUpdate: true,
          grouped: response.data.grouped,
        };
      } else {
        // Update the existing prompt manually
        const updateResponse = await api.put(
          `/prompts/${response.data.promptId}`,
          requestData
        );

        return { ...updateResponse.data, isUpdate: true, grouped: false };
      }
    }
  } catch {
    // Fallback: Get all prompts and check locally
    try {
      const existingPromptsResponse = await api.get("/prompts");
      const existingPrompts = existingPromptsResponse.data;

      const existingPrompt = existingPrompts.find(
        (prompt: { promptTitle: string; promptModel: string; id: string }) =>
          prompt.promptTitle === title &&
          prompt.promptModel === requestData.promptModel
      );

      if (existingPrompt) {
        // Update existing prompt manually
        const updateResponse = await api.put(
          `/prompts/${existingPrompt.id}`,
          requestData
        );

        return { ...updateResponse.data, isUpdate: true };
      }
    } catch {}
  }

  // Only create new prompt if no existing prompt found

  const response = await api.post("/prompts", requestData);

  return { ...response.data, isUpdate: false };
};

function useSavePrompt() {
  const queryClient = useQueryClient();
  const { mutate, data, error, isPending } = useMutation({
    mutationFn: savePrompt,
    onSuccess: (data) => {
      let message = "Prompt created successfully!";

      if (data.isUpdate) {
        message = "Prompt updated successfully!";
      } else if (data.grouped) {
        message = "Response grouped with existing prompt!";
      }

      toast.success(message);

      // Invalidate all prompt-related queries
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({ queryKey: ["prompts-model"] });
      queryClient.invalidateQueries({ queryKey: ["check-prompt-exists"] });
      queryClient.invalidateQueries({ queryKey: ["prompt"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error saving prompt: ${errorMessage}`);
    },
  });
  return { savePrompt: mutate, data, error, isPending };
}

export default useSavePrompt;
