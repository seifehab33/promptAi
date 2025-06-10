"use client";
import axios, { AxiosError } from "axios";
import { SignResponse, SignUpData } from "@/types/type";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const createUser = async (data: SignUpData) => {
  const response = await axios.post<SignResponse>(
    "http://localhost:3001/auth/register",
    data,
    {
      withCredentials: true,
    }
  );
  return response.data;
};
function useCreateUser() {
  const router = useRouter();
  const { mutate, data, error, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created successfully!");
      setTimeout(() => {
        router.push("/Editor");
      }, 1900);
    },
    onError: (error: AxiosError) => {
      toast.error(`Error creating user: ${error.message}`);
      setTimeout(() => {
        router.push("/");
      }, 1900);
    },
  });
  return { mutate, data, error, isPending };
}

export default useCreateUser;
