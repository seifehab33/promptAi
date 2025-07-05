import { CreatePromptData, ErrorResponse } from "@/types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import api from "./axios";

const savePrompt = async (data: CreatePromptData) => {
  // Generate a default title if none is provided
  const defaultTitle =
    data.promptTitle?.trim() ||
    `AI Prompt - ${data.promptModel || "Unknown Model"}`;

  console.log("Saving prompt with data:", data);
  const requestData = {
    ...data,
    promptContent: data.promptContent || "",
    promptTitle: defaultTitle,
    promptTags: data.promptTags || [],
    isPublic: data.isPublic || false,
    promptModel: data.promptModel || "gpt-4o-mini",
  };
  console.log("Request data being sent:", requestData);

  const response = await api.post("/prompts", requestData);
  console.log("Save response:", response.data);
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
