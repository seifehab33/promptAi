"use client";
import api from "./axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ErrorResponse, ResetPasswordData } from "@/types/type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

const resetPassword = async ({ token, newPassword }: ResetPasswordData) => {
  const response = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data;
};

function useResetPassword() {
  const router = useRouter();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(data.data.message, {
        duration: 2000,
      });
      setTimeout(() => {
        router.push("/SignIn");
      }, 2000);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message || "Failed to reset password");
    },
  });
  return { ReqResetPassword: mutate, isPending, isError };
}

export default useResetPassword;
