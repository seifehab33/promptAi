import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SignInData, SignResponse } from "@/types/type";
import { useRouter } from "next/navigation";

interface ErrorResponse {
  message: string;
}

const signInUser = async (data: SignInData) => {
  const response = await axios.post<SignResponse>(
    "http://localhost:3001/auth/login",
    data,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

function useSignInUser() {
  const router = useRouter();
  const { mutate, data, error, isPending } = useMutation({
    mutationFn: signInUser,
    onSuccess: () => {
      toast.success("User signed in successfully!");
      setTimeout(() => {
        router.push("/Dashboard");
      }, 1500);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error signing in: ${errorMessage}`);
    },
  });
  return { SignInUser: mutate, data, error, isPending };
}

export default useSignInUser;
