"use client";
import { SignResponse, SignUpData } from "@/types/type";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "./axios";
import { AxiosError } from "axios";
const createUser = async (data: SignUpData) => {
  const response = await api.post<SignResponse>("/auth/register", data);
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
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(`Error creating user: ${error.message}`);
      setTimeout(() => {
        router.push("/");
      }, 1900);
    },
  });
  return { mutate, data, error, isPending };
}

export default useCreateUser;
