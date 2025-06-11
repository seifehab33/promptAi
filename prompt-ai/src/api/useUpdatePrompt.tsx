import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { PromptUpdate } from "@/types/type";
function useUpdatePrompt() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PromptUpdate }) =>
      api.put(`/prompts/${id}`, data),
    onSuccess: () => {
      toast.success("Prompt updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(`Error updating prompt: ${error.message}`);
    },
  });
  return { mutate, isPending };
}

export default useUpdatePrompt;
