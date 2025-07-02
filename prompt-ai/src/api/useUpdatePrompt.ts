import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { PromptUpdate } from "@/types/type";
function useUpdatePrompt() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PromptUpdate }) =>
      api.patch(`/prompts/${id}`, data),
    onSuccess: () => {
      toast.success("Prompt updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({ queryKey: ["public-prompt"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(`Error updating prompt: ${error.message}`);
    },
  });
  return { updatePrompt: mutate, isPending };
}

export default useUpdatePrompt;
