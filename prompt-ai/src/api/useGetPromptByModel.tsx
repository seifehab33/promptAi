import { useQuery } from "@tanstack/react-query";
import api from "./axios";
import { Prompt } from "@/types/type";

const getPromptByModel = async (model: string) => {
  console.log("Fetching prompts for model:", model);
  const response = await api.get(`/prompts/model/${model}`);
  console.log("Response data:", response.data);
  return response.data;
};

const useGetPromptByModel = (model: string, shouldFetch: boolean = false) => {
  return useQuery<Prompt[]>({
    queryKey: ["prompts-model", model],
    queryFn: () => getPromptByModel(model),
    enabled: !!model && shouldFetch, // only run if model is provided and shouldFetch is true
  });
};

export default useGetPromptByModel;
