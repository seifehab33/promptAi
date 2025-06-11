import { CreatePromptData, ErrorResponse } from "@/types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import api from "./axios";

const savePrompt = async (data: CreatePromptData) => {
  if (!data.promptTitle?.trim()) {
    throw new Error("Prompt title is required");
  }

  const response = await api.post("/prompts", {
    ...data,
    promptTags: data.promptTags || [],
    isPublic: data.isPublic || false,
  });
  return response.data;
};

function useSavePrompt() {
  const queryClient = useQueryClient();
  const { mutate, data, error, isPending } = useMutation({
    mutationFn: savePrompt,
    onSuccess: () => {
      toast.success("Prompt created successfully!");
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error creating prompt: ${errorMessage}`);
    },
  });
  return { savePrompt: mutate, data, error, isPending };
}

export default useSavePrompt;
