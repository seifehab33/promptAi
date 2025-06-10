import { CreatePromptData, ErrorResponse } from "@/types/type";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const savePrompt = async (data: CreatePromptData) => {
  const response = await axios.post(
    "http://localhost:3001/prompts",
    {
      ...data,
      promptTitle: data.promptTitle || "Untitled Prompt",
      promptTags: data.promptTags || [],
      isPublic: data.isPublic || false,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

function useSavePrompt() {
  const { mutate, data, error, isPending } = useMutation({
    mutationFn: savePrompt,
    onSuccess: () => {
      toast.success("Prompt created successfully!");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error creating prompt: ${errorMessage}`);
    },
  });
  return { savePrompt: mutate, data, error, isPending };
}

export default useSavePrompt;
