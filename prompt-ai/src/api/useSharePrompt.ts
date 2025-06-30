import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./axios";
import { toast } from "sonner";

const sharePrompt = async (promptId: number) => {
  const response = await api.post(`/prompts/${promptId}/share`);
  return response.data;
};

const unSharePrompt = async (promptId: number) => {
  const response = await api.post(`/prompts/${promptId}/unshare`);
  return response.data;
};

function useSharePrompt() {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: sharePrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      toast.success("Prompt shared successfully");
    },
    onError: () => {
      toast.error("Failed to share prompt");
    },
  });
  return { sharePrompt: mutate, isPending, error };
}

const useUnSharePrompt = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: unSharePrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      toast.success("Prompt unshared successfully");
    },
    onError: () => {
      toast.error("Failed to unshare prompt");
    },
  });
  return { unSharePrompt: mutate, isPending, error };
};

export { useSharePrompt, useUnSharePrompt };
