import { useQuery } from "@tanstack/react-query";
import api from "./axios";
import { Likes } from "@/types/type";

const getLikes = async (promptId: number): Promise<Likes> => {
  const res = await api.get(`/prompts/likes/${promptId}`);
  return res.data;
};

const useGetLikes = (promptId: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["likes", promptId],
    queryFn: () => getLikes(promptId),
    enabled: !!promptId,
    staleTime: 1000 * 60 * 5,
  });
  return { likesData: data, isLoading, error, refetch };
};

export default useGetLikes;
