import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SignInData, SignResponse } from "@/types/type";
import { useRouter } from "next/navigation";
import api, { startAutoRefresh } from "./axios";
import { AxiosError } from "axios";

const signInUser = async (data: SignInData) => {
  const response = await api.post<SignResponse>("/auth/login", data);
  return response.data;
};

function useSignInUser() {
  const router = useRouter();
  const { mutate, data, error, isPending } = useMutation({
    mutationFn: signInUser,
    onSuccess: () => {
      toast.success("User signed in successfully!");
      startAutoRefresh();
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error signing in: ${errorMessage}`);
    },
  });
  return { SignInUser: mutate, data, error, isPending };
}

export default useSignInUser;
