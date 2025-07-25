import { toast } from "sonner";
import api from "./axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
const publicPrompt = async (page: number, limit: number) => {
  const res = await api.get("/prompts/public", {
    params: {
      page,
      limit,
    },
  });
  return res.data;
};
const likePrompt = async (promptId: number) => {
  const res = await api.post(`/prompts/${promptId}/like`);
  return res.data;
};

function useGetPublicPrompt(page: number, limit: number) {
  const { data, isLoading, isError } = useQuery({
    queryFn: () => publicPrompt(page, limit),
    queryKey: ["public-prompt", page, limit],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  return {
    PublicPrompts: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError,
  };
}
function useLikePrompt() {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: (promptId: number) => likePrompt(promptId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["public-prompt"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["popularPrompts"],
        exact: false,
      });
      toast.success("Prompt liked successfully", {
        style: {
          backgroundColor: "green",
          color: "white",
        },
      });
    },
    onError: (error: AxiosError) => {
      toast.error("Failed to like prompt", {
        description:
          (error.response?.data as { message: string })?.message ||
          "Please try again later",
        style: {
          backgroundColor: "red",
          color: "white",
        },
      });
    },
  });
  return { LikePrompt: mutate, isPending, error };
}

export { useGetPublicPrompt, useLikePrompt };
