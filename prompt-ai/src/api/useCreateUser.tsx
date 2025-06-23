"use client";
import { ErrorResponse, SignResponse, SignUpData } from "@/types/type";
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
      toast.success("User created successfully!", {
        duration: 1200,
        className: "bg-green-500 text-white",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1900);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message, {
        duration: 1200,
        className: "bg-red-500 text-white",
      });
      setTimeout(() => {
        router.push("/");
      }, 1900);
    },
  });
  return { mutate, data, error, isPending };
}

export default useCreateUser;
