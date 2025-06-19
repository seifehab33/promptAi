"use client";
import { useMutation } from "@tanstack/react-query";
import api from "./axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const handleLogout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
const useLogout = () => {
  const router = useRouter();
  const { mutate, isPending, error } = useMutation({
    mutationFn: handleLogout,
    onSuccess: () => {
      toast.success("Logged out successfully", {
        style: {
          backgroundColor: "green",
          color: "white",
        },
      });
      router.push("/");
    },
    onError: () => {
      toast.error("Failed to logout", {
        style: {
          backgroundColor: "red",
          color: "white",
        },
      });
    },
  });
  return { logout: mutate, isPending, error };
};

export default useLogout;
