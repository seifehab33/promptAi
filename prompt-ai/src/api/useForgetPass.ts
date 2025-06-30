import { ErrorResponse, ForgetPassResponse } from "@/types/type";
import { AxiosError } from "axios";
import api from "./axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const forgetPass = async (email: string): Promise<ForgetPassResponse> => {
  const response = await api.post<ForgetPassResponse>("/auth/forget-password", {
    email,
  });
  return response.data;
};
function useForgetPass() {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: forgetPass,
    onSuccess: (data) => {
      toast.success(data.data.message);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message);
    },
  });
  return { ReqForgetPass: mutate, isPending, isError };
}

export default useForgetPass;
