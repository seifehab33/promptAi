import { useQuery } from "@tanstack/react-query";
import api from "./axios";
import { Prompt } from "@/types/type";

const getPopularPrompts = async (): Promise<Prompt[]> => {
  const res = await api.get("/prompts/popular");
  return res.data.data || res.data; // Handle both new and old response formats
};
export function useGetPopularPrompts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["popularPrompts"],
    queryFn: getPopularPrompts,
    staleTime: 1000 * 60 * 5,
  });
  return { PopularPrompts: data || [], isLoading, isError: !!error };
}
