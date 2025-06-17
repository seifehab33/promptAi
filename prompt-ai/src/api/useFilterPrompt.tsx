import { useQuery } from "@tanstack/react-query";
import api from "./axios";
const getPromptQuery = async (query: string) => {
  const response = await api.get(`/prompts/search?query=${query}`);
  return response.data;
};
function useFilterPrompt(query: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["prompts", query],
    queryFn: () => getPromptQuery(query),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!query,
  });
  return { FilteredData: data, isLoading, error };
}

export default useFilterPrompt;
