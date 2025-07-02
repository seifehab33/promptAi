import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

function useDeletePrompt() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => api.delete(`/prompts/${id}`),
    onSuccess: () => {
      toast.success("Prompt deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      queryClient.invalidateQueries({
        queryKey: ["public-prompt"],
        exact: false,
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(`Error deleting prompt: ${error.message}`);
    },
  });
  return { DeletePrompt: mutate, isPending };
}

export default useDeletePrompt;
