import api from "./axios";
import { useQuery } from "@tanstack/react-query";

const getPromptByID = async (id: string) => {
  const response = await api.get(`/prompts/${id}`);
  return response.data;
};

const useGetPromptByID = (id: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["prompt", id],
    queryFn: () => getPromptByID(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return { data, isLoading, error, refetch };
};

export default useGetPromptByID;
