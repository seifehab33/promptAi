import { useQuery } from "@tanstack/react-query";
import api from "./axios";

interface CheckPromptExistsParams {
  promptTitle: string;
  promptModel: string;
}

const checkPromptExists = async ({
  promptTitle,
  promptModel,
}: CheckPromptExistsParams) => {
  try {
    const response = await api.get(`/prompts/check-exists`, {
      params: {
        promptTitle,
        promptModel,
      },
    });
    return response.data;
  } catch {
    // If the endpoint doesn't exist yet, return null
    return null;
  }
};

function useCheckPromptExists(promptTitle: string, promptModel: string) {
  return useQuery({
    queryKey: ["check-prompt-exists", promptTitle, promptModel],
    queryFn: () => checkPromptExists({ promptTitle, promptModel }),
    enabled: !!promptTitle && !!promptModel,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export default useCheckPromptExists;
