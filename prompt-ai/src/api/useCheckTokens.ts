import { CheckTokensResponse } from "@/types/type";
import api from "./axios";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/userContext";

const checkTokens = async (): Promise<CheckTokensResponse> => {
  const response = await api.get("/prompts/check-tokens");
  return response.data;
};

function useCheckTokens() {
  const { user } = useUser();

  const { data, error, isPending } = useQuery({
    queryKey: ["check-tokens", user.name], // Include user name in query key
    queryFn: checkTokens,
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
    enabled: !!user.name, // Only run query when user is authenticated
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache the data
  });

  return { data, error, isPending };
}

export default useCheckTokens;
