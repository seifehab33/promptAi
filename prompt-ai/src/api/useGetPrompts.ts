import { useQuery } from "@tanstack/react-query";
import api from "./axios";
const getPrompts = async () => {
  const response = await api.get("/prompts");
  return response.data;
};
function useGetPrompts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["prompts"],
    queryFn: () => getPrompts(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  return { Prompts: data, isLoading, error };
}

export default useGetPrompts;
