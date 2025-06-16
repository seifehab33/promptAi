import api from "./axios";
import { useQuery } from "@tanstack/react-query";
const validateTokenForgetPass = async (token: string) => {
  const response = await api.get(`/auth/validate-reset-token?token=${token}`);
  return response.data;
};
function useValidateTokenForgetPass(token: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["validate-reset-token", token],
    queryFn: () => validateTokenForgetPass(token),
    enabled: !!token,
  });
  return { data, isLoading, error };
}

export default useValidateTokenForgetPass;
