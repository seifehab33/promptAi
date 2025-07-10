import { CheckTokensResponse } from "@/types/type";
import api from "./axios";
import { useQuery } from "@tanstack/react-query";

const checkTokens = async (): Promise<CheckTokensResponse> => {
  const response = await api.get("/prompts/check-tokens");
  return response.data;
};
function useCheckTokens() {
  const { data, error, isPending } = useQuery({
    queryKey: ["check-tokens"],
    queryFn: checkTokens,
  });

  return { data, error, isPending };
}
export default useCheckTokens;
