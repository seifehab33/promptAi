import api from "./axios";
import { useQuery } from "@tanstack/react-query";

const validateTokenForgetPass = async (token: string) => {
  if (!token) throw new Error("No reset token found");
  const response = await api.get(`/auth/validate-reset-token?token=${token}`);
  return response.data;
};

function useValidateTokenForgetPass(token: string | null) {
  return useQuery({
    queryKey: ["validate-reset-token", token],
    queryFn: () => validateTokenForgetPass(token!),
    enabled: !!token,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
}

export default useValidateTokenForgetPass;
